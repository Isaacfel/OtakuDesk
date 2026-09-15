/**
 * Weekly price refresh.
 *
 * The site hides any price older than PRICE_MAX_AGE_DAYS (see data/types.ts),
 * so without this the whole catalog goes priceless six weeks after it was
 * researched. This re-reads each live Amazon listing, updates `price` and
 * `priceCheckedAt` in data/picks.ts, and writes a report for the pull request
 * a human approves.
 *
 * Run:  npx tsx scripts/refresh-prices.ts            (report only)
 *       npx tsx scripts/refresh-prices.ts --write     (also edit data/picks.ts)
 *       ... --report price-report.md                  (write the report to a file)
 *
 * It only ever changes `price` and `priceCheckedAt`. Anything else the listing
 * suggests (unavailable, gone, a price that moved by more than 3x) is reported
 * for a person to decide, matching scripts/check-links.ts.
 *
 * Exit codes: 0 fine; 2 when Amazon blocked most requests (bot check), so a
 * scheduled run knows not to open an empty pull request.
 *
 * Runs from a home connection via scripts/refresh-prices.ps1 and Windows Task
 * Scheduler. GitHub's hosted runners are blocked by Amazon's bot check.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { PICKS } from '../data/picks'
import { PRICE_MAX_AGE_DAYS } from '../data/types'
import type { Pick } from '../data/types'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
const TIMEOUT_MS = 20_000
// Polite pacing. A burst of requests earns the "continue shopping" bot page.
const DELAY_MS = 4_000
const PICKS_FILE = new URL('../data/picks.ts', import.meta.url)

type Outcome =
  | { kind: 'price'; price: number }
  | { kind: 'unavailable' }
  | { kind: 'no-price' }
  | { kind: 'blocked'; status: number }
  | { kind: 'gone' }
  | { kind: 'error'; detail: string }

type Result = { pick: Pick; outcome: Outcome; changed: boolean; suspicious: boolean }

const PRICE = /\$([0-9]{1,4}(?:,[0-9]{3})*\.[0-9]{2})/

function firstPrice(block: string | undefined): number | null {
  if (!block) return null
  const m = block.match(new RegExp(`a-offscreen">${PRICE.source}`))
  if (!m) return null
  const n = Number(m[1].replace(/,/g, ''))
  return n > 0 ? n : null
}

/**
 * Prices Amazon shows that are NOT the buy price: the struck-through list
 * price ("basis price") and per-unit prices ("$4.00 / count"). Both carry
 * the `a-text-price` class, so they are dropped before the buy price is read.
 */
const NOT_THE_PRICE = /<span class="a-price a-text-price[^"]*"[^>]*>\s*<span class="a-offscreen">[^<]*<\/span>/g

/** The listing's buy-box price, trying the layouts Amazon actually uses. */
export function parsePrice(raw: string): number | null {
  const html = raw.replace(NOT_THE_PRICE, '')
  return (
    firstPrice(html.match(/id="corePriceDisplay_desktop_feature_div"[\s\S]{0,6000}/)?.[0]) ??
    firstPrice(html.match(/id="corePrice_feature_div"[\s\S]{0,6000}/)?.[0]) ??
    firstPrice(html.match(/id="apex_desktop"[\s\S]{0,8000}?priceToPay[\s\S]{0,600}/)?.[0]) ??
    // Books: the format swatch carries the price.
    (() => {
      const m = html.match(new RegExp(`PAPERBACK[\\s\\S]{0,3000}?slot-price[\\s\\S]{0,400}?${PRICE.source}`))
      return m ? Number(m[1].replace(/,/g, '')) : null
    })()
  )
}

export function parseOutcome(status: number, html: string): Outcome {
  if (status === 404) return { kind: 'gone' }
  if (status >= 500 || status === 429) return { kind: 'blocked', status }
  // Amazon's bot pages: the classic captcha, and the small "Click the button
  // below to continue shopping" page it serves after a burst of requests.
  if (
    /Robot Check|Type the characters you see|api-services-support@amazon\.com|Click the button below to continue shopping/i.test(
      html,
    )
  )
    return { kind: 'blocked', status }
  if (/id="availability"[\s\S]{0,600}?Currently unavailable/i.test(html)) return { kind: 'unavailable' }
  const price = parsePrice(html)
  return price === null ? { kind: 'no-price' } : { kind: 'price', price }
}

async function fetchListing(pick: Pick): Promise<Outcome> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(pick.purchaseUrl, {
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'user-agent': UA, 'accept-language': 'en-US,en;q=0.9', accept: 'text/html' },
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

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

/**
 * Rewrite one pick's `price` and `priceCheckedAt` in the source file. The
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

function fmt(n: number | null): string {
  return n === null ? '—' : `$${n.toFixed(2)}`
}

function describe(r: Result): string {
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

async function main() {
  const write = process.argv.includes('--write')
  const reportIdx = process.argv.indexOf('--report')
  const reportPath = reportIdx >= 0 ? process.argv[reportIdx + 1] : null

  const live = PICKS.filter((p) => p.linkStatus === 'ok' && p.merchantId === 'amazon')
  console.log(`Refreshing ${live.length} Amazon listings...\n`)

  const results: Result[] = []
  for (const pick of live) {
    const outcome = await fetchListing(pick)
    let changed = false
    let suspicious = false
    if (outcome.kind === 'price') {
      const old = pick.price
      suspicious = old !== null && old > 0 && (outcome.price / old > 3 || old / outcome.price > 3)
      changed = old !== outcome.price
    }
    results.push({ pick, outcome, changed, suspicious })
    console.log(
      `${outcome.kind.padEnd(12)} ${pick.slug.padEnd(48)} ${fmt(pick.price)} -> ${
        outcome.kind === 'price' ? fmt(outcome.price) : '—'
      }`,
    )
    await sleep(DELAY_MS)
  }

  const blocked = results.filter((r) => r.outcome.kind === 'blocked').length
  const priced = results.filter((r) => r.outcome.kind === 'price' && !r.suspicious)
  const date = today()

  if (write && priced.length > 0) {
    let source = readFileSync(PICKS_FILE, 'utf8')
    for (const r of priced) {
      if (r.outcome.kind === 'price') source = applyPrice(source, r.pick, r.outcome.price, date)
    }
    writeFileSync(PICKS_FILE, source)
    console.log(`\nWrote ${priced.length} price(s) to data/picks.ts with priceCheckedAt ${date}.`)
  }

  const attention = results.filter((r) => r.outcome.kind !== 'price' || r.suspicious)
  const lines = [
    `## Price refresh — ${date}`,
    '',
    `${priced.length} of ${results.length} listings priced. Prices older than ${PRICE_MAX_AGE_DAYS} days are hidden on the site, so this keeps them visible.`,
    '',
    '| Product | Was | Now | Note |',
    '|---|---|---|---|',
    ...results.map(
      (r) =>
        `| ${r.pick.title} | ${fmt(r.pick.price)} | ${
          r.outcome.kind === 'price' ? fmt(r.outcome.price) : '—'
        } | ${describe(r)} |`,
    ),
  ]
  if (attention.length) {
    lines.push('', `### Needs a person (${attention.length})`, '')
    for (const r of attention) lines.push(`- **${r.pick.title}**: ${describe(r)}`)
  }
  const report = lines.join('\n') + '\n'
  if (reportPath) writeFileSync(reportPath, report)
  console.log('\n' + report)

  if (blocked > results.length / 2) {
    console.error(
      `Amazon blocked ${blocked} of ${results.length} requests. Run this from a home connection instead: npm run prices:refresh -- --write`,
    )
    process.exitCode = 2
  }
}

// Only run when executed directly, so tests can import the parsers.
if (process.argv[1] && /refresh-prices\.(ts|mts|js)$/.test(process.argv[1])) main()
