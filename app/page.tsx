import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { CategoryRow } from '@/components/CategoryRow'
import { JournalGrid } from '@/components/JournalCard'
import { PICKS } from '@/data/picks'
import { toCatalogPick, type Category } from '@/data/types'
import { loadAllPosts } from './journal/_posts'

/**
 * Home: a hero strip, then product rows by category, then the journal.
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

export default async function HomePage() {
  const posts = (await loadAllPosts()).slice(0, 3)

  const newest = [...PICKS]
    .sort(
      (a, b) =>
        b.addedAt.localeCompare(a.addedAt) ||
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        a.id.localeCompare(b.id),
    )
    .slice(0, 4)
    .map(toCatalogPick)

  return (
    <>
      <Header />
      <main>
        <section className="bg-accent text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              Anime merch we&rsquo;ve checked.
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/90 sm:text-lg">
              Every link goes to the real seller.
            </p>
          </div>
        </section>

        <CategoryRow id="new" title="New" href="/desk?sort=newest" picks={newest} />

        {HOME_ROWS.map((row) => (
          <CategoryRow
            key={row.id}
            id={row.id}
            title={row.category}
            href={categoryHref(row.category)}
            picks={PICKS.filter((p) => p.category === row.category).map(toCatalogPick)}
          />
        ))}

        <section aria-labelledby="journal" className="mx-auto max-w-6xl px-4 py-8">
          <h2 id="journal" className="mb-4 text-xl font-bold text-fg sm:text-2xl">
            Journal
          </h2>
          <JournalGrid posts={posts} />
          <div className="mt-5 flex justify-end">
            <Link
              href="/journal"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              View All
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
