import { Header, Footer } from '@/components/Shell'
import { HeroBanner } from '@/components/HeroBanner'
import { CategoryRow } from '@/components/CategoryRow'
import { PICKS } from '@/data/picks'
import { toCatalogPick, type Category } from '@/data/types'

/**
 * Home: a banner of real product photos, then product rows by category.
 * Nothing on this page links to a merchant; only the product page does.
 */

const HOME_ROWS: Array<{ id: string; category: Category }> = [
  { id: 'figures', category: 'Figures & Collectibles' },
  { id: 'manga', category: 'Manga & Books' },
  { id: 'desk', category: 'Desk & Room' },
]

function categoryHref(category: Category) {
  return `/desk?category=${encodeURIComponent(category)}`
}

export default function HomePage() {
  const newest = [...PICKS]
    .sort(
      (a, b) =>
        b.addedAt.localeCompare(a.addedAt) ||
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        a.id.localeCompare(b.id),
    )
    .map(toCatalogPick)

  return (
    <>
      <Header />
      <main>
        <HeroBanner />

        <CategoryRow id="new" title="New" href="/desk?sort=newest" picks={newest.slice(0, 4)} />

        {HOME_ROWS.map((row) => (
          <CategoryRow
            key={row.id}
            id={row.id}
            title={row.category}
            href={categoryHref(row.category)}
            picks={PICKS.filter((p) => p.category === row.category).map(toCatalogPick)}
          />
        ))}
      </main>
      <Footer />
    </>
  )
}
