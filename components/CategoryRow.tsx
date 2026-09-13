import Link from 'next/link'
import type { CatalogPick } from '@/data/types'
import { ProductGrid } from './ProductCard'

/** A home-page row: heading, up to four products, and a View All pill. */
export function CategoryRow({
  id,
  title,
  href,
  picks,
}: {
  id: string
  title: string
  href: string
  picks: CatalogPick[]
}) {
  if (picks.length === 0) return null

  return (
    <section aria-labelledby={id} className="mx-auto max-w-6xl px-4 py-8">
      <h2 id={id} className="mb-4 text-xl font-bold text-fg sm:text-2xl">
        {title}
      </h2>
      <ProductGrid picks={picks.slice(0, 4)} />
      <div className="mt-5 flex justify-end">
        <Link
          href={href}
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          View All
        </Link>
      </div>
    </section>
  )
}
