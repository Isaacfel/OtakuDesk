import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, ContactEmail } from '@/app/_legal/LegalShell'
import { SITE } from '@/lib/site'
import { PRICE_MAX_AGE_DAYS } from '@/data/types'

export const metadata: Metadata = {
  title: 'Terms of use',
  description:
    'Plain terms for using Otakudesk: what the site is, what it is not responsible for, and how its content may be used.',
}

/**
 * Terms of use. Short and honest. Most of what matters legally
 * follows from one fact: we are not a party to any purchase.
 */
export default function TermsPage() {
  return (
    <LegalPage
      label="Legal"
      title="Terms of use"
      lede="Short, because a guide does not need long terms. The one thing to understand is that we are never a party to your purchase."
    >
      <h2 id="what">What Otakudesk is</h2>
      <p>
        Otakudesk is an independent editorial shopping guide. We recommend
        products and link to the businesses that sell them. We do not sell,
        ship, or take payment for anything, and we are not the merchant of
        record for any purchase. When you buy, your contract is with the seller
        named on the pick, under that seller&rsquo;s terms, prices, shipping, and
        returns policy. Problems with an order go to them, not to us &mdash;
        every pick page names the seller and links to their policy.
      </p>

      <h2 id="affiliate">Affiliate links</h2>
      <p>
        We earn a commission on some purchases made through our links. Our{' '}
        <Link href="/disclosure">affiliate disclosure</Link> explains exactly
        how, and is part of these terms.
      </p>

      <h2 id="accuracy">Accuracy</h2>
      <p>
        We try to be right and we say when we are not sure. Even so: prices
        change after we record them (which is why every price is dated and
        hidden after {PRICE_MAX_AGE_DAYS} days); stock runs out; sellers change
        listings; and our licence labels reflect our own research on a given
        date, not a certification from any rights holder. The merchant&rsquo;s
        listing is always authoritative over ours. Check it before you buy.
      </p>

      <h2 id="ip">Intellectual property</h2>
      <p>
        Our writing, design, photography, and the Otakudesk name are ours.
        Product names, brand names, and franchise names that appear on this site
        belong to their respective owners and are used only to identify the
        products discussed. No affiliation with, sponsorship by, or endorsement
        from any studio, publisher, licensor, or merchant is implied.
      </p>
      <p>
        If you hold rights in an image or a work shown on this site and believe
        we are using it without permission, tell us via the{' '}
        <Link href="/contact">contact page</Link>. We remove first and discuss
        second.
      </p>

      <h2 id="use">Using this site</h2>
      <p>
        You may read, link to, and quote briefly from this site with
        attribution. You may not scrape the catalog, republish our picks or
        articles wholesale, or present our licence labels as your own
        verification. You may not use the site to do anything unlawful, which
        given what the site does would be difficult anyway.
      </p>

      <h2 id="liability">No warranty, limited liability</h2>
      <p>
        The site is provided as-is. To the fullest extent the law allows, we
        are not liable for any loss arising from a purchase you make from a
        third party, from a product we recommended, or from relying on
        information here that turned out to be out of date. Nothing in these
        terms limits rights that consumer law gives you and that cannot be
        limited by contract.
      </p>

      <h2 id="law">Governing law</h2>
      <p>
        These terms are governed by the laws of {SITE.jurisdiction}, and
        disputes go to the
        courts there, without prejudice to any mandatory consumer protections
        where you live.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        We may update these terms. The date at the top of the page is the
        current version. Continuing to use the site after a change means you
        accept it.
      </p>

      <h2 id="who">Who you are dealing with</h2>
      <p>
        This site is operated by {SITE.legalName}, {SITE.address}. Contact:{' '}
        <ContactEmail />.
      </p>
    </LegalPage>
  )
}
