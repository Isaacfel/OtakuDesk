import Link from 'next/link'
import type { CatalogPick, Category } from '@/data/types'
import { isPurchasable } from '@/data/types'
import { EditorialBadge } from '@/components/motifs'
import { PickThumb, type ThumbRatio } from './PickThumb'
import { PriceStamp } from './PriceStamp'
import { LicenseBadge, SellerNote } from './Badges'

/**
 * The catalog card — one panel on a manga page.
 *
 * Hard ink rule, square corners, a gutter stripe in the category's signal
 * colour, and a die-cut sticker where a pick is not buyable. The picture is
 * the panel's artwork; the caption underneath carries the facts.
 *
 * Note what is absent: no star rating and no review count. The brief required
 * both as mandatory fields while also forbidding fabricated reviews, which
 * cannot both be satisfied with seed data. What replaces them is the first of
 * the three editorial reasons — a claim we actually stand behind, and more
 * persuasive than four-and-a-half stars nobody believes.
 *
 * The card never links out. It links to the pick page, where the seller, the
 * licence and the price age are all visible before anyone decides anything.
 * Every fact on the card is legible without hover; hover only adds the second
 * print impression.
 */

/**
 * The category's signal colour, mirrored from CategoryPattern so the card's
 * gutter stripe and the placeholder artwork agree. One colour per category;
 * the licence badge keeps its own semantic colours.
 */
export type CategoryAccent = {
  bar: string
  text: string
  tone: 'red' | 'blue' | 'lilac' | 'green' | 'orange'
  motif: string
}

export const CATEGORY_ACCENT: Record<Category, CategoryAccent> = {
  'Desk & Room': { bar: 'bg-blue', text: 'text-blue', tone: 'blue', motif: 'desk grid' },
  'Wall Art': { bar: 'bg-lilac', text: 'text-lilac', tone: 'lilac', motif: 'display frame' },
  Accessories: { bar: 'bg-orange', text: 'text-orange', tone: 'orange', motif: 'carry' },
  Apparel: { bar: 'bg-green', text: 'text-green', tone: 'green', motif: 'stitch' },
  'Storage & Display': { bar: 'bg-shu', text: 'text-shu', tone: 'red', motif: 'plinth' },
}

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
  const accent = CATEGORY_ACCENT[pick.category] ?? CATEGORY_ACCENT['Desk & Room']
  const sample = pick.linkStatus === 'sample'

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/desk/${pick.slug}`}
        className="panel-frame flex flex-1 flex-col bg-surface transition-[box-shadow,transform] duration-200 group-hover:offset-print group-hover:-translate-x-px group-hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shu"
      >
        {/* Artwork */}
        <div className="relative overflow-hidden border-b-2 border-paper">
          <PickThumb pick={pick} priority={priority} ratio={ratio} />

          {/* Not-buyable sticker. SAMPLE is loud on purpose: nothing here is for sale. */}
          {!live && (
            <div className="absolute top-2 left-2">
              {sample ? (
                <EditorialBadge tone="ink">Sample &middot; not for sale</EditorialBadge>
              ) : (
                <EditorialBadge tone="orange">Verifying</EditorialBadge>
              )}
            </div>
          )}

          {pick.featured && live && (
            <div className="absolute top-2 left-2">
              <EditorialBadge tone="red">Featured</EditorialBadge>
            </div>
          )}
        </div>

        {/* Gutter stripe in the category colour — the card's visual accent. */}
        <div aria-hidden="true" className={`h-1 ${accent.bar}`} />

        {/* Caption */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <LicenseBadge pick={pick} />
            <span className={`label-xs ${accent.text}`}>{pick.category}</span>
          </div>

          <h3 className="font-display text-lg leading-tight font-bold text-paper transition-colors group-hover:text-shu">
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
