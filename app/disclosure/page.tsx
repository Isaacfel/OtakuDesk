import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, Placeholder } from '@/app/_legal/LegalShell'
import { MERCHANTS } from '@/data/merchants'
import { PRICE_MAX_AGE_DAYS, type AffiliateNetwork } from '@/data/types'
import { INLINE_DISCLOSURE, AMAZON_ATTESTATION } from '@/lib/affiliate'

export const metadata: Metadata = {
  title: 'Affiliate disclosure',
  description:
    'How Otakudesk is paid: commission on referred purchases, which programs, and what does not influence a pick.',
}

const NETWORK_LABEL: Record<AffiliateNetwork, string> = {
  amazon: 'Amazon Associates',
  awin: 'Awin',
  impact: 'Impact',
  direct: 'Direct',
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * The affiliate disclosure.
 *
 * The programs table is generated from data/merchants.ts, so this page cannot
 * name a partnership the data does not support. A merchant with an empty
 * `termsVerifiedAt` has not been approved and is shown as such; the Amazon
 * attestation appears only once an Amazon program is actually verified.
 */
export default function DisclosurePage() {
  const programs = MERCHANTS.filter((m) => m.id !== 'sample')
  const approved = programs.filter((m) => Boolean(m.termsVerifiedAt))
  const pending = programs.filter((m) => !m.termsVerifiedAt)
  const usesAmazon = MERCHANTS.some(
    (m) => m.network === 'amazon' && Boolean(m.termsVerifiedAt),
  )

  return (
    <LegalPage
      label="Legal"
      title="Affiliate disclosure"
      lede="Otakudesk earns a commission when you buy through our links, at no extra cost to you. It does not change which products we pick or what we say about them. The rest of this page is the detail."
    >
      <h2 id="short">The short version</h2>
      <p>
        Some links on this site are affiliate links. If you click one and buy
        something, the merchant pays us a percentage of the sale. You pay the
        merchant&rsquo;s normal price. We never see your payment details or your
        order; we receive aggregate reports from the affiliate program later.
      </p>
      {usesAmazon && <p>{AMAZON_ATTESTATION}</p>}

      <h2 id="how">How the links work</h2>
      <p>
        Every buy button on a pick page points to a redirect on this site
        (<code>/go/&hellip;</code>), which forwards you to the merchant with a
        tag identifying us as the referrer. Beside every one of those buttons is
        this sentence, in full:
      </p>
      <blockquote>
        <p>{INLINE_DISCLOSURE}</p>
      </blockquote>
      <p>
        There is no code path on the site that produces an outbound purchase
        link without that sentence next to it. Every such link is also marked{' '}
        <code>rel=&quot;sponsored&quot;</code> so that search engines treat it as
        paid. Links in our journal articles go to pick pages on this site, never
        straight to a shop.
      </p>

      <h2 id="programs">Which programs</h2>
      <p>
        The table below is generated from the same data the site runs on, so it
        cannot list a relationship we do not have.
      </p>
      {approved.length === 0 && (
        <p>
          <strong>
            As of the date on this page, we have not been approved by any
            affiliate program and no live affiliate link exists on this site.
          </strong>{' '}
          The programs listed are ones we intend to apply to. Naming them here
          is a statement of intent, not of partnership, and none of these
          companies has endorsed or reviewed Otakudesk.
        </p>
      )}
      <table>
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Network</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {programs.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{NETWORK_LABEL[m.network]}</td>
              <td>
                {m.termsVerifiedAt
                  ? `Approved · terms last reviewed ${formatDate(m.termsVerifiedAt)}`
                  : 'Not yet approved · no links live'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {approved.length > 0 && pending.length > 0 && (
        <p>
          Merchants marked &ldquo;not yet approved&rdquo; carry no live links.
          They are listed so this page changes only by adding a date, never by
          adding a name you have not seen before.
        </p>
      )}
      <p>
        We re-read every program&rsquo;s terms &mdash; commission rate, image
        rights, and email rules &mdash; at least quarterly, and the date shown is
        the last time that happened. Commission rates are not published here
        because they vary by product category and change without notice; if
        you want to know what a specific click could earn us, ask via the{' '}
        <Link href="/contact">contact page</Link> and we will tell you.
      </p>

      <h2 id="influence">What does not influence a pick</h2>
      <ul>
        <li>No merchant pays for placement or can buy a pick.</li>
        <li>No merchant sees a pick before it is published or edits our copy.</li>
        <li>
          Picks are not ordered by commission rate, and a higher rate does not
          break a tie between two equally good products.
        </li>
        <li>
          A product with no affiliate program can still be a pick. The
          commission is a consequence of choosing it, not a condition.
        </li>
        <li>
          Sample listings and picks marked <em>Verifying</em> have no buy button
          and cannot earn anything.
        </li>
      </ul>

      <h2 id="prices">Prices</h2>
      <p>
        Every price on the site is shown with the date we last checked it. A
        price older than {PRICE_MAX_AGE_DAYS} days is hidden rather than shown
        stale. The merchant&rsquo;s own listing is always authoritative; if the
        two disagree, the merchant is right and we would like to{' '}
        <Link href="/contact">hear about it</Link>.
      </p>

      <h2 id="email">Email</h2>
      <p>
        If you join our mailing list, emails link to pages on this site, never
        directly to a merchant with an affiliate tag. Several programs forbid
        affiliate links in email; we apply that rule to all of them.
      </p>

      <h2 id="entity">Who is disclosing</h2>
      <p>
        This disclosure is made by the operator of Otakudesk:{' '}
        <Placeholder what="legal entity name" />, located at{' '}
        <Placeholder what="business address" />. Questions about this page:{' '}
        <Placeholder what="contact email" />.
      </p>
    </LegalPage>
  )
}
