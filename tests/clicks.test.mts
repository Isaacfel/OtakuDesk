/**
 * Outbound click log: one key per click, everything the summary needs in the
 * key, a 13-month TTL, and a summary that pages through KV and respects the
 * window.
 *
 * Run: npm test
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  CLICK_TTL_SECONDS,
  MAX_SUMMARY_DAYS,
  clickKey,
  parseClickKey,
  recordClick,
  summarizeClicks,
  tokenMatches,
} from '../lib/clicks'
import type { KVLike } from '../lib/newsletter'

type PutOptions = { expirationTtl?: number } | undefined

/**
 * In-memory stand-in for a KV namespace. Unlike the newsletter test's fake,
 * `list` honours `limit` and hands back a cursor, so pagination is exercised;
 * `puts` records the options each write was given so TTLs can be asserted.
 */
function fakeKv(): KVLike & { store: Map<string, string>; puts: PutOptions[]; listCalls: number } {
  const store = new Map<string, string>()
  const puts: PutOptions[] = []
  const kv = {
    store,
    puts,
    listCalls: 0,
    async get(key: string) {
      return store.get(key) ?? null
    },
    async put(key: string, value: string, options?: { expirationTtl?: number }) {
      store.set(key, value)
      puts.push(options)
    },
    async delete(key: string) {
      store.delete(key)
    },
    async list({ prefix = '', cursor, limit = 1000 }: { prefix?: string; cursor?: string; limit?: number } = {}) {
      kv.listCalls++
      const all = [...store.keys()].filter((k) => k.startsWith(prefix)).sort()
      const start = cursor ? Number(cursor) : 0
      const keys = all.slice(start, start + limit).map((name) => ({ name }))
      const end = start + keys.length
      return end >= all.length
        ? { keys, list_complete: true as const }
        : { keys, list_complete: false as const, cursor: String(end) }
    },
  }
  return kv
}

const NOW = new Date('2026-09-15T12:34:56Z')

test('recordClick: one key per click, dated, prefixed, 13-month TTL, no personal data', async () => {
  const kv = fakeKv()
  const key = await recordClick(kv, {
    pickSlug: 'neon-panel-desk-mat',
    merchant: 'Amazon',
    network: 'amazon',
    from: 'journal:desk-guide',
    now: NOW,
  })

  assert.match(key, /^click:2026-09-15:neon-panel-desk-mat:[a-f0-9]{16}$/)
  assert.deepEqual(parseClickKey(key), { date: '2026-09-15', pickSlug: 'neon-panel-desk-mat' })
  assert.equal(kv.store.size, 1)
  assert.deepEqual(kv.puts, [{ expirationTtl: CLICK_TTL_SECONDS }])
  assert.equal(CLICK_TTL_SECONDS, 395 * 86_400, '13 months, matching the privacy page')

  const value = JSON.parse(kv.store.get(key)!)
  assert.deepEqual(value, {
    merchant: 'Amazon',
    network: 'amazon',
    from: 'journal:desk-guide',
    ts: '2026-09-15T12:34:56.000Z',
  })

  // Two clicks on the same pick on the same day are two keys, never a counter.
  await recordClick(kv, { pickSlug: 'neon-panel-desk-mat', merchant: 'Amazon', network: 'amazon', from: 'direct', now: NOW })
  assert.equal(kv.store.size, 2)
})

test('parseClickKey rejects anything that is not a click key', () => {
  for (const bad of ['sub:fan@example.com', 'click:', 'click:2026-09-15', 'click:nope:slug:id', 'click:2026-09-15::id'])
    assert.equal(parseClickKey(bad), null, bad)
})

test('summarizeClicks: pages through list results, drops clicks outside the window', async () => {
  const kv = fakeKv()
  const day = (offset: number) => new Date(NOW.getTime() - offset * 86_400_000).toISOString().slice(0, 10)

  // 1500 keys in the window forces two list pages at KV's 1000-key page size.
  for (let i = 0; i < 1500; i++) {
    const slug = i % 3 === 0 ? 'desk-mat' : i % 3 === 1 ? 'monitor-arm' : 'figure-shelf'
    kv.store.set(clickKey(day(i % 7), slug, i.toString(16).padStart(16, '0')), '{}')
  }
  // Just outside a 7-day window (today + 6 days back), and far outside.
  kv.store.set(clickKey(day(7), 'desk-mat', 'a'.repeat(16)), '{}')
  kv.store.set(clickKey(day(200), 'desk-mat', 'b'.repeat(16)), '{}')
  // A neighbour under another prefix must not be counted.
  kv.store.set('sub:fan@example.com', '{}')

  const summary = await summarizeClicks(kv, { days: 7, now: NOW })
  assert.ok(kv.listCalls >= 2, 'aggregation spanned more than one list page')
  assert.equal(summary.days, 7)
  assert.equal(summary.total, 1500)

  assert.deepEqual(summary.byPick, [
    { pickSlug: 'desk-mat', clicks: 500 },
    { pickSlug: 'figure-shelf', clicks: 500 },
    { pickSlug: 'monitor-arm', clicks: 500 },
  ])
  assert.ok(summary.byPick.every((p, i, arr) => i === 0 || arr[i - 1].clicks >= p.clicks), 'sorted desc')

  assert.equal(summary.byDay.length, 7, 'every day in the window, zero-filled')
  assert.equal(summary.byDay[0].date, day(6), 'oldest first')
  assert.equal(summary.byDay[6].date, day(0))
  assert.equal(summary.byDay.reduce((n, d) => n + d.clicks, 0), 1500)
  // 1500 / 7 days: 214 or 215 per day, never the 2 out-of-window extras.
  assert.ok(summary.byDay.every((d) => d.clicks === 214 || d.clicks === 215))

  // Widening the window picks up the day-7 click but not the 200-day-old one.
  const wider = await summarizeClicks(kv, { days: 8, now: NOW })
  assert.equal(wider.total, 1501)
  const widest = await summarizeClicks(kv, { days: 10_000, now: NOW })
  assert.equal(widest.days, MAX_SUMMARY_DAYS, 'window is capped')
  assert.equal(widest.total, 1502)
})

test('summarizeClicks on an empty log is all zeros, not an error', async () => {
  const summary = await summarizeClicks(fakeKv(), { days: 1, now: NOW })
  assert.deepEqual(summary, { days: 1, total: 0, byPick: [], byDay: [{ date: '2026-09-15', clicks: 0 }] })
})

test('tokenMatches: exact match only, and an unset secret admits nobody', () => {
  assert.equal(tokenMatches('s3cret', 's3cret'), true)
  assert.equal(tokenMatches('s3cre', 's3cret'), false)
  assert.equal(tokenMatches('s3cret!', 's3cret'), false)
  assert.equal(tokenMatches('S3CRET', 's3cret'), false)
  assert.equal(tokenMatches('', ''), false)
  assert.equal(tokenMatches('anything', ''), false)
})
