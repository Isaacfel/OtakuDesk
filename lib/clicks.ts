import type { KVLike } from './newsletter'

/**
 * The persistent outbound click log.
 *
 * `/go/[slug]` records one KV key per click; `/api/clicks` reads them back as
 * a summary. The design is shaped by two facts about Workers KV:
 *
 *   - Writes are eventually consistent and there is no atomic increment, so a
 *     read-modify-write counter would silently lose clicks whenever two
 *     readers click within the same second. One key per click has no race.
 *   - `list` is cheap and returns key names only. Everything the summary needs
 *     (date, pick) is therefore packed into the key so a summary is a handful
 *     of list calls and zero `get` calls, however many clicks there are.
 *
 * Privacy: the privacy page promises an anonymous log — the pick, the page
 * the click came from, and the time. That is exactly what is stored. No IP,
 * no user agent, no cookie, nothing that could tie two clicks to one person.
 */

const KEY_PREFIX = 'click:'

/**
 * Keys expire so the namespace cannot grow without bound and so the log is
 * self-purging. 13 months (395 days) covers a full year of comparisons plus
 * the lag before an affiliate network's own report is final, and it is the
 * retention period the privacy page states — this must never exceed that.
 */
export const CLICK_TTL_SECONDS = 395 * 24 * 60 * 60 // 34,128,000

/**
 * The largest window `summarizeClicks` accepts. Anything past the TTL has
 * expired anyway, so a wider window only costs the caller nothing.
 */
export const MAX_SUMMARY_DAYS = 400

export type ClickRecord = {
  merchant: string
  network: string
  /** Which page produced the click — 'pick:neon-panel-desk-mat', 'journal:desk-guide'. */
  from: string
  /** ISO timestamp of the click. */
  ts: string
}

export type ClickSummary = {
  days: number
  total: number
  byPick: Array<{ pickSlug: string; clicks: number }>
  byDay: Array<{ date: string; clicks: number }>
}

/** ISO date (YYYY-MM-DD) in UTC. */
const isoDate = (d: Date) => d.toISOString().slice(0, 10)

function randomId(): string {
  // 8 random bytes: collisions within one pick on one day are not a concern.
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * `click:<YYYY-MM-DD>:<pickSlug>:<id>`. Pick slugs are kebab-case without
 * colons (see SLUG_SHAPE in the /go route and the catalog), so splitting on
 * ':' is unambiguous.
 */
export function clickKey(date: string, pickSlug: string, id: string): string {
  return `${KEY_PREFIX}${date}:${pickSlug}:${id}`
}

/** Inverse of `clickKey`. Returns null for anything that is not a click key. */
export function parseClickKey(key: string): { date: string; pickSlug: string } | null {
  if (!key.startsWith(KEY_PREFIX)) return null
  const parts = key.slice(KEY_PREFIX.length).split(':')
  if (parts.length !== 3) return null
  const [date, pickSlug] = parts
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || pickSlug.length === 0) return null
  return { date, pickSlug }
}

export async function recordClick(
  kv: KVLike,
  click: { pickSlug: string; merchant: string; network: string; from: string; now?: Date },
): Promise<string> {
  const now = click.now ?? new Date()
  const record: ClickRecord = {
    merchant: click.merchant,
    network: click.network,
    from: click.from,
    ts: now.toISOString(),
  }
  const key = clickKey(isoDate(now), click.pickSlug, randomId())
  await kv.put(key, JSON.stringify(record), { expirationTtl: CLICK_TTL_SECONDS })
  return key
}

/**
 * Clicks over the last `days` days, today included: `days: 1` is today only,
 * `days: 30` is today and the 29 days before it. `byPick` is sorted by clicks
 * descending; `byDay` covers every date in the window, zero-filled, oldest
 * first, so a chart can be drawn from it directly.
 */
export async function summarizeClicks(
  kv: KVLike,
  opts: { days: number; now?: Date },
): Promise<ClickSummary> {
  const now = opts.now ?? new Date()
  const days = Math.min(Math.max(Math.floor(opts.days), 1), MAX_SUMMARY_DAYS)
  const since = isoDate(new Date(now.getTime() - (days - 1) * 86_400_000))
  const today = isoDate(now)

  const byDay = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    byDay.set(isoDate(new Date(now.getTime() - i * 86_400_000)), 0)
  }
  const byPick = new Map<string, number>()
  let total = 0

  // KV returns at most 1000 keys per list call; follow the cursor until done.
  let cursor: string | undefined
  do {
    const page = await kv.list({ prefix: KEY_PREFIX, cursor, limit: 1000 })
    for (const { name } of page.keys) {
      const parsed = parseClickKey(name)
      // Dates in the future can only come from clock skew; count them as today
      // rather than dropping a click that really happened.
      if (!parsed || parsed.date < since) continue
      const date = parsed.date > today ? today : parsed.date
      total++
      byDay.set(date, (byDay.get(date) ?? 0) + 1)
      byPick.set(parsed.pickSlug, (byPick.get(parsed.pickSlug) ?? 0) + 1)
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  return {
    days,
    total,
    byPick: [...byPick]
      .map(([pickSlug, clicks]) => ({ pickSlug, clicks }))
      .sort((a, b) => b.clicks - a.clicks || a.pickSlug.localeCompare(b.pickSlug)),
    byDay: [...byDay].map(([date, clicks]) => ({ date, clicks })),
  }
}

/**
 * Constant-time string comparison for the admin token. The loop always runs
 * over the expected token's full length and folds a length mismatch into the
 * result, so how long the check takes reveals nothing about where a guess
 * first went wrong. An empty expected token never matches: an unset secret
 * must lock the door, not leave it open.
 */
export function tokenMatches(provided: string, expected: string): boolean {
  if (expected.length === 0) return false
  const a = new TextEncoder().encode(provided)
  const b = new TextEncoder().encode(expected)
  let diff = a.length ^ b.length
  for (let i = 0; i < b.length; i++) diff |= (a[i] ?? 0) ^ b[i]
  return diff === 0
}
