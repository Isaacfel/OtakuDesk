import type { Pick } from '@/data/types'
import { Sticker } from './PickCard'
import { DossierHeading, DossierPanel } from './ProductDossierSection'

/**
 * Who this suits, and what to watch out for.
 *
 * The caveat is the most trust-building thing on the page and is treated
 * that way: it gets its own lamplight-orange panel at full body size, a
 * jagged attention burst and a sticker, and it is never collapsed. A guide
 * that only ever says nice things is indistinguishable from an advert.
 * `watchOut` is optional in the data because some picks genuinely have no
 * drawback worth naming — the panel is omitted then, never filled with a
 * soft non-caveat.
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
    <div className={`grid gap-8 ${pick.watchOut ? 'lg:grid-cols-2' : ''}`}>
      <section aria-labelledby="fit-heading" className="flex min-w-0 flex-col">
        <DossierHeading n={bestForN} id="fit-heading" title="Best for" />
        <DossierPanel light="--blue" className="mt-6 flex-1 p-5 sm:p-6">
          <p className="label-xs text-blue">Who this suits</p>
          <p className="mt-2 max-w-[40ch] font-display text-xl leading-snug font-medium text-paper sm:text-2xl">
            {pick.bestFor}
          </p>
        </DossierPanel>
      </section>

      {pick.watchOut && (
        <section aria-labelledby="watch-heading" className="flex min-w-0 flex-col">
          <DossierHeading n={watchOutN} id="watch-heading" title="Watch out" />
          <div className="bloom-orange relative mt-6 flex-1 border-2 border-orange bg-orange-soft p-5 pt-7 sm:p-6 sm:pt-8">
            <Sticker tone="orange" className="absolute -top-3 left-4 bg-orange-soft">
              Honest caveat
            </Sticker>
            <div className="flex items-start gap-4">
              <AttentionBurst className="mt-0.5 h-10 w-10 shrink-0 text-orange" />
              <p className="max-w-[44ch] font-display text-lg leading-snug font-medium text-paper sm:text-xl">
                {pick.watchOut}
              </p>
            </div>
            <p className="mt-4 max-w-[52ch] text-xs leading-relaxed text-paper-2">
              We print the drawback in the same size as the praise. If this one matters to you,
              one of the alternatives further down may fit better.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

/**
 * A jagged "attention" burst with an exclamation mark — the manga shorthand
 * for a shout. Twelve points, hand-set radii, drawn here and nowhere else.
 */
function AttentionBurst({ className = '' }: { className?: string }) {
  const points: string[] = []
  const outer = [20, 19, 21, 20, 18, 21, 20, 19, 21, 20, 19, 20]
  const inner = 13
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? outer[i / 2] : inner
    points.push(`${(24 + Math.cos(a) * r).toFixed(1)},${(24 + Math.sin(a) * r).toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
      <polygon points={points.join(' ')} fill="currentColor" opacity="0.18" />
      <polygon points={points.join(' ')} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M24 14.5v12" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="24" cy="32.5" r="2" fill="currentColor" />
    </svg>
  )
}
