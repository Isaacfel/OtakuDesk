import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header, Footer } from '@/components/Shell'
import { DeskBrowser } from '@/components/DeskBrowser'
import { EditorialBadge, GlowOrb, Mascot, SparkleField, SpeedStreaks } from '@/components/motifs'
import { PICKS, CATALOG_IS_SAMPLE } from '@/data/picks'
import { CATEGORIES, toCatalogPick } from '@/data/types'

export const metadata: Metadata = {
  title: 'The Desk',
  description:
    'Everything on The Desk in one place. Search and filter by category, licence status, seller type, price, and collection. Seller named and price dated on every pick.',
}

/**
 * /desk — the full catalog, a shelf lit at night.
 *
 * A server component that hands the static PICKS array to the client browser.
 * There is no data fetching here and the page stays fully static. The browser
 * reads its initial state from the query string on the client (hence the
 * Suspense boundary) and mirrors changes back into the URL, so a filtered view
 * is shareable without making the route dynamic.
 *
 * The room's light sources — a warm lamp at the left, screen glow at the
 * right, night air below — are painted behind the whole page by `room-light`,
 * and the masthead is the lit end of the shelf: a lamp, a monitor, a few
 * sparkles, and the desk spirit sitting on the corner. The masthead's numbers
 * are real counts and nothing else.
 */
export default function DeskPage() {
  const categoryCount = new Set(PICKS.map((p) => p.category)).size

  return (
    <>
      <Header />
      <div className="room-light">
        <main className="mx-auto max-w-6xl px-5 pt-8 pb-8 sm:pt-12">
          <header className="relative mb-8 overflow-hidden border border-line bg-surface/70 px-5 py-8 sm:mb-10 sm:px-8 sm:py-10">
            <GlowOrb tone="orange" size={460} intensity="mid" blend="screen" className="-top-64 -left-40" />
            <GlowOrb tone="blue" size={560} intensity="mid" blend="screen" pulse className="-top-80 -right-52" />
            <SparkleField seed="desk-masthead" count={8} tone="lilac" minSize={8} maxSize={18} />
            <SpeedStreaks
              direction="horizontal"
              from="right"
              density="low"
              tone="ink"
              seed="desk-masthead"
              className="opacity-20"
            />
            {/* The panel gutter: a hairline frame inset from the edge. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-2 border border-paper/10" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2">
                <EditorialBadge tone="ink">The Desk</EditorialBadge>
                {CATALOG_IS_SAMPLE && (
                  <EditorialBadge tone="ink" className="px-3 py-1.5 text-[11px] tracking-[0.16em]">
                    Sample catalog &middot; nothing is for sale
                  </EditorialBadge>
                )}
              </div>

              <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end lg:gap-12">
                <h1 className="text-4xl text-paper sm:text-6xl lg:text-cover">
                  <span className="text-glow-red text-shu">The Desk</span>, lit up, with the
                  facts attached.
                </h1>

                <div className="max-w-[48ch]">
                  <p className="text-base leading-relaxed text-paper-2">
                    Everything we have looked at closely enough to recommend. Each panel
                    shows the licence status, who is selling it, and a price with the
                    date we last checked it. Open anything on the Desk for the three reasons we
                    chose it and the honest caveat.
                  </p>
                  <dl className="tnum mt-5 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-4 text-sm">
                    <div>
                      <dt className="label-xs text-muted">On the Desk</dt>
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
                      <dd className="mt-1 text-2xl font-semibold text-green">By hand</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* The desk spirit, sitting on the corner of the shelf. Room for it
                exists only on wide screens; below that it stays out of the way. */}
            <div className="pointer-events-none absolute top-6 right-8 hidden lg:block">
              <Mascot pose="idle" size={104} fill="var(--paper)" className="text-ink" />
            </div>
          </header>

          <Suspense
            fallback={
              <p role="status" className="tnum text-sm text-muted">
                Loading {PICKS.length} items…
              </p>
            }
          >
            {/* Narrowed at the boundary: purchaseUrl must never reach the client. */}
            <DeskBrowser picks={PICKS.map(toCatalogPick)} />
          </Suspense>
        </main>
      </div>
      <Footer />
    </>
  )
}
