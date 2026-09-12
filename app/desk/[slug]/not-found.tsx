import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { GlowOrb, Mascot, SparkleField } from '@/components/motifs'
import { glowVars, GLOW } from '@/components/PickThumb'

/**
 * Rendered when `notFound()` is thrown for an unknown pick slug.
 *
 * Picks do get retired — a seller stops stocking something, or a licence
 * question comes up — so an old link from a journal post or a search result
 * landing here is expected, not an error on the reader's part. Say so, and
 * point at the catalog.
 *
 * The desk spirit has dozed off on the empty shelf: the character carries the
 * page, so a dead end still feels like the same room.
 */
export default function PickNotFound() {
  return (
    <>
      <Header />

      <div className="room-light">
        <main className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div
            className={`relative overflow-hidden border border-line bg-surface ${GLOW}`}
            style={glowVars('--lilac')}
          >
            <GlowOrb tone="lilac" size={520} intensity="mid" blend="screen" pulse className="-top-72 -right-48" />
            <GlowOrb tone="orange" size={360} intensity="low" blend="screen" className="-bottom-52 -left-32" />
            <SparkleField seed="not-found" count={7} tone="lilac" minSize={8} maxSize={18} />
            <span aria-hidden="true" className="pointer-events-none absolute inset-2 border border-paper/10" />

            <div className="relative grid gap-6 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 sm:p-10">
              <div className="flex items-start justify-center sm:justify-start">
                <Mascot pose="sleep" size={150} fill="var(--paper)" className="text-ink" />
              </div>

              <div className="min-w-0">
                <p className="label-xs text-lilac">404 &middot; Pick not found</p>
                <h1 className="mt-3 max-w-[24ch] font-display text-3xl text-paper sm:text-4xl">
                  There is no pick at this address.
                </h1>
                <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-paper-2">
                  It may have been retired — we pull a pick when the seller stops
                  stocking it or a licensing question comes up — or the link may be
                  mistyped. Either way, the rest of the shelf is one click away.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                  <Link
                    href="/desk"
                    className="inline-flex items-center gap-2 bg-shu px-5 py-3 font-display font-semibold tracking-tight text-white transition-colors hover:bg-shu-bright"
                  >
                    Browse the Desk
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <Link
                    href="/journal"
                    className="py-3 text-paper-2 underline underline-offset-2 transition-colors hover:text-paper"
                  >
                    Or read the journal
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
