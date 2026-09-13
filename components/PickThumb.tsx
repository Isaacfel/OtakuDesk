import type { CSSProperties } from 'react'
import type { CatalogPick, Category, PickImage } from '@/data/types'
import { CategoryPattern, GlowOrb, SparkleField, type MotifTone } from '@/components/motifs'

/**
 * Product imagery, with provenance enforced — and lit like a shelf at night.
 *
 * Every image on the site declares where it came from. Images marked
 * 'placeholder' have no source yet, so instead of shipping a stock photo or a
 * scraped product shot — the most common way a small affiliate site earns a
 * takedown — we draw the category's art-directed pattern and say plainly that
 * it is not the product.
 *
 * The night-room treatment sits ON TOP of that rule, never instead of it: a
 * soft light source in the category's colour and a few sparkles, both
 * decorative and `aria-hidden`, so the placeholder reads as a lit display
 * rather than an empty tile. A real photograph gets a quiet vignette so it
 * sits in the same room as its neighbours.
 *
 * `ratio` lets the catalog card run a taller cover ratio while the dossier
 * page keeps the pattern's native 4:3.
 */
export type ThumbRatio = 'cover' | 'standard'

const RATIO_CLASS: Record<ThumbRatio, string> = {
  cover: 'aspect-[4/5]',
  standard: 'aspect-[4/3]',
}

/* -------------------------------------------------------------------------
   Category accent — one light source per category.

   Lives here (rather than in PickCard) so the thumb, the card and the
   dossier plate all read the same table and cannot disagree. `bar`/`text`
   are kept for existing callers; `cssVar` and `motifTone` drive the glow and
   the motifs; `tone` is the EditorialBadge tone for the rare cases it is used.
   ---------------------------------------------------------------------- */
export type CategoryAccent = {
  bar: string
  text: string
  tone: 'red' | 'blue' | 'lilac' | 'green' | 'orange'
  motif: string
  motifTone: Exclude<MotifTone, 'inherit' | 'ink' | 'paper'>
  /** The raw colour token behind this category's light. */
  cssVar: '--shu' | '--blue' | '--lilac' | '--green' | '--orange'
}

export const CATEGORY_ACCENT: Record<Category, CategoryAccent> = {
  'Desk & Room': { bar: 'bg-blue', text: 'text-blue', tone: 'blue', motif: 'desk grid', motifTone: 'blue', cssVar: '--blue' },
  'Wall Art': { bar: 'bg-lilac', text: 'text-lilac', tone: 'lilac', motif: 'display frame', motifTone: 'lilac', cssVar: '--lilac' },
  Accessories: { bar: 'bg-orange', text: 'text-orange', tone: 'orange', motif: 'carry', motifTone: 'orange', cssVar: '--orange' },
  Apparel: { bar: 'bg-green', text: 'text-green', tone: 'green', motif: 'stitch', motifTone: 'green', cssVar: '--green' },
  'Storage & Display': { bar: 'bg-shu', text: 'text-shu', tone: 'red', motif: 'plinth', motifTone: 'shu', cssVar: '--shu' },
  'Figures & Collectibles': { bar: 'bg-orange', text: 'text-orange', tone: 'orange', motif: 'pedestal', motifTone: 'orange', cssVar: '--orange' },
  'Manga & Books': { bar: 'bg-lilac', text: 'text-lilac', tone: 'lilac', motif: 'spines', motifTone: 'lilac', cssVar: '--lilac' },
}

export function accentFor(category: Category): CategoryAccent {
  return CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT['Desk & Room']
}

/**
 * Glow as CSS custom properties, so one inline style sets the colour and the
 * static Tailwind classes below do the drawing (and the hover intensifying).
 * `bloom-*` in globals.css covers four colours; this covers all five without
 * a sixth utility, and lets a single element change colour per category.
 */
export function glowVars(cssVar: CategoryAccent['cssVar'] | '--paper'): CSSProperties {
  return {
    '--glow-ring': `color-mix(in srgb, var(${cssVar}) 42%, transparent)`,
    '--glow-halo': `color-mix(in srgb, var(${cssVar}) 38%, transparent)`,
    '--glow-ring-hi': `color-mix(in srgb, var(${cssVar}) 85%, transparent)`,
    '--glow-halo-hi': `color-mix(in srgb, var(${cssVar}) 62%, transparent)`,
  } as CSSProperties
}

/** Resting glow. Pair with `glowVars` on the same or an ancestor element. */
export const GLOW = 'shadow-[0_0_0_1px_var(--glow-ring),0_0_28px_-6px_var(--glow-halo)]'
/** The glow turned up, for hover on the element itself. */
export const GLOW_HOVER =
  'hover:shadow-[0_0_0_1px_var(--glow-ring-hi),0_0_48px_-6px_var(--glow-halo-hi)]'
/** The glow turned up, driven by a `group` ancestor's hover. */
export const GLOW_GROUP_HOVER =
  'group-hover:shadow-[0_0_0_1px_var(--glow-ring-hi),0_0_48px_-6px_var(--glow-halo-hi)]'

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
  const accent = accentFor(pick.category)

  if (img && img.source !== 'placeholder' && img.src) {
    return (
      <div className={`relative w-full max-w-full overflow-hidden bg-surface-2 ${RATIO_CLASS[ratio]} ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.alt}
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Room vignette: keeps a bright product photo in the same light as the rest. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_55%,color-mix(in_srgb,var(--panel-2)_55%,transparent)_100%)]"
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

      {/* The light on the shelf: one source in the category colour, screened
          over the pattern, plus a few sparkles. Purely decorative. */}
      <GlowOrb
        tone={accent.motifTone}
        size="120%"
        intensity="mid"
        blend="screen"
        className="-top-[45%] left-1/2 -translate-x-1/2"
      />
      <SparkleField
        seed={pick.slug}
        count={4}
        tone={accent.motifTone}
        minSize={7}
        maxSize={14}
        className="opacity-80"
      />
      {/* A strip light along the top edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, var(${accent.cssVar}) 30%, var(${accent.cssVar}) 70%, transparent)`,
        }}
      />
    </div>
  )
}
