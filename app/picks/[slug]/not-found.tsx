import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'

/**
 * Rendered when `notFound()` is thrown for an unknown pick slug.
 *
 * Picks do get retired — a seller stops stocking something, or a licence
 * question comes up — so an old link from a journal post or a search result
 * landing here is expected, not an error on the reader's part. Say so, and
 * point at the catalog.
 */
export default function PickNotFound() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 py-20">
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
            href="/vault"
            className="inline-flex items-center gap-2 rounded-sm bg-shu px-5 py-3 font-display font-semibold tracking-tight text-white transition-colors hover:bg-shu-bright"
          >
            Browse the Vault
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link
            href="/"
            className="py-3 text-paper-2 underline underline-offset-2 transition-colors hover:text-paper"
          >
            Back to the home page
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
