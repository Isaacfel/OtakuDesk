import type { CatalogPick, PickImage } from '@/data/types'
import { CategoryPattern } from '@/components/motifs'

/**
 * Product imagery, with provenance enforced.
 *
 * Every image on the site declares where it came from. Images marked
 * 'placeholder' have no source yet, so instead of shipping a stock photo or a
 * scraped product shot — the most common way a small affiliate site earns a
 * takedown — we draw the category's art-directed pattern and say plainly that
 * it is not the product.
 *
 * The pattern comes from `CategoryPattern`: an original SVG per category (a
 * desk, a frame, a stitch line, a plinth) with a stable per-pick tilt derived
 * from the slug, so a grid of placeholders reads as a set rather than as one
 * repeated tile.
 *
 * `ratio` lets the catalog card run a taller cover ratio while the dossier
 * page keeps the pattern's native 4:3. The pattern fills whatever box it is
 * given: with both width and height set, its own aspect-ratio is ignored.
 */
export type ThumbRatio = 'cover' | 'standard'

const RATIO_CLASS: Record<ThumbRatio, string> = {
  cover: 'aspect-[4/5]',
  standard: 'aspect-[4/3]',
}

export function PickThumb({
  pick,
  image,
  className = '',
  priority = false,
  ratio = 'standard',
}: {
  pick: CatalogPick
  image?: PickImage
  className?: string
  priority?: boolean
  ratio?: ThumbRatio
}) {
  const img = image ?? pick.images[0]

  if (img && img.source !== 'placeholder' && img.src) {
    return (
      <div className={`relative w-full max-w-full overflow-hidden ${RATIO_CLASS[ratio]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full max-w-full overflow-hidden ${RATIO_CLASS[ratio]} ${className}`}>
      <div className="absolute inset-0">
        <CategoryPattern
          category={pick.category}
          seed={pick.slug}
          label={`Placeholder graphic for ${pick.title}, drawn in the ${pick.category} pattern. No product photograph is available.`}
          className="h-full"
        />
      </div>
    </div>
  )
}
