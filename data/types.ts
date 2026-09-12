/**
 * The OtakuVault data contract.
 *
 * This is an AFFILIATE site: we never hold stock, set a price, take payment,
 * ship, or process returns. Every field below is shaped by that fact. If a
 * value is something only the merchant can know (real-time stock, a variant
 * selection, a returns policy), it does not live here — we link out instead.
 *
 * Three rules are enforced by the SHAPE of these types rather than by
 * discipline, because discipline does not survive month three:
 *
 *   1. `price` is nullable and always paired with `priceCheckedAt`, so a
 *      component cannot render a price without confronting its age.
 *   2. `licenseStatus: 'unverified'` and any `linkStatus` other than 'ok'
 *      must never produce an outbound CTA.
 *   3. Every image declares where it came from and under what permission.
 */

/** Which network handles the click, and therefore how the link is tagged. */
export type AffiliateNetwork = 'amazon' | 'awin' | 'impact' | 'direct'

/**
 * Who the reader is actually buying from. Shown on every pick, because
 * "who is selling this" is the question no marketplace listing answers.
 */
export type SellerType =
  | 'licensed_retailer'
  | 'brand_direct'
  | 'marketplace'
  | 'independent_artist'

/**
 * Our licensing verdict on the product itself.
 *
 * 'unverified' is a terminal state for display purposes: such a pick renders
 * a "we're still checking" panel and never an outbound link. There is
 * deliberately no 'do_not_publish' value — that is a workflow state that
 * belongs in the review pipeline, not in shipped catalog data.
 */
export type LicenseStatus =
  | 'officially_licensed'
  | 'original_design'
  | 'unverified'

/**
 * Link health, maintained by scripts/check-links.ts on a weekly schedule.
 * 'sample' marks seed data whose purchase integration is not configured —
 * it renders a placeholder state and is never presented as buyable.
 */
export type LinkStatus = 'ok' | 'broken' | 'discontinued' | 'sample'

/** Provenance for every image. If it cannot be attributed, it does not ship. */
export type ImageSource = 'merchant_feed' | 'press_kit' | 'own' | 'placeholder'

export type PickImage = {
  src: string
  alt: string
  source: ImageSource
}

export type Merchant = {
  id: string
  name: string
  network: AffiliateNetwork
  /** Awin merchant id. Required when network === 'awin'. */
  mid?: string
  /** Impact per-advertiser tracking domain. Required when network === 'impact'. */
  trackingBase?: string
  /** Shown on the pick page so the reader knows who they are buying from. */
  blurb: string
  /** Merchant's own shipping/returns page. We link, we do not restate. */
  policyUrl?: string
  /**
   * ISO date the program's terms were last read in full: commission rate,
   * image-use rights, and email rules. Programs change these AFTER you have
   * built around them, which is the dangerous version. Re-verify quarterly.
   */
  termsVerifiedAt: string
  /** Anything in this program's terms that constrains how we may use it. */
  termsNotes?: string[]
}

export type Pick = {
  id: string
  slug: string
  title: string

  // --- Editorial: the part that is actually ours ---------------------------
  /** Exactly three reasons. Replaces the fabricated ratings the spec required. */
  whyWePicked: [string, string, string]
  /** Who this suits: "small desks", "a first apartment", "someone who travels". */
  bestFor: string
  /** An honest caveat. Builds more trust than any badge; omit only if there is none. */
  watchOut?: string
  description: string

  // --- Merchant & money ----------------------------------------------------
  merchantId: string
  sellerType: SellerType
  licenseStatus: LicenseStatus
  /** Resolves at /go/[goSlug]. Never link to purchaseUrl directly. */
  goSlug: string
  /** Raw destination. Read only by the /go route, never rendered. */
  purchaseUrl: string

  // --- Price: always dated, never bare -------------------------------------
  price: number | null
  currency: 'USD'
  /** ISO date. A price older than PRICE_MAX_AGE_DAYS is suppressed at render. */
  priceCheckedAt: string

  // --- Provenance & health -------------------------------------------------
  images: PickImage[]
  lastVerifiedAt: string
  linkStatus: LinkStatus

  // --- Merchandising -------------------------------------------------------
  category: Category
  collections: string[]
  tags: string[]
  /** Pick ids, for the comparison block. Keep to 2–3. */
  alternatives: string[]
  /** ISO date added, powering /new-drops honestly. */
  addedAt: string
  featured?: boolean
}

export type Category =
  | 'Desk & Room'
  | 'Wall Art'
  | 'Accessories'
  | 'Apparel'
  | 'Storage & Display'

export const CATEGORIES: Category[] = [
  'Desk & Room',
  'Wall Art',
  'Accessories',
  'Apparel',
  'Storage & Display',
]

export type Collection = {
  slug: string
  name: string
  description: string
  /** One line of editorial framing for the collection index card. */
  blurb: string
}

/**
 * A curated set. NOT a bundle with a discount — no discount is ours to give.
 * Each item links out separately; the total is informational only.
 */
export type CuratedSet = {
  slug: string
  name: string
  description: string
  pickIds: string[]
}

/**
 * The catalog shape that is safe to hand to a Client Component.
 *
 * `purchaseUrl` is the raw, untagged merchant destination. A Client
 * Component's props are serialized into the RSC payload and shipped to the
 * browser, so passing a full `Pick` across that boundary publishes every
 * merchant URL in the page source — invisible to a reader, trivially readable
 * by anyone, and a route to the merchant that bypasses the /go tracking we are
 * paid through.
 *
 * A TypeScript `Omit` alone does NOT fix this: types are erased at runtime and
 * the property would still be serialized. The object has to be narrowed for
 * real, which is what `toCatalogPick` does at the boundary.
 */
export type CatalogPick = Omit<Pick, 'purchaseUrl'>

export function toCatalogPick(pick: Pick): CatalogPick {
  // Destructured out rather than deleted, so the returned object genuinely
  // lacks the key instead of carrying an undefined one.
  const { purchaseUrl: _withheld, ...safe } = pick
  return safe
}

// --- Display policy ---------------------------------------------------------

/**
 * Prices older than this are not displayed at all. Several affiliate programs
 * forbid showing stale prices; suppressing is always safe, guessing is not.
 */
export const PRICE_MAX_AGE_DAYS = 45

export function isPriceFresh(checkedAt: string, now = Date.now()): boolean {
  const age = now - new Date(checkedAt).getTime()
  return Number.isFinite(age) && age >= 0 && age < PRICE_MAX_AGE_DAYS * 864e5
}

/**
 * The single source of truth for "may this pick send a reader to a merchant?".
 * Both the /go route and the OutboundButton call this, so the UI and the
 * redirect can never disagree about whether a link is live.
 */
export function isPurchasable(pick: CatalogPick): boolean {
  return pick.licenseStatus !== 'unverified' && pick.linkStatus === 'ok'
}

export const LICENSE_LABEL: Record<LicenseStatus, string> = {
  officially_licensed: 'Officially licensed',
  original_design: 'Original design',
  unverified: 'Verifying',
}

export const SELLER_LABEL: Record<SellerType, string> = {
  licensed_retailer: 'Licensed retailer',
  brand_direct: 'Brand direct',
  marketplace: 'Marketplace seller',
  independent_artist: 'Independent artist',
}
