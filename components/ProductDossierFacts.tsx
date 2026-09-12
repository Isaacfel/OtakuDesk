import type { Pick } from '@/data/types'
import { SELLER_LABEL } from '@/data/types'
import { getMerchant } from '@/data/merchants'
import { LicenseBadge, VerifiedStamp } from './Badges'
import { PriceStamp } from './PriceStamp'

/**
 * The facts strip under the title — the stat block on the card's back.
 *
 * Everything a reader needs before the argument begins: the licence verdict,
 * who is selling, the dated price, and when we last checked. Four cells with
 * hairline gutters, like the stat grid on a collectible card — except nothing
 * here is a rating or a count of anything we did not verify ourselves; every
 * value comes straight off the pick record.
 *
 * Server-only by nature: it takes the full `Pick`. It renders no link.
 */
export function ProductDossierFacts({ pick }: { pick: Pick }) {
  const merchant = getMerchant(pick.merchantId)

  return (
    <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
      <div className="min-w-0 bg-surface p-3.5">
        <dt className="label-xs mb-2 text-muted">Licence</dt>
        <dd>
          <LicenseBadge pick={pick} />
        </dd>
      </div>

      <div className="min-w-0 bg-surface p-3.5">
        <dt className="label-xs mb-2 text-muted">Seller</dt>
        <dd className="text-sm leading-snug">
          <span className="font-semibold text-paper">{merchant.name}</span>
          <span className="block text-xs text-muted">{SELLER_LABEL[pick.sellerType]}</span>
        </dd>
      </div>

      <div className="min-w-0 bg-surface p-3.5">
        <dt className="label-xs mb-2 text-muted">Price</dt>
        <dd>
          <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} size="sm" />
        </dd>
      </div>

      <div className="min-w-0 bg-surface p-3.5">
        <dt className="label-xs mb-2 text-muted">Verified</dt>
        <dd>
          <VerifiedStamp pick={pick} />
        </dd>
      </div>
    </dl>
  )
}
