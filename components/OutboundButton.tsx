import type { Pick } from '@/data/types'
import { isPurchasable } from '@/data/types'
import { getMerchant } from '@/data/merchants'
import { goHref, INLINE_DISCLOSURE } from '@/lib/affiliate'
import { PriceStamp } from './PriceStamp'
import { TrackedLink } from './TrackedLink'

/**
 * The ONLY sanctioned way to send a reader to a merchant.
 *
 * The disclosure sentence renders with the button, so no code path produces
 * an outbound link without it. `isPurchasable` is the same predicate the /go
 * route uses, so the button and the redirect cannot disagree.
 *
 * Server component on purpose: it handles the full `Pick` (which carries the
 * raw `purchaseUrl`) and passes only primitives to the client `TrackedLink`,
 * so the merchant URL never reaches the browser.
 */
export function OutboundButton({
  pick,
  from,
  showPrice = true,
}: {
  pick: Pick
  from: string
  showPrice?: boolean
}) {
  const merchant = getMerchant(pick.merchantId)

  if (!isPurchasable(pick)) {
    return (
      <p className="rounded-md border border-line bg-bg-soft px-4 py-3 text-sm text-fg-muted">
        {pick.licenseStatus === 'unverified'
          ? "We're still confirming this item's licence, so there is no buy link yet."
          : 'This listing is no longer available.'}
      </p>
    )
  }

  const label = merchant.network === 'amazon' ? 'Buy on Amazon' : `Buy at ${merchant.name}`

  return (
    <div>
      {showPrice && (
        <div className="mb-3">
          <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} size="lg" />
        </div>
      )}
      <TrackedLink
        href={goHref(pick, from)}
        pickSlug={pick.slug}
        merchant={merchant.name}
        network={merchant.network}
        from={from}
        className="inline-flex w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover sm:w-auto sm:min-w-56"
      >
        {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </TrackedLink>
      <p className="mt-2 text-xs leading-relaxed text-fg-muted">
        {INLINE_DISCLOSURE}{' '}
        <a className="underline underline-offset-2 hover:text-fg" href="/disclosure">
          Details
        </a>
      </p>
    </div>
  )
}
