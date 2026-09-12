import type { ImageSource, Pick } from '@/data/types'
import { PickThumb } from './PickThumb'

/**
 * The image area of the pick page.
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

  return (
    <figure className="flex min-w-0 flex-col gap-3">
      <div className="overflow-hidden border border-line-soft">
        <PickThumb pick={pick} image={lead} priority />
      </div>

      {rest.length > 0 && (
        <ul className="grid grid-cols-3 gap-3" aria-label="More views">
          {rest.map((img, i) => (
            <li
              key={`${img.src || 'placeholder'}-${i}`}
              className="min-w-0 overflow-hidden border border-line-soft"
            >
              <PickThumb pick={pick} image={img} />
            </li>
          ))}
        </ul>
      )}

      <figcaption className="label-xs text-muted">
        {SOURCE_CAPTION[lead?.source ?? 'placeholder']}
      </figcaption>
    </figure>
  )
}
