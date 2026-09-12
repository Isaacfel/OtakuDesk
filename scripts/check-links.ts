/**
 * Weekly link health check.
 *
 * Dead merchant URLs are the quietest way an affiliate site loses money: the
 * page still looks fine, the button still renders, and every click earns
 * nothing. Nobody notices until a monthly report comes in low.
 *
 * Run: npx tsx scripts/check-links.ts
 * CI:  exits 1 when any live pick's URL fails, so a scheduled job can alert.
 *
 * This script REPORTS; it does not edit the catalog. Flipping a pick to
 * `linkStatus: 'broken'` is a judgement call (a 403 is usually bot blocking,
 * not a dead product), so a human makes it. The report tells them where to look.
 */

import { PICKS } from '../data/picks'
import type { Pick } from '../data/types'

const TIMEOUT_MS = 12_000
const UA =
  'Mozilla/5.0 (compatible; OtakudeskLinkCheck/1.0; +https://otakudesk.com/about)'

type Result = {
  pick: Pick
  ok: boolean
  status: number | string
  note?: string
}

async function check(pick: Pick): Promise<Result> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    // HEAD first — cheap. Many storefronts reject it, so fall back to a
    // ranged GET that pulls only the first bytes rather than a whole page.
    let res = await fetch(pick.purchaseUrl, {
      method: 'HEAD',
      redirect: 'follow',
      signal: ctl.signal,
      headers: { 'user-agent': UA },
    })
    if (res.status === 405 || res.status === 501) {
      res = await fetch(pick.purchaseUrl, {
        method: 'GET',
        redirect: 'follow',
        signal: ctl.signal,
        headers: { 'user-agent': UA, range: 'bytes=0-2047' },
      })
    }
    const note =
      res.status === 403
        ? 'likely bot protection rather than a dead product — verify by hand'
        : undefined
    return { pick, ok: res.status < 400 || res.status === 403, status: res.status, note }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { pick, ok: false, status: msg.includes('abort') ? 'timeout' : 'network error' }
  } finally {
    clearTimeout(timer)
  }
}

/** Picks whose price stamp has gone stale enough to be suppressed at render. */
function stalePrices(maxAgeDays = 45): Pick[] {
  const cutoff = Date.now() - maxAgeDays * 864e5
  return PICKS.filter(
    (p) => p.linkStatus === 'ok' && p.price !== null &&
      new Date(p.priceCheckedAt).getTime() < cutoff,
  )
}

async function main() {
  const live = PICKS.filter((p) => p.linkStatus === 'ok')
  const skipped = PICKS.length - live.length

  if (live.length === 0) {
    console.log(
      `No live picks to check — all ${PICKS.length} are sample or already flagged.`,
    )
    console.log('Nothing to do until real picks are researched and verified.')
    return
  }

  console.log(`Checking ${live.length} live picks (${skipped} skipped)...\n`)

  // Modest concurrency: we are a guest on these servers.
  const results: Result[] = []
  const queue = [...live]
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let next = queue.shift(); next; next = queue.shift()) {
        results.push(await check(next))
      }
    }),
  )

  const failed = results.filter((r) => !r.ok)
  for (const r of results.sort((a, b) => Number(a.ok) - Number(b.ok))) {
    const mark = r.ok ? 'ok  ' : 'FAIL'
    console.log(
      `${mark} ${String(r.status).padEnd(14)} ${r.pick.slug}${r.note ? `  (${r.note})` : ''}`,
    )
  }

  const stale = stalePrices()
  if (stale.length) {
    console.log(`\n${stale.length} pick(s) with prices past 45 days — price is`)
    console.log('currently hidden on these pages until re-checked:')
    for (const p of stale) console.log(`  ${p.slug}  (checked ${p.priceCheckedAt})`)
  }

  console.log(
    `\n${results.length - failed.length}/${results.length} links healthy.`,
  )
  if (failed.length) {
    console.log(
      'Set linkStatus to "broken" or "discontinued" on failures above, or fix the URL.',
    )
    process.exitCode = 1
  }
}

main()
