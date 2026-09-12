import type { Pick, Merchant } from '@/data/types'
import { getMerchant } from '../data/merchants'

/**
 * Affiliate link construction — the one place in the codebase that knows how
 * each network wants its links tagged.
 *
 * Nothing outside lib/ and app/go/ should import this. Components link to
 * /go/[goSlug]; only the redirect handler resolves a real merchant URL.
 *
 * Security model, stated once so it can be checked in one place:
 *
 *   - The DESTINATION always comes from the catalog (`pick.purchaseUrl`).
 *     No request input is ever used as, or concatenated into, a URL.
 *   - The only request-derived value that reaches the outbound URL is the
 *     sub-id, and it passes through `normalizeFrom` + `buildSubId`, which
 *     reduce it to `[a-zA-Z0-9_-]` and cap its length. It is then attached
 *     with `URLSearchParams.set`, which encodes it again. There is no path by
 *     which it can add a query parameter, a fragment, or change the scheme.
 *
 * tests/affiliate.test.mts asserts both properties with hostile input.
 */

/** Network credentials. Absent in development, which is intentional. */
const CREDS = {
  amazonTag: process.env.AMAZON_TAG ?? '',
  awinAffId: process.env.AWIN_AFF_ID ?? '',
}

export class AffiliateConfigError extends Error {}

/**
 * Upper bound on the `from` query param the /go route accepts. Legitimate
 * values are short labels like `pick:neon-panel-desk-mat` or
 * `journal:licensed-vs-bootleg`; anything longer is noise or abuse.
 */
export const FROM_MAX_LENGTH = 64

const FROM_ALLOWED = /[^a-zA-Z0-9_:.-]/g

/**
 * Reduce the raw `from` query value to something safe to log and to pass
 * into `buildSubId`. Never throws; hostile or empty input degrades to
 * 'direct' rather than being rejected, because a refused click is lost
 * revenue and the attribution label is only diagnostic.
 */
export function normalizeFrom(raw: string | null | undefined): string {
  if (typeof raw !== 'string') return 'direct'
  const cleaned = raw.slice(0, FROM_MAX_LENGTH).replace(FROM_ALLOWED, '')
  return cleaned.length > 0 ? cleaned : 'direct'
}

/**
 * The sub-id carried into the network's own reporting.
 *
 * This is the difference between knowing you earned $40 last month and knowing
 * WHICH pick and WHICH article earned it. Networks cap sub-id length and are
 * inconsistent about permitted characters, so it is sanitised and truncated.
 */
export function buildSubId(pickSlug: string, from: string): string {
  return `${pickSlug}__${from}`.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 80)
}

/**
 * Parse a catalog destination and refuse anything that is not a web URL.
 *
 * The catalog is ours, so this is a guard against a data-entry mistake
 * (`javascript:`, a bare domain, an empty string) rather than an attacker —
 * but the redirect handler emits whatever this returns as a Location header,
 * so a mistake here would be served to every reader.
 */
function parseDestination(dest: string, pickSlug: string): URL {
  let u: URL
  try {
    u = new URL(dest)
  } catch {
    throw new AffiliateConfigError(`Pick ${pickSlug} has an unparseable purchaseUrl`)
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') {
    throw new AffiliateConfigError(
      `Pick ${pickSlug} purchaseUrl has a non-web scheme (${u.protocol})`,
    )
  }
  return u
}

/**
 * Build the tracked destination for a pick.
 *
 * Throws AffiliateConfigError when the network credential is missing, rather
 * than silently emitting an untagged link — an untagged link looks like it
 * works, converts fine for the merchant, and pays us nothing. Failing loudly
 * at the redirect is far better than losing revenue quietly for months.
 */
export function buildTrackedUrl(pick: Pick, subId: string): string {
  const merchant: Merchant = getMerchant(pick.merchantId)
  const dest = parseDestination(pick.purchaseUrl, pick.slug)

  switch (merchant.network) {
    case 'amazon': {
      if (!CREDS.amazonTag) throw new AffiliateConfigError('AMAZON_TAG is not set')
      const u = new URL(dest)
      u.searchParams.set('tag', CREDS.amazonTag)
      u.searchParams.set('ascsubtag', subId)
      return u.toString()
    }

    case 'awin': {
      if (!CREDS.awinAffId) throw new AffiliateConfigError('AWIN_AFF_ID is not set')
      if (!merchant.mid)
        throw new AffiliateConfigError(`Merchant ${merchant.id} has no Awin mid`)
      const u = new URL('https://www.awin1.com/cread.php')
      u.searchParams.set('awinmid', merchant.mid)
      u.searchParams.set('awinaffid', CREDS.awinAffId)
      u.searchParams.set('clickref', subId)
      u.searchParams.set('ued', dest.toString())
      return u.toString()
    }

    case 'impact': {
      if (!merchant.trackingBase)
        throw new AffiliateConfigError(
          `Merchant ${merchant.id} has no Impact trackingBase`,
        )
      const u = new URL(merchant.trackingBase)
      u.searchParams.set('u', dest.toString())
      u.searchParams.set('subId1', subId)
      return u.toString()
    }

    case 'direct': {
      const u = new URL(dest)
      u.searchParams.set('utm_source', 'otakudesk')
      u.searchParams.set('utm_medium', 'referral')
      u.searchParams.set('utm_campaign', subId)
      return u.toString()
    }
  }
}

/**
 * The href every outbound link in the UI uses. `from` records which page
 * produced the click so attribution survives into the network report.
 */
export function goHref(pick: Pick, from: string): string {
  return `/go/${pick.goSlug}?from=${encodeURIComponent(from)}`
}

/** Required verbatim by the Amazon Associates operating agreement once joined. */
export const AMAZON_ATTESTATION =
  'As an Amazon Associate we earn from qualifying purchases.'

/** Shown adjacent to every outbound button. Short by design — it must be read. */
export const INLINE_DISCLOSURE =
  'We earn a commission if you buy through this link, at no extra cost to you.'
