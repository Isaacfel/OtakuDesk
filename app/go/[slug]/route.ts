import { NextResponse, type NextRequest } from 'next/server'
import { after } from 'next/server'
import { getPickByGoSlug } from '@/data/picks'
import { getMerchant } from '@/data/merchants'
import { isPurchasable } from '@/data/types'
import {
  buildSubId,
  buildTrackedUrl,
  normalizeFrom,
  AffiliateConfigError,
} from '@/lib/affiliate'
import { logOutboundClick } from '@/lib/analytics'

/**
 * The outbound link layer.
 *
 * Every affiliate link on the site points here. Nothing else in the codebase
 * resolves `pick.purchaseUrl`. That buys four things at once:
 *
 *   1. One place to change when a program alters its link format.
 *   2. Click counts we own, independent of the network's dashboard — which is
 *      also the only check on whether the network reports honestly.
 *   3. `rel` and tagging guaranteed rather than remembered.
 *   4. A dead link can be killed site-wide with one data edit.
 *
 * Request input never chooses the destination. `slug` is only a lookup key
 * into our own catalog (exact match, or bounce); `from` is reduced to a short
 * `[a-zA-Z0-9_:.-]` label before it is logged or folded into the sub-id.
 *
 * Route handlers are dynamic by default in Next 16; `force-dynamic` is stated
 * anyway because a cached redirect here would silently lose every click.
 */
export const dynamic = 'force-dynamic'

/** goSlugs are short kebab-case identifiers. Anything else is not a lookup. */
const SLUG_MAX_LENGTH = 128
const SLUG_SHAPE = /^[a-zA-Z0-9_-]+$/

/**
 * Bounce the reader back to one of OUR pages.
 *
 * The Location is deliberately relative. Building it from `request.url`
 * would derive the origin from the Host header, which a misconfigured proxy
 * can let a client set — turning "unknown slug, send them to /desk" into an
 * open redirect to any host. Browsers resolve a relative Location against
 * the origin they actually connected to, so there is nothing to spoof.
 */
function bounce(path: string): NextResponse {
  const res = new NextResponse(null, { status: 302 })
  res.headers.set('Location', path)
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params

  // Reject junk before it reaches the catalog. The lookup is an exact match
  // so this is not an injection guard — it keeps garbage out of the logs and
  // short-circuits the obvious scanner traffic a public redirect attracts.
  if (
    typeof slug !== 'string' ||
    slug.length === 0 ||
    slug.length > SLUG_MAX_LENGTH ||
    !SLUG_SHAPE.test(slug)
  ) {
    return bounce('/desk')
  }

  const pick = getPickByGoSlug(slug)

  // Unknown slug: a stale link from an old article or a mistyped URL.
  // Send the reader somewhere useful rather than showing them an error.
  if (!pick) return bounce('/desk')

  // The two hard stops, both delegating to the same predicate the UI uses so
  // the button and the redirect can never disagree. Sample and unverified
  // picks bounce back to their own page, which explains the state — far
  // better than dropping someone on a merchant 404.
  if (!isPurchasable(pick)) {
    return bounce(`/picks/${pick.slug}?unavailable=1`)
  }

  // `from` is attribution only. Bounded and reduced to a safe charset here so
  // a hostile query string can neither grow the log line nor reach the network.
  const from = normalizeFrom(request.nextUrl.searchParams.get('from'))

  let destination: string
  let merchantName = 'unknown'
  let network = 'unknown'
  try {
    const merchant = getMerchant(pick.merchantId)
    merchantName = merchant.name
    network = merchant.network
    destination = buildTrackedUrl(pick, buildSubId(pick.slug, from))
  } catch (err) {
    // An untagged link is worse than no link: it converts for the merchant and
    // pays us nothing, silently, for as long as nobody notices. Refuse to send
    // the reader out, and make the misconfiguration loud in the logs.
    //
    // Anything else thrown here is a catalog data bug (unknown merchant, bad
    // URL). That is ours to fix, not the reader's to see as a 500 — bounce
    // them to the pick page, which explains that the link is unavailable.
    console.error(
      JSON.stringify({
        event:
          err instanceof AffiliateConfigError
            ? 'affiliate_misconfigured'
            : 'affiliate_redirect_failed',
        pick: pick.slug,
        merchant: pick.merchantId,
        reason: err instanceof Error ? err.message : String(err),
      }),
    )
    return bounce(`/picks/${pick.slug}?unavailable=1`)
  }

  // Fire-and-forget: the reader never waits on our analytics.
  after(() =>
    logOutboundClick({
      pickSlug: pick.slug,
      merchant: merchantName,
      network,
      from,
    }),
  )

  // 302, never 301. A cached permanent redirect costs us the click count and
  // the ability to retarget the link when the program changes.
  //
  // `destination` is absolute and came from the catalog via buildTrackedUrl,
  // which is the only place a merchant URL is ever resolved.
  const res = NextResponse.redirect(destination, 302)
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'no-store')
  // Networks attribute on the referring page; the site-wide policy in
  // next.config.ts is stricter and is overridden for /go there as well.
  res.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  return res
}
