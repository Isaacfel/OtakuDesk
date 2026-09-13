import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header, Footer, categoryLinks } from '@/components/Shell'
import { CatalogBrowser } from '@/components/CatalogBrowser'
import { ProductGrid } from '@/components/ProductCard'
import { PICKS } from '@/data/picks'
import { toCatalogPick } from '@/data/types'

export const metadata: Metadata = {
  title: 'All products',
  description:
    'Anime figures, manga, and desk gear. Filter by category and sort by price. Licence status and a dated price on every item.',
}

/**
 * /desk — the full catalog. Static: the browser reads its filters from the
 * query string on the client, inside the Suspense boundary. The fallback is
 * the full, unfiltered grid, so the prerendered HTML (and a reader without
 * JavaScript) gets every product rather than a loading line.
 */
export default function DeskPage() {
  const categories = categoryLinks().map((c) => ({ value: c.value, label: c.label }))
  const picks = PICKS.map(toCatalogPick)
  const byFeatured = [...picks].sort(
    (a, b) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      b.addedAt.localeCompare(a.addedAt) ||
      a.title.localeCompare(b.title),
  )

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <h1 className="mb-4 text-2xl font-bold text-fg">All products</h1>
        <Suspense fallback={<ProductGrid picks={byFeatured} />}>
          {/* Narrowed at the boundary: purchaseUrl must never reach the client. */}
          <CatalogBrowser picks={picks} categories={categories} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
