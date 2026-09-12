import Link from 'next/link'
import type { Pick } from '@/data/types'
import { isPurchasable } from '@/data/types'
import { PickThumb } from './PickThumb'
import { PriceStamp } from './PriceStamp'
import { LicenseBadge, SellerNote } from './Badges'

/**
 * The catalog card.
 *
 * Note what is absent: no star rating and no review count. The brief required
 * both as mandatory fields while also forbidding fabricated reviews, which
 * cannot both be satisfied with seed data. What replaces them is the first of
 * the three editorial reasons — a claim we actually stand behind, and more
 * persuasive than four-and-a-half stars nobody believes.
 *
 * The card never links out. It links to the pick page, where the seller, the
 * licence and the price age are all visible before anyone decides anything.
 */
export function PickCard({
  pick,
  priority = false,
}: {
  pick: Pick
  priority?: boolean
}) {
  const live = isPurchasable(pick)

  return (
    <article className="group flex flex-col">
      <Link
        href={`/picks/${pick.slug}`}
        className="flex flex-1 flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shu-bright"
      >
        <div className="relative overflow-hidden border border-line-soft">
          <PickThumb pick={pick} priority={priority} />
          {!live && (
            <span className="label-xs absolute top-0 right-0 m-2 rounded-xs bg-ink/80 px-2 py-1 text-caution">
              {pick.linkStatus === 'sample' ? 'Sample' : 'Verifying'}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 pt-3">
          <div className="flex flex-wrap items-center gap-2">
            <LicenseBadge pick={pick} />
            <span className="label-xs text-muted">{pick.category}</span>
          </div>

          <h3 className="font-display text-lg leading-tight font-semibold text-paper transition-colors group-hover:text-shu-bright">
            {pick.title}
          </h3>

          {/* One real reason beats a fabricated rating. */}
          <p className="line-clamp-2 text-sm leading-relaxed text-paper-2">
            {pick.whyWePicked[0]}
          </p>

          <div className="mt-auto flex flex-col gap-1 pt-2">
            <PriceStamp
              price={pick.price}
              checkedAt={pick.priceCheckedAt}
              size="sm"
            />
            <SellerNote pick={pick} />
          </div>
        </div>
      </Link>
    </article>
  )
}
