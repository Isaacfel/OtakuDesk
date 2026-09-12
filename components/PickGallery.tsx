import type { ImageSource, Pick } from '@/data/types'
import { EnergyBurst, GlowOrb, SparkleField } from '@/components/motifs'
import { PickThumb, accentFor, glowVars, GLOW } from './PickThumb'
import { Sticker } from './PickCard'

/**
 * The image area of the pick page — a lit display case.
 *
 * The product visual sits on a dark plate behind a hairline frame, lit from
 * behind by the category's colour: an impact burst radiating out from the
 * centre, a soft lamp, a few sparkles, and a glow around the frame. It is
 * the collectible-card treatment — the thing itself, presented — and
 * entirely original: no artwork, no character, nothing traced.
 *
 * Most picks carry one image; a gallery is handled by leading with the first
 * and laying the rest out as a tile row beneath it. No client-side carousel:
 * every image is visible without a click, which is also what makes them
 * indexable and reachable by keyboard for free.
 *
 * The caption states the image's provenance. Every image on the site must
 * trace to a granted right, and saying so in the open is both the honest
 * thing and a reminder — when a real photo lands here, the caption changes
 * to name where it came from.
 */
const SOURCE_CAPTION: Record<ImageSource, string> = {
  merchant_feed: 'Image supplied by the seller',
  press_kit: "Image from the maker's press kit",
  own: 'Photographed by Otakudesk',
  placeholder: 'Generated placeholder — not a photograph of the product',
}

export function PickGallery({ pick }: { pick: Pick }) {
  const [lead, ...rest] = pick.images
  const accent = accentFor(pick.category)

  return (
    <figure className="flex min-w-0 flex-col gap-3" style={glowVars(accent.cssVar)}>
      <div className={`relative overflow-visible border border-line bg-panel-2 p-4 sm:p-6 ${GLOW}`}>
        {/* The light behind the plate. All decorative. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <EnergyBurst
            intensity="low"
            tone={accent.motifTone}
            seed={`plate:${pick.slug}`}
            className="opacity-80"
          />
          <GlowOrb
            tone={accent.motifTone}
            size="110%"
            intensity="mid"
            blend="screen"
            pulse
            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          <SparkleField
            seed={`plate:${pick.slug}`}
            count={6}
            tone={accent.motifTone}
            minSize={8}
            maxSize={18}
          />
        </div>

        {/* The plate. */}
        <div className="relative border border-paper/20 bg-surface shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)]">
          <PickThumb pick={pick} image={lead} priority ratio="standard" />
        </div>

        <Sticker tone={accent.tone} className="absolute -top-3 left-4 sm:left-6">
          {pick.category}
        </Sticker>
      </div>

      {rest.length > 0 && (
        <ul className="grid grid-cols-3 gap-3" aria-label="More views">
          {rest.map((img, i) => (
            <li
              key={`${img.src || 'placeholder'}-${i}`}
              className="min-w-0 overflow-hidden border border-line bg-surface p-1"
            >
              <PickThumb pick={pick} image={img} ratio="standard" />
              <span className="label-xs mt-1 block text-muted">
                Fig. {String(i + 2).padStart(2, '0')}
              </span>
            </li>
          ))}
        </ul>
      )}

      <figcaption className="label-xs flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-muted">
        <span className="text-paper-2">Fig. 01</span>
        <span>{SOURCE_CAPTION[lead?.source ?? 'placeholder']}</span>
      </figcaption>
    </figure>
  )
}
