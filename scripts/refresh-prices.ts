/**
 * Price refresh, by hand.
 *
 * The scheduled version is the Cloudflare cron Worker in prices/, which runs
 * every Monday and opens a pull request. This CLI is for running the same
 * check locally: after adding products, or to look into something the
 * weekly report flagged.
 *
 * Run:  npm run prices:refresh                 (report only)
 *       npm run prices:refresh -- --write      (also edit data/picks.ts)
 *       ... --report price-report.md           (write the report to a file)
 *
 * Exit codes: 0 fine; 2 when Amazon blocked most requests (bot check).
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { PICKS } from '../data/picks'
import { PRICE_MAX_AGE_DAYS } from '../data/types'
import { applyResults, buildReport, fmtPrice, mostlyBlocked, refreshAll } from '../lib/prices'

const PICKS_FILE = new URL('../data/picks.ts', import.meta.url)

async function main() {
  const write = process.argv.includes('--write')
  const reportIdx = process.argv.indexOf('--report')
  const reportPath = reportIdx >= 0 ? process.argv[reportIdx + 1] : null

  const live = PICKS.filter((p) => p.linkStatus === 'ok' && p.merchantId === 'amazon')
  console.log(`Refreshing ${live.length} Amazon listings...\n`)

  const results = await refreshAll(live, (r) =>
    console.log(
      `${r.outcome.kind.padEnd(12)} ${r.pick.slug.padEnd(48)} ${fmtPrice(r.pick.price)} -> ${
        r.outcome.kind === 'price' ? fmtPrice(r.outcome.price) : '—'
      }`,
    ),
  )

  const date = new Date().toISOString().slice(0, 10)

  if (write) {
    const current = readFileSync(PICKS_FILE, 'utf8')
    const { source, written } = applyResults(current, results, date)
    if (source !== current) writeFileSync(PICKS_FILE, source)
    console.log(`\nWrote ${written} price(s) to data/picks.ts with priceCheckedAt ${date}.`)
  }

  const report = buildReport(results, date, PRICE_MAX_AGE_DAYS)
  if (reportPath) writeFileSync(reportPath, report)
  console.log('\n' + report)

  if (mostlyBlocked(results)) {
    console.error('Amazon blocked most requests (bot check). Wait a while and try again.')
    process.exitCode = 2
  }
}

main()
