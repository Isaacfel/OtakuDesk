import type { CatalogPick, LicenseStatus } from '@/data/types'
import { LICENSE_LABEL } from '@/data/types'

const BADGE_TONE: Record<LicenseStatus, string> = {
  officially_licensed: 'bg-ok-soft text-ok',
  original_design: 'bg-ok-soft text-ok',
  unverified: 'bg-bg-soft text-fg-muted',
}

export function LicenceBadge({ status }: { status: LicenseStatus }) {
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold ${BADGE_TONE[status]}`}
    >
      {LICENSE_LABEL[status]}
    </span>
  )
}

/** The editorial notes, collapsed behind one "Details" toggle. */
export function ProductDetails({
  pick,
  className = '',
}: {
  pick: CatalogPick
  className?: string
}) {
  return (
    <details className={`group border-t border-line ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-fg [&::-webkit-details-marker]:hidden">
        Details
        <span aria-hidden="true" className="text-fg-muted group-open:hidden">
          +
        </span>
        <span aria-hidden="true" className="hidden text-fg-muted group-open:inline">
          &minus;
        </span>
      </summary>
      <div className="space-y-4 pb-5 text-sm leading-relaxed text-fg">
        <p>{pick.description}</p>
        <ul className="list-disc space-y-1.5 pl-5">
          {pick.whyWePicked.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <p>
          <span className="font-semibold">Best for:</span> {pick.bestFor}
        </p>
        {pick.watchOut && (
          <p>
            <span className="font-semibold">Watch out:</span> {pick.watchOut}
          </p>
        )}
      </div>
    </details>
  )
}
