import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header, Footer } from '@/components/Shell'
import { VaultBrowser } from '@/components/VaultBrowser'
import { PICKS } from '@/data/picks'
import { toCatalogPick } from '@/data/types'

export const metadata: Metadata = {
  title: 'The Vault',
  description:
    'Every Otakudesk pick in one place. Search and filter by category, licence status, seller type, price, and collection. Seller named and price dated on every pick.',
}

/**
 * /vault — the full catalog.
 *
 * A server component that hands the static PICKS array to the client browser.
 * There is no data fetching here and the page stays fully static. The browser
 * reads its initial state from the query string on the client (hence the
 * Suspense boundary) and mirrors changes back into the URL, so a filtered view
 * is shareable without making the route dynamic.
 */
export default function VaultPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-5 pt-10 pb-8 sm:pt-14">
        <header className="mb-10 max-w-[64ch]">
          <p className="label-xs mb-3 text-shu">The Vault</p>
          <h1 className="text-4xl text-paper sm:text-5xl">
            Every pick, with the facts attached.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-paper-2 sm:text-lg">
            Everything we have looked at closely enough to recommend. Each card
            shows the licence status, who is selling it, and a price with the date
            we last checked it. Open any pick for the three reasons we chose it
            and the honest caveat.
          </p>
        </header>

        <Suspense
          fallback={
            <p role="status" className="tnum text-sm text-muted">
              Loading {PICKS.length} picks…
            </p>
          }
        >
          {/* Narrowed at the boundary: purchaseUrl must never reach the client. */}
          <VaultBrowser picks={PICKS.map(toCatalogPick)} />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
