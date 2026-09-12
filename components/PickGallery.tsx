import type { ImageSource, Pick } from '@/data/types'
import { EditorialBadge, RegistrationMark } from '@/components/motifs'
import { PickThumb } from './PickThumb'
import { CATEGORY_ACCENT } from './PickCard'

/**
 * The image area of the pick page — a mounted print.
 *
 * The product visual sits inside a paper mat with a hard ink rule and a
 * second, offset impression, on a coarse-halftone backdrop with registration
 * marks at the corners: the treatment of a plate in a printed catalogue, and
 * entirely original. The category sticker is applied at the top edge.
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
  const accent = CATEGORY_ACCENT[pick.category] ?? CATEGORY_ACCENT['Desk & Room']

  return (
    <figure className="flex min-w-0 flex-col gap-3">
      <div className="halftone-lg relative border-2 border-paper bg-surface-2 p-5 sm:p-8">
        <RegistrationMark className="pointer-events-none absolute top-1.5 left-1.5 h-3.5 w-3.5 text-paper/60" />
        <RegistrationMark className="pointer-events-none absolute top-1.5 right-1.5 h-3.5 w-3.5 text-paper/60" />
        <RegistrationMark className="pointer-events-none absolute bottom-1.5 left-1.5 h-3.5 w-3.5 text-paper/60" />
        <RegistrationMark className="pointer-events-none absolute right-1.5 bottom-1.5 h-3.5 w-3.5 text-paper/60" />

        {/* The mat and the plate. */}
        <div className="panel-frame offset-print bg-surface p-2 sm:p-3">
          <div className="border border-line-soft">
            <PickThumb pick={pick} image={lead} priority ratio="standard" />
          </div>
        </div>

        <EditorialBadge tone={accent.tone} className="absolute -top-3 left-5 sm:left-8">
          {pick.category}
        </EditorialBadge>
      </div>

      {rest.length > 0 && (
        <ul className="grid grid-cols-3 gap-3" aria-label="More views">
          {rest.map((img, i) => (
            <li
              key={`${img.src || 'placeholder'}-${i}`}
              className="panel-frame min-w-0 overflow-hidden bg-surface p-1"
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
