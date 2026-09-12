import Link from 'next/link'
import type { CatalogPick } from '@/data/types'
import { isPurchasable } from '@/data/types'
import { EditorialBadge, SpeedStreaks } from '@/components/motifs'
import {
  PickThumb,
  accentFor,
  glowVars,
  GLOW,
  GLOW_GROUP_HOVER,
  type ThumbRatio,
} from './PickThumb'
import { PriceStamp } from './PriceStamp'
import { LicenseBadge, SellerNote } from './Badges'

// Re-exported so existing callers (the home lookbook, the dossier plate) keep
// importing the accent table from here.
export { CATEGORY_ACCENT, type CategoryAccent } from './PickThumb'

/**
 * The catalog card — a manga panel on a lit shelf.
 *
 * Square corners and a hairline inner frame (the panel's gutter), lit from
 * within by the category's colour: a resting glow that comes up on hover,
 * and a burst of speed streaks across the artwork as the panel comes forward.
 * That is the anime grammar: a character-coloured light and motion lines,
 * rather than print texture.
 *
 * Note what is absent: no star rating and no review count. What replaces
 * them is the first of the three editorial reasons — a claim we actually
 * stand behind, and more persuasive than four-and-a-half stars nobody
 * believes. Every fact on the card is legible without hover; hover only
 * turns the light up.
 *
 * SAMPLE is loud on purpose. It is the die-cut sticker in the paper tone —
 * the highest-contrast thing on the card — because nothing here is for sale
 * and a reader must not have to squint to learn that.
 *
 * The card never links out. It links to the pick page, where the seller, the
 * licence and the price age are all visible before anyone decides anything.
 */
export function PickCard({
  pick,
  priority = false,
  ratio = 'cover',
}: {
  pick: CatalogPick
  priority?: boolean
  ratio?: ThumbRatio
}) {
  const live = isPurchasable(pick)
  const accent = accentFor(pick.category)
  const sample = pick.linkStatus === 'sample'

  return (
    <article className="group flex h-full flex-col" style={glowVars(accent.cssVar)}>
      <Link
        href={`/desk/${pick.slug}`}
        className={`relative flex flex-1 flex-col border border-line bg-surface transition-[box-shadow,transform,border-color] duration-300 group-hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shu ${GLOW} ${GLOW_GROUP_HOVER}`}
      >
        {/* The panel gutter: a hairline frame inset from the edge. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1.5 z-10 border border-paper/10"
        />

        {/* Artwork */}
        <div className="relative overflow-hidden border-b border-line-soft">
          <PickThumb pick={pick} priority={priority} ratio={ratio} />

          {/* Motion lines, revealed as the panel comes forward. */}
          <SpeedStreaks
            direction="diagonal"
            from="right"
            density="low"
            tone={accent.motifTone}
            seed={pick.slug}
            className="opacity-0 transition-opacity duration-300 group-hover:opacity-80"
          />

          {/* Stickers. SAMPLE first and largest: nothing here is for sale. */}
          <div className="absolute top-2.5 left-2.5 z-20 flex flex-col items-start gap-1.5">
            {sample ? (
              <EditorialBadge tone="ink" className="px-3 py-1.5 text-[11px] tracking-[0.16em]">
                Sample &middot; not for sale
              </EditorialBadge>
            ) : !live ? (
              <Sticker tone="orange">Verifying</Sticker>
            ) : pick.featured ? (
              <Sticker tone="red">Featured</Sticker>
            ) : null}
          </div>

        </div>

        {/* Caption */}
        <div className="relative flex flex-1 flex-col gap-2.5 p-4 pt-3.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <LicenseBadge pick={pick} />
            {/* The category, lit in its own colour. In the caption rather than
                over the artwork so it can never collide with the placeholder's
                "No photo yet" label. */}
            <span className={`label-xs flex items-center gap-1.5 ${accent.text}`}>
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: `var(${accent.cssVar})`, boxShadow: `0 0 8px var(${accent.cssVar})` }}
              />
              {pick.category}
            </span>
          </div>

          <h3 className="font-display text-lg leading-tight font-bold text-paper transition-colors group-hover:text-shu-bright">
            {pick.title}
          </h3>

          {/* One real reason beats a fabricated rating. */}
          <p className="line-clamp-2 text-sm leading-relaxed text-paper-2">
            {pick.whyWePicked[0]}
          </p>

          <div className="mt-auto flex flex-col gap-1.5 border-t border-line-soft pt-3">
            <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} size="sm" />
            <SellerNote pick={pick} />
          </div>
        </div>
      </Link>
    </article>
  )
}

/**
 * A die-cut sticker in the site's soft tones.
 *
 * Same shape and tilt as `EditorialBadge`, but coloured text on the tone's
 * soft ground with a ring in the full colour. On the night ground the motif
 * badge's white-on-orange and white-on-lime fall below AA; these do not, in
 * either theme, and they still read as applied by hand.
 */
export function Sticker({
  children,
  tone = 'red',
  className = '',
}: {
  children: React.ReactNode
  tone?: 'red' | 'orange' | 'blue' | 'lilac' | 'green'
  className?: string
}) {
  const tones = {
    red: 'bg-shu-dim text-shu-bright ring-shu',
    orange: 'bg-orange-soft text-orange ring-orange',
    blue: 'bg-blue-soft text-paper ring-blue',
    lilac: 'bg-lilac-soft text-lilac ring-lilac',
    green: 'bg-green-soft text-green ring-green',
  }[tone]

  return (
    <span className={`label-xs inline-block -rotate-2 px-2.5 py-1 ring-1 ${tones} ${className}`}>
      {children}
    </span>
  )
}
