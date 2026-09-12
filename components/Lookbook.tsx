import Link from 'next/link'
import { PickThumb } from '@/components/PickThumb'
import { PriceStamp } from '@/components/PriceStamp'
import { LicenseBadge, SellerNote } from '@/components/Badges'
import { CATEGORY_ACCENT } from '@/components/PickCard'
import { EditorialBadge, GlowOrb } from '@/components/motifs'
import { isPurchasable, type Pick } from '@/data/types'

/**
 * Featured picks as a lookbook — home only.
 *
 * Asymmetric on desktop (one lead spread, the rest stacked beside it), a
 * horizontal snap rail on phones. The picture is the panel; the caption is
 * editorial — the first of the three reasons, and who it suits. Never a
 * rating, never a review count, never stock.
 *
 * Cards link to the pick page. Nothing here links out; only `OutboundButton`
 * on the pick page may do that, and only after `isPurchasable()` agrees.
 */

const BLOOM: Record<string, string> = {
  blue: 'group-hover:bloom-blue',
  lilac: 'group-hover:bloom-lilac',
  orange: 'group-hover:bloom-orange',
  red: 'group-hover:bloom-red',
  green:
    'group-hover:[box-shadow:0_0_0_1px_color-mix(in_srgb,var(--green)_40%,transparent),0_0_34px_-6px_color-mix(in_srgb,var(--green)_55%,transparent)]',
}

function LookCard({ pick, index, lead = false }: { pick: Pick; index: number; lead?: boolean }) {
  const live = isPurchasable(pick)
  const accent = CATEGORY_ACCENT[pick.category] ?? CATEGORY_ACCENT['Desk & Room']
  const glow = accent.tone === 'red' ? 'electric' : accent.tone

  return (
    <article
      className={`group flex h-full w-[82%] shrink-0 snap-start flex-col sm:w-[60%] lg:w-auto ${
        lead ? 'lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'
      }`}
    >
      <Link
        href={`/desk/${pick.slug}`}
        className={`relative flex h-full flex-col border-2 border-line bg-surface transition-[box-shadow,transform,border-color] duration-300 group-hover:-translate-y-1 group-hover:border-paper ${BLOOM[accent.tone]} ${
          lead ? '' : 'lg:flex-row'
        }`}
      >
        <div
          className={`relative overflow-hidden border-b-2 border-line ${
            lead ? '' : 'lg:w-[44%] lg:shrink-0 lg:border-r-2 lg:border-b-0'
          }`}
        >
          <PickThumb pick={pick} priority={index === 0} ratio={lead ? 'standard' : 'cover'} />
          {/* The category's light, spilling across the picture. */}
          <GlowOrb
            tone={glow}
            size="90%"
            intensity="low"
            blend="screen"
            className="-right-1/4 -bottom-1/3"
          />
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
            <EditorialBadge tone="ink">Look {String(index + 1).padStart(2, '0')}</EditorialBadge>
            {!live && (
              <EditorialBadge tone="ink">
                {pick.linkStatus === 'sample' ? 'Sample · not for sale' : 'Verifying'}
              </EditorialBadge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div aria-hidden="true" className={`h-1 ${accent.bar} ${lead ? '' : 'lg:hidden'}`} />
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <LicenseBadge pick={pick} />
              <span className={`label-xs ${accent.text}`}>{pick.category}</span>
            </div>

            <h3
              className={`font-display leading-tight font-bold text-paper transition-colors group-hover:text-shu ${
                lead ? 'text-2xl sm:text-3xl' : 'text-xl'
              }`}
            >
              {pick.title}
            </h3>

            <p className={`leading-relaxed text-paper-2 ${lead ? 'text-base' : 'line-clamp-3 text-sm'}`}>
              {pick.whyWePicked[0]}
            </p>

            <p className="text-sm text-muted">
              <span className="label-xs text-paper-2">Best for</span>{' '}
              <span className="text-paper-2">{pick.bestFor.toLowerCase()}</span>
            </p>

            <div className="mt-auto flex flex-col gap-1.5 border-t border-line-soft pt-3">
              <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} size="sm" />
              <SellerNote pick={pick} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export function Lookbook({ picks }: { picks: Pick[] }) {
  if (picks.length === 0) {
    return (
      <p className="text-sm text-muted">
        No picks are featured right now.{' '}
        <Link href="/desk" className="text-paper-2 underline underline-offset-2">
          Enter the Desk
        </Link>{' '}
        instead.
      </p>
    )
  }

  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pt-2 pb-4 [scrollbar-width:thin] lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
      {picks.map((pick, i) => (
        <LookCard key={pick.id} pick={pick} index={i} lead={i === 0} />
      ))}
    </div>
  )
}
