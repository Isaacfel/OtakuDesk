import type { Merchant, Pick } from '@/data/types'
import { isPriceFresh, isPurchasable, PRICE_MAX_AGE_DAYS } from '@/data/types'

/**
 * schema.org JSON-LD for the product page.
 *
 * Pure functions that return plain objects, so the shape can be asserted in
 * tests without rendering React. The page serialises them with `jsonLdScript`.
 *
 * Two rules carry over from the UI unchanged, because search engines cache
 * structured data far longer than a reader looks at a page:
 *
 *   1. An `Offer` is emitted only when the pick is purchasable AND its price
 *      is fresh — the same `isPurchasable` / `isPriceFresh` predicates the
 *      buy button and PriceStamp use. A stale-priced or dead-link pick is still
 *      a `Product`, just one with no price claim.
 *   2. The offer's `url` is our own product page. Never the /go redirect
 *      (a tracking endpoint, noindex) and never the merchant URL (we are not
 *      the seller, and the raw destination must not appear in page source).
 */

import { SITE } from './site'

/** One source of truth with app/layout.tsx `metadataBase` and app/sitemap.ts. */
export const SITE_URL = SITE.url

export type JsonLdOptions = {
  /** Absolute origin used to build every URL. */
  siteUrl?: string
  /** Injected for tests; the page uses the current time. */
  now?: number
}

type Offer = {
  '@type': 'Offer'
  price: string
  priceCurrency: string
  availability: 'https://schema.org/InStock'
  url: string
  priceValidUntil: string
  seller: { '@type': 'Organization'; name: string }
}

export type ProductJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'Product'
  name: string
  description: string
  image: string[]
  category: string
  url: string
  offers?: Offer
}

export type BreadcrumbJsonLd = {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: Array<{
    '@type': 'ListItem'
    position: number
    name: string
    item: string
  }>
}

export const productPath = (pick: Pick) => `/desk/${pick.slug}`
export const categoryPath = (pick: Pick) => `/desk?category=${encodeURIComponent(pick.category)}`

const absolute = (path: string, siteUrl: string) => new URL(path, siteUrl).href

/** The last day a fresh price is still shown, as an ISO date. */
export function priceValidUntil(checkedAt: string): string {
  const d = new Date(checkedAt)
  d.setUTCDate(d.getUTCDate() + PRICE_MAX_AGE_DAYS)
  return d.toISOString().slice(0, 10)
}

export function productJsonLd(pick: Pick, merchant: Merchant, opts: JsonLdOptions = {}): ProductJsonLd {
  const siteUrl = opts.siteUrl ?? SITE_URL
  const url = absolute(productPath(pick), siteUrl)

  const product: ProductJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pick.title,
    description: pick.description,
    // Placeholder images have no src; an empty entry would be an invalid URL.
    image: pick.images.filter((img) => img.src).map((img) => absolute(img.src, siteUrl)),
    category: pick.category,
    url,
  }

  // `Pick` has no brand field; the manufacturer of record lives in prose.
  // Omitted rather than guessed from the merchant, who is the seller.
  const price = pick.price
  if (isPurchasable(pick) && price !== null && isPriceFresh(pick.priceCheckedAt, opts.now)) {
    product.offers = {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: pick.currency,
      availability: 'https://schema.org/InStock',
      url,
      priceValidUntil: priceValidUntil(pick.priceCheckedAt),
      seller: { '@type': 'Organization', name: merchant.name },
    }
  }

  return product
}

export function breadcrumbJsonLd(pick: Pick, opts: JsonLdOptions = {}): BreadcrumbJsonLd {
  const siteUrl = opts.siteUrl ?? SITE_URL
  const crumbs: Array<[string, string]> = [
    ['Home', '/'],
    [pick.category, categoryPath(pick)],
    [pick.title, productPath(pick)],
  ]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absolute(path, siteUrl),
    })),
  }
}

/**
 * Serialise for `<script type="application/ld+json">`. JSON.stringify leaves
 * `<` alone, so a title containing `</script>` would close the tag and run
 * whatever follows as HTML; the `\u003c` escape is valid JSON and inert in
 * markup. `>` and `&` are escaped for the same reason.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
