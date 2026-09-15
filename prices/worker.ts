import { PICKS } from '../data/picks'
import { PRICE_MAX_AGE_DAYS } from '../data/types'
import type { Pick } from '../data/types'
import { applyResults, buildReport, fetchListing, mostlyBlocked, type Outcome, type Result } from '../lib/prices'

/**
 * Weekly price refresh, as a Cloudflare cron Worker (see prices/wrangler.jsonc).
 *
 * Cloudflare's network is not blocked by Amazon's bot check, unlike GitHub's
 * hosted runners, so this is where the job lives.
 *
 * It runs in small steps. The cron fires every two minutes through a Monday
 * window; each firing reads ONE listing and records the result in KV, and
 * the firing that completes the list applies the prices to data/picks.ts as
 * fetched from GitHub, pushes a branch, and opens a pull request with the
 * report. One listing per invocation keeps CPU per run far under the free
 * plan's limit, and spacing the fetches two minutes apart is as polite to
 * Amazon as it gets. Nothing merges on its own.
 *
 * Needs: PRICES KV binding; GITHUB_TOKEN secret (fine-grained, this repo
 * only, Contents and Pull requests read/write). DRY_RUN=1 logs the report
 * instead of touching GitHub.
 */

type KV = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
}
type Env = { PRICES: KV; GITHUB_TOKEN?: string; GITHUB_REPO?: string; DRY_RUN?: string }
type ScheduledEvent = { scheduledTime: number; cron: string }

class PricesConfigError extends Error {}

/** One week's run. Kept in KV under `run:<date>`; expires after 14 days. */
type RunState = {
  date: string
  cursor: number
  results: Array<{ slug: string; outcome: Outcome; changed: boolean; suspicious: boolean }>
  done?: { at: string; summary: string }
}

const RUN_TTL_SECONDS = 14 * 24 * 60 * 60
const API = 'https://api.github.com'

function livePicks(): Pick[] {
  return PICKS.filter((p) => p.linkStatus === 'ok' && p.merchantId === 'amazon')
}

// --- GitHub ----------------------------------------------------------------

function gh(token: string) {
  return async <T>(method: string, path: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'otakudesk-prices',
        ...(body ? { 'content-type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`GitHub ${method} ${path}: ${res.status} ${(await res.text()).slice(0, 300)}`)
    return (await res.json()) as T
  }
}

// Base64 with real UTF-8 handling; the catalog contains non-ASCII (α, ×, ’).
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(bin)
}
function decodeBase64(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ''))
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)))
}

async function openPullRequest(env: Env, results: Result[], date: string): Promise<string> {
  if (!env.GITHUB_TOKEN) throw new PricesConfigError('GITHUB_TOKEN is not set')
  const repo = env.GITHUB_REPO ?? 'Isaacfel/OtakuDesk'
  const api = gh(env.GITHUB_TOKEN)
  const branch = `chore/prices-${date}`
  const report = buildReport(results, date, PRICE_MAX_AGE_DAYS)

  // Apply prices to the catalog as it is on main right now, not as bundled.
  const file = await api<{ content: string; sha: string }>('GET', `/repos/${repo}/contents/data/picks.ts?ref=main`)
  const current = decodeBase64(file.content)
  const { source, written } = applyResults(current, results, date)
  if (source === current) return `no changes (${written} prices confirmed)`

  const main = await api<{ object: { sha: string } }>('GET', `/repos/${repo}/git/ref/heads/main`)
  await api('POST', `/repos/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: main.object.sha })
  await api('PUT', `/repos/${repo}/contents/data/picks.ts`, {
    message: `Refresh prices (${date})`,
    content: encodeBase64(source),
    sha: file.sha,
    branch,
  })
  const pr = await api<{ html_url: string }>('POST', `/repos/${repo}/pulls`, {
    title: `Refresh prices (${date})`,
    head: branch,
    base: 'main',
    body: report,
  })
  return pr.html_url
}

// --- The stepwise run --------------------------------------------------------

/** Advance the week's run by one listing; finish it when the list is done. */
export async function step(env: Env, now: Date = new Date()): Promise<void> {
  if (!env.PRICES) throw new PricesConfigError('PRICES KV binding is missing')
  if (env.DRY_RUN !== '1' && !env.GITHUB_TOKEN) throw new PricesConfigError('GITHUB_TOKEN is not set')

  const date = now.toISOString().slice(0, 10)
  const key = `run:${date}`
  const picks = livePicks()
  const raw = await env.PRICES.get(key)
  const state: RunState = raw ? JSON.parse(raw) : { date, cursor: 0, results: [] }

  if (state.done) return

  if (state.cursor < picks.length) {
    const pick = picks[state.cursor]
    const outcome = await fetchListing(pick.purchaseUrl)
    const changed = outcome.kind === 'price' && pick.price !== outcome.price
    const suspicious =
      outcome.kind === 'price' &&
      pick.price !== null &&
      pick.price > 0 &&
      (outcome.price / pick.price > 3 || pick.price / outcome.price > 3)
    state.results.push({ slug: pick.slug, outcome, changed, suspicious })
    state.cursor++
    await env.PRICES.put(key, JSON.stringify(state), { expirationTtl: RUN_TTL_SECONDS })
    console.log(
      JSON.stringify({ event: 'price_checked', step: `${state.cursor}/${picks.length}`, pick: pick.slug, outcome: outcome.kind, changed }),
    )
    if (state.cursor < picks.length) return
  }

  // All listings read: finish the run.
  const bySlug = new Map(PICKS.map((p) => [p.slug, p]))
  const results: Result[] = state.results
    .map((r) => {
      const pick = bySlug.get(r.slug)
      return pick ? { pick, outcome: r.outcome, changed: r.changed, suspicious: r.suspicious } : null
    })
    .filter((r): r is Result => r !== null)

  let summary: string
  if (mostlyBlocked(results)) {
    summary = `blocked: Amazon refused ${results.filter((r) => r.outcome.kind === 'blocked').length} of ${results.length}`
  } else if (env.DRY_RUN === '1') {
    console.log(buildReport(results, date, PRICE_MAX_AGE_DAYS))
    summary = 'dry run'
  } else {
    summary = await openPullRequest(env, results, date)
  }

  state.done = { at: now.toISOString(), summary }
  await env.PRICES.put(key, JSON.stringify(state), { expirationTtl: RUN_TTL_SECONDS })
  console.log(
    JSON.stringify({
      event: 'prices_run_finished',
      date,
      checked: results.length,
      changed: results.filter((r) => r.changed && !r.suspicious).length,
      needsPerson: results.filter((r) => r.outcome.kind !== 'price' || r.suspicious).length,
      summary,
    }),
  )
}

const worker = {
  // Awaited, not handed to waitUntil: the runtime keeps a scheduled
  // invocation alive only as long as the returned promise.
  async scheduled(event: ScheduledEvent, env: Env) {
    try {
      await step(env, new Date(event.scheduledTime))
    } catch (err) {
      console.error(
        JSON.stringify({
          event: err instanceof PricesConfigError ? 'prices_misconfigured' : 'prices_failed',
          reason: err instanceof Error ? err.message : String(err),
        }),
      )
    }
  },

  // No public surface; the site lives on the otakudesk Worker.
  async fetch() {
    return new Response('Not found', { status: 404 })
  },
}

export default worker
