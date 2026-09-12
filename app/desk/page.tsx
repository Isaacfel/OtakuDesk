import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header, Footer } from '@/components/Shell'
import { DeskBrowser } from '@/components/DeskBrowser'
import { EditorialBadge, RegistrationMark } from '@/components/motifs'
import { PICKS, CATALOG_IS_SAMPLE } from '@/data/picks'
import { CATEGORIES, toCatalogPick } from '@/data/types'

export const metadata: Metadata = {
  title: 'The Desk',
  description:
    'Every Otakudesk pick in one place. Search and filter by category, licence status, seller type, price, and collection. Seller named and price dated on every pick.',
}

/**
 * /desk — the full catalog, opened like a lookbook.
 *
 * A server component that hands the static PICKS array to the client browser.
 * There is no data fetching here and the page stays fully static. The browser
 * reads its initial state from the query string on the client (hence the
 * Suspense boundary) and mirrors changes back into the URL, so a filtered view
 * is shareable without making the route dynamic.
 *
 * The masthead's numbers are real counts and nothing else.
 */
export default function DeskPage() {
  const categoryCount = new Set(PICKS.map((p) => p.category)).size

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-8 pb-8 sm:pt-12">
        <header className="paper-grain relative mb-8 border-2 border-paper bg-surface px-5 py-8 sm:mb-10 sm:px-8 sm:py-10">
          <RegistrationMark className="pointer-events-none absolute top-1.5 left-1.5 h-3.5 w-3.5 text-line" />
          <RegistrationMark className="pointer-events-none absolute top-1.5 right-1.5 h-3.5 w-3.5 text-line" />
          <RegistrationMark className="pointer-events-none absolute bottom-1.5 left-1.5 h-3.5 w-3.5 text-line" />
          <RegistrationMark className="pointer-events-none absolute right-1.5 bottom-1.5 h-3.5 w-3.5 text-line" />

          <div className="flex flex-wrap items-center gap-2">
            <EditorialBadge tone="red">The Desk</EditorialBadge>
            {CATALOG_IS_SAMPLE && (
              <EditorialBadge tone="ink">Sample catalog &middot; nothing is for sale</EditorialBadge>
            )}
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end lg:gap-12">
            <h1 className="text-4xl text-paper sm:text-6xl lg:text-cover">
              Every pick, with the facts attached.
            </h1>

            <div className="max-w-[48ch]">
              <p className="text-base leading-relaxed text-paper-2">
                Everything we have looked at closely enough to recommend. Each card
                shows the licence status, who is selling it, and a price with the
                date we last checked it. Open any pick for the three reasons we
                chose it and the honest caveat.
              </p>
              <dl className="tnum mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4 text-sm">
                <div>
                  <dt className="label-xs text-muted">Picks</dt>
                  <dd className="mt-1 text-2xl font-semibold text-paper">{PICKS.length}</dd>
                </div>
                <div>
                  <dt className="label-xs text-muted">Categories</dt>
                  <dd className="mt-1 text-2xl font-semibold text-paper">
                    {categoryCount}
                    <span className="text-sm font-normal text-muted"> / {CATEGORIES.length}</span>
                  </dd>
                </div>
                <div>
                  <dt className="label-xs text-muted">Verified</dt>
                  <dd className="mt-1 text-2xl font-semibold text-paper">By hand</dd>
                </div>
              </dl>
            </div>
          </div>
        </header>

        <Suspense
          fallback={
            <p role="status" className="tnum text-sm text-muted">
              Loading {PICKS.length} picks…
            </p>
          }
        >
          {/* Narrowed at the boundary: purchaseUrl must never reach the client. */}
          <DeskBrowser picks={PICKS.map(toCatalogPick)} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
