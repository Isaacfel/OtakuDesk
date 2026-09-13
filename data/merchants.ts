import type { Merchant } from './types'

/**
 * The merchant registry.
 *
 * Network credentials (Awin affiliate id, the Amazon tag) are read from the
 * environment in lib/affiliate.ts, never hardcoded here — this file is public
 * catalog metadata and gets committed.
 *
 * `termsVerifiedAt` is the date someone last read the program's terms in full.
 * Programs change commission rates, image-use rights, and email rules AFTER
 * you have built around them; that is the failure mode, not the initial check.
 * Re-verify quarterly and update the date. Anything older than a quarter is a
 * claim we can no longer support.
 *
 * Entries with an empty `termsVerifiedAt` are placeholders for programs we
 * have applied to but not yet been approved for. They carry no picks until
 * approval lands and a real product has been researched and verified by hand.
 * Amazon is the first live program.
 */
export const MERCHANTS: Merchant[] = [
  {
    id: 'sample',
    name: 'Example Seller',
    network: 'direct',
    blurb:
      'Placeholder seller used by the sample catalog. No real purchase path is configured.',
    termsVerifiedAt: '2026-09-11',
    termsNotes: ['Not a real program. Sample picks never link out.'],
  },
  {
    id: 'displate',
    name: 'Displate',
    network: 'impact',
    blurb:
      'Metal poster maker working with licensed artists and studios. Ships worldwide from Europe.',
    policyUrl: 'https://displate.com/shipping',
    termsVerifiedAt: '',
    termsNotes: [
      'UNVERIFIED — application not yet submitted.',
      'Confirm on approval: commission rate, image-use rights, email permission.',
    ],
  },
  {
    id: 'etsy',
    name: 'Etsy',
    network: 'awin',
    blurb:
      'Marketplace of independent makers. Seller quality varies, so we name the specific shop on every pick.',
    policyUrl: 'https://www.etsy.com/legal/policy/returns',
    termsVerifiedAt: '',
    termsNotes: [
      'UNVERIFIED — application not yet submitted.',
      'Awin mid must be recorded here on approval before any Etsy pick goes live.',
    ],
  },
  {
    id: 'crunchyroll-store',
    name: 'Crunchyroll Store',
    network: 'impact',
    blurb:
      'The official storefront for many series. The strongest licensing signal available in this category.',
    policyUrl: 'https://store.crunchyroll.com/pages/shipping',
    termsVerifiedAt: '',
    termsNotes: ['UNVERIFIED — application not yet submitted.'],
  },
  {
    id: 'hot-topic',
    name: 'Hot Topic',
    network: 'impact',
    blurb:
      'Large officially licensed anime apparel and decor range, with mainstream US shipping and returns.',
    termsVerifiedAt: '',
    termsNotes: ['UNVERIFIED — application not yet submitted.'],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    network: 'amazon',
    blurb:
      'Widest selection and fastest delivery, but listing quality and authenticity vary by seller.',
    termsVerifiedAt: '2026-09-13',
    termsNotes: [
      'Associates account is live; the tag is set as the AMAZON_TAG Worker secret, never here.',
      'Operating Agreement accepted at sign-up. Re-read it in full and bump this date each quarter.',
      'Product Advertising API gated behind 3 qualifying sales in 180 days — until then, no feed images.',
      'Affiliate links PROHIBITED in email — newsletters must link to our own pages.',
      'Displaying stale prices is prohibited; PriceStamp freshness rule is mandatory.',
      'Attestation sentence required verbatim on every page carrying their links.',
    ],
  },
]

const BY_ID = new Map(MERCHANTS.map((m) => [m.id, m]))

export function getMerchant(id: string): Merchant {
  const m = BY_ID.get(id)
  if (!m) throw new Error(`Unknown merchant: ${id}`)
  return m
}

/** Quarterly re-verification window. */
const TERMS_MAX_AGE_DAYS = 92

/**
 * Merchants whose terms need re-reading. Surfaced by `npm run audit` so this
 * becomes a scheduled chore rather than something remembered.
 */
export function merchantsNeedingTermsReview(now = Date.now()): Merchant[] {
  return MERCHANTS.filter((m) => {
    if (m.id === 'sample') return false
    if (!m.termsVerifiedAt) return true
    const age = now - new Date(m.termsVerifiedAt).getTime()
    return !Number.isFinite(age) || age > TERMS_MAX_AGE_DAYS * 864e5
  })
}
