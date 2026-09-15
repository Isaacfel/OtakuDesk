import type { Pick } from '../data/types'

/**
 * Price refresh: read a live Amazon listing, decide what it says, and apply
 * a new price to the catalog source.
 *
 * Shared by the cron Worker in prices/ (runs weekly on Cloudflare) and the
 * local CLI in scripts/refresh-prices.ts. Plain Web APIs only, no `@/`
 * aliases, so both runtimes can bundle it.
 */

export const LISTING_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'

/** Polite pacing between listings. A burst earns Amazon's bot page. */
export const LISTING_DELAY_MS = 4_000

export type Outcome =
  | { kind: 'price'; price: number }
  | { kind: 'unavailable' }
  | { kind: 'no-price' }
  | { kind: 'blocked'; status: number }
  | { kind: 'gone' }
  | { kind: 'error'; detail: string }

export type Result = { pick: Pick; outcome: Outcome; changed: boolean; suspicious: boolean }

const PRICE = /\$([0-9]{1,4}(?:,[0-9]{3})*\.[0-9]{2})/

/**
 * Prices Amazon shows that are NOT the buy price: the struck-through list
 * price ("basis price") and per-unit prices ("$4.00 / count"). Both carry
 * the `a-text-price` class, so they are dropped before the buy price is read.
 */
const NOT_THE_PRICE = /<span class="a-price a-text-price[^"]*"[^>]*>\s*<span class="a-offscreen">[^<]*<\/span>/g

/**
 * A slice of the page starting at `marker`, `length` characters long, with the
 * non-buy prices removed. Amazon pages run to 2.5 MB; regex over the whole
 * thing costs real CPU, and a Worker on the free plan has 10 ms of it. Cutting
 * a window with indexOf first keeps each parse well under a millisecond.
 */
function windowAfter(html: string, marker: string, length: number): string | undefined {
  const i = html.indexOf(marker)
  return i < 0 ? undefined : html.slice(i, i + length).replace(NOT_THE_PRICE, '')
}

function firstPrice(block: string | undefined): number | null {
  if (!block) return null
  const m = block.match(new RegExp(`a-offscreen">${PRICE.source}`))
  if (!m) return null
  const n = Number(m[1].replace(/,/g, ''))
  return n > 0 ? n : null
}

/** The listing's buy-box price, trying the layouts Amazon actually uses. */
export function parsePrice(html: string): number | null {
  return (
    firstPrice(windowAfter(html, 'id="corePriceDisplay_desktop_feature_div"', 6000)) ??
    firstPrice(windowAfter(html, 'id="corePrice_feature_div"', 6000)) ??
    firstPrice(windowAfter(windowAfter(html, 'id="apex_desktop"', 8000) ?? '', 'priceToPay', 600)) ??
    // Books: the format swatch carries the price.
    (() => {
      const w = windowAfter(html, 'PAPERBACK', 3000)
      const m = w?.match(new RegExp(`slot-price[\\s\\S]{0,400}?${PRICE.source}`))
      return m ? Number(m[1].replace(/,/g, '')) : null
    })()
  )
}

const BOT_PAGE =
  /Robot Check|Type the characters you see|api-services-support@amazon\.com|Click the button below to continue shopping/i

export function parseOutcome(status: number, html: string): Outcome {
  if (status === 404) return { kind: 'gone' }
  if (status >= 500 || status === 429) return { kind: 'blocked', status }
  // Amazon's bot pages: the classic captcha, and the small "Click the button
  // below to continue shopping" page it serves after a burst of requests.
  // Both are a few KB, so only the head of the page needs checking.
  if (BOT_PAGE.test(html.slice(0, 20_000))) return { kind: 'blocked', status }
  const avail = windowAfter(html, 'id="availability"', 600)
  if (avail && /Currently unavailable/i.test(avail)) return { kind: 'unavailable' }
  const price = parsePrice(html)
  return price === null ? { kind: 'no-price' } : { kind: 'price', price }
}

export async function fetchListing(url: string, timeoutMs = 20_000): Promise<Outcome> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'user-agent': LISTING_UA, 'accept-language': 'en-US,en;q=0.9', accept: 'text/html' },
    })
    const html = await res.text()
    return parseOutcome(res.status, html)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { kind: 'error', detail: msg.includes('abort') ? 'timeout' : msg }
  } finally {
    clearTimeout(timer)
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Read every live Amazon pick in turn, politely paced. */
export async function refreshAll(
  picks: readonly Pick[],
  onResult?: (r: Result) => void,
  delayMs = LISTING_DELAY_MS,
): Promise<Result[]> {
  const results: Result[] = []
  for (const pick of picks) {
    const outcome = await fetchListing(pick.purchaseUrl)
    let changed = false
    let suspicious = false
    if (outcome.kind === 'price') {
      const old = pick.price
      suspicious = old !== null && old > 0 && (outcome.price / old > 3 || old / outcome.price > 3)
      changed = old !== outcome.price
    }
    const r = { pick, outcome, changed, suspicious }
    results.push(r)
    onResult?.(r)
    await sleep(delayMs)
  }
  return results
}

/**
 * Rewrite one pick's `price` and `priceCheckedAt` in the catalog source. The
 * pick is located by its purchaseUrl, which is unique; only the first
 * `price:` and `priceCheckedAt:` after it are touched.
 */
export function applyPrice(source: string, pick: Pick, price: number, date: string): string {
  const anchor = `purchaseUrl: '${pick.purchaseUrl}'`
  const i = source.indexOf(anchor)
  if (i < 0) throw new Error(`could not find ${pick.slug} in data/picks.ts`)
  const window = source.slice(i, i + 800)
  const PRICE_FIELD = /price: (?:[0-9.]+|null),/
  const DATE_FIELD = /priceCheckedAt: (?:[A-Z_]+|'[0-9-]+'),/
  // Presence, not difference: an unchanged price on the same day is a
  // legitimate no-op, not a missing field.
  if (!PRICE_FIELD.test(window) || !DATE_FIELD.test(window))
    throw new Error(`no price fields found for ${pick.slug}`)
  const updated = window
    .replace(PRICE_FIELD, `price: ${price},`)
    .replace(DATE_FIELD, `priceCheckedAt: '${date}',`)
  return source.slice(0, i) + updated + source.slice(i + 800)
}

/** Apply every confirmed, non-suspicious price. Returns the new source and how many were written. */
export function applyResults(source: string, results: readonly Result[], date: string): { source: string; written: number } {
  let out = source
  let written = 0
  for (const r of results) {
    if (r.outcome.kind !== 'price' || r.suspicious) continue
    out = applyPrice(out, r.pick, r.outcome.price, date)
    written++
  }
  return { source: out, written }
}

export const fmtPrice = (n: number | null): string => (n === null ? '—' : `$${n.toFixed(2)}`)

export function describe(r: Result): string {
  switch (r.outcome.kind) {
    case 'price':
      return r.suspicious ? 'moved more than 3x — not written, check by hand' : r.changed ? 'updated' : 'unchanged'
    case 'unavailable':
      return 'listing says Currently unavailable — consider linkStatus discontinued'
    case 'no-price':
      return 'page loaded but no price found — check by hand'
    case 'blocked':
      return `Amazon bot check (HTTP ${r.outcome.status})`
    case 'gone':
      return 'HTTP 404 — listing removed; consider linkStatus broken'
    case 'error':
      return `fetch failed: ${r.outcome.detail}`
  }
}

/** Markdown report for the pull request body. */
export function buildReport(results: readonly Result[], date: string, maxAgeDays: number): string {
  const priced = results.filter((r) => r.outcome.kind === 'price' && !r.suspicious)
  const attention = results.filter((r) => r.outcome.kind !== 'price' || r.suspicious)
  const lines = [
    `## Price refresh — ${date}`,
    '',
    `${priced.length} of ${results.length} listings priced. Prices older than ${maxAgeDays} days are hidden on the site, so this keeps them visible.`,
    '',
    '| Product | Was | Now | Note |',
    '|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${r.pick.title} | ${fmtPrice(r.pick.price)} | ${
          r.outcome.kind === 'price' ? fmtPrice(r.outcome.price) : '—'
        } | ${describe(r)} |`,
    ),
  ]
  if (attention.length) {
    lines.push('', `### Needs a person (${attention.length})`, '')
    for (const r of attention) lines.push(`- **${r.pick.title}**: ${describe(r)}`)
  }
  return lines.join('\n') + '\n'
}

export const mostlyBlocked = (results: readonly Result[]) =>
  results.filter((r) => r.outcome.kind === 'blocked').length > results.length / 2
