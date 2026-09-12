import type { Pick } from '@/data/types'
import { getPickById } from '@/data/picks'
import { PickCard } from './PickCard'
import { DossierHeading } from './ProductDossierSection'

/**
 * The comparison block.
 *
 * `pick.alternatives` holds pick ids, kept to two or three by convention.
 * Ids that no longer resolve — a retired pick — are dropped silently rather
 * than rendered as a broken card, and if nothing is left the section is
 * omitted entirely, margin included, so the page does not carry an empty
 * heading.
 */
export function PickAlternatives({
  pick,
  n = '06',
  className = '',
}: {
  pick: Pick
  n?: string
  className?: string
}) {
  const alternatives = pick.alternatives
    .map((id) => getPickById(id))
    .filter((alt): alt is Pick => alt !== undefined && alt.id !== pick.id)

  if (alternatives.length === 0) return null

  return (
    <section aria-labelledby="alternatives-heading" className={className}>
      <DossierHeading
        n={n}
        id="alternatives-heading"
        title="Also consider"
        kicker="What we would weigh this against before deciding. Same facts on every card: licence, seller, dated price."
      />

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {alternatives.map((alt) => (
          <li key={alt.id} className="min-w-0">
            <PickCard pick={alt} ratio="standard" />
          </li>
        ))}
      </ul>
    </section>
  )
}
