'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Explains why a reader was sent back here from /go.
 *
 * This reads the query string on the CLIENT deliberately. Reading
 * `searchParams` in the page itself would opt the whole route into
 * request-time rendering, and `/picks/[slug]` is the most valuable page on the
 * site — it is what search traffic lands on and what has to be fast. Keeping
 * it prerendered means it is served from a CDN rather than rendered per
 * request, for the sake of a notice almost nobody sees.
 *
 * It takes the pre-computed `reason` string rather than a `Pick`, so no part of
 * the catalog — least of all `purchaseUrl` — is serialized into the payload.
 */
export function BouncedNotice({ reason }: { reason: string }) {
  const params = useSearchParams()
  if (params.get('unavailable') !== '1') return null

  return (
    <div
      role="status"
      className="mt-6 border-l-2 border-caution bg-surface p-4 sm:p-5"
    >
      <p className="label-xs mb-2 text-caution">Why you were sent back here</p>
      <p className="font-display text-lg leading-snug font-semibold text-paper">
        There is no live link to the seller for this pick.
      </p>
      <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-paper-2">
        {reason}
      </p>
    </div>
  )
}
