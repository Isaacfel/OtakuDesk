import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { Hero } from '@/components/Hero'
import { ArcCard } from '@/components/ArcCard'
import { Lookbook } from '@/components/Lookbook'
import { SetupPath } from '@/components/SetupPath'
import { TrustPanels } from '@/components/TrustPanels'
import { JournalCovers } from '@/components/JournalCovers'
import { GlowOrb, Mascot, PanelCut, SpeedStreaks } from '@/components/motifs'
import { PICKS } from '@/data/picks'
import { COLLECTIONS } from '@/data/collections'

/**
 * Home — stepping into the night room.
 *
 * Order: the room itself (hero), the arcs to choose from, the featured
 * lookbook, the setup path, then the trust panels, the journal covers, and
 * the letter. The trust argument sits mid-page rather than first because the
 * hero already carries its three-word version ("Seller named · License
 * stated · Price dated"); the panels expand it once the reader has seen what
 * is here.
 *
 * Hard rules that shape this file: nothing renders `purchaseUrl`; no outbound
 * merchant link exists on this page at all (only `OutboundButton`, on the
 * pick page, may link out); no ratings, counts, stock or urgency anywhere;
 * nothing waits at opacity 0 for a scroll.
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
        <p className={`label-xs mb-3 flex items-center gap-3 ${kickerTone}`}>
          <span aria-hidden="true" className="inline-block h-px w-8 bg-current" />
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

/* The five arcs, composed as a page of panels rather than a grid of tiles:
   a wide lead beside a tall second, then three across, with alternate panels
   dropped a little so the row reads as staggered. Margins, not transforms, so
   nothing escapes its box. */
const ARC_LAYOUT = [
  'lg:col-span-7',
  'lg:col-span-5 lg:mt-10',
  'lg:col-span-4',
  'lg:col-span-4 lg:mt-8',
  'lg:col-span-4',
]

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
          className="relative overflow-hidden bg-ink"
        >
          <div aria-hidden="true" className="room-light pointer-events-none absolute inset-0 opacity-70" />
          <GlowOrb tone="lilac" size="min(60vw, 560px)" intensity="low" blend="screen" className="top-0 -right-1/4" />

          <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:pt-20">
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

            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
              {COLLECTIONS.map((collection, i) => (
                <li
                  key={collection.slug}
                  className={`${i === 0 ? 'sm:col-span-2' : ''} ${ARC_LAYOUT[i] ?? 'lg:col-span-4'}`}
                >
                  <ArcCard collection={collection} index={i} size={i === 0 ? 'lead' : 'standard'} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---- Featured picks: the lookbook ------------------------------ */}
        <PanelCut top="ink" bottom="surface-2" slope="fall" rule="shu" height={48} />
        <section
          aria-labelledby="featured-heading"
          className="relative overflow-hidden bg-surface-2"
        >
          <SpeedStreaks from="right" density="low" tone="ink" seed="lookbook" className="opacity-30" />
          <GlowOrb tone="blue" size="min(60vw, 600px)" intensity="low" blend="screen" className="-bottom-1/3 -left-1/4" />

          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <SectionHead
              id="featured-heading"
              kicker="Featured on the Desk"
              title="The lookbook."
              aside={
                <Link
                  href="/desk"
                  className="label-xs inline-flex items-center gap-2 border-2 border-paper px-4 py-2.5 text-paper transition-colors hover:bg-paper hover:text-ink"
                >
                  All {PICKS.length} on the Desk
                  <span aria-hidden="true">→</span>
                </Link>
              }
            />

            <div className="mt-10">
              <Lookbook picks={featured} />
            </div>

            <p className="mt-6 max-w-[64ch] text-xs leading-relaxed text-muted">
              Captions are the first of the three reasons we chose each pick. Open
              a pick for all three, who it suits, and the honest caveat. We show
              no ratings or review counts because we have none we can stand behind.
            </p>
          </div>
        </section>
        <PanelCut top="surface-2" bottom="ink" slope="rise" rule="shu" height={48} />

        {/* ---- Build your setup ------------------------------------------ */}
        <section
          aria-labelledby="setup-heading"
          className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20"
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
          className="halftone relative overflow-hidden border-y-2 border-line bg-panel-2"
        >
          <GlowOrb tone="orange" size="min(50vw, 480px)" intensity="low" blend="screen" className="-top-1/4 -left-1/5" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <SectionHead
              id="trust-heading"
              kicker="The trust panel"
              title="Three things every pick tells you that a search result will not."
              tone="dark"
              aside={
                <div className="flex items-end gap-4">
                  <Mascot
                    pose="point"
                    size={96}
                    fill="#f3ebdd"
                    className="hidden shrink-0 text-[#17151a] sm:block"
                    title="The desk spirit points at the three trust panels"
                  />
                  <Link
                    href="/about"
                    className="text-sm text-panel-type/80 underline underline-offset-4 hover:text-shu-electric"
                  >
                    How we choose and how we are paid
                  </Link>
                </div>
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
          className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20"
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
          <div className="relative overflow-hidden border-2 border-line bg-surface">
            <div aria-hidden="true" className="halftone-lg pointer-events-none absolute inset-0 opacity-50" />
            <GlowOrb tone="lilac" size={420} intensity="low" blend="screen" className="-top-40 -right-24" />

            <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
              <div>
                <p className="label-xs mb-3 flex items-center gap-3 text-shu">
                  <span aria-hidden="true" className="inline-block h-px w-8 bg-current" />
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

              {/* The spirit is asleep because the list is. */}
              <Mascot
                pose="sleep"
                size={112}
                fill="var(--surface-2)"
                className="hidden justify-self-center lg:block"
                title="The desk spirit, asleep — the letter is not sending yet"
              />

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
                    className="bg-shu px-5 py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
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
