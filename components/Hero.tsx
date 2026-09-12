import Link from 'next/link'
import { CATEGORIES } from '@/data/types'
import { PICKS, isQuizReady } from '@/data/picks'

/**
 * The masthead.
 *
 * Original typographic work only — no character art, no franchise reference,
 * no studio colourway. The screentone flourish is drawn from manga print, and
 * the vermilion block is a nod to a hanko stamp: a mark of verification, which
 * is what the site actually sells.
 *
 * The gift-quiz CTA is gated on `isQuizReady()`. There is no other way to
 * reach the quiz from here, so it cannot be linked prematurely.
 */
export function Hero() {
  const quizReady = isQuizReady()
  const categoryCount = new Set(PICKS.map((p) => p.category)).size

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="screentone pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 opacity-60 md:block" />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-16 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end md:pt-20 md:pb-24">
        <div className="relative">
          <p className="label-xs mb-5 text-shu">
            A trusted anime room and desk shopping guide
          </p>

          <h1 className="text-5xl text-paper sm:text-6xl md:text-7xl">
            Curated gear for your next arc.
          </h1>

          <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-paper-2">
            We help fans set up a room and a desk they actually want to sit at.
            For every pick we name the seller, state the licence, and date the
            price — so you decide with the facts in front of you, not a star
            rating nobody can trace.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/desk"
              className="inline-flex items-center gap-2 bg-shu px-6 py-3 text-base font-semibold text-paper transition-colors hover:bg-shu-bright"
            >
              Explore the desk
              <span aria-hidden="true">→</span>
            </Link>

            {quizReady && (
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 border border-line px-6 py-3 text-base font-semibold text-paper transition-colors hover:border-paper"
              >
                Take the desk quiz
              </Link>
            )}

            <Link
              href="/about"
              className="text-sm text-paper-2 underline underline-offset-4 hover:text-paper"
            >
              How we choose and how we are paid
            </Link>
          </div>
        </div>

        {/* The verification mark. Numbers are real counts, nothing else. */}
        <div className="relative md:justify-self-end">
          <div className="relative border border-line bg-surface p-6 md:w-72">
            <div
              aria-hidden="true"
              className="absolute -top-3 -right-3 flex h-14 w-14 rotate-6 items-center justify-center border-2 border-shu bg-ink"
            >
              <span className="font-display text-xl font-extrabold tracking-tight text-shu">
                OV
              </span>
            </div>

            <p className="label-xs text-muted">On every pick</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-paper-2">
              <li className="flex gap-3">
                <span className="text-shu" aria-hidden="true">
                  ■
                </span>
                Seller named
              </li>
              <li className="flex gap-3">
                <span className="text-shu" aria-hidden="true">
                  ■
                </span>
                Licence stated
              </li>
              <li className="flex gap-3">
                <span className="text-shu" aria-hidden="true">
                  ■
                </span>
                Price dated
              </li>
            </ul>

            <dl className="tnum mt-6 grid grid-cols-2 gap-4 border-t border-line-soft pt-4 text-sm">
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
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
