import type { Pick, Collection, CuratedSet } from './types'

/**
 * ============================================================================
 * SAMPLE CATALOG — NOT REAL PRODUCTS, NOT BUYABLE
 * ============================================================================
 *
 * Every entry below is `linkStatus: 'sample'`, which means:
 *   - no outbound CTA renders anywhere in the UI
 *   - the /go route refuses to redirect
 *   - the site shows an explicit "sample data" state instead
 *
 * These are original-design product CONCEPTS in the spirit of the brief. They
 * deliberately reference no anime franchise, character, or studio. Replace
 * them one at a time as real picks are researched: find the product, verify
 * the seller and licence by hand, capture the price with today's date, confirm
 * you have the right to the image, then flip linkStatus to 'ok'.
 *
 * Do not bulk-import. The catalog is the product; every row is a claim we make.
 */

const SAMPLE_DATE = '2026-09-11'

export const PICKS: Pick[] = [
  {
    id: 'p001',
    slug: 'neon-panel-desk-mat',
    title: 'Neon Panel Desk Mat',
    whyWePicked: [
      'At 900×400mm it clears a full keyboard and mouse sweep without hanging off a standard 1200mm desk.',
      'Stitched edges, which is the difference between a mat that lasts three years and one that frays in six months.',
      'The panel-gutter print reads as graphic rather than busy, so it does not fight whatever else is on the desk.',
    ],
    bestFor: 'Standard-depth desks where a full-size mat would overhang',
    watchOut: 'Rubber backing has a noticeable smell for the first week.',
    description:
      'A large, smooth desk mat with an original neon panel design for gaming, study, and creative setups.',
    merchantId: 'sample',
    sellerType: 'independent_artist',
    licenseStatus: 'original_design',
    goSlug: 'neon-panel-desk-mat',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 29.99,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [
      { src: '', alt: 'Neon Panel Desk Mat shown on a dark desk', source: 'placeholder' },
    ],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Desk & Room',
    collections: ['desk-and-room-arc', 'original-artist-picks'],
    tags: ['desk', 'gaming', 'original design', 'giftable'],
    alternatives: ['p004', 'p007'],
    addedAt: SAMPLE_DATE,
    featured: true,
  },
  {
    id: 'p002',
    slug: 'convention-utility-sling',
    title: 'Convention Utility Sling',
    whyWePicked: [
      'The badge pocket sits on the strap, so you are not unzipping the main compartment every time you are scanned.',
      'Fits a 500ml bottle upright in the side pocket, which most slings this size cannot.',
      'Water-resistant shell — con halls are fine, the queue outside is not.',
    ],
    bestFor: 'Long convention days where a backpack is too much and pockets are not enough',
    watchOut: 'Too small for anything larger than a B5 artbook.',
    description:
      'A compact crossbody bag designed to keep badges, phone, wallet, and small collectibles organised at events.',
    merchantId: 'sample',
    sellerType: 'brand_direct',
    licenseStatus: 'unverified',
    goSlug: 'convention-utility-sling',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 34.99,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [
      { src: '', alt: 'Convention Utility Sling worn across the chest', source: 'placeholder' },
    ],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Accessories',
    collections: ['convention-ready'],
    tags: ['convention', 'travel', 'utility', 'unisex'],
    alternatives: ['p008'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p003',
    slug: 'collector-display-risers',
    title: 'Collector Display Risers',
    whyWePicked: [
      'Three heights that stack, so one set covers a shelf, a cabinet, and a windowsill.',
      'Acrylic is 5mm rather than the usual 3mm — it does not bow under a heavier figure.',
      'Clear rather than frosted, which keeps the attention on what is standing on it.',
    ],
    bestFor: 'Turning one flat shelf into a layered display without buying a cabinet',
    description:
      'Clear modular risers that help create layered displays for figures, art toys, and small collectibles.',
    merchantId: 'sample',
    sellerType: 'marketplace',
    licenseStatus: 'original_design',
    goSlug: 'collector-display-risers',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 24.99,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [
      { src: '', alt: 'Three clear acrylic risers at stepped heights', source: 'placeholder' },
    ],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Storage & Display',
    collections: ['collector-arc', 'desk-and-room-arc'],
    tags: ['display', 'collector', 'room decor'],
    alternatives: ['p009'],
    addedAt: SAMPLE_DATE,
    featured: true,
  },
  {
    id: 'p004',
    slug: 'gradient-grid-mousepad-xl',
    title: 'Gradient Grid Mousepad XL',
    whyWePicked: [
      'Low-friction weave aimed at fast sensor tracking rather than a soft cloth feel.',
      'The grid fades toward the edges, so the mat frames the setup instead of dominating it.',
      'Washable without the print lifting, which is rarer than it sounds at this price.',
    ],
    bestFor: 'Low-sensitivity mouse players who need room to swing',
    description:
      'An extra-wide mousepad with an original gradient grid, built for speed-oriented sensor tracking.',
    merchantId: 'sample',
    sellerType: 'independent_artist',
    licenseStatus: 'original_design',
    goSlug: 'gradient-grid-mousepad-xl',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 21.5,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Wide gradient grid mousepad', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Desk & Room',
    collections: ['desk-and-room-arc'],
    tags: ['desk', 'gaming', 'original design'],
    alternatives: ['p001'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p005',
    slug: 'sunset-city-metal-print',
    title: 'Sunset City Metal Print',
    whyWePicked: [
      'Matte finish, which means you can hang it opposite a window without glare washing it out.',
      'Magnet mount leaves no holes — the right call for a rental.',
      'Original skyline illustration, so it works as a room piece rather than reading as a poster of something.',
    ],
    bestFor: 'Renters who cannot drill, and walls that catch afternoon light',
    watchOut: 'The magnet mount needs a flat wall; textured plaster weakens the hold.',
    description:
      'A matte metal wall print of an original illustrated skyline, mounted magnetically.',
    merchantId: 'sample',
    sellerType: 'brand_direct',
    licenseStatus: 'original_design',
    goSlug: 'sunset-city-metal-print',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 59.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Matte metal wall print of an illustrated skyline', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Wall Art',
    collections: ['desk-and-room-arc', 'original-artist-picks'],
    tags: ['wall art', 'room decor', 'renter friendly'],
    alternatives: ['p010'],
    addedAt: SAMPLE_DATE,
    featured: true,
  },
  {
    id: 'p006',
    slug: 'panel-cut-heavyweight-tee',
    title: 'Panel Cut Heavyweight Tee',
    whyWePicked: [
      '240gsm cotton, which holds its shape instead of clinging after two washes.',
      'The graphic is a single abstract panel cut — subtle enough for work, legible to anyone who knows.',
      'Boxy cut that sits right on a wider frame, where most fandom tees run narrow.',
    ],
    bestFor: 'Wearing fandom without announcing it across a whole chest print',
    watchOut: 'Runs one size large; size down if you want a standard fit.',
    description:
      'A heavyweight cotton tee with a restrained original panel-cut graphic.',
    merchantId: 'sample',
    sellerType: 'independent_artist',
    licenseStatus: 'original_design',
    goSlug: 'panel-cut-heavyweight-tee',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 38.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Heavyweight tee with a small abstract panel graphic', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Apparel',
    collections: ['streetwear-arc', 'original-artist-picks'],
    tags: ['apparel', 'subtle', 'everyday'],
    alternatives: ['p011'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p007',
    slug: 'low-profile-monitor-riser',
    title: 'Low-Profile Monitor Riser',
    whyWePicked: [
      'Raises a monitor 95mm, which lands the top edge at eye level for most people at a standard desk height.',
      'The gap underneath is 80mm — enough to park a keyboard, which is the whole point.',
      'Steel rather than particleboard, so it does not sag under a 27-inch panel.',
    ],
    bestFor: 'Small desks where the keyboard needs somewhere to go',
    description:
      'A steel monitor stand sized to clear a keyboard underneath and bring the screen to eye level.',
    merchantId: 'sample',
    sellerType: 'marketplace',
    licenseStatus: 'original_design',
    goSlug: 'low-profile-monitor-riser',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 42.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Steel monitor riser with a keyboard stored beneath', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Desk & Room',
    collections: ['desk-and-room-arc'],
    tags: ['desk', 'ergonomics', 'small space'],
    alternatives: ['p001'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p008',
    slug: 'badge-and-pin-travel-roll',
    title: 'Badge & Pin Travel Roll',
    whyWePicked: [
      'Felt-backed panels, so pin backs grip instead of sliding into a corner in transit.',
      'Rolls to roughly a 1L bottle in volume, which fits a con bag without claiming the whole thing.',
      'Doubles as a display piece unrolled on a shelf, so it earns its place at home too.',
    ],
    bestFor: 'Anyone whose pin collection currently lives in a plastic bag',
    description:
      'A roll-up fabric organiser with felt panels for transporting and displaying enamel pins and badges.',
    merchantId: 'sample',
    sellerType: 'independent_artist',
    licenseStatus: 'original_design',
    goSlug: 'badge-and-pin-travel-roll',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 27.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Fabric pin roll partly unrolled showing felt panels', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Storage & Display',
    collections: ['convention-ready', 'collector-arc'],
    tags: ['convention', 'pins', 'storage', 'giftable'],
    alternatives: ['p002', 'p003'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p009',
    slug: 'dust-cover-display-case',
    title: 'Dust Cover Display Case',
    whyWePicked: [
      'UV-filtering acrylic, which matters more than collectors expect — sun fade is the main killer of shelf pieces.',
      'Snap-together, no adhesive, so it can be taken apart to clean.',
      'Sized to the common 1/7 scale footprint rather than a generic cube.',
    ],
    bestFor: 'Shelves near a window, and anyone tired of dusting figures',
    watchOut: 'Acrylic scratches easily — clean with a microfibre cloth only.',
    description:
      'A snap-together UV-filtering acrylic case sized for standard-scale display pieces.',
    merchantId: 'sample',
    sellerType: 'marketplace',
    licenseStatus: 'original_design',
    goSlug: 'dust-cover-display-case',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 46.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Clear acrylic display case on a shelf', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Storage & Display',
    collections: ['collector-arc'],
    tags: ['display', 'collector', 'protection'],
    alternatives: ['p003'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p010',
    slug: 'ambient-shelf-light-bar',
    title: 'Ambient Shelf Light Bar',
    whyWePicked: [
      'Diffused rather than dotted, so it lights a shelf evenly instead of spotting each figure.',
      'USB-C powered off the same hub as everything else on the desk — no extra wall wart.',
      'Adjustable warmth, which lets it sit at 2700K in the evening instead of a flat blue-white.',
    ],
    bestFor: 'Making a display shelf readable after dark without lighting the whole room',
    description:
      'A USB-C powered diffused LED bar for lighting display shelves and desk backdrops.',
    merchantId: 'sample',
    sellerType: 'brand_direct',
    licenseStatus: 'original_design',
    goSlug: 'ambient-shelf-light-bar',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 33.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Slim LED light bar mounted under a shelf', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Desk & Room',
    collections: ['desk-and-room-arc', 'collector-arc'],
    tags: ['lighting', 'room decor', 'desk'],
    alternatives: ['p005'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p011',
    slug: 'reversible-coach-jacket',
    title: 'Reversible Coach Jacket',
    whyWePicked: [
      'Plain on one side, graphic on the other — one jacket that works for a con floor and for work.',
      'Snap front rather than a zip, which is the detail that keeps it looking like outerwear and not merch.',
      'Lined, so it is actually useful in autumn rather than being a shell.',
    ],
    bestFor: 'Travelling light to an event and still having something to wear afterwards',
    watchOut: 'Not waterproof — the shell is wind-resistant only.',
    description:
      'A lined, reversible coach jacket with an original graphic on the inner face.',
    merchantId: 'sample',
    sellerType: 'brand_direct',
    licenseStatus: 'original_design',
    goSlug: 'reversible-coach-jacket',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 96.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Coach jacket shown from both reversible sides', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Apparel',
    collections: ['streetwear-arc', 'convention-ready'],
    tags: ['apparel', 'outerwear', 'convention'],
    alternatives: ['p006'],
    addedAt: SAMPLE_DATE,
  },
  {
    id: 'p012',
    slug: 'folding-con-water-bottle',
    title: 'Folding Con Water Bottle',
    whyWePicked: [
      'Collapses to about a third of its height, so it stops taking up bag space once it is empty.',
      'Wide mouth fits the ice from a hall vendor cup, which the narrow ones do not.',
      'Carabiner loop that is actually rated to hold — most are decorative.',
    ],
    bestFor: 'All-day events where you refill and then want the bottle gone',
    description:
      'A collapsible silicone water bottle sized for long event days and small bags.',
    merchantId: 'sample',
    sellerType: 'marketplace',
    licenseStatus: 'original_design',
    goSlug: 'folding-con-water-bottle',
    purchaseUrl: 'https://example.invalid/sample-not-configured',
    price: 18.0,
    currency: 'USD',
    priceCheckedAt: SAMPLE_DATE,
    images: [{ src: '', alt: 'Collapsible silicone bottle shown folded and full', source: 'placeholder' }],
    lastVerifiedAt: SAMPLE_DATE,
    linkStatus: 'sample',
    category: 'Accessories',
    collections: ['convention-ready'],
    tags: ['convention', 'travel', 'giftable'],
    alternatives: ['p002'],
    addedAt: SAMPLE_DATE,
  },
]

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

// --- Lookups ----------------------------------------------------------------

export const getPickBySlug = (slug: string) => PICKS.find((p) => p.slug === slug)
export const getPickById = (id: string) => PICKS.find((p) => p.id === id)
export const getPickByGoSlug = (goSlug: string) =>
  PICKS.find((p) => p.goSlug === goSlug)
export const getCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug)
export const getPicksInCollection = (slug: string) =>
  PICKS.filter((p) => p.collections.includes(slug))

/** True when the catalog is still entirely seed data — drives the site-wide banner. */
export const CATALOG_IS_SAMPLE = PICKS.every((p) => p.linkStatus === 'sample')

/**
 * Gift-quiz availability gate.
 *
 * The quiz is the highest-value feature in the brief and the easiest to
 * discredit: below real catalog depth it returns the same three answers
 * whatever the reader inputs, which damages the trust claim more than having
 * no quiz at all. So v1 scopes it to desk setup and gates every entry point
 * on this single check — there is no other way to link to it.
 */
export const QUIZ_MIN_PICKS = 15
export const QUIZ_CATEGORY = 'Desk & Room' as const

export function quizEligiblePicks() {
  return PICKS.filter(
    (p) =>
      p.category === QUIZ_CATEGORY &&
      p.linkStatus === 'ok' &&
      p.licenseStatus !== 'unverified',
  )
}

/** Home CTA, nav entry, and the route itself all consult this. */
export function isQuizReady(): boolean {
  return quizEligiblePicks().length >= QUIZ_MIN_PICKS
}
