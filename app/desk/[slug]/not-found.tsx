import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { MascotMark, RegistrationMark } from '@/components/motifs'

/**
 * Rendered when `notFound()` is thrown for an unknown pick slug.
 *
 * Picks do get retired — a seller stops stocking something, or a licence
 * question comes up — so an old link from a journal post or a search result
 * landing here is expected, not an error on the reader's part. Say so, and
 * point at the catalog. The mascot is the empty-state mark by design.
 */
export default function PickNotFound() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="halftone-lg relative border-2 border-paper bg-surface-2 p-5 sm:p-10">
          <RegistrationMark className="pointer-events-none absolute top-1.5 left-1.5 h-3.5 w-3.5 text-paper/60" />
          <RegistrationMark className="pointer-events-none absolute top-1.5 right-1.5 h-3.5 w-3.5 text-paper/60" />
          <RegistrationMark className="pointer-events-none absolute bottom-1.5 left-1.5 h-3.5 w-3.5 text-paper/60" />
          <RegistrationMark className="pointer-events-none absolute right-1.5 bottom-1.5 h-3.5 w-3.5 text-paper/60" />

          <div className="panel-frame offset-print grid gap-6 bg-surface p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 sm:p-10">
            <MascotMark className="h-16 w-16 text-shu sm:h-24 sm:w-24" title="An empty panel with a spark leaving it" />

            <div className="min-w-0">
              <p className="label-xs text-muted">404 &middot; Pick not found</p>
              <h1 className="mt-3 max-w-[24ch] font-display text-3xl text-paper sm:text-4xl">
                There is no pick at this address.
              </h1>
              <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-paper-2">
                It may have been retired — we pull a pick when the seller stops
                stocking it or a licensing question comes up — or the link may be
                mistyped. Either way, the rest of the catalog is one click away.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
                <Link
                  href="/desk"
                  className="inline-flex items-center gap-2 bg-shu px-5 py-3 font-display font-semibold tracking-tight text-white transition-colors hover:bg-shu-bright"
                >
                  Browse all picks
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <Link
                  href="/"
                  className="py-3 text-paper-2 underline underline-offset-2 transition-colors hover:text-paper"
                >
                  Back to the home page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
