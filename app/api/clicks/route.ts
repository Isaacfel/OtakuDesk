import { NextResponse, type NextRequest } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { MAX_SUMMARY_DAYS, summarizeClicks, tokenMatches } from '@/lib/clicks'

/**
 * Owner-only summary of the outbound click log.
 *
 *   GET /api/clicks?days=30
 *   authorization: Bearer <ADMIN_TOKEN>
 *
 * ADMIN_TOKEN is a Worker secret (`npx wrangler secret put ADMIN_TOKEN`); it
 * never appears in the repo. The comparison is constant-time and an unset
 * secret refuses everyone rather than admitting anyone.
 *
 * `force-dynamic` and `no-store` because a cached summary is a stale summary,
 * and because nothing here may ever be served from a shared cache.
 */
export const dynamic = 'force-dynamic'

const DEFAULT_DAYS = 30

function json(body: unknown, status: number, extra?: Record<string, string>): NextResponse {
  const res = NextResponse.json(body, { status })
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  for (const [k, v] of Object.entries(extra ?? {})) res.headers.set(k, v)
  return res
}

function bearer(request: NextRequest): string {
  const header = request.headers.get('authorization') ?? ''
  const m = /^Bearer\s+(\S+)$/i.exec(header.trim())
  return m ? m[1] : ''
}

export async function GET(request: NextRequest) {
  let env: CloudflareEnv | undefined
  try {
    env = (await getCloudflareContext({ async: true })).env
  } catch {
    // No Cloudflare context (plain `next dev`): there is no secret to check
    // against, so nobody is authorised. Falls through to the 401 below.
  }

  // Authenticate before anything else so an unauthenticated caller learns
  // nothing — not even whether the binding exists.
  if (!tokenMatches(bearer(request), env?.ADMIN_TOKEN ?? '')) {
    return json({ error: 'unauthorized' }, 401, { 'WWW-Authenticate': 'Bearer' })
  }

  const kv = env?.CLICKS
  if (!kv) {
    console.error(JSON.stringify({ event: 'clicks_misconfigured', missing: ['CLICKS'] }))
    return json({ error: 'click log unavailable' }, 503)
  }

  const raw = request.nextUrl.searchParams.get('days')
  const parsed = raw === null ? DEFAULT_DAYS : Number(raw)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return json({ error: `days must be an integer from 1 to ${MAX_SUMMARY_DAYS}` }, 400)
  }
  const days = Math.min(parsed, MAX_SUMMARY_DAYS)

  const summary = await summarizeClicks(kv, { days })
  return json(summary, 200)
}
