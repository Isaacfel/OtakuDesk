import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage, Placeholder } from '@/app/_legal/LegalShell'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Report a listing problem, raise a rights concern, or ask a question. We do not handle orders — the seller does.',
}

/**
 * Contact — draft. No real email exists yet, so every channel is a loud
 * placeholder. The structure matters more than the address: the "report a
 * listing problem" route is the one that keeps the catalog honest.
 */
export default function ContactPage() {
  return (
    <LegalPage
      label="Contact"
      title="Contact"
      lede="We read everything and answer listing problems first. One thing we cannot help with: your order. We never sold you anything — the seller named on the pick did, and every pick page links to their support and returns policy."
    >
      <h2 id="listing">Report a listing problem</h2>
      <p>
        This is the most useful thing you can send us. If any of these is true
        about a pick, tell us:
      </p>
      <ul>
        <li>The buy link is dead or goes to the wrong product.</li>
        <li>The price we show is wrong or out of date.</li>
        <li>You suspect the product is a bootleg or the seller is not who we say.</li>
        <li>The licence label looks wrong to you.</li>
        <li>The product has been discontinued or the seller has closed.</li>
      </ul>
      <p>Include, where you can:</p>
      <ol>
        <li>The pick&rsquo;s address on this site (it starts with <code>/desk/</code>).</li>
        <li>What is wrong, in a sentence.</li>
        <li>A screenshot if it is about a price or the listing itself.</li>
      </ol>
      <p>
        <strong>What we do with it:</strong> a dead link or wrong price is
        pulled the day we confirm it. A bootleg or seller concern moves the
        pick to <em>Verifying</em> immediately &mdash; which removes its buy
        button &mdash; while we re-check. We do not argue with a report before
        acting on it.
      </p>
      <p>
        Send it to: <Placeholder what="listing-problems contact email" />
      </p>

      <h2 id="rights">Rights holders and artists</h2>
      <p>
        If you own the rights to an image, design, or product shown here and
        believe we are using it without permission or describing it wrongly,
        write to us. We take the item down first and discuss it second; you do
        not need to send a formal notice to get that response, though you are
        welcome to. Please tell us which page, what the work is, and how we can
        verify you are the rights holder.
      </p>
      <p>
        Send it to: <Placeholder what="rights contact email" />
      </p>

      <h2 id="sellers">Sellers with a pick marked Verifying</h2>
      <p>
        If we have listed your product as <em>Verifying</em> and you want to
        speed the check up, the fastest route is to send us: a link to the
        product on your own site, a photo of the copyright line and licensee
        mark on the product or its packaging, and, for licensed goods, the name
        of the licensor and the territory your licence covers. For original
        designs, a link to your wider portfolio is usually enough. We do not
        accept payment to expedite verification and we do not accept payment
        for placement at all &mdash; see the{' '}
        <Link href="/disclosure">disclosure page</Link>.
      </p>
      <p>
        Send it to: <Placeholder what="seller contact email" />
      </p>

      <h2 id="else">Everything else</h2>
      <p>
        Suggestions for products to look at, corrections to an article,
        questions about how the site works, or press enquiries:{' '}
        <Placeholder what="general contact email" />
      </p>
      <p>
        We do not publish a phone number and do not offer live chat. We are a
        small team and would rather answer properly in writing than quickly on
        the phone.
      </p>
    </LegalPage>
  )
}
