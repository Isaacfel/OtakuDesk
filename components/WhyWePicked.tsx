import type { Pick } from '@/data/types'
import { GlowOrb, PanelCut, SpeedStreaks } from '@/components/motifs'
import { DossierHeading } from './ProductDossierSection'

/**
 * The three editorial reasons, given the weight a star rating would normally
 * occupy — and the page's one full dark spread.
 *
 * This is the content that is actually ours. Anyone can copy a merchant's
 * spec sheet; nobody else can tell the reader which three things made us
 * choose this one over the alternatives. So it is cut into the page between
 * two diagonal panel gutters, set large in the display face with the beat
 * numbers lit red, with a lamp behind it and speed lines running through —
 * the action panel of the dossier.
 *
 * `whyWePicked` is typed as a tuple of exactly three, so the numbering here
 * is never 01–02 or 01–07.
 */
export function WhyWePicked({ pick, n = '01' }: { pick: Pick; n?: string }) {
  return (
    <section aria-labelledby="why-heading" className="relative">
      <PanelCut top="ink" bottom="panel-2" slope="fall" height={40} rule="shu" />

      <div className="relative overflow-hidden bg-panel-2 text-panel-type">
        <GlowOrb
          tone="shu"
          size={620}
          intensity="mid"
          blend="screen"
          pulse
          className="-top-80 -right-52"
        />
        <GlowOrb tone="lilac" size={420} intensity="low" blend="screen" className="-bottom-64 -left-40" />
        <SpeedStreaks
          direction="diagonal"
          from="right"
          density="mid"
          tone="ink"
          seed={`why:${pick.slug}`}
          className="opacity-30"
        />

        <div className="relative px-5 py-8 sm:px-8 sm:py-10">
          <DossierHeading
            n={n}
            id="why-heading"
            tone="dark"
            title="Why this made the Desk"
            kicker="Three reasons we stand behind, in place of a rating we would have had to invent."
          />

          <ol className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {pick.whyWePicked.map((reason, i) => (
              <li
                key={i}
                className="relative border-t border-panel-line pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
              >
                <span
                  aria-hidden="true"
                  className="tnum text-glow-red block font-display text-5xl leading-none font-extrabold text-shu-electric sm:text-6xl"
                >
                  0{i + 1}
                </span>
                <p className="mt-4 max-w-[36ch] font-display text-lg leading-snug font-medium text-panel-type sm:text-xl">
                  {reason}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <PanelCut top="panel-2" bottom="ink" slope="rise" height={40} rule="shu" />
    </section>
  )
}
