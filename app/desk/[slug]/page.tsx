import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { LicenseStatus, Pick } from '@/data/types'
import { isPurchasable, SELLER_LABEL, toCatalogPick } from '@/data/types'
import { PICKS, getPickBySlug, getPickById } from '@/data/picks'
import { getMerchant } from '@/data/merchants'
import { Header, Footer } from '@/components/Shell'
import { BouncedNotice } from '@/components/BouncedNotice'
import { OutboundButton } from '@/components/OutboundButton'
import { ProductGrid, ProductImage } from '@/components/ProductCard'
import { LicenceBadge, ProductDetails } from '@/components/ProductDetails'
import { SITE } from '@/lib/site'

/**
 * The product page. Image, title, licence badge, seller, price, one buy
 * button with its disclosure, and the notes collapsed behind "Details".
 *
 * Static. `searchParams` is deliberately not read here; the `?unavailable=1`
 * bounce from /go is handled on the client by `BouncedNotice`.
 * `pick.purchaseUrl` is never rendered.
 */

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return PICKS.map((pick) => ({ slug: pick.slug }))
}

const META_LICENCE: Record<LicenseStatus, string> = {
  officially_licensed: 'Officially licensed',
  original_design: 'Original design',
  unverified: 'Licence being verified',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pick = getPickBySlug(slug)
  if (!pick) return { title: 'Not found' }

  const merchant = getMerchant(pick.merchantId)
  const description = `${pick.description} ${META_LICENCE[pick.licenseStatus]}, sold by ${merchant.name}.`
  const path = `/desk/${pick.slug}`
  const image = pick.images[0]?.src

  return {
    title: pick.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: pick.title,
      description,
      url: path,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

/** Up to four related products: listed alternatives first, then same category. */
function related(pick: Pick): Pick[] {
  const seen = new Set<string>([pick.id])
  const out: Pick[] = []
  const add = (p: Pick | undefined) => {
    if (p && !seen.has(p.id) && out.length < 4) {
      seen.add(p.id)
      out.push(p)
    }
  }
  for (const id of pick.alternatives) add(getPickById(id))
  for (const p of PICKS) if (p.category === pick.category) add(p)
  return out
}

function bounceReason(pick: Pick): string {
  if (pick.licenseStatus === 'unverified')
    return "We're still confirming this item's licence, so it doesn't link out yet."
  if (!isPurchasable(pick)) return 'This listing is no longer available, so the link was removed.'
  return 'Our link to the seller is misconfigured on our side. Please try again later.'
}

const REPORT_EMAIL = SITE.contactEmail

export default async function PickPage({ params }: Props) {
  const { slug } = await params
  const pick = getPickBySlug(slug)
  if (!pick) notFound()

  const merchant = getMerchant(pick.merchantId)
  const more = related(pick).map(toCatalogPick)
  const safe = toCatalogPick(pick)

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-fg-muted">
          <Link href="/desk" className="hover:text-fg">
            All products
          </Link>
          <span aria-hidden="true"> / </span>
          <Link
            href={`/desk?category=${encodeURIComponent(pick.category)}`}
            className="hover:text-fg"
          >
            {pick.category}
          </Link>
        </nav>

        <Suspense fallback={null}>
          <BouncedNotice reason={bounceReason(pick)} />
        </Suspense>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <ProductImage pick={safe} eager className="rounded-md border border-line" />

          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-fg sm:text-3xl">{pick.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <LicenceBadge status={pick.licenseStatus} />
              <span className="text-fg-muted">
                Sold by {merchant.name} &middot; {SELLER_LABEL[pick.sellerType]}
              </span>
            </div>

            <div className="mt-6">
              {/* The only outbound path. Price and disclosure travel with it. */}
              <OutboundButton pick={pick} from={`pick:${pick.slug}`} />
            </div>

            <ProductDetails pick={safe} className="mt-8" />

            <p className="mt-4 text-xs text-fg-muted">
              Something wrong with this listing?{' '}
              <a
                href={`mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(`Listing problem: ${pick.title}`)}`}
                className="underline underline-offset-2 hover:text-fg"
              >
                Tell us
              </a>
              .
            </p>
          </div>
        </div>

        {more.length > 0 && (
          <section aria-labelledby="more-like-this" className="mt-16">
            <h2 id="more-like-this" className="mb-4 text-xl font-bold text-fg">
              More like this
            </h2>
            <ProductGrid picks={more} />
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
