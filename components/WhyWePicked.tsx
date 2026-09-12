import type { Pick } from '@/data/types'

/**
 * The three editorial reasons, given the weight a star rating would normally
 * occupy.
 *
 * This is the content that is actually ours. Anyone can copy a merchant's
 * spec sheet; nobody else can tell the reader which three things made us
 * choose this one over the alternatives. So it is set large, in the display
 * face, one reason per row — not a bullet list tucked under the price.
 *
 * `whyWePicked` is typed as a tuple of exactly three, so the numbering here
 * is never 01–02 or 01–07.
 */
export function WhyWePicked({ pick }: { pick: Pick }) {
  return (
    <section aria-labelledby="why-heading">
      <h2 id="why-heading" className="font-display text-2xl text-paper sm:text-3xl">
        Why we picked it
      </h2>
      <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted">
        Three reasons we stand behind, in place of a rating we would have had
        to invent.
      </p>

      <ol className="mt-6 divide-y divide-line-soft border-y border-line-soft">
        {pick.whyWePicked.map((reason, i) => (
          <li
            key={i}
            className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-4 sm:py-6"
          >
            <span
              aria-hidden="true"
              className="tnum pt-1.5 text-sm font-semibold text-shu"
            >
              0{i + 1}
            </span>
            <p className="max-w-[56ch] font-display text-lg leading-snug font-medium text-paper sm:text-xl">
              {reason}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
