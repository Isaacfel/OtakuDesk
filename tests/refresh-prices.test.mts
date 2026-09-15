/**
 * The price refresher's parsers and its edit to data/picks.ts.
 *
 * Run: npm test
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { applyPrice, parseOutcome, parsePrice } from '../lib/prices'
import { PICKS } from '../data/picks'

const CORE = (price: string) =>
  `<div id="corePrice_feature_div"><span class="a-price"><span class="a-offscreen">$${price}</span></span></div>`

test('parsePrice: buy box, apex priceToPay, and paperback swatch layouts', () => {
  assert.equal(parsePrice(CORE('15.99')), 15.99)
  assert.equal(parsePrice(CORE('1,234.50')), 1234.5)
  assert.equal(
    parsePrice(
      '<div id="apex_desktop"><span class="priceToPay"><span class="a-offscreen">$58.99</span></span></div>',
    ),
    58.99,
  )
  assert.equal(
    parsePrice(
      '<div id="tmm-grid-swatch-PAPERBACK"><span class="slot-title">Paperback</span><span class="slot-price"><span>$6.71</span></span></div>',
    ),
    6.71,
  )
  assert.equal(parsePrice('<html><body>no price here</body></html>'), null)
  assert.equal(parsePrice(CORE('0.00')), null, 'a zero price is not a price')
})

test('parsePrice: ignores the struck-through list price and per-unit prices', () => {
  const strike =
    '<span class="a-price a-text-price apex-basisprice-value" data-a-strike="true"><span class="a-offscreen">$11.99</span></span>'
  const perUnit =
    '<span class="a-price a-text-price apex-priceperunit-value" data-a-size="mini"><span class="a-offscreen">$4.00</span></span>'
  const buy = '<span class="a-price aok-align-center"><span class="a-offscreen">$6.71</span></span>'
  assert.equal(parsePrice(`<div id="corePrice_feature_div">${strike}${buy}</div>`), 6.71)
  assert.equal(parsePrice(`<div id="corePrice_feature_div">${perUnit}${buy}</div>`), 6.71)
  assert.equal(
    parsePrice(`<div id="corePrice_feature_div">${strike}${perUnit}</div>`),
    null,
    'nothing but list and per-unit prices means no buy price',
  )
})

test('parseOutcome: bot checks, missing pages, and unavailable listings are reported, not priced', () => {
  assert.deepEqual(parseOutcome(404, ''), { kind: 'gone' })
  assert.deepEqual(parseOutcome(503, ''), { kind: 'blocked', status: 503 })
  assert.deepEqual(parseOutcome(200, '<title>Robot Check</title>' + CORE('9.99')), {
    kind: 'blocked',
    status: 200,
  })
  assert.deepEqual(
    parseOutcome(200, '<div id="availability"><span>Currently unavailable.</span></div>'),
    { kind: 'unavailable' },
  )
  assert.deepEqual(parseOutcome(200, CORE('24.99')), { kind: 'price', price: 24.99 })
  assert.deepEqual(parseOutcome(200, '<p>loaded</p>'), { kind: 'no-price' })
})

test('applyPrice: rewrites only the target pick and only price fields', () => {
  const a = PICKS[0]
  const b = PICKS[1]
  const source = [
    `  {`,
    `    id: '${a.id}',`,
    `    purchaseUrl: '${a.purchaseUrl}',`,
    `    price: ${a.price},`,
    `    currency: 'USD',`,
    `    priceCheckedAt: AMAZON_DATE,`,
    `  },`,
    `  {`,
    `    id: '${b.id}',`,
    `    purchaseUrl: '${b.purchaseUrl}',`,
    `    price: ${b.price},`,
    `    currency: 'USD',`,
    `    priceCheckedAt: '2026-09-13',`,
    `  },`,
  ].join('\n')

  const out = applyPrice(source, b, 12.34, '2026-10-01')
  assert.ok(out.includes(`    price: ${a.price},\n    currency: 'USD',\n    priceCheckedAt: AMAZON_DATE,`), 'first pick untouched')
  assert.ok(out.includes(`    price: 12.34,\n    currency: 'USD',\n    priceCheckedAt: '2026-10-01',`), 'second pick updated')
  assert.throws(() => applyPrice(source, { ...b, purchaseUrl: 'https://www.amazon.com/dp/NOPE000000' }, 1, '2026-10-01'))

  // Same price on the same day is a no-op, not an error.
  assert.equal(applyPrice(source, b, b.price ?? 0, '2026-09-13'), source)
})

test('applyPrice: works on the real catalog source for every live pick', async () => {
  const { readFileSync } = await import('node:fs')
  const source = readFileSync(new URL('../data/picks.ts', import.meta.url), 'utf8')
  for (const p of PICKS.filter((x) => x.linkStatus === 'ok')) {
    const out = applyPrice(source, p, 99.99, '2026-10-01')
    assert.ok(out.includes("priceCheckedAt: '2026-10-01'"), p.slug)
  }
})
