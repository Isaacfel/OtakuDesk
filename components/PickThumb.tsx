import type { CatalogPick, PickImage } from '@/data/types'

/**
 * Product imagery, with provenance enforced.
 *
 * Every image on the site declares where it came from. Images marked
 * 'placeholder' have no source yet, so instead of shipping a stock photo or a
 * scraped product shot — the most common way a small affiliate site earns a
 * takedown — we draw a deterministic generated tile and say plainly that it is
 * not the product.
 *
 * The tile is derived from the slug, so each pick gets a stable, distinct
 * pattern and a grid of them does not read as one repeated grey box.
 */
function hashSlug(slug: string): number {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function PickThumb({
  pick,
  image,
  className = '',
  priority = false,
}: {
  pick: CatalogPick
  image?: PickImage
  className?: string
  priority?: boolean
}) {
  const img = image ?? pick.images[0]

  if (img && img.source !== 'placeholder' && img.src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={img.src}
        alt={img.alt}
        loading={priority ? 'eager' : 'lazy'}
        className={`aspect-[4/3] w-full max-w-full object-cover ${className}`}
      />
    )
  }

  const h = hashSlug(pick.slug)
  const hue = h % 360
  const angle = 25 + (h % 90)

  return (
    <div
      role="img"
      aria-label={`Placeholder graphic for ${pick.title}. No product photograph is available.`}
      className={`screentone relative flex aspect-[4/3] w-full max-w-full items-end overflow-hidden bg-surface-2 ${className}`}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, color-mix(in oklab, hsl(${hue} 42% 55%) 22%, var(--surface)) 0%, var(--surface-2) 72%)`,
      }}
    >
      <span className="label-xs m-3 rounded-xs bg-ink/85 px-2 py-1 text-muted ring-1 ring-line">
        No product photo
      </span>
    </div>
  )
}
