import { NextResponse, type NextRequest } from 'next/server'
import { after } from 'next/server'
import { getPickByGoSlug } from '@/data/picks'
import { getMerchant } from '@/data/merchants'
import { isPurchasable } from '@/data/types'
import { buildSubId, buildTrackedUrl, AffiliateConfigError } from '@/lib/affiliate'
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
 * Route handlers are dynamic by default in Next 16; `force-dynamic` is stated
 * anyway because a cached redirect here would silently lose every click.
 */
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params
  const pick = getPickByGoSlug(slug)

  const bounce = (path: string) => {
    const res = NextResponse.redirect(new URL(path, request.url), 302)
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

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

  const from = request.nextUrl.searchParams.get('from') ?? 'direct'
  const merchant = getMerchant(pick.merchantId)
  const subId = buildSubId(pick.slug, from)

  let destination: string
  try {
    destination = buildTrackedUrl(pick, subId)
  } catch (err) {
    // An untagged link is worse than no link: it converts for the merchant and
    // pays us nothing, silently, for as long as nobody notices. Refuse to send
    // the reader out, and make the misconfiguration loud in the logs.
    if (err instanceof AffiliateConfigError) {
      console.error(
        JSON.stringify({
          event: 'affiliate_misconfigured',
          pick: pick.slug,
          merchant: merchant.id,
          reason: err.message,
        }),
      )
      return bounce(`/picks/${pick.slug}?unavailable=1`)
    }
    throw err
  }

  // Fire-and-forget: the reader never waits on our analytics.
  after(() =>
    logOutboundClick({
      pickSlug: pick.slug,
      merchant: merchant.name,
      network: merchant.network,
      from,
    }),
  )

  // 302, never 301. A cached permanent redirect costs us the click count and
  // the ability to retarget the link when the program changes.
  const res = NextResponse.redirect(destination, 302)
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  return res
}
