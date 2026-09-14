import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Header, Footer } from '@/components/Shell'
import { NewsletterStatus } from '@/components/NewsletterStatus'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'New products on Otakudesk, once a week.',
  robots: { index: false, follow: true },
}

/**
 * Landing page for every newsletter outcome. Static; the message is chosen on
 * the client from `?state=` so the route never renders per request.
 */
export default function NewsletterPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <Suspense fallback={null}>
          <NewsletterStatus />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
