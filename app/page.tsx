import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { Hero } from '@/components/Hero'
import { ArcCard } from '@/components/ArcCard'
import { SetupPath } from '@/components/SetupPath'
import { TrustPanels } from '@/components/TrustPanels'
import { JournalCovers } from '@/components/JournalCovers'
import { PickThumb } from '@/components/PickThumb'
import { PriceStamp } from '@/components/PriceStamp'
import { LicenseBadge, SellerNote } from '@/components/Badges'
import { CATEGORY_ACCENT } from '@/components/PickCard'
import { EditorialBadge, RegistrationMark } from '@/components/motifs'
import { PICKS } from '@/data/picks'
import { COLLECTIONS } from '@/data/collections'
import { isPurchasable, type Pick } from '@/data/types'

/**
 * Home — the volume's opening spread.
 *
 * Order: the masthead, the arcs to choose from, the featured lookbook, the
 * setup path, then the trust panels, the journal covers, and the letter. The
 * trust argument sits mid-page rather than first because the new masthead
 * already carries its three-word version ("Seller named · License stated ·
 * Price dated"); the panels expand it once the reader has seen what is here.
 *
 * Hard rules that shape this file: nothing renders `purchaseUrl`; no outbound
 * merchant link exists on this page at all (only `OutboundButton`, on the
 * pick page, may link out); no ratings, counts, stock or urgency anywhere.
 */

function SectionHead({
  id,
  kicker,
  title,
  aside,
  tone = 'paper',
}: {
  id: string
  kicker: string
  title: string
  aside?: React.ReactNode
  tone?: 'paper' | 'dark'
}) {
  const kickerTone = tone === 'dark' ? 'text-shu-electric' : 'text-shu'
  const titleTone = tone === 'dark' ? 'text-panel-type' : 'text-paper'
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-[60ch]">
        <p className={`label-xs mb-3 flex items-center gap-2 ${kickerTone}`}>
          <RegistrationMark className="h-3 w-3" />
          {kicker}
        </p>
        <h2 id={id} className={`text-3xl sm:text-4xl ${titleTone}`}>
          {title}
        </h2>
      </div>
      {aside}
    </div>
  )
}

/* -------------------------------------------------------------------------
   Featured lookbook card. The picture is the panel; the caption is editorial —
   the first of the three reasons, and who it suits. Never a rating.
   ---------------------------------------------------------------------- */
function LookCard({
  pick,
  index,
  lead = false,
}: {
  pick: Pick
  index: number
  lead?: boolean
}) {
  const live = isPurchasable(pick)
  const accent = CATEGORY_ACCENT[pick.category] ?? CATEGORY_ACCENT['Desk & Room']

  return (
    <article
      className={`group flex h-full w-[82%] shrink-0 snap-start flex-col sm:w-[60%] lg:w-auto ${
        lead ? 'lg:col-span-7 lg:row-span-2' : 'lg:col-span-5'
      }`}
    >
      <Link
        href={`/picks/${pick.slug}`}
        className={`panel-frame flex h-full flex-col bg-surface transition-[box-shadow,transform] duration-200 group-hover:offset-print group-hover:-translate-x-px group-hover:-translate-y-px ${
          lead ? '' : 'lg:flex-row'
        }`}
      >
        <div
          className={`relative overflow-hidden border-b-2 border-paper ${
            lead ? '' : 'lg:w-[44%] lg:shrink-0 lg:border-r-2 lg:border-b-0'
          }`}
        >
          <PickThumb pick={pick} priority={index === 0} ratio={lead ? 'standard' : 'cover'} />
          <div className="absolute top-2 left-2 flex flex-col items-start gap-1.5">
            <EditorialBadge tone="ink">Look {String(index + 1).padStart(2, '0')}</EditorialBadge>
            {!live && (
              <EditorialBadge tone={pick.linkStatus === 'sample' ? 'ink' : 'orange'}>
                {pick.linkStatus === 'sample' ? 'Sample · not for sale' : 'Verifying'}
              </EditorialBadge>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div aria-hidden="true" className={`h-1 ${accent.bar} ${lead ? '' : 'lg:hidden'}`} />
          <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2">
              <LicenseBadge pick={pick} />
              <span className={`label-xs ${accent.text}`}>{pick.category}</span>
            </div>

            <h3
              className={`font-display leading-tight font-bold text-paper transition-colors group-hover:text-shu ${
                lead ? 'text-2xl sm:text-3xl' : 'text-xl'
              }`}
            >
              {pick.title}
            </h3>

            <p className={`leading-relaxed text-paper-2 ${lead ? 'text-base' : 'text-sm line-clamp-3'}`}>
              {pick.whyWePicked[0]}
            </p>

            <p className="text-sm text-muted">
              <span className="label-xs text-paper-2">Best for</span>{' '}
              <span className="text-paper-2">{pick.bestFor.toLowerCase()}</span>
            </p>

            <div className="mt-auto flex flex-col gap-1.5 border-t border-line-soft pt-3">
              <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} size="sm" />
              <SellerNote pick={pick} />
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default function HomePage() {
  const featured = PICKS.filter((p) => p.featured)

  return (
    <>
      <Header />
      <main className="overflow-x-clip">
        <Hero />

        {/* ---- Choose your arc ------------------------------------------- */}
        <section
          aria-labelledby="arcs-heading"
          className="paper-grain mx-auto max-w-6xl px-5 pt-16 pb-16 sm:pt-20"
        >
          <SectionHead
            id="arcs-heading"
            kicker="Choose your arc"
            title="Five ways in. Pick the one that sounds like your room."
            aside={
              <p className="max-w-[38ch] text-sm leading-relaxed text-muted">
                Each arc opens the Desk with that filter already set. Nothing is
                behind a separate page.
              </p>
            }
          />

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
            {COLLECTIONS.map((collection, i) => (
              <li
                key={collection.slug}
                className={i === 0 ? 'sm:col-span-2 lg:col-span-4' : 'lg:col-span-2'}
              >
                <ArcCard collection={collection} index={i} size={i === 0 ? 'lead' : 'standard'} />
              </li>
            ))}
          </ul>
        </section>

        {/* ---- Featured picks: the lookbook ------------------------------ */}
        <section
          aria-labelledby="featured-heading"
          className="border-y-2 border-paper bg-surface-2/50"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <SectionHead
              id="featured-heading"
              kicker="Featured picks"
              title="The lookbook."
              aside={
                <Link
                  href="/desk"
                  className="label-xs inline-flex items-center gap-2 border-2 border-paper px-4 py-2.5 text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  All {PICKS.length} picks
                  <span aria-hidden="true">→</span>
                </Link>
              }
            />

            {featured.length > 0 ? (
              <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:thin] lg:mx-0 lg:grid lg:grid-cols-12 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
                {featured.map((pick, i) => (
                  <LookCard key={pick.id} pick={pick} index={i} lead={i === 0} />
                ))}
              </div>
            ) : (
              <p className="mt-10 text-sm text-muted">
                No picks are featured right now.{' '}
                <Link href="/desk" className="text-paper-2 underline underline-offset-2">
                  Enter the Desk
                </Link>{' '}
                instead.
              </p>
            )}

            <p className="mt-6 max-w-[64ch] text-xs leading-relaxed text-muted">
              Captions are the first of the three reasons we chose each pick. Open
              a pick for all three, who it suits, and the honest caveat. We show
              no ratings or review counts because we have none we can stand behind.
            </p>
          </div>
        </section>

        {/* ---- Build your setup ------------------------------------------ */}
        <section
          aria-labelledby="setup-heading"
          className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        >
          <SectionHead
            id="setup-heading"
            kicker="Build your setup"
            title="Three panels to a room that reads as yours."
            aside={
              <p className="max-w-[40ch] text-sm leading-relaxed text-muted">
                A way to plan, not a bundle. Every piece links out on its own from
                its pick page; there is no combined price and no discount.
              </p>
            }
          />
          <div className="mt-10">
            <SetupPath />
          </div>
        </section>

        {/* ---- The trust panel ------------------------------------------- */}
        <section
          aria-labelledby="trust-heading"
          className="halftone border-y-2 border-paper bg-ink"
        >
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <SectionHead
              id="trust-heading"
              kicker="The trust panel"
              title="Three things every pick tells you that a search result will not."
              aside={
                <Link
                  href="/about"
                  className="text-sm text-paper-2 underline underline-offset-4 hover:text-shu"
                >
                  How we choose and how we are paid
                </Link>
              }
            />
            <div className="mt-10">
              <TrustPanels />
            </div>
          </div>
        </section>

        {/* ---- Journal covers -------------------------------------------- */}
        <section
          aria-labelledby="journal-heading"
          className="mx-auto max-w-6xl px-5 py-16 sm:py-20"
        >
          <SectionHead
            id="journal-heading"
            kicker="Journal"
            title="Notes on buying well."
            aside={
              <Link
                href="/journal"
                className="label-xs inline-flex items-center gap-2 border-2 border-paper px-4 py-2.5 text-paper transition-colors hover:bg-paper hover:text-ink"
              >
                All articles
                <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <div className="mt-10">
            <JournalCovers limit={4} />
          </div>
        </section>

        {/* ---- Email ------------------------------------------------------ */}
        <section aria-labelledby="email-heading" className="mx-auto max-w-6xl px-5 pb-4">
          <div className="halftone-lg border-2 border-paper bg-surface offset-print">
            <div className="grid gap-8 bg-surface/85 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="label-xs mb-3 flex items-center gap-2 text-shu">
                  <RegistrationMark className="h-3 w-3" />
                  The letter
                </p>
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
              <form aria-describedby="email-note" className="flex flex-col gap-3">
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
                    className="min-w-0 flex-1 border-2 border-line bg-ink px-3 py-2.5 text-sm text-paper placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled
                    aria-disabled="true"
                    className="bg-shu px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
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
