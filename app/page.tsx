import { Header, Footer } from '@/components/Shell'
import { HeroBanner } from '@/components/HeroBanner'
import { CategoryRow } from '@/components/CategoryRow'
import { PICKS, navCategories } from '@/data/picks'
import { toCatalogPick, type Category } from '@/data/types'

/**
 * Home: a banner of real product photos, then product rows by category.
 * Nothing on this page links to a merchant; only the product page does.
 *
 * The rows follow the header nav: a category gets a row only when it clears
 * the same MIN_NAV_PICKS gate, so the home page never advertises a category
 * whose page would be empty or all "still checking" panels.
 */

function categoryHref(category: Category) {
  return `/desk?category=${encodeURIComponent(category)}`
}

/** Heading id for aria-labelledby: 'Figures & Collectibles' -> 'figures-collectibles'. */
function rowId(category: Category) {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
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

        {navCategories().map((category) => (
          <CategoryRow
            key={category}
            id={rowId(category)}
            title={category}
            href={categoryHref(category)}
            picks={PICKS.filter((p) => p.category === category).map(toCatalogPick)}
          />
        ))}
      </main>
      <Footer />
    </>
  )
}
