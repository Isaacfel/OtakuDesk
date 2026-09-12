import type { LicenseStatus, Pick } from '@/data/types'
import { getMerchant } from '@/data/merchants'
import { LicenseBadge, VerifiedStamp } from './Badges'

/**
 * What our licence verdict means for THIS pick.
 *
 * The badge says "Officially licensed" or "Original design"; on its own that
 * is a label, not an argument. This block spells out what we checked and,
 * for the unverified state, why the absence of a buy link is a decision
 * rather than an omission.
 *
 * Copy is per-status and names the merchant, because a generic paragraph
 * about licensing in the abstract is exactly what a reader has learned to
 * skip.
 */
const EXPLAINER: Record<LicenseStatus, (merchantName: string) => string> = {
  officially_licensed: (m) =>
    `"Officially licensed" means we checked that ${m} is an official storefront or an authorised retailer for this product, and that the product itself carries the rights holder's licensing marks. It is the strongest signal available that the people who made the series are paid when you buy it.`,
  original_design: (m) =>
    `"Original design" means this product uses no studio's characters, logos, or artwork — the design belongs to the maker. There is no franchise licence to verify because none is needed. What we do check is that ${m} is the designer, or their authorised outlet, rather than a reseller of copied work.`,
  unverified: (m) =>
    `"Verifying" means we have not yet confirmed who holds the rights to this design, or that ${m} is authorised to sell it. Until both are confirmed there is no buy link on this page. That is not a formality: we do not send readers to a product we cannot vouch for.`,
}

const LIGHT: Record<LicenseStatus, string> = {
  officially_licensed: 'text-green',
  original_design: 'text-blue',
  unverified: 'text-orange',
}

export function PickLicenseNote({ pick }: { pick: Pick }) {
  const merchant = getMerchant(pick.merchantId)

  return (
    <section aria-labelledby="licence-heading" className="min-w-0">
      <h3 id="licence-heading" className={`label-xs mb-3 ${LIGHT[pick.licenseStatus]}`}>
        Authenticity &amp; licensing
      </h3>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <LicenseBadge pick={pick} />
        <VerifiedStamp pick={pick} />
      </div>

      <p className="max-w-[58ch] text-sm leading-relaxed text-paper-2">
        {EXPLAINER[pick.licenseStatus](merchant.name)}
      </p>

      <p className="mt-3 max-w-[58ch] border-l-2 border-line pl-3 text-xs leading-relaxed text-muted">
        The date above is when we last re-checked the seller and the licence
        for this pick. Our verdict describes the product and the seller; it is
        not an endorsement by, or an affiliation with, any studio, publisher,
        or licensor.
      </p>
    </section>
  )
}
