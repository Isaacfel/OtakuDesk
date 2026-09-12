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
import { LicenseBadge, SellerNote } from '@/components/Badges'
import { PickGallery } from '@/components/PickGallery'
import { WhyWePicked } from '@/components/WhyWePicked'
import { PickFit } from '@/components/PickFit'
import { PickLicenseNote } from '@/components/PickLicenseNote'
import { PickAlternatives } from '@/components/PickAlternatives'

/**
 * The pick page. The most important page on the site.
 *
 * Everything a reader needs to decide is visible before the buy button is
 * reached: the licence verdict, who the seller is, how old the price is, the
 * three reasons we chose it, and the honest caveat. The button itself is
 * `OutboundButton` — the only component permitted to link to a merchant, and
 * the one that carries the disclosure by construction.
 *
 * `params` and `searchParams` are promises in Next 16 and are awaited.
 * Reading `searchParams` opts the page into request-time rendering; that is
 * accepted, because `/go` bounces readers back here with `?unavailable=1`
 * and the page must be able to explain why.
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
  const path = `/picks/${pick.slug}`

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

  return (
    <>
      <Header />

      <main className="mx-auto max-w-6xl px-5 pt-6 pb-16 sm:pt-8">
        <nav
          aria-label="Breadcrumb"
          className="label-xs flex flex-wrap items-center gap-2 text-muted"
        >
          <Link href="/vault" className="transition-colors hover:text-paper">
            The Vault
          </Link>
          <span aria-hidden="true">/</span>
          <span>{pick.category}</span>
        </nav>

        <Suspense fallback={null}>
          <BouncedNotice reason={bounceReason(pick)} />
        </Suspense>

        {/* Hero: image beside the decision column. */}
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <PickGallery pick={pick} />

          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <LicenseBadge pick={pick} />
              <span className="label-xs text-muted">{pick.category}</span>
            </div>

            <h1 className="font-display text-3xl text-paper sm:text-4xl">
              {pick.title}
            </h1>

            <p className="max-w-[52ch] text-base leading-relaxed text-paper-2">
              {pick.description}
            </p>

            <div className="border-t border-line-soft pt-5">
              <OutboundButton pick={pick} from={`pick:${pick.slug}`} />
            </div>
          </div>
        </div>

        {/* Editorial: the argument, beside the provenance. */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
          <div className="flex min-w-0 flex-col gap-12">
            <WhyWePicked pick={pick} />
            <PickFit pick={pick} />
          </div>

          <aside className="flex min-w-0 flex-col gap-8 lg:pt-1">
            <SellerNote pick={pick} detailed />
            <PickLicenseNote pick={pick} />
            <ReportProblem pick={pick} />
          </aside>
        </div>

        <PickAlternatives pick={pick} className="mt-16" />
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
    `Pick: /picks/${pick.slug}\n\nWhat is wrong? (stale price, dead link, licensing concern, wrong seller, something else)\n\n`,
  )

  return (
    <div className="border-t border-line-soft pt-4">
      <h3 className="label-xs mb-2 text-muted">Something wrong here?</h3>
      <p className="max-w-[52ch] text-sm leading-relaxed text-paper-2">
        A stale price, a dead link, a licensing concern, or a seller who is not
        who we say: tell us and we will re-check the pick.
      </p>
      <a
        href={`mailto:${REPORT_EMAIL}?subject=${subject}&body=${body}`}
        className="mt-2 inline-block text-sm text-paper underline underline-offset-2 transition-colors hover:text-shu-bright"
      >
        Report a problem with this listing
      </a>
    </div>
  )
}
