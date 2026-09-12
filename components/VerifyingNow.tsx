import Link from 'next/link'
import { PICKS } from '@/data/picks'

/**
 * Names the picks currently sitting at `licenseStatus: 'unverified'`.
 *
 * This exists because three articles originally asserted, in fixed prose, that
 * one named product was awaiting verification. That was true the day it was
 * written and becomes false the moment the check clears — on a site whose only
 * real claim is that it tells you the truth about licence status. A stale
 * sentence there does more damage than no sentence at all.
 *
 * Reading it from the catalog at build time means the articles cannot drift
 * from the data: clear a pick and the prose updates itself; flag a new one and
 * it is named automatically.
 *
 * Available in every .mdx file without an import, via mdx-components.tsx.
 */
export function VerifyingNow() {
  const waiting = PICKS.filter((p) => p.licenseStatus === 'unverified')

  if (waiting.length === 0) {
    return (
      <>
        Every pick currently in the Vault has cleared that check — but the
        label exists precisely so that we are not tempted to skip it.
      </>
    )
  }

  return (
    <>
      {waiting.length === 1 ? 'One pick is' : `${waiting.length} picks are`} in
      that state right now:{' '}
      {waiting.map((p, i) => (
        <span key={p.id}>
          {i > 0 && (i === waiting.length - 1 ? ' and ' : ', ')}
          <Link href={`/picks/${p.slug}`}>{p.title}</Link>
        </span>
      ))}
      . Not because we think anything is counterfeit, but because the check is
      unfinished, and &ldquo;probably fine&rdquo; is not a licence status.
    </>
  )
}
