import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { Prose } from '@/mdx-components'
import { Placeholder } from '@/app/_legal/LegalShell'
import { MERCHANTS } from '@/data/merchants'
import { CATALOG_IS_SAMPLE, PICKS } from '@/data/picks'
import { PRICE_MAX_AGE_DAYS } from '@/data/types'
import { INLINE_DISCLOSURE, AMAZON_ATTESTATION } from '@/lib/affiliate'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who curates OtakuVault, how a pick is chosen and verified, and exactly how the site makes money.',
}

/**
 * The about page.
 *
 * This is the cheapest trust the site will ever buy, so it is written like a
 * person explaining themselves rather than a policy. Every factual claim about
 * money and merchants is derived from the data layer, so the page cannot
 * describe a partnership we do not have or a catalog state that has changed.
 */
export default function AboutPage() {
  const programs = MERCHANTS.filter((m) => m.id !== 'sample')
  const approved = programs.filter((m) => Boolean(m.termsVerifiedAt))
  const usesAmazon = MERCHANTS.some(
    (m) => m.network === 'amazon' && Boolean(m.termsVerifiedAt),
  )

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-5 pt-10 pb-8 sm:pt-14">
        <article className="mx-auto max-w-[68ch]">
          <header>
            <p className="label-xs text-muted">About</p>
            <h1 className="mt-3 text-3xl leading-[1.1] sm:text-4xl">
              A guide, not a store.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-paper-2">
              OtakuVault is a shopping guide for anime rooms, desks, and
              convention days. We find products worth owning, tell you who is
              actually selling them and whether they are licensed, and send you
              to the seller. We are paid on referral. This page explains all of
              that in as much detail as you want.
            </p>
            <hr className="mt-8 border-line" />
          </header>

          <Prose className="mt-8">
            <h2 id="what">What this is, and is not</h2>
            <p>
              We do not hold stock, set prices, take payment, ship anything, or
              handle returns. When you buy, you buy from the seller named on the
              pick, under their terms, at their price. We are the friend who
              already did the research, and we are up-front about the fact that
              the friend gets a small cut.
            </p>
            <p>
              We are not affiliated with, endorsed by, or in contact with any
              anime studio, publisher, or licensor. We do not use character art,
              series names, or franchise imagery in our own branding, and we do
              not name series in our articles. A guide that borrows a
              franchise&rsquo;s identity to sell you things is doing the very
              thing it claims to protect you from.
            </p>

            <h2 id="who">Who curates</h2>
            <p>
              People, one pick at a time. There is no feed import and no
              automated catalog. Every pick was chosen by a member of the
              OtakuVault team who found the product, read the seller&rsquo;s
              listing, checked the licence, and wrote the three reasons you see
              on its card. If we would not put it on our own desk, it is not in
              the Vault.
            </p>
            <p>
              Bylines and a short bio for each editor will sit here before
              launch: <Placeholder what="editor names and bios" />
            </p>

            <h2 id="how">How a pick gets chosen</h2>
            <p>A product has to clear all of these before it is written up:</p>
            <ul>
              <li>
                It solves a real problem on a desk, in a room, or on a
                convention floor. Decoration alone is not a reason.
              </li>
              <li>
                We can name the seller and say what kind of seller they are:
                licensed retailer, brand direct, marketplace seller, or
                independent artist.
              </li>
              <li>
                We can determine the licence status &mdash; officially licensed,
                original design, or not yet cleared &mdash; using the method in{' '}
                <Link href="/journal/licensed-vs-bootleg">our own guide</Link>.
              </li>
              <li>
                We have the right to show an image of it: from the
                merchant&rsquo;s own feed, a press kit, or our own camera. If we
                do not, we show a placeholder rather than borrow one.
              </li>
              <li>
                We can write three specific reasons it is good and, where there
                is one, an honest caveat. If we cannot, we do not know it well
                enough to recommend it.
              </li>
            </ul>
            <p>
              You will notice there are no star ratings and no review counts on
              this site. The alternative was inventing them, and one real reason
              is more persuasive than four and a half stars nobody believes.
            </p>
            <p>
              What we skip: figures and collectibles, which are well served
              elsewhere and the hardest category in which to keep a licence
              promise; anything whose seller we cannot identify; and anything we
              cannot source an image for legally.
            </p>

            <h2 id="verify">How we verify, and keep verifying</h2>
            <ol>
              <li>
                <strong>Find the product on the seller&rsquo;s own listing</strong>,
                not a repost of it.
              </li>
              <li>
                <strong>Identify the seller.</strong> On a marketplace that means
                the specific shop, which we name on the pick.
              </li>
              <li>
                <strong>Check the licence.</strong> For licensed goods: the
                copyright line, the licensee, and a match to the licensee&rsquo;s
                catalogue or an official storefront. For original designs: that
                the work is genuinely the artist&rsquo;s own.
              </li>
              <li>
                <strong>Capture the price with the date</strong> we saw it. The
                date is shown next to the price everywhere it appears. A price
                older than {PRICE_MAX_AGE_DAYS} days is hidden rather than
                guessed at.
              </li>
              <li>
                <strong>Confirm image rights</strong> and record where the image
                came from.
              </li>
              <li>
                <strong>Only then</strong> does the buy link go live.
              </li>
            </ol>
            <p>
              After that: links are checked weekly, and a listing that dies has
              its link pulled the same day rather than sending you to a 404.
              Every affiliate program&rsquo;s terms are re-read quarterly, because
              commission rates and image rules change after you have built
              around them.
            </p>
            <p>
              A pick we have not cleared is labelled <em>Verifying</em> and has
              no buy button &mdash; not a greyed-out one, none. The same check
              runs on our outbound redirect, so a copied link will not reach the
              merchant either. That is enforced by code, not by a policy someone
              has to remember.
            </p>

            <h2 id="money">How we make money, exactly</h2>
            <p>
              When you click a buy button on a pick page, you pass through our
              own redirect to the merchant. The link is tagged so the
              merchant&rsquo;s affiliate program knows the visit came from us.
              If you buy within that program&rsquo;s attribution window, the
              merchant pays us a percentage of the sale. That is the entire
              revenue model. This sentence sits beside every buy button on the
              site, in full, not in a footer:
            </p>
            <blockquote>
              <p>{INLINE_DISCLOSURE}</p>
            </blockquote>
            <p>In practice that means:</p>
            <ul>
              <li>
                You pay the merchant&rsquo;s price. The commission comes out of
                their margin, not on top of what you pay.
              </li>
              <li>
                We never see your payment, your address, or your order. The
                merchant reports sales to us in aggregate, weeks later.
              </li>
              <li>
                No merchant pays for placement, can buy a pick, or sees a pick
                before it is published.
              </li>
              <li>
                We do not order picks by commission rate. If two products are
                equally good and one pays us more, the tie is broken by the
                reader&rsquo;s interest &mdash; usually the cheaper one.
              </li>
              <li>
                Sample listings and picks marked <em>Verifying</em> never link
                out, so they cannot earn anything.
              </li>
            </ul>
            {approved.length === 0 ? (
              <p>
                <strong>Where that stands today:</strong> we have not yet been
                approved by any affiliate program. The programs we intend to
                join are listed on the{' '}
                <Link href="/disclosure">disclosure page</Link>, but no live
                affiliate link exists on this site right now, and naming a
                program there reflects intent rather than a relationship. When
                that changes, the disclosure page updates first.
              </p>
            ) : (
              <p>
                <strong>Where that stands today:</strong> we are an approved
                participant in {approved.length} affiliate{' '}
                {approved.length === 1 ? 'program' : 'programs'}, listed with
                dates on the <Link href="/disclosure">disclosure page</Link>.
                {usesAmazon && <> {AMAZON_ATTESTATION}</>}
              </p>
            )}

            {CATALOG_IS_SAMPLE && (
              <>
                <h2 id="catalog">Where the catalog stands</h2>
                <p>
                  Every one of the {PICKS.length} products in the Vault today is
                  sample data used while the site is built. Each is labelled as
                  such, none is for sale, no price is live, and no purchase link
                  is configured. Real picks will replace them one at a time, each
                  having gone through the process above first. This section, and
                  the banner at the top of every page, disappear on their own the
                  moment the first real pick is published.
                </p>
              </>
            )}

            <h2 id="wont">What we will not do</h2>
            <ul>
              <li>No countdown timers, &ldquo;only 3 left&rdquo;, or invented urgency.</li>
              <li>No fabricated reviews or ratings.</li>
              <li>No stale prices. If we are not sure, the price is hidden.</li>
              <li>No character art in our own branding, ever.</li>
              <li>No bulk-imported catalog. Every row is a claim we make.</li>
              <li>No affiliate links in email. Newsletters link to our own pages.</li>
            </ul>

            <h2 id="talk">Talk to us</h2>
            <p>
              If a pick is wrong &mdash; a dead link, a stale price, something you
              suspect is a bootleg, or an image you have rights to &mdash; the{' '}
              <Link href="/contact">contact page</Link> explains what to send
              and what we do with it. Listing problems are answered first.
            </p>
          </Prose>
        </article>
      </main>
      <Footer />
    </>
  )
}
