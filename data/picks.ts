import type { Category, Pick } from './types'
import { isPurchasable } from './types'
import { COLLECTIONS } from './collections'

// Re-exported for server-side consumers. Client Components must import these
// from '@/data/collections' directly — importing them from here would pull the
// catalog, and every merchant URL, into the browser bundle.
export { COLLECTIONS, SETS } from './collections'

/**
 * The catalog. Every entry is a real listing researched by hand; see the
 * block comment above the first pick for how licence status and images
 * were decided.
 */
/** The date the Amazon picks below were researched and their prices captured. */
const AMAZON_DATE = '2026-09-13'

export const PICKS: Pick[] = [
  // ==========================================================================
  // AMAZON PICKS — real listings, researched 2026-09-13
  // ==========================================================================
  //
  // Each of these was resolved from the original shortlink to its ASIN and the
  // listing was read on the date below: title, brand/manufacturer of record,
  // buy-box seller, and buy-box price. `purchaseUrl` is the bare /dp/ASIN URL;
  // the Associates tag and the per-pick sub-id are attached at click time by
  // lib/affiliate.ts, never stored here.
  //
  // `licenseStatus` reflects what could actually be verified from the listing:
  //   - 'officially_licensed' only where the manufacturer of record is a known
  //     licensee (VIZ Media, SEGA, Banpresto/Bandai Spirits, Funko, ABYstyle,
  //     Jazwares Total Anime, Youtooz) and the product is their own line.
  //   - 'unverified' where the listing names no licensor, the brand exists only
  //     as a marketplace storefront, or the product cannot be identified. These
  //     render the "still checking" panel and never link out. Flip them by hand
  //     once the licence is confirmed — the watchOut on each says what to check.
  //
  // Images are each listing's main image, recorded as 'merchant_listing'.
  // Owner's decision (see docs/superpowers/specs/2026-09-13-storefront-
  // redesign-design.md): this is outside the Associates image terms until the
  // Product Advertising API unlocks after three qualifying sales, and the URLs
  // can change without notice. Swap to API images when available.

  // --- Manga & Books --------------------------------------------------------
  {
    id: 'p013',
    slug: 'demon-slayer-vol-1-viz',
    title: 'Demon Slayer: Kimetsu no Yaiba, Vol. 1',
    whyWePicked: [
      "VIZ Media's official English edition, so the translation, paper, and binding are the publisher's own rather than a scan-and-print.",
      'Volume 1 is the cleanest entry point in the series: the story starts here, and it stands alone if you never buy volume 2.',
      'Sold and shipped by Amazon.com directly, so a damaged copy is a straightforward return.',
    ],
    bestFor: 'Someone who liked the anime and wants to see where it came from, or the first book on a new shelf',
    watchOut:
      'Used copies from third-party sellers are listed on the same page at lower prices; check the seller before checking out.',
    description:
      "The first volume of Koyoharu Gotouge's Demon Slayer: Kimetsu no Yaiba in VIZ Media's official English paperback edition.",
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'demon-slayer-vol-1-viz',
    purchaseUrl: 'https://www.amazon.com/dp/1974700526',
    price: 6.71,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/81ZNkhqRvVL._SL1500_.jpg', alt: 'Demon Slayer: Kimetsu no Yaiba, Vol. 1 paperback', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Manga & Books',
    collections: ['collector-arc'],
    tags: ['manga', 'demon slayer', 'viz media', 'giftable'],
    alternatives: ['p014', 'p018'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p014',
    slug: 'jujutsu-kaisen-vol-1-viz',
    title: 'Jujutsu Kaisen, Vol. 1',
    whyWePicked: [
      "VIZ Media's official English edition of Gege Akutami's series, published under licence from Shueisha.",
      'The first volume covers the whole setup arc, so it reads as a complete story on its own.',
      'Priced like an ordinary paperback, which makes it the cheapest officially licensed item on this list.',
    ],
    bestFor: 'Fans of the anime who want the source material, or a low-cost gift for someone who already owns the figures',
    watchOut:
      'This is only volume 1; the series runs well past twenty volumes, so budget for the habit if it lands.',
    description:
      "The first volume of Gege Akutami's Jujutsu Kaisen in VIZ Media's official English paperback edition.",
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'jujutsu-kaisen-vol-1-viz',
    purchaseUrl: 'https://www.amazon.com/dp/1974710025',
    price: 8.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/81TmHlRleJL._SL1500_.jpg', alt: 'Jujutsu Kaisen, Vol. 1 paperback', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Manga & Books',
    collections: ['collector-arc'],
    tags: ['manga', 'jujutsu kaisen', 'viz media', 'giftable'],
    alternatives: ['p013', 'p024', 'p033'],
    addedAt: AMAZON_DATE,
  },

  // --- Apparel --------------------------------------------------------------
  {
    id: 'p015',
    slug: 'crown-limited-supply-anime-graphic-tee',
    title: 'Crown Limited Supply Oversized Anime Graphic Tee',
    whyWePicked: [
      'Oversized, vintage-washed cut, which is the silhouette this style of tee is actually about.',
      'Heat-applied front graphic rather than a direct-to-garment print, which tends to hold up better through washing.',
      'Listed as unisex sizing, so it works as a gift without knowing a specific cut.',
    ],
    bestFor: 'Gym or everyday streetwear with a Japanese-inspired print rather than a character on the chest',
    watchOut:
      'The brand is a marketplace storefront and the listing names no licensor or artist, so we have not been able to confirm the artwork is licensed or original. Price varies by size and colour.',
    description:
      'An oversized, vintage-washed graphic t-shirt from the Crown Limited Supply storefront with a Japanese-inspired anime print.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'crown-limited-supply-anime-graphic-tee',
    purchaseUrl: 'https://www.amazon.com/dp/B0H1MBT2GY',
    price: 32.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/817slMttdQL._AC_SL1500_.jpg', alt: 'Oversized vintage-washed anime graphic tee', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Apparel',
    collections: ['streetwear-arc'],
    tags: ['tee', 'oversized', 'streetwear', 'gym'],
    alternatives: ['p027', 'p028'],
    addedAt: AMAZON_DATE,
  },

  // --- Figures & Collectibles: licensed -------------------------------------
  {
    id: 'p016',
    slug: 'sega-figurizm-megumi-fushiguro-encounter',
    title: 'SEGA Figurizmα Megumi Fushiguro "Encounter" Figure',
    whyWePicked: [
      "SEGA's Figurizmα line is an officially licensed Jujutsu Kaisen product; SEGA is the manufacturer of record and the listing carries the licence statement.",
      'Roughly 7 in tall with a base stand included, so it displays straight out of the box without a separate riser.',
      "Ships from Amazon's warehouse even though a third party sells it, so delivery and returns follow Amazon's process.",
    ],
    bestFor: 'A single mid-size centrepiece for a shelf that already has Funko-scale pieces on it',
    watchOut:
      'Sold by a Japanese import shop (Soleil Japan), so the price sits above Japanese retail. Compare before buying if you are not in a hurry.',
    description:
      'SEGA\'s Figurizmα "Encounter" figure of Megumi Fushiguro from Jujutsu Kaisen, with display base.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'officially_licensed',
    goSlug: 'sega-figurizm-megumi-fushiguro-encounter',
    purchaseUrl: 'https://www.amazon.com/dp/B0CWDM5YPW',
    price: 54.8,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/51nCB20xiRL._AC_SL1000_.jpg', alt: 'SEGA Figurizmα Megumi Fushiguro figure on its base', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'jujutsu kaisen', 'sega', 'prize figure'],
    alternatives: ['p024', 'p033', 'p018'],
    addedAt: AMAZON_DATE,
    featured: true,
  },
  {
    id: 'p017',
    slug: 'abystyle-death-note-light-sfc-figure',
    title: 'ABYstyle Studio Death Note Light SFC Figure',
    whyWePicked: [
      "Sold by Abysse America, ABYstyle's own US arm, so you are buying from the licensee rather than a reseller.",
      'About 9.5 in tall including the scythe, which is large for this price bracket.',
      'The SFC line is stylised rather than scale-realistic, so it sits comfortably next to Funko and Nendoroid-sized pieces.',
    ],
    bestFor: "A Death Note fan's first display piece, or a desk corner that needs one tall object",
    watchOut:
      'Recommended for ages 14 and up. The scythe blade is thin PVC and will bow if the box is crushed in transit.',
    description:
      "ABYstyle Studio's SFC (Super Figure Collection) PVC figure of Light Yagami holding a scythe, from Death Note.",
    merchantId: 'amazon',
    sellerType: 'brand_direct',
    licenseStatus: 'officially_licensed',
    goSlug: 'abystyle-death-note-light-sfc-figure',
    purchaseUrl: 'https://www.amazon.com/dp/B0BN6S8MBY',
    price: 34.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/816LoQCSEeL._AC_SL1500_.jpg', alt: 'ABYstyle Death Note Light SFC figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'death note', 'abystyle', 'giftable'],
    alternatives: ['p025', 'p034'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p018',
    slug: 'banpresto-nezuko-kamado-vol-26-ver-b',
    title: 'Banpresto Demon Slayer Nezuko Kamado Vol. 26 (ver. B)',
    whyWePicked: [
      'A Bandai Spirits Banpresto prize figure; the box carries the Bandai Namco warning label that marks a licensed production run.',
      "About 6.3 in tall in Nezuko's signature pose, the version most people recognise.",
      'Sold and shipped by Amazon.com directly, so returns are straightforward.',
    ],
    bestFor: 'A recognisable Demon Slayer piece under $50',
    watchOut:
      'Prize figures are made for arcade machines in Japan. Paint quality is good, but not on par with scale figures at three times the price.',
    description:
      "Banpresto's Demon Slayer: Kimetsu no Yaiba Vol. 26 Nezuko Kamado (ver. B) prize figure, by Bandai Spirits.",
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'banpresto-nezuko-kamado-vol-26-ver-b',
    purchaseUrl: 'https://www.amazon.com/dp/B0B4V6ZDVT',
    price: 41.64,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/81rOuk5MrhL._AC_SL1500_.jpg', alt: 'Banpresto Nezuko Kamado Vol. 26 ver. B prize figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'demon slayer', 'banpresto', 'prize figure', 'giftable'],
    alternatives: ['p016', 'p013'],
    addedAt: AMAZON_DATE,
    featured: true,
  },
  {
    id: 'p020',
    slug: 'total-anime-sung-jinwoo-9-inch-statue',
    title: 'Total Anime Sung Jinwoo 9-Inch Collector Statue',
    whyWePicked: [
      "Jazwares' Total Anime line is a licensed Solo Leveling product; Jazwares is the manufacturer of record.",
      '9 in of PVC on an environmental base of black flames, so it reads as a statue rather than a toy.',
      'Sold and shipped by Amazon.com directly.',
    ],
    bestFor: "A Solo Leveling fan's shelf centrepiece at a prize-figure price",
    watchOut:
      'Total Anime is a mass-market line. Expect some paint bleed at the base and visible seams on the flames.',
    description:
      "Total Anime's 9-inch Sung Jinwoo collector statue from Solo Leveling, with a black-flame environmental display base.",
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'total-anime-sung-jinwoo-9-inch-statue',
    purchaseUrl: 'https://www.amazon.com/dp/B0DLLMT5F9',
    price: 34.5,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/71wn3EhVOiL._AC_SL1500_.jpg', alt: 'Total Anime Sung Jinwoo 9-inch statue on its base', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'solo leveling', 'jazwares', 'statue'],
    alternatives: ['p022', 'p026'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p022',
    slug: 'total-anime-asta-6-5-inch-figure',
    title: 'Total Anime Asta 6.5-Inch Articulated Figure',
    whyWePicked: [
      "A licensed Black Clover figure from Jazwares' Total Anime line.",
      '30-plus points of articulation, swappable faceplates and hands, and two swords, which is a lot of figure for the price.',
      'Sold and shipped by Amazon.com directly.',
    ],
    bestFor: 'Posing and photographing rather than static display, and a good first figure for a younger fan',
    watchOut:
      'Joints can be tight out of the box. Warm them in your hands before swapping parts or you risk a snapped peg.',
    description:
      "Total Anime's 6.5-inch articulated Asta figure from Black Clover, with swappable faceplates, alternate hands, and two swords.",
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'total-anime-asta-6-5-inch-figure',
    purchaseUrl: 'https://www.amazon.com/dp/B0CNKRG4SS',
    price: 18.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/717cwjru3wL._AC_SL1500_.jpg', alt: 'Total Anime Asta 6.5-inch articulated figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'black clover', 'jazwares', 'articulated', 'giftable'],
    alternatives: ['p020', 'p024'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p024',
    slug: 'funko-pop-jujutsu-kaisen-sukuna',
    title: 'Funko Pop! Animation: Jujutsu Kaisen – Sukuna',
    whyWePicked: [
      "Funko is a licensed Jujutsu Kaisen manufacturer; this is a mainline Pop!, not a third-party 'Pop-style' vinyl.",
      'Standard 3.75 in Pop! scale, so it fits existing Pop! shelving and protectors.',
      'Sold and shipped by Amazon.com directly.',
    ],
    bestFor: 'Adding to an existing Pop! wall, or a low-risk gift',
    watchOut:
      'Funko boxes arrive dented from Amazon more often than from specialist shops. If a mint box matters to you, buy it elsewhere.',
    description: 'Funko Pop! Animation vinyl figure of Ryomen Sukuna in robes, from Jujutsu Kaisen.',
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'funko-pop-jujutsu-kaisen-sukuna',
    purchaseUrl: 'https://www.amazon.com/dp/B0CND27VG5',
    price: 15.49,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/71-M0eCb5iL._AC_SL1300_.jpg', alt: 'Funko Pop! Sukuna vinyl figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'jujutsu kaisen', 'funko', 'giftable'],
    alternatives: ['p033', 'p016'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p025',
    slug: 'abystyle-death-note-misa-sfc-figure',
    title: 'ABYstyle Studio Death Note Misa SFC Figure',
    whyWePicked: [
      'Sold by Abysse America, the licensee, so provenance is not in question.',
      'Packaged with Death Note branding, which matters if it is a gift.',
      'Same SFC line and scale as the Light figure, so the two display as a pair.',
    ],
    bestFor: 'Completing the pair with the Light SFC figure',
    watchOut:
      'Listed at a noticeably higher price than the Light figure from the same line, for a smaller piece.',
    description:
      "ABYstyle Studio's SFC PVC figure of Misa Amane holding a Death Note, from Death Note.",
    merchantId: 'amazon',
    sellerType: 'brand_direct',
    licenseStatus: 'officially_licensed',
    goSlug: 'abystyle-death-note-misa-sfc-figure',
    purchaseUrl: 'https://www.amazon.com/dp/B0BJL3JL4M',
    price: 49.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/71FF--632BL._AC_SL1500_.jpg', alt: 'ABYstyle Death Note Misa SFC figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'death note', 'abystyle'],
    alternatives: ['p017', 'p034'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p033',
    slug: 'funko-pop-jujutsu-kaisen-gojo',
    title: 'Funko Pop! Animation: Jujutsu Kaisen – Gojo',
    whyWePicked: [
      'A mainline, licensed Funko Pop!; Funko is the manufacturer of record.',
      'Standard 3.75 in Pop! scale, so it fits existing shelving and protectors.',
      'Sold and shipped by Amazon.com directly.',
    ],
    bestFor: 'The obvious Jujutsu Kaisen starter piece, and the one people ask for by name',
    watchOut:
      'Several Gojo Pop! variants exist at very different prices. Check the box number against the one you want before buying.',
    description: 'Funko Pop! Animation vinyl figure of Satoru Gojo, from Jujutsu Kaisen.',
    merchantId: 'amazon',
    sellerType: 'licensed_retailer',
    licenseStatus: 'officially_licensed',
    goSlug: 'funko-pop-jujutsu-kaisen-gojo',
    purchaseUrl: 'https://www.amazon.com/dp/B09HLBVD56',
    price: 15.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/61BZzrj1feL._AC_SL1300_.jpg', alt: 'Funko Pop! Satoru Gojo vinyl figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'jujutsu kaisen', 'funko', 'giftable'],
    alternatives: ['p024', 'p016'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p035',
    slug: 'youtooz-pochita-9-inch-plush',
    title: 'Youtooz Pochita 9-Inch Plush',
    whyWePicked: [
      "Youtooz's official Chainsaw Man licence, stated on the listing and sold from Youtooz's own storefront.",
      "9 in tall, 100% PP cotton fill, and shipped in Youtooz's own waterproof mailer rather than a bag.",
      'Pochita is the one Chainsaw Man design that reads as cute rather than gory, which makes it giftable.',
    ],
    bestFor: "A Chainsaw Man fan's desk, or anyone who has seen the show and liked the dog",
    watchOut: "Intended for ages 15 and up according to Youtooz. Not a children's toy.",
    description: "Youtooz's officially licensed 9-inch Pochita plush from Chainsaw Man.",
    merchantId: 'amazon',
    sellerType: 'brand_direct',
    licenseStatus: 'officially_licensed',
    goSlug: 'youtooz-pochita-9-inch-plush',
    purchaseUrl: 'https://www.amazon.com/dp/B0BSMN8DFY',
    price: 34.97,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/616bv-qiXbL._AC_SL1500_.jpg', alt: 'Youtooz Pochita 9-inch plush', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['plush', 'chainsaw man', 'youtooz', 'giftable'],
    alternatives: ['p031', 'p024'],
    addedAt: AMAZON_DATE,
    featured: true,
  },

  // --- Figures & Collectibles: unverified -----------------------------------
  {
    id: 'p019',
    slug: 'akaza-koyuki-1-7-pvc-figure',
    title: 'Akaza and Koyuki 1/7 PVC Figure (RZAHUAHU)',
    whyWePicked: [
      'A two-character 1/7-scale piece at 10.6 in tall, a size that is rare under $100.',
      "Fulfilled from Amazon's warehouse, so shipping-damage claims go through Amazon rather than an overseas seller.",
      'The theatrical-release pairing is a scene fans asked for and few licensed makers have produced.',
    ],
    bestFor: 'Readers who have verified the maker for themselves and want the scene regardless',
    watchOut:
      'No manufacturer is named anywhere on the listing and the origin is given only as China. That is the profile of an unlicensed copy, which is why we have not cleared it.',
    description:
      'An unbranded 1/7-scale PVC figure of Akaza and Koyuki from the Demon Slayer film, sold by the RZAHUAHU storefront.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'akaza-koyuki-1-7-pvc-figure',
    purchaseUrl: 'https://www.amazon.com/dp/B0GVRWSDG2',
    price: 69.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/61a3ylfvX-L._AC_SL1200_.jpg', alt: 'Akaza and Koyuki 1/7-scale PVC figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'demon slayer', 'scale figure'],
    alternatives: ['p018', 'p016'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p021',
    slug: 'mabaiude-himiko-toga-sitting-figure',
    title: 'MABAIUDE Himiko Toga 16 cm Sitting Figure',
    whyWePicked: [
      'Small, at about 6.3 in in a sitting pose, so it fits a monitor stand or a car dashboard.',
      'Very cheap for a painted PVC piece.',
      'Sold and shipped by Amazon.com, so it can go back easily if the paint is rough.',
    ],
    bestFor: 'Readers who want a desk-sized Toga and have checked the maker themselves',
    watchOut:
      'The listing names no licensor, muddles character names in its own copy, and the brand has no presence outside marketplaces. We have not been able to verify a licence.',
    description:
      'A 16 cm sitting-pose Himiko Toga PVC figure from My Hero Academia, sold under the MABAIUDE brand.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'mabaiude-himiko-toga-sitting-figure',
    purchaseUrl: 'https://www.amazon.com/dp/B0FSKFS27D',
    price: 11.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/61+z5YmBi5L._AC_SL1500_.jpg', alt: 'Himiko Toga sitting-pose PVC figure', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'my hero academia', 'desk'],
    alternatives: ['p024', 'p022'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p023',
    slug: 'sega-figurizm-mahoraga',
    title: 'SEGA Figurizmα Jujutsu Kaisen Mahoraga Figure',
    whyWePicked: [
      "An official SEGA Figurizmα prize figure of Mahoraga, the Eight-Handled Sword Divergent Sila Divine General; SEGA is the manufacturer of record and the line is licensed for Jujutsu Kaisen.",
      'About 8.5 in tall with the purple energy effect sculpted into the base, so it reads as a scene rather than a standing figure.',
      "Fulfilled by Amazon from a Japanese import shop's stock.",
    ],
    bestFor: 'A Jujutsu Kaisen shelf that already has Megumi on it: this is his shikigami',
    watchOut:
      'The Amazon listing title is a machine translation of the Japanese name, so it is hard to find by search. It is sold by a Japanese import shop at import pricing.',
    description:
      "SEGA's Figurizmα prize figure of Mahoraga from Jujutsu Kaisen, sold by a Japanese import shop.",
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'officially_licensed',
    goSlug: 'sega-figurizm-mahoraga',
    purchaseUrl: 'https://www.amazon.com/dp/B0GVBF48QB',
    price: 59.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/61z-EASoIQL._AC_SL1206_.jpg', alt: 'SEGA Figurizmα Mahoraga figure with purple energy base', source: 'merchant_listing' }],
    lastVerifiedAt: '2026-09-15',
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['figure', 'jujutsu kaisen', 'sega', 'prize figure', 'import'],
    alternatives: ['p016', 'p024', 'p033'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p031',
    slug: 'slime-plush-pillow-obanai',
    title: 'Slime Plush Pillow (Obanai)',
    whyWePicked: [
      'Two sizes (28 cm and 45 cm), so there is a desk version and a sofa version.',
      'PP cotton fill, which holds its shape better than cheaper polyester fill.',
      "Fulfilled from Amazon's warehouse.",
    ],
    bestFor: 'A soft desk companion for a That Time I Got Reincarnated as a Slime fan',
    watchOut:
      'The listing avoids naming the series and the seller makes no licence statement, which is the usual pattern for an unlicensed plush. It arrives vacuum-packed and needs a day to regain its shape.',
    description: 'A slime-shaped plush pillow in two sizes, sold by the Obanai storefront.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'slime-plush-pillow-obanai',
    purchaseUrl: 'https://www.amazon.com/dp/B09MRXRVR8',
    price: 21.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/41Nv271vA7L._AC_SL1005_.jpg', alt: 'Slime-shaped plush pillow', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Figures & Collectibles',
    collections: ['collector-arc'],
    tags: ['plush', 'pillow', 'desk'],
    alternatives: ['p035'],
    addedAt: AMAZON_DATE,
  },

  // --- Desk & Room ----------------------------------------------------------
  {
    id: 'p026',
    slug: 'otaku-lamps-sung-jinwoo-light-box',
    title: 'Otaku Lamps Sung Jinwoo LED Light Box',
    whyWePicked: [
      'A light box rather than a figure, so it actually does something on a desk: 16-colour RGB, DC power cord included.',
      "Otaku Lamps holds a Solo Leveling licence: this light box is listed in the Officially Licensed collection on its own store, and it ships from Amazon's warehouse.",
      'Roughly 9 in wide and 5 in tall, sized for a monitor shelf rather than a display cabinet.',
    ],
    bestFor: 'Ambient light on a desk or bedside for a Solo Leveling fan',
    watchOut:
      "Otaku Lamps' own store sells the same item as the 'Jinwoo Arise Light Box', sometimes for less than the Amazon listing. Compare before buying.",
    description:
      "Otaku Lamps' 3D LED light box of Sung Jinwoo from Solo Leveling, with 16-colour RGB lighting and a DC power cord.",
    merchantId: 'amazon',
    sellerType: 'brand_direct',
    licenseStatus: 'officially_licensed',
    goSlug: 'otaku-lamps-sung-jinwoo-light-box',
    purchaseUrl: 'https://www.amazon.com/dp/B0DJN491FT',
    price: 39.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/81OWdCrRd2L._AC_SL1500_.jpg', alt: 'Otaku Lamps Sung Jinwoo LED light box, lit', source: 'merchant_listing' }],
    lastVerifiedAt: '2026-09-15',
    linkStatus: 'ok',
    category: 'Desk & Room',
    collections: ['desk-and-room-arc'],
    tags: ['lamp', 'led', 'solo leveling', 'desk', 'giftable'],
    alternatives: ['p030', 'p020'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p030',
    slug: 'abystyle-naruto-kunai-3d-mug',
    title: 'ABYstyle Naruto Shippuden 3D Kunai Mug',
    whyWePicked: [
      'ABYstyle is a licensed Naruto Shippuden manufacturer and sells this from its own US storefront, Abysse America.',
      '460 ml capacity with a sculpted kunai handle, so it is a working mug rather than a display piece.',
      'Dolomite ceramic body; the sculpted handle is the only unusual part to look after.',
    ],
    bestFor: 'A desk mug with a recognisable reference that does not shout',
    watchOut: 'Not microwave or dishwasher safe, and only three were in stock when we checked.',
    description:
      "ABYstyle's officially licensed Naruto Shippuden 460 ml ceramic mug with a 3D kunai-shaped handle.",
    merchantId: 'amazon',
    sellerType: 'brand_direct',
    licenseStatus: 'officially_licensed',
    goSlug: 'abystyle-naruto-kunai-3d-mug',
    purchaseUrl: 'https://www.amazon.com/dp/B0B94M1J74',
    price: 24.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/71xIXAQW24L._AC_SL1500_.jpg', alt: 'ABYstyle Naruto Shippuden mug with 3D kunai handle', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Desk & Room',
    collections: ['desk-and-room-arc'],
    tags: ['mug', 'naruto', 'abystyle', 'desk', 'giftable'],
    alternatives: ['p026', 'p035'],
    addedAt: AMAZON_DATE,
    featured: true,
  },

  // --- Wall Art -------------------------------------------------------------
  {
    id: 'p034',
    slug: 'death-note-character-collage-poster-24x36',
    title: 'Death Note Character Collage Poster, 24 × 36 in',
    whyWePicked: [
      'Standard 24 × 36 in, so any off-the-shelf frame fits.',
      "Poster Stop Online is a long-running poster retailer whose stock is mostly licensed publishers' prints.",
      'Sold and shipped by Amazon.com directly.',
    ],
    bestFor: 'A cheap, frameable focal point for a wall that has nothing on it yet',
    watchOut:
      'The listing does not name the publisher (Trends International, GB eye, and similar licensed printers usually appear), so we cannot confirm the licence for this particular print.',
    description:
      'A 24 × 36 in unframed Death Note character collage poster sold through Poster Stop Online.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'death-note-character-collage-poster-24x36',
    purchaseUrl: 'https://www.amazon.com/dp/B01879UCO4',
    price: 14.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/716ASj7z2GL._AC_SL1000_.jpg', alt: 'Death Note character collage poster, 24 by 36 inches', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Wall Art',
    collections: ['desk-and-room-arc'],
    tags: ['poster', 'death note', 'wall'],
    alternatives: ['p017', 'p025'],
    addedAt: AMAZON_DATE,
  },

  // --- Accessories ----------------------------------------------------------
  {
    id: 'p027',
    slug: 'kozuki-solo-leveling-holographic-car-sticker',
    title: 'KOZUKI Solo Leveling Holographic Vinyl Sticker',
    whyWePicked: [
      'Holographic waterproof vinyl rated for outdoor use, so it survives a car, a helmet, or a laptop lid.',
      'Cheap enough to be an add-on to a larger order.',
      "Fulfilled from Amazon's warehouse.",
    ],
    bestFor: 'A laptop lid or a car that already has one sticker on it',
    watchOut:
      'No licensor is named and the brand has no footprint outside Amazon; the artwork is almost certainly unlicensed fan art. Stock was down to two units when we checked.',
    description:
      'A holographic, waterproof vinyl decal of Sung Jin-Woo from Solo Leveling for cars, laptops, and helmets.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'kozuki-solo-leveling-holographic-car-sticker',
    purchaseUrl: 'https://www.amazon.com/dp/B0FJXGM1R5',
    price: 10.77,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/719xG8DLPLL._AC_SL1500_.jpg', alt: 'Holographic Solo Leveling vinyl sticker', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Accessories',
    collections: ['streetwear-arc'],
    tags: ['sticker', 'solo leveling', 'car', 'laptop'],
    alternatives: ['p026', 'p028'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p028',
    slug: 'gon-killua-iphone-17-pro-max-glass-case',
    title: 'Gon & Killua Tempered-Glass Case for iPhone 17 Pro Max',
    whyWePicked: [
      'Tempered-glass back with a TPU bumper, which is the construction that actually protects a phone.',
      'Cut specifically for the iPhone 17 Pro Max, with button covers rather than cut-outs.',
      "Fulfilled from Amazon's warehouse.",
    ],
    bestFor: 'Readers who want a Hunter × Hunter case for a current iPhone',
    watchOut:
      'Sold by a trading company with no licence statement, and the artwork is unattributed. We have not cleared it.',
    description:
      'A tempered-glass iPhone 17 Pro Max case printed with Gon and Killua artwork from Hunter × Hunter.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'gon-killua-iphone-17-pro-max-glass-case',
    purchaseUrl: 'https://www.amazon.com/dp/B0GV3TBR4P',
    price: 13.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/71aS3XjkFlL._AC_SL1500_.jpg', alt: 'Gon and Killua tempered-glass iPhone case', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Accessories',
    collections: ['streetwear-arc'],
    tags: ['phone case', 'hunter x hunter', 'iphone'],
    alternatives: ['p029', 'p027'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p029',
    slug: 'evangelion-manga-design-iphone-17-case',
    title: 'Evangelion Manga-Design Case for iPhone 17',
    whyWePicked: [
      "Two-part polycarbonate shell with a TPU liner, printed in the USA through Amazon's print-on-demand service.",
      'Sold and shipped by Amazon.com, so returns are simple.',
      'Fits the base-model iPhone 17.',
    ],
    bestFor: 'Fans of the series who want a low-key case rather than a character portrait',
    watchOut:
      "The brand field says 'Evangelion', but the manufacturer is Merch by Amazon, a print-on-demand service. An individual uploaded this design, and we cannot confirm they hold a licence.",
    description: 'A print-on-demand iPhone 17 case with an Evangelion-themed manga design.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'evangelion-manga-design-iphone-17-case',
    purchaseUrl: 'https://www.amazon.com/dp/B0FY8YL6WF',
    price: 24.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/51JBcyi2wHL._AC_SL1500_.jpg', alt: 'Evangelion-themed iPhone 17 case', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Accessories',
    collections: ['streetwear-arc'],
    tags: ['phone case', 'evangelion', 'iphone'],
    alternatives: ['p028'],
    addedAt: AMAZON_DATE,
  },
  {
    id: 'p032',
    slug: 'toji-fushiguro-inverted-spear-necklace',
    title: 'Toji Fushiguro "Inverted Spear of Heaven" Necklace',
    whyWePicked: [
      'Listed as 925 sterling silver, which is unusual at this price for fan jewellery.',
      'Small enough to wear daily; the reference is only legible to people who know the series.',
      "Fulfilled from Amazon's warehouse.",
    ],
    bestFor: 'A subtle Jujutsu Kaisen gift for someone who does not want a figure',
    watchOut:
      "The silver claim is the seller's own and unverified, no licensor is named, and the price is high for an unattributed maker.",
    description:
      'A sterling-silver pendant necklace modelled on the Inverted Spear of Heaven from Jujutsu Kaisen, sold by the Fuguangju storefront.',
    merchantId: 'amazon',
    sellerType: 'marketplace',
    licenseStatus: 'unverified',
    goSlug: 'toji-fushiguro-inverted-spear-necklace',
    purchaseUrl: 'https://www.amazon.com/dp/B0DD2WP2RN',
    price: 76.99,
    currency: 'USD',
    priceCheckedAt: '2026-09-15',
    images: [{ src: 'https://m.media-amazon.com/images/I/61dSAN2k5kL._AC_SL1500_.jpg', alt: 'Inverted Spear of Heaven pendant necklace', source: 'merchant_listing' }],
    lastVerifiedAt: AMAZON_DATE,
    linkStatus: 'ok',
    category: 'Accessories',
    collections: ['streetwear-arc'],
    tags: ['necklace', 'jewellery', 'jujutsu kaisen', 'giftable'],
    alternatives: ['p024', 'p033'],
    addedAt: AMAZON_DATE,
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

/**
 * Category navigation gate.
 *
 * A category earns a header link and a homepage row only once it has this
 * many purchasable picks. Below that, the link sends a shopper to a page that
 * is empty or nothing but "still checking" panels, which reads as a broken
 * store rather than a small one. The category pages themselves stay
 * reachable by direct URL; only the ways in are gated.
 */
export const MIN_NAV_PICKS = 2

/** The order categories appear in the header and on the home page. */
export const NAV_ORDER: Category[] = [
  'Figures & Collectibles',
  'Manga & Books',
  'Desk & Room',
  'Wall Art',
  'Apparel',
  'Accessories',
  'Storage & Display',
]

/** Categories with enough purchasable picks to be worth linking to, in nav order. */
export function navCategories(picks: readonly Pick[] = PICKS): Category[] {
  return NAV_ORDER.filter(
    (c) => picks.filter((p) => p.category === c && isPurchasable(p)).length >= MIN_NAV_PICKS,
  )
}

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
