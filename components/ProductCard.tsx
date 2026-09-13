import Link from 'next/link'
import type { CatalogPick } from '@/data/types'
import { isPriceFresh, isPurchasable } from '@/data/types'

/**
 * The product tile: image, title, price. Nothing else.
 *
 * Takes a `CatalogPick`, which has no `purchaseUrl`, so it is safe to render
 * inside client components as well as on the server.
 */

export function ProductImage({
  pick,
  className = '',
  eager = false,
}: {
  pick: CatalogPick
  className?: string
  eager?: boolean
}) {
  const img = pick.images[0]

  return (
    <div
      className={`flex aspect-square items-center justify-center overflow-hidden bg-bg-soft ${className}`}
    >
      {img?.src ? (
        // Remote listing images on a host we do not control; served as-is
        // rather than through the image optimizer so a broken URL fails
        // visibly instead of at build time.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img.src}
          alt={img.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-contain p-4 mix-blend-multiply"
        />
      ) : (
        <span className="px-4 text-center text-xs text-fg-muted">{pick.category}</span>
      )}
    </div>
  )
}

export function CardPrice({ pick }: { pick: CatalogPick }) {
  if (!isPurchasable(pick)) {
    return (
      <span className="inline-block rounded-sm bg-bg-soft px-2 py-0.5 text-xs font-medium text-fg-muted">
        {pick.licenseStatus === 'unverified' ? 'Verifying' : 'Unavailable'}
      </span>
    )
  }
  if (pick.price !== null && isPriceFresh(pick.priceCheckedAt)) {
    return <span className="tnum text-base font-bold text-fg">${pick.price.toFixed(2)}</span>
  }
  return <span className="text-sm text-fg-muted">See price</span>
}

export function ProductCard({ pick }: { pick: CatalogPick }) {
  return (
    <Link
      href={`/desk/${pick.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-bg transition-colors hover:border-line-strong"
    >
      <ProductImage pick={pick} />
      <div className="flex flex-1 flex-col p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-fg transition-colors group-hover:text-accent">
          {pick.title}
        </h3>
        <p className="mt-auto pt-2">
          <CardPrice pick={pick} />
        </p>
      </div>
    </Link>
  )
}

export function ProductGrid({ picks }: { picks: CatalogPick[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {picks.map((pick) => (
        <li key={pick.id}>
          <ProductCard pick={pick} />
        </li>
      ))}
    </ul>
  )
}
