import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { LicenseStatus, Pick } from '@/data/types'
import { isPurchasable } from '@/data/types'
import { PICKS, getPickBySlug } from '@/data/picks'
import { getMerchant } from '@/data/merchants'
import { BouncedNotice } from '@/components/BouncedNotice'
import { Header, Footer } from '@/components/Shell'
import { OutboundButton } from '@/components/OutboundButton'
import { SellerNote } from '@/components/Badges'
import { PriceStamp } from '@/components/PriceStamp'
import { EditorialBadge, RegistrationMark } from '@/components/motifs'
import { PickGallery } from '@/components/PickGallery'
import { WhyWePicked } from '@/components/WhyWePicked'
import { PickFit } from '@/components/PickFit'
import { PickLicenseNote } from '@/components/PickLicenseNote'
import { PickAlternatives } from '@/components/PickAlternatives'
import { ProductDossierFacts } from '@/components/ProductDossierFacts'
import { ProductDossierRelated } from '@/components/ProductDossierRelated'
import { DossierHeading } from '@/components/ProductDossierSection'

/**
 * The pick page — an editorial dossier, not a store listing.
 *
 * The most important page on the site. Everything a reader needs to decide
 * is visible before the outbound control is reached: the licence verdict,
 * who the seller is, how old the price is, the three reasons we chose it, and
 * the honest caveat. Sections are numbered in a fixed order:
 *
 *   01 Why this made the list      04 Seller & licence
 *   02 Best for                    05 Price & link (with disclosure)
 *   03 Watch out                   06 Also consider
 *                                  07 From the journal
 *
 * The outbound control is `OutboundButton` — the only component permitted to
 * link to a merchant, and the one that carries the disclosure by
 * construction. `pick.purchaseUrl` is never rendered here or anywhere else.
 *
 * This page is STATIC. `params` is awaited (a promise in Next 16), but
 * `searchParams` is deliberately not read: doing so would opt the route into
 * request-time rendering. The `?unavailable=1` bounce from /go is handled on
 * the client by `BouncedNotice`, inside a Suspense boundary.
 */

type Props = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PICKS.map((pick) => ({ slug: pick.slug }))
}

/**
 * Meta description wording. LICENSE_LABEL's "Verifying" is fine as a badge
 * but reads oddly mid-sentence, so the unverified case gets a fuller phrase.
 */
const META_LICENCE: Record<LicenseStatus, string> = {
  officially_licensed: 'Officially licensed',
  original_design: 'Original design',
  unverified: 'Licence still being verified',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pick = getPickBySlug(slug)
  if (!pick) return { title: 'Pick not found' }

  const merchant = getMerchant(pick.merchantId)
  const description = `${pick.description} ${META_LICENCE[pick.licenseStatus]}, sold by ${merchant.name}.`
  const path = `/desk/${pick.slug}`

  return {
    title: pick.title,
    description,
    // The ?unavailable=1 variant must not index as a separate URL.
    alternates: { canonical: path },
    openGraph: { title: pick.title, description, url: path },
  }
}

export default async function PickPage({ params }: Props) {
  const { slug } = await params
  const pick = getPickBySlug(slug)
  if (!pick) notFound()

  const merchant = getMerchant(pick.merchantId)
  const live = isPurchasable(pick)
  const sample = pick.linkStatus === 'sample'

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 pt-6 pb-16 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="label-xs flex flex-wrap items-center gap-2 text-muted"
        >
          <RegistrationMark className="h-3 w-3 text-shu" />
          <Link href="/desk" className="transition-colors hover:text-paper">
            The Desk
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/desk?category=${encodeURIComponent(pick.category)}`}
            className="transition-colors hover:text-paper"
          >
            {pick.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-paper-2">Dossier</span>
        </nav>

        <Suspense fallback={null}>
          <BouncedNotice reason={bounceReason(pick)} />
        </Suspense>

        {/* ---- Masthead: the plate beside the index card ------------------- */}
        <header className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <PickGallery pick={pick} />

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              {!live && (
                <EditorialBadge tone={sample ? 'ink' : 'orange'}>
                  {sample ? 'Sample · not for sale' : 'Verifying'}
                </EditorialBadge>
              )}
              {pick.featured && <EditorialBadge tone="red">Featured pick</EditorialBadge>}
            </div>

            <div>
              <p className="label-xs text-shu">Pick dossier</p>
              <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl lg:text-5xl">
                {pick.title}
              </h1>
            </div>

            <p className="max-w-[52ch] text-base leading-relaxed text-paper-2 sm:text-lg">
              {pick.description}
            </p>

            <ProductDossierFacts pick={pick} />

            <p className="text-sm text-muted">
              Full seller and licence notes, the dated price, and the link to the listing are in{' '}
              <a
                href="#seller-heading"
                className="text-paper-2 underline underline-offset-2 transition-colors hover:text-shu"
              >
                sections 04 and 05
              </a>
              , after the reasons.
            </p>
          </div>
        </header>

        {/* ---- 01 The argument, staged ------------------------------------- */}
        <div className="mt-14">
          <WhyWePicked pick={pick} n="01" />
        </div>

        {/* ---- 02 / 03 Fit and caveat -------------------------------------- */}
        <div className="mt-12">
          <PickFit pick={pick} bestForN="02" watchOutN="03" />
        </div>

        {/* ---- 04 Provenance ------------------------------------------------ */}
        <section aria-labelledby="seller-heading" className="mt-12 scroll-mt-24">
          <DossierHeading
            n="04"
            id="seller-heading"
            title="Seller and licence"
            kicker="Who you are buying from, and what our verdict on the product means."
          />
          <div className="paper-grain panel-frame mt-6 grid gap-8 bg-surface p-5 sm:p-7 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0 [&>div]:border-t-0 [&>div]:pt-0">
              <SellerNote pick={pick} detailed />
            </div>
            <div className="min-w-0 border-t border-line-soft pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
              <PickLicenseNote pick={pick} />
            </div>
          </div>
        </section>

        {/* ---- 05 Price and link -------------------------------------------- */}
        <section aria-labelledby="price-heading" className="mt-12 scroll-mt-24">
          <DossierHeading
            n="05"
            id="price-heading"
            title="Price and link"
            kicker={
              live
                ? `The price is what we saw at ${merchant.name} on the date shown. The listing itself is the source of truth.`
                : 'The price is what we saw on the date shown. There is no live link for this pick, and the panel below says why.'
            }
          />
          <div className="offset-print-red mt-6 grid gap-6 border-2 border-shu bg-surface p-5 sm:p-7 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
            <div className="min-w-0">
              <p className="label-xs mb-2 text-muted">Dated price stamp</p>
              <PriceStamp price={pick.price} checkedAt={pick.priceCheckedAt} size="lg" />
              <p className="mt-3 max-w-[40ch] text-xs leading-relaxed text-muted">
                We never show a price we have not checked recently, and we never show a
                &ldquo;was&rdquo; price. What you pay is set by the seller.
              </p>
            </div>
            <div className="min-w-0 border-t border-line-soft pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
              {/* The only outbound path. Disclosure travels with it. */}
              <OutboundButton pick={pick} from={`pick:${pick.slug}`} showPrice={false} />
            </div>
          </div>
        </section>

        {/* ---- 06 Alternatives ---------------------------------------------- */}
        <PickAlternatives pick={pick} n="06" className="mt-14" />

        {/* ---- 07 Related reading ------------------------------------------- */}
        <ProductDossierRelated pick={pick} n="07" className="mt-14" />

        <div className="mt-14">
          <ReportProblem pick={pick} />
        </div>
      </main>

      <Footer />
    </>
  )
}

/**
 * Shown when `/go/[slug]` refused to redirect and sent the reader back here.
 *
 * The reason is derived from the same fields the redirect checked, so the
 * explanation always matches the refusal. The `isPurchasable` branch covers
 * the case where the pick is live but our own link construction failed —
 * the button below will still render, and honesty demands we say whose
 * fault a second bounce would be.
 */
function bounceReason(pick: Pick): string {
  const merchant = getMerchant(pick.merchantId)

  let reason: string
  if (pick.licenseStatus === 'unverified') {
    reason = `We have not finished verifying the licensing on this pick, so we do not send readers to ${merchant.name} for it yet. The link will appear once the check is complete.`
  } else if (pick.linkStatus === 'sample') {
    reason =
      'This is sample catalog data used while the site is being built. No purchase path is configured and nothing on this page is for sale.'
  } else if (pick.linkStatus === 'broken') {
    reason = `The ${merchant.name} listing for this product is no longer reachable. We pulled the link rather than send you to a dead page.`
  } else if (pick.linkStatus === 'discontinued') {
    reason = `${merchant.name} no longer stocks this product, so we have removed the link. The pick stays published so the reasoning is still readable.`
  } else if (isPurchasable(pick)) {
    reason = `Our tracked link to ${merchant.name} is misconfigured on our side, so we stopped the redirect rather than send you out through a broken link. If the button below bounces you back here again, that is our fault, not the seller's. Please report it using the link further down.`
  } else {
    reason = `The link to ${merchant.name} is not available right now, so the redirect was stopped.`
  }

  return reason
}

/**
 * Cheap credibility: a way to tell us the listing is wrong. Keep the address
 * in step with `metadataBase` in app/layout.tsx when the domain changes.
 */
const REPORT_EMAIL = 'hello@otakudesk.com'

function ReportProblem({ pick }: { pick: Pick }) {
  const subject = encodeURIComponent(
    `Problem with listing: ${pick.title} (${pick.slug})`,
  )
  const body = encodeURIComponent(
    `Pick: /desk/${pick.slug}\n\nWhat is wrong? (stale price, dead link, licensing concern, wrong seller, something else)\n\n`,
  )

  return (
    <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div>
        <h2 className="label-xs mb-2 text-muted">Something wrong here?</h2>
        <p className="max-w-[52ch] text-sm leading-relaxed text-paper-2">
          A stale price, a dead link, a licensing concern, or a seller who is not
          who we say: tell us and we will re-check the pick.
        </p>
      </div>
      <a
        href={`mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`}
        className="shrink-0 self-start border-2 border-paper px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-paper hover:text-ink"
      >
        Report a problem with this listing
      </a>
    </div>
  )
}
