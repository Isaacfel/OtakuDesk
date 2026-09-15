/**
 * JSON-LD for the product page.
 *
 * Run: npm test
 *
 * The properties that matter: an Offer appears only when the UI would show a
 * price (purchasable AND fresh), the offer's url is our own page rather than
 * the /go redirect or the merchant, and the serialised script can never be
 * closed early by a hostile title.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { PICKS } from '../data/picks'
import { getMerchant } from '../data/merchants'
import { PRICE_MAX_AGE_DAYS } from '../data/types'
import {
  SITE_URL,
  breadcrumbJsonLd,
  jsonLdScript,
  priceValidUntil,
  productJsonLd,
} from '../lib/structured-data'

type Pick = (typeof PICKS)[number]

const CHECKED = '2026-09-01'
// A "now" a week after the check: comfortably inside the freshness window.
const NOW = new Date('2026-09-08T12:00:00Z').getTime()

function fakePick(overrides: Partial<Pick> = {}): Pick {
  return {
    ...PICKS[0],
    slug: 'test-pick',
    goSlug: 'test-pick',
    title: 'Test Pick',
    merchantId: 'amazon',
    linkStatus: 'ok',
    licenseStatus: 'officially_licensed',
    price: 12.5,
    currency: 'USD',
    priceCheckedAt: CHECKED,
    category: 'Desk & Room',
    images: [{ src: 'https://img.example/a.jpg', alt: 'a', source: 'merchant_listing' }],
    ...overrides,
  }
}

const merchant = getMerchant('amazon')

// ---------------------------------------------------------------------------
// Product
// ---------------------------------------------------------------------------

test('purchasable fresh pick: Product with an Offer priced to two decimals', () => {
  const pick = fakePick()
  const ld = productJsonLd(pick, merchant, { now: NOW })

  assert.equal(ld['@context'], 'https://schema.org')
  assert.equal(ld['@type'], 'Product')
  assert.equal(ld.name, pick.title)
  assert.equal(ld.description, pick.description)
  assert.equal(ld.category, 'Desk & Room')
  assert.equal(ld.url, `${SITE_URL}/desk/test-pick`)
  assert.deepEqual(ld.image, ['https://img.example/a.jpg'])
  assert.ok(!('brand' in ld), 'no brand field on Pick, so none may be invented')

  assert.ok(ld.offers, 'expected an Offer')
  assert.equal(ld.offers['@type'], 'Offer')
  assert.equal(ld.offers.price, '12.50')
  assert.equal(ld.offers.priceCurrency, 'USD')
  assert.equal(ld.offers.availability, 'https://schema.org/InStock')
  assert.deepEqual(ld.offers.seller, { '@type': 'Organization', name: 'Amazon' })
})

test('offer.url is our product page, never /go and never the merchant', () => {
  const pick = fakePick({ purchaseUrl: 'https://www.amazon.com/dp/B000000000' })
  const ld = productJsonLd(pick, merchant, { now: NOW })
  assert.equal(ld.offers?.url, `${SITE_URL}/desk/test-pick`)
  const out = jsonLdScript(ld)
  assert.ok(!out.includes('/go/'), 'leaks the redirect')
  assert.ok(!out.includes('amazon.com'), 'leaks the merchant URL')
})

test('priceValidUntil is priceCheckedAt plus the max price age', () => {
  assert.equal(PRICE_MAX_AGE_DAYS, 45)
  assert.equal(priceValidUntil('2026-09-01'), '2026-10-16')
  // Crosses a year boundary.
  assert.equal(priceValidUntil('2026-12-20'), '2027-02-03')

  const ld = productJsonLd(fakePick(), merchant, { now: NOW })
  assert.equal(ld.offers?.priceValidUntil, '2026-10-16')
})

test('integer price is still a two-decimal string', () => {
  const ld = productJsonLd(fakePick({ price: 30 }), merchant, { now: NOW })
  assert.equal(ld.offers?.price, '30.00')
})

test('stale price: Product without offers', () => {
  const stale = new Date(CHECKED).getTime() + (PRICE_MAX_AGE_DAYS + 1) * 864e5
  const ld = productJsonLd(fakePick(), merchant, { now: stale })
  assert.equal(ld['@type'], 'Product')
  assert.equal(ld.name, 'Test Pick')
  assert.ok(!('offers' in ld), 'stale price must not be asserted to search engines')
})

test('price exactly at the age limit is stale, matching isPriceFresh', () => {
  const edge = new Date(CHECKED).getTime() + PRICE_MAX_AGE_DAYS * 864e5
  assert.ok(!('offers' in productJsonLd(fakePick(), merchant, { now: edge })))
  assert.ok('offers' in productJsonLd(fakePick(), merchant, { now: edge - 1 }))
})

test('null price: no offers even when fresh and purchasable', () => {
  assert.ok(!('offers' in productJsonLd(fakePick({ price: null }), merchant, { now: NOW })))
})

test('unverified licence or dead link: no offers', () => {
  for (const overrides of [
    { licenseStatus: 'unverified' as const },
    { linkStatus: 'broken' as const },
    { linkStatus: 'discontinued' as const },
  ]) {
    const ld = productJsonLd(fakePick(overrides), merchant, { now: NOW })
    assert.ok(!('offers' in ld), JSON.stringify(overrides))
  }
})

test('images: relative srcs are made absolute and empty srcs are dropped', () => {
  const pick = fakePick({
    images: [
      { src: '/og/a.png', alt: 'a', source: 'own' },
      { src: '', alt: 'placeholder', source: 'placeholder' },
    ],
  })
  const ld = productJsonLd(pick, merchant, { now: NOW })
  assert.deepEqual(ld.image, [`${SITE_URL}/og/a.png`])
})

test('siteUrl option overrides the default origin everywhere', () => {
  const ld = productJsonLd(fakePick(), merchant, { siteUrl: 'https://preview.example', now: NOW })
  assert.equal(ld.url, 'https://preview.example/desk/test-pick')
  assert.equal(ld.offers?.url, 'https://preview.example/desk/test-pick')
})

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------

test('breadcrumbs: Home > category > product, absolute and 1-indexed', () => {
  const ld = breadcrumbJsonLd(fakePick())
  assert.equal(ld['@type'], 'BreadcrumbList')
  assert.deepEqual(ld.itemListElement, [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Desk & Room',
      item: `${SITE_URL}/desk?category=Desk%20%26%20Room`,
    },
    { '@type': 'ListItem', position: 3, name: 'Test Pick', item: `${SITE_URL}/desk/test-pick` },
  ])
})

// ---------------------------------------------------------------------------
// Serialisation
// ---------------------------------------------------------------------------

test('jsonLdScript: `<` is escaped so a title cannot close the script tag', () => {
  const pick = fakePick({ title: 'Evil </script><script>alert(1)</script>' })
  const out = jsonLdScript(productJsonLd(pick, merchant, { now: NOW }))
  assert.ok(!out.includes('<'), 'raw < in output')
  assert.ok(!out.includes('</script'), 'script close survives')
  assert.ok(out.includes('\\u003c/script\\u003e'))
  // Still valid JSON that round-trips to the original title.
  assert.equal(JSON.parse(out).name, pick.title)
})

test('jsonLdScript: output for the real catalog parses and passes through unchanged', () => {
  for (const pick of PICKS) {
    const m = getMerchant(pick.merchantId)
    const ld = productJsonLd(pick, m)
    assert.deepEqual(JSON.parse(jsonLdScript(ld)), ld, pick.slug)
    assert.deepEqual(JSON.parse(jsonLdScript(breadcrumbJsonLd(pick))), breadcrumbJsonLd(pick), pick.slug)
  }
})
