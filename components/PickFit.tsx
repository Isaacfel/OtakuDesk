import type { Pick } from '@/data/types'
import { EditorialBadge } from '@/components/motifs'
import { DossierHeading } from './ProductDossierSection'

/**
 * Who this suits, and what to watch out for.
 *
 * The caveat is the most trust-building thing on the page and is treated
 * that way: it gets its own tinted panel at full body size with a sticker on
 * it, not a footnote, and it is never collapsed. A guide that only ever says
 * nice things is indistinguishable from an advert. `watchOut` is optional in
 * the data because some picks genuinely have no drawback worth naming — the
 * panel is omitted then, never filled with a soft non-caveat.
 */
export function PickFit({
  pick,
  bestForN = '02',
  watchOutN = '03',
}: {
  pick: Pick
  bestForN?: string
  watchOutN?: string
}) {
  return (
    <div className={`grid gap-6 ${pick.watchOut ? 'lg:grid-cols-2' : ''}`}>
      <section aria-labelledby="fit-heading" className="flex min-w-0 flex-col">
        <DossierHeading n={bestForN} id="fit-heading" title="Best for" />
        <div className="panel-frame mt-5 flex-1 bg-surface p-5 sm:p-6">
          <p className="max-w-[44ch] font-display text-lg leading-snug font-medium text-paper sm:text-xl">
            {pick.bestFor}
          </p>
        </div>
      </section>

      {pick.watchOut && (
        <section aria-labelledby="watch-heading" className="flex min-w-0 flex-col">
          <DossierHeading n={watchOutN} id="watch-heading" title="Watch out" />
          <div className="relative mt-5 flex-1 border-2 border-orange bg-orange-soft p-5 pt-6 sm:p-6 sm:pt-7">
            <EditorialBadge tone="orange" className="absolute -top-3 left-4">
              Honest caveat
            </EditorialBadge>
            <p className="max-w-[44ch] text-base leading-relaxed text-paper">
              {pick.watchOut}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
