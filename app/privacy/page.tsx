import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, ContactEmail } from '@/app/_legal/LegalShell'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What Otakudesk collects, what it does not, and how to exercise your rights under GDPR and CCPA.',
}

/**
 * Privacy policy.
 *
 * Written from what the code actually does today: no analytics script, an
 * anonymous outbound click log, and a double opt-in email list. If a provider
 * or a data category is added, this page changes in the same PR.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      label="Legal"
      title="Privacy"
      lede="We run a shopping guide, not a shop. We have no accounts, take no payments, and sell no data. Here is the whole of what we collect and why."
    >
      <h2 id="collect">What we collect</h2>
      <h3>Analytics</h3>
      <p>
        None. We load no analytics script and set no analytics cookies.
      </p>
      <h3>Outbound clicks</h3>
      <p>
        When you click a buy button, we log the product, the page you clicked
        from, and the time. No IP address, cookie, or other identifier is stored
        with it. The log is stored with our hosting provider, Cloudflare, and
        kept for up to 13 months. This is how we know which article earned a
        commission, and it is the only independent check on whether an
        affiliate network is reporting honestly.
      </p>
      <h3>Affiliate tracking on the merchant&rsquo;s site</h3>
      <p>
        Once you leave for a merchant, that merchant and its affiliate network
        set their own cookies to attribute any purchase to us. That happens on
        their site under their privacy policy, not ours. We later receive
        aggregate reports &mdash; number of sales, commission earned &mdash;
        and never your identity, address, or order contents.
      </p>
      <h3>Email list</h3>
      <p>
        If you sign up, we store your email address, the date you signed up, and
        the date you confirmed, in a Cloudflare KV store on our account. Nothing
        is sent until you click the confirmation link in the first email.
        Emails are delivered by Resend, which processes your address to send
        them. Every issue carries a one-click unsubscribe link, and
        unsubscribing deletes your record. Unconfirmed signups are deleted
        automatically after seven days. We do not add anyone who has not signed
        up, and we do not buy or import lists.
      </p>
      <h3>Contact</h3>
      <p>
        If you write to us, we keep the correspondence for as long as needed to
        deal with it.
      </p>

      <h2 id="not">What we do not do</h2>
      <ul>
        <li>We do not sell, rent, or trade personal data. To anyone. Ever.</li>
        <li>We have no user accounts and store no passwords.</li>
        <li>
          We never take payment, so we never see card numbers, addresses, or
          orders.
        </li>
        <li>We do not run third-party advertising or ad-tracking pixels.</li>
        <li>
          We do not place affiliate links in email, so opening a newsletter does
          not tag you for any merchant.
        </li>
      </ul>

      <h2 id="rights">Your rights (GDPR, UK GDPR, CCPA and similar)</h2>
      <p>
        Wherever you are, you can ask us to tell you what personal data we hold
        about you, correct it, delete it, or stop using it. Given what we
        collect, the honest answer will usually be &ldquo;an email address, if
        you subscribed&rdquo; or &ldquo;nothing we can tie to you&rdquo;. To
        exercise any of these rights, contact <ContactEmail subject="Privacy request" />.
        We will respond within the
        period the applicable law requires (one month under GDPR; 45 days under
        CCPA). We will not discriminate against you for making a request.
      </p>
      <p>
        If you are in the EU or UK and believe we have handled your data
        unlawfully, you may complain to your national supervisory authority.
      </p>

      <h2 id="controller">Who is responsible</h2>
      <p>
        The data controller for this site is {SITE.legalName}, {SITE.address}.
        EU/UK representative: not required.
      </p>

      <h2 id="children">Children</h2>
      <p>
        This site is not directed at children and we do not knowingly collect
        data from anyone under 16. If you believe a child has subscribed to our
        list, tell us and we will remove them.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        When this policy changes, the date at the top of the page changes with
        it. If a change is material &mdash; a new category of data, a new
        provider &mdash; we will say so in the newsletter as well.
      </p>

      <p>
        Questions about any of this: the <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  )
}
