import type { Pick } from '@/data/types'
import { getPickById } from '@/data/picks'
import { PickCard } from './PickCard'

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
  className = '',
}: {
  pick: Pick
  className?: string
}) {
  const alternatives = pick.alternatives
    .map((id) => getPickById(id))
    .filter((alt): alt is Pick => alt !== undefined && alt.id !== pick.id)

  if (alternatives.length === 0) return null

  return (
    <section aria-labelledby="alternatives-heading" className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2
          id="alternatives-heading"
          className="font-display text-2xl text-paper sm:text-3xl"
        >
          Also consider
        </h2>
        <p className="text-sm text-muted">
          What we would weigh this against before deciding.
        </p>
      </div>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {alternatives.map((alt) => (
          <li key={alt.id} className="min-w-0">
            <PickCard pick={alt} />
          </li>
        ))}
      </ul>
    </section>
  )
}
