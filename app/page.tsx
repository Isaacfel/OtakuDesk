import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { Hero } from '@/components/Hero'
import { PickCard } from '@/components/PickCard'
import { PICKS } from '@/data/picks'
import { PRICE_MAX_AGE_DAYS } from '@/data/types'

/**
 * Home.
 *
 * Positioning, then the trust argument, then the picks. The order matters:
 * the site's entire differentiation is that it tells you who is selling, under
 * what licence, and when the price was checked. That case gets made before a
 * single product card appears, so the cards are read in that light.
 */

const TRUST_POINTS = [
  {
    n: '01',
    title: 'We name the seller.',
    body: 'Marketplace listings hide who is actually shipping the box. Every pick here says whether you are buying from a licensed retailer, the brand itself, a marketplace seller, or an independent artist — and names them.',
    why: 'Because the seller decides your returns, your shipping time, and whether the thing that arrives is the thing in the photo.',
  },
  {
    n: '02',
    title: 'We state the licence.',
    body: 'Each pick is marked officially licensed, original design, or still being verified. An unverified pick never gets a buy link — it gets a panel saying we are still checking.',
    why: 'Because bootleg merchandise pays nobody who made the work you love, and telling the difference is the hardest part of shopping this space.',
  },
  {
    n: '03',
    title: 'We date every price.',
    body: `A price is shown with the day we last checked it, and a price older than ${PRICE_MAX_AGE_DAYS} days is not shown at all. There is no “was $59, now $39” anywhere on this site.`,
    why: 'Because a stale price is a small lie, and a guide that tells small lies is not a guide.',
  },
]

const HOW_WE_CHOOSE = [
  {
    step: 'Find',
    text: 'We look for pieces that change how a room or a desk feels, starting with what sits on the desk and what goes on the wall. Figures are out of scope on purpose.',
  },
  {
    step: 'Verify',
    text: 'We confirm who sells it and under what licence, by hand, one pick at a time. Nothing is bulk-imported from a merchant feed.',
  },
  {
    step: 'Explain',
    text: 'Every pick carries exactly three reasons we chose it, who it suits, and an honest caveat where there is one. No ratings, no review counts we cannot stand behind.',
  },
]

export default function HomePage() {
  const featured = PICKS.filter((p) => p.featured)

  return (
    <>
      <Header />
      <main>
        <Hero />

        {/* ---- The trust argument ---------------------------------------- */}
        <section
          aria-labelledby="trust-heading"
          className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:pt-20"
        >
          <div className="max-w-[60ch]">
            <p className="label-xs mb-3 text-shu">Why this guide exists</p>
            <h2 id="trust-heading" className="text-3xl text-paper sm:text-4xl">
              Three things every pick tells you that a search result will not.
            </h2>
          </div>

          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {TRUST_POINTS.map((point) => (
              <li key={point.n} className="border-t-2 border-shu pt-6">
                <span className="tnum block text-sm text-shu">{point.n}</span>
                <h3 className="mt-3 text-2xl text-paper">{point.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-paper-2">{point.body}</p>
                <p className="mt-4 border-l border-line pl-4 text-sm leading-relaxed text-muted">
                  {point.why}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- Featured picks -------------------------------------------- */}
        <section
          aria-labelledby="featured-heading"
          className="border-y border-line bg-surface"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label-xs mb-3 text-shu">Featured picks</p>
                <h2 id="featured-heading" className="text-3xl text-paper sm:text-4xl">
                  Start with these.
                </h2>
              </div>
              <Link
                href="/vault"
                className="text-sm text-paper-2 underline underline-offset-4 hover:text-paper"
              >
                See all {PICKS.length} picks in the vault →
              </Link>
            </div>

            {featured.length > 0 ? (
              <ul className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((pick, i) => (
                  <li key={pick.id}>
                    <PickCard pick={pick} priority={i < 3} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-10 text-sm text-muted">
                No picks are featured right now.{' '}
                <Link href="/vault" className="text-paper-2 underline underline-offset-2">
                  Browse the vault
                </Link>{' '}
                instead.
              </p>
            )}
          </div>
        </section>

        {/* ---- How we choose --------------------------------------------- */}
        <section
          aria-labelledby="how-heading"
          className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
            <div>
              <p className="label-xs mb-3 text-shu">How we choose</p>
              <h2 id="how-heading" className="text-3xl text-paper sm:text-4xl">
                Small catalog. Every row checked.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-paper-2">
                We earn a commission when you buy through a link here, at no extra
                cost to you. That is the whole business, and it is why the catalog
                stays small: each pick is a claim we are putting our name to.
              </p>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-2 border border-line px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:border-paper"
              >
                Read how we choose and how we are paid
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <ol className="grid gap-6 sm:grid-cols-3 lg:gap-8">
              {HOW_WE_CHOOSE.map((item, i) => (
                <li key={item.step} className="border-t border-line pt-5">
                  <span className="tnum text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 text-lg text-paper">{item.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper-2">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---- Email ------------------------------------------------------ */}
        <section
          aria-labelledby="email-heading"
          className="mx-auto max-w-6xl px-5 pb-8"
        >
          <div className="screentone border border-line bg-surface">
            <div className="grid gap-8 bg-surface/80 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
              <div>
                <p className="label-xs mb-3 text-shu">The letter</p>
                <h2 id="email-heading" className="text-2xl text-paper sm:text-3xl">
                  New picks and price checks, when there are some.
                </h2>
                <p className="mt-3 max-w-[50ch] text-sm leading-relaxed text-paper-2">
                  An occasional email with what we have added and what we have
                  re-verified. No daily drops, no invented urgency. You can leave
                  with one click.
                </p>
              </div>

              {/* Visual only. The list has no backend yet, so the form does not
                  submit and says so plainly instead of pretending. */}
              <form
                aria-describedby="email-note"
                className="flex flex-col gap-3"
              >
                <label htmlFor="email-input" className="label-xs text-muted">
                  Email address
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="email-input"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled
                    aria-disabled="true"
                    className="min-w-0 flex-1 border border-line bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled
                    aria-disabled="true"
                    className="bg-shu px-5 py-2.5 text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Not open yet
                  </button>
                </div>
                <p id="email-note" className="text-xs leading-relaxed text-muted">
                  The list is not live yet. It opens when the catalog has real,
                  verified picks to write about — this form does not send anything
                  in the meantime.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
