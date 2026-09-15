import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { JournalGrid } from '@/components/JournalCard'
import { MERCHANTS } from '@/data/merchants'
import { PRICE_MAX_AGE_DAYS } from '@/data/types'
import { INLINE_DISCLOSURE, AMAZON_ATTESTATION } from '@/lib/affiliate'
import { loadAllPosts } from '@/app/journal/_posts'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Who runs Otakudesk, how products are chosen and checked, and how the site makes money.',
}

/**
 * About: short. Every claim about money and merchants comes from the data
 * layer, so the page cannot describe a program we are not in. The guides
 * (journal articles) are listed at the bottom.
 */
export default async function AboutPage() {
  const approved = MERCHANTS.filter((m) => Boolean(m.termsVerifiedAt))
  const usesAmazon = approved.some((m) => m.network === 'amazon')
  const posts = await loadAllPosts()

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
        <div className="max-w-[68ch]">
          <h1 className="text-2xl font-bold text-fg sm:text-3xl">About Otakudesk</h1>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-fg">
            <p>
              Otakudesk is a guide to anime figures, manga, and desk gear. We don&rsquo;t sell
              anything. Every product links to the seller&rsquo;s own listing, and we show the
              licence status, the seller, and a dated price before you get there.
            </p>

            <h2 className="pt-2 text-lg font-bold">How products are chosen</h2>
            <p>
              Each item is added by hand. We check who is selling it and whether the maker holds
              a licence for the series. Products from known licensees are marked{' '}
              <strong>Officially licensed</strong>. Anything we can&rsquo;t trace to a licensee is
              marked <strong>Verifying</strong> so you can decide for yourself. Prices show the
              date we checked them, and a price older than {PRICE_MAX_AGE_DAYS} days is hidden
              rather than shown stale.
            </p>

            <h2 className="pt-2 text-lg font-bold">How we make money</h2>
            <p>
              {INLINE_DISCLOSURE} You pay the seller&rsquo;s normal price; the commission comes out
              of their margin. No seller pays for placement or sees a product before it&rsquo;s
              published, and we don&rsquo;t rank products by commission.
              {usesAmazon && <> {AMAZON_ATTESTATION}</>} Full details are on the{' '}
              <Link href="/disclosure" className="text-accent underline underline-offset-2">
                disclosure page
              </Link>
              .
            </p>

            <p>
              We are not affiliated with any anime studio, publisher, or licensor. Spotted a
              problem with a listing?{' '}
              <Link href="/contact" className="text-accent underline underline-offset-2">
                Tell us
              </Link>
              .
            </p>
          </div>
        </div>

        <section aria-labelledby="guides" className="mt-14">
          <h2 id="guides" className="mb-4 text-xl font-bold text-fg">
            Guides
          </h2>
          <JournalGrid posts={posts} />
        </section>
      </main>
      <Footer />
    </>
  )
}
