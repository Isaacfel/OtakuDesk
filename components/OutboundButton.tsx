'use client'

import type { Pick } from '@/data/types'
import { isPurchasable } from '@/data/types'
import { getMerchant } from '@/data/merchants'
import { goHref, INLINE_DISCLOSURE } from '@/lib/affiliate'
import { track } from '@/lib/analytics'
import { PriceStamp } from './PriceStamp'

/**
 * The ONLY sanctioned way to send a reader to a merchant.
 *
 * The disclosure is rendered by this component, as a full sentence, adjacent
 * to the control — not a bare "affiliate link" tag, and not a line in the
 * footer. The FTC standard is that disclosure be clear, conspicuous, and
 * placed before the reader acts.
 *
 * Building it in here is the point: there is no code path in the application
 * that produces an outbound link without a disclosure attached, so compliance
 * does not depend on anyone remembering it in month three.
 *
 * `from` records which page produced the click. It rides through /go into the
 * network's own reporting, which is the difference between knowing you earned
 * $40 and knowing which article earned it.
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

  // Sample data and unverified licences never get a buy button. Same predicate
  // the /go route uses, so the UI and the redirect cannot disagree.
  if (!isPurchasable(pick)) {
    return <UnavailablePanel pick={pick} />
  }

  return (
    <div className="flex flex-col gap-2.5">
      <a
        href={goHref(pick, from)}
        rel="sponsored nofollow noopener"
        target="_blank"
        onClick={() =>
          track({
            name: 'outbound_click',
            pickSlug: pick.slug,
            merchant: merchant.name,
            network: merchant.network,
            from,
          })
        }
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-shu px-5 py-3 font-display text-sm font-semibold tracking-tight text-white transition-colors hover:bg-shu-bright focus-visible:bg-shu-bright"
      >
        Check price at {merchant.name}
        <span aria-hidden="true">→</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>

      {showPrice && (
        <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} />
      )}

      {/* Ships with the button, by construction. */}
      <p className="max-w-[46ch] text-xs leading-relaxed text-muted">
        {INLINE_DISCLOSURE}{' '}
        <a className="text-paper-2 underline underline-offset-2" href="/disclosure">
          How this works
        </a>
      </p>
    </div>
  )
}

/**
 * What a reader sees instead of a buy button.
 *
 * Two different states, deliberately distinguished: one says our verification
 * is incomplete, the other says the purchase path is not configured. Blurring
 * them into a generic "unavailable" would waste the trust the distinction buys.
 */
function UnavailablePanel({ pick }: { pick: Pick }) {
  const verifying = pick.licenseStatus === 'unverified'
  const sample = pick.linkStatus === 'sample'

  return (
    <div className="rounded-sm border border-dashed border-line bg-surface p-4">
      <p className="label-xs mb-2 text-caution">
        {verifying ? 'Verification in progress' : sample ? 'Sample listing' : 'Currently unavailable'}
      </p>
      <p className="max-w-[52ch] text-sm leading-relaxed text-paper-2">
        {verifying ? (
          <>
            We verify the seller and the licensing on every pick before we link
            to it. This one has not cleared yet, so there is no buy link.
          </>
        ) : sample ? (
          <>
            This is sample catalog data used while the site is being built. No
            purchase path is configured and nothing here is for sale.
          </>
        ) : (
          <>
            The seller&rsquo;s listing is no longer reachable. We have pulled the
            link rather than send you to a dead page.
          </>
        )}
      </p>
    </div>
  )
}
