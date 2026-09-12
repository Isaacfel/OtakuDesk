import type { Collection, CuratedSet } from './types'

/**
 * Collection and set metadata, deliberately in its own module.
 *
 * VaultBrowser is a Client Component and needs COLLECTIONS for its filter
 * facets. When this lived in data/picks.ts, that single import pulled the
 * whole catalog into the client bundle — including every `purchaseUrl`, the
 * raw untagged merchant destinations, readable by anyone who opened the JS.
 *
 * Splitting the module is the fix. Nothing here may import from ./picks, or
 * the leak comes straight back.
 */

/**
 * Editorial collections. Note the absence of the brief's "Giftable Under $35":
 * a price-bounded collection breaks silently the moment a merchant reprices,
 * and we cannot control merchant pricing. Budget browsing lives in the gift
 * guide instead, where it is computed from live price data at render time.
 */
export const COLLECTIONS: Collection[] = [
  {
    slug: 'desk-and-room-arc',
    name: 'Desk & Room Arc',
    description:
      'The pieces that change how a room feels: what sits on the desk, what goes on the wall, and what lights the shelf. This is the core of what we cover.',
    blurb: 'Decor and accessories for upgrading your space.',
  },
  {
    slug: 'streetwear-arc',
    name: 'Streetwear Arc',
    description:
      'Everyday apparel with restraint. Things you can wear to work on Tuesday and to a con on Saturday without changing.',
    blurb: 'Everyday apparel with subtle fandom energy.',
  },
  {
    slug: 'collector-arc',
    name: 'Collector Arc',
    description:
      'Display, protection, and lighting. We cover what surrounds a collection rather than the figures themselves — the market for those is well served and hard to verify.',
    blurb: 'Display pieces and the gear that protects them.',
  },
  {
    slug: 'convention-ready',
    name: 'Convention Ready',
    description:
      'Practical gear for long event days: carrying things, refilling things, and getting home with your pins still attached.',
    blurb: 'Practical accessories for events, travel, and cosplay.',
  },
  {
    slug: 'original-artist-picks',
    name: 'Original Artist Picks',
    description:
      'Original designs from independent artists, named and linked. No fan art, no traced characters — work the artist owns outright.',
    blurb: 'Original designs from independent artists, with attribution.',
  },
]

/**
 * Curated sets. These are NOT discounted bundles — no discount is ours to give.
 * The total is informational, and every item links out separately.
 */
export const SETS: CuratedSet[] = [
  {
    slug: 'first-desk-upgrade',
    name: 'First Desk Upgrade',
    description:
      'The three things that change a desk most for the least money, in the order we would buy them.',
    pickIds: ['p001', 'p007', 'p010'],
  },
  {
    slug: 'first-convention',
    name: 'First Convention Kit',
    description:
      'What we would carry to a first two-day event, assuming you already own a bag you like.',
    pickIds: ['p002', 'p012', 'p008'],
  },
  {
    slug: 'shelf-that-lasts',
    name: 'A Shelf That Lasts',
    description:
      'Display, protect, and light a collection so it still looks right in three years.',
    pickIds: ['p003', 'p009', 'p010'],
  },
]
