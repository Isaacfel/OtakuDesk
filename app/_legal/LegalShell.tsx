import type { ReactNode } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { Prose } from '@/mdx-components'
import { SITE } from '@/lib/site'

/**
 * Shared frame for the legal pages (/disclosure, /privacy, /terms, /contact).
 *
 * Operator details come from lib/site.ts rather than being typed into each
 * page, so the four pages cannot disagree about who is behind the site.
 */

/** The date the copy was last edited. Bump when it changes. */
export const LEGAL_UPDATED_DATE = '2026-09-15'

/** The one contact address, as a mailto link. `subject` pre-fills the email. */
export function ContactEmail({ subject }: { subject?: string }) {
  const href = subject
    ? `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}`
    : `mailto:${SITE.contactEmail}`
  return <a href={href}>{SITE.contactEmail}</a>
}

export function LegalPage({
  label,
  title,
  lede,
  children,
}: {
  label: string
  title: string
  lede: string
  children: ReactNode
}) {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-5 pt-10 pb-8 sm:pt-14">
        <article className="mx-auto max-w-[68ch]">
          <header className="mb-8">
            <p className="label-xs text-muted">
              {label}{' '}
              <span aria-hidden="true">·</span>{' '}
              <span className="tnum normal-case tracking-normal">
                Updated{' '}
                <time dateTime={LEGAL_UPDATED_DATE}>{LEGAL_UPDATED_DATE}</time>
              </span>
            </p>
            <h1 className="mt-4 text-3xl leading-[1.1] sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-paper-2">{lede}</p>
            <hr className="mt-8 border-line" />
          </header>

          <Prose>{children}</Prose>

          <nav
            aria-label="Other policies"
            className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-soft pt-6 text-sm"
          >
            <Link href="/disclosure" className="text-paper-2 underline underline-offset-2 hover:text-paper">
              Affiliate disclosure
            </Link>
            <Link href="/privacy" className="text-paper-2 underline underline-offset-2 hover:text-paper">
              Privacy
            </Link>
            <Link href="/terms" className="text-paper-2 underline underline-offset-2 hover:text-paper">
              Terms
            </Link>
            <Link href="/contact" className="text-paper-2 underline underline-offset-2 hover:text-paper">
              Contact
            </Link>
            <Link href="/about" className="text-paper-2 underline underline-offset-2 hover:text-paper">
              About
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  )
}
