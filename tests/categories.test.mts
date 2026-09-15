/**
 * Category navigation gate.
 *
 * Run: npm test
 *
 * The header, the home page rows, and the /desk filter tabs all read from
 * navCategories(). A category should appear there only when a shopper who
 * clicks it will find something they can actually buy — otherwise the link
 * makes the store look broken rather than small.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { MIN_NAV_PICKS, NAV_ORDER, PICKS, navCategories } from '../data/picks'
import { CATEGORIES, isPurchasable, type Category, type Pick } from '../data/types'

type Overrides = Partial<Pick> & { category: Category }

/** A purchasable pick in the given category unless the overrides say otherwise. */
function fakePick(overrides: Overrides): Pick {
  return {
    ...PICKS[0],
    id: `test-${Math.random().toString(36).slice(2)}`,
    linkStatus: 'ok',
    licenseStatus: 'original_design',
    ...overrides,
  }
}

test('MIN_NAV_PICKS demands more than a lone pick', () => {
  assert.ok(MIN_NAV_PICKS >= 2)
})

test('NAV_ORDER covers every category exactly once', () => {
  assert.deepEqual([...NAV_ORDER].sort(), [...CATEGORIES].sort())
})

test('a category with fewer than MIN_NAV_PICKS purchasable picks is hidden', () => {
  const picks = [
    fakePick({ category: 'Wall Art' }),
    fakePick({ category: 'Wall Art', linkStatus: 'broken' }),
    fakePick({ category: 'Wall Art', linkStatus: 'discontinued' }),
  ]
  assert.deepEqual(navCategories(picks), [])
})

test('an unverified licence still counts: the owner keeps those links live', () => {
  const picks = [
    fakePick({ category: 'Wall Art' }),
    fakePick({ category: 'Wall Art', licenseStatus: 'unverified' }),
  ]
  assert.deepEqual(navCategories(picks), ['Wall Art'])
})

test('a category with MIN_NAV_PICKS purchasable picks is shown', () => {
  const picks = Array.from({ length: MIN_NAV_PICKS }, () => fakePick({ category: 'Apparel' }))
  assert.deepEqual(navCategories(picks), ['Apparel'])
})

test('shown categories follow NAV_ORDER, not insertion order', () => {
  const picks = [
    ...Array.from({ length: MIN_NAV_PICKS }, () => fakePick({ category: 'Storage & Display' })),
    ...Array.from({ length: MIN_NAV_PICKS }, () => fakePick({ category: 'Figures & Collectibles' })),
  ]
  assert.deepEqual(navCategories(picks), ['Figures & Collectibles', 'Storage & Display'])
})

test('the live catalog gate agrees with isPurchasable', () => {
  const shown = new Set(navCategories())
  for (const c of CATEGORIES) {
    const purchasable = PICKS.filter((p) => p.category === c && isPurchasable(p)).length
    assert.equal(
      shown.has(c),
      purchasable >= MIN_NAV_PICKS,
      `${c}: ${purchasable} purchasable pick(s), shown=${shown.has(c)}`,
    )
  }
  // The nav must never go completely dark; if it does the catalog has bigger problems.
  assert.ok(shown.size > 0)
})
