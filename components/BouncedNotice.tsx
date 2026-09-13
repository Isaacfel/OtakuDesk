'use client'

import { useSearchParams } from 'next/navigation'

/**
 * Shown when /go refused to redirect and sent the reader back here.
 *
 * Reads the query string on the client so the product page stays static.
 * Takes a pre-computed string, never a `Pick`, so nothing from the catalog is
 * serialized into the payload.
 */
export function BouncedNotice({ reason }: { reason: string }) {
  const params = useSearchParams()
  if (params.get('unavailable') !== '1') return null

  return (
    <p
      role="status"
      className="mb-6 rounded-md border border-caution/30 bg-caution-soft px-4 py-3 text-sm text-caution"
    >
      {reason}
    </p>
  )
}
