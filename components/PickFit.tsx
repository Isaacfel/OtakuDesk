import type { Pick } from '@/data/types'

/**
 * Who this suits, and what to watch out for.
 *
 * The caveat is the most trust-building thing on the page and is treated
 * that way: it gets its own tinted panel at full body size, not a footnote,
 * and it is never collapsed. A guide that only ever says nice things is
 * indistinguishable from an advert. `watchOut` is optional in the data
 * because some picks genuinely have no drawback worth naming — the panel is
 * omitted then, never filled with a soft non-caveat.
 */
export function PickFit({ pick }: { pick: Pick }) {
  return (
    <section
      aria-labelledby="fit-heading"
      className={`grid gap-5 ${pick.watchOut ? 'sm:grid-cols-2' : ''}`}
    >
      <h2 id="fit-heading" className="sr-only">
        Who it suits
      </h2>

      <div className="border-l-2 border-line pl-4 sm:pl-5">
        <h3 className="label-xs mb-2 text-muted">Best for</h3>
        <p className="max-w-[40ch] text-base leading-relaxed text-paper">
          {pick.bestFor}
        </p>
      </div>

      {pick.watchOut && (
        <div className="rounded-sm border border-caution/40 bg-caution-soft p-4 sm:p-5">
          <h3 className="label-xs mb-2 text-caution">Watch out</h3>
          <p className="max-w-[40ch] text-base leading-relaxed text-paper">
            {pick.watchOut}
          </p>
        </div>
      )}
    </section>
  )
}
