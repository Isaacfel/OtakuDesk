import type { CSSProperties } from 'react'
import type { Pick } from '@/data/types'
import { DossierHeading } from './ProductDossierSection'

/**
 * The three editorial reasons, given the weight a star rating would normally
 * occupy — and the page's one staged dark spread.
 *
 * This is the content that is actually ours. Anyone can copy a merchant's
 * spec sheet; nobody else can tell the reader which three things made us
 * choose this one over the alternatives. So it is set large, in the display
 * face, one reason per row, on the dark panel where the electric red is
 * allowed to appear.
 *
 * `whyWePicked` is typed as a tuple of exactly three, so the numbering here
 * is never 01–02 or 01–07.
 */

/* Motif utilities draw in `--paper`; on a dark panel that has to be the light
   stock. Flipped on the decorative layer only. */
const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

export function WhyWePicked({ pick, n = '01' }: { pick: Pick; n?: string }) {
  return (
    <section
      aria-labelledby="why-heading"
      className="relative overflow-hidden border-2 border-paper bg-panel text-panel-type"
    >
      <div
        aria-hidden="true"
        style={ON_DARK}
        className="halftone-lg pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40 [mask-image:linear-gradient(90deg,transparent,#000_50%)]"
      />

      <div className="relative p-5 sm:p-8">
        <DossierHeading
          n={n}
          id="why-heading"
          tone="dark"
          title="Why this made the list"
          kicker="Three reasons we stand behind, in place of a rating we would have had to invent."
        />

        <ol className="mt-6 divide-y divide-panel-line border-y border-panel-line">
          {pick.whyWePicked.map((reason, i) => (
            <li
              key={i}
              className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4 sm:py-6"
            >
              <span
                aria-hidden="true"
                className="tnum pt-1.5 text-sm font-semibold text-shu-electric"
              >
                0{i + 1}
              </span>
              <p className="max-w-[56ch] font-display text-lg leading-snug font-medium text-panel-type sm:text-xl">
                {reason}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
