import type { Pick } from '@/data/types'
import { LICENSE_LABEL, SELLER_LABEL } from '@/data/types'
import { getMerchant } from '@/data/merchants'

/**
 * The licence badge.
 *
 * This is the differentiator made visible. Anyone can list anime merchandise;
 * almost nobody tells you whether a given item is officially licensed, an
 * original design, or something they have not checked. Semantic colour here is
 * kept separate from the brand accent so "verified" never reads as merely
 * "on brand".
 */
export function LicenseBadge({ pick }: { pick: Pick }) {
  const tone = {
    officially_licensed: 'bg-verified-soft text-verified',
    original_design: 'bg-ai-soft text-ai',
    unverified: 'bg-caution-soft text-caution',
  }[pick.licenseStatus]

  return (
    <span className={`label-xs inline-block rounded-xs px-2 py-1 ${tone}`}>
      {LICENSE_LABEL[pick.licenseStatus]}
    </span>
  )
}

/**
 * Who the reader is actually buying from — the question no marketplace
 * listing answers, and the reason someone would use this site over a search.
 */
export function SellerNote({
  pick,
  detailed = false,
}: {
  pick: Pick
  detailed?: boolean
}) {
  const merchant = getMerchant(pick.merchantId)

  if (!detailed) {
    return (
      <p className="text-xs text-muted">
        {SELLER_LABEL[pick.sellerType]} &middot;{' '}
        <span className="text-paper-2">{merchant.name}</span>
      </p>
    )
  }

  return (
    <div className="border-t border-line-soft pt-4">
      <h3 className="label-xs mb-2 text-muted">Who you are buying from</h3>
      <p className="mb-1 font-semibold text-paper">
        {merchant.name}{' '}
        <span className="font-normal text-muted">
          &middot; {SELLER_LABEL[pick.sellerType]}
        </span>
      </p>
      <p className="max-w-[58ch] text-sm leading-relaxed text-paper-2">
        {merchant.blurb}
      </p>
      {merchant.policyUrl && (
        <p className="mt-2 text-sm">
          <a
            href={merchant.policyUrl}
            rel="nofollow noopener"
            target="_blank"
            className="text-muted underline underline-offset-2 hover:text-paper"
          >
            Their shipping &amp; returns policy
          </a>
          <span className="text-muted">
            {' '}
            — we link to it rather than restate it, so it cannot go stale here.
          </span>
        </p>
      )}
    </div>
  )
}

/**
 * The last-verified stamp. Small, and load-bearing: it is how a reader tells
 * a maintained guide from an abandoned affiliate farm.
 */
export function VerifiedStamp({ pick }: { pick: Pick }) {
  return (
    <p className="tnum text-[11px] text-muted">
      Checked{' '}
      <time dateTime={pick.lastVerifiedAt}>
        {new Date(pick.lastVerifiedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </time>
    </p>
  )
}
