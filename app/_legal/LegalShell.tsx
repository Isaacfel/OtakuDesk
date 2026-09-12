import type { ReactNode } from 'react'
import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { Prose } from '@/mdx-components'

/**
 * Shared frame for the legal pages (/disclosure, /privacy, /terms, /contact).
 *
 * Two deliberate choices:
 *
 * 1. Every page opens with a visible draft notice. These pages have not had
 *    legal review and there is no legal entity behind the site yet. Saying so
 *    is more accurate than looking finished, and accuracy is what these
 *    pages are for.
 * 2. Anything that requires a real entity — a name, an address, a governing
 *    law, an email — is a <Placeholder />, rendered loudly. Nothing here is
 *    invented to fill a gap.
 */

/** The date the drafts were last edited. Bump when the copy changes. */
export const LEGAL_DRAFT_DATE = '2026-09-11'

export function DraftNotice() {
  return (
    <aside
      role="note"
      className="mb-10 rounded-sm border border-caution/40 bg-caution-soft p-4 text-sm leading-relaxed text-caution"
    >
      <p className="label-xs mb-1.5">Draft — pending legal review</p>
      <p>
        This page is a working draft, published so the site&rsquo;s commitments
        are visible while it is being built. It has not been reviewed by a
        lawyer. Items marked{' '}
        <span className="font-mono text-[0.85em] font-medium">
          [TO BE COMPLETED BEFORE LAUNCH]
        </span>{' '}
        are deliberate placeholders for details that require a real legal
        entity, not omissions.
      </p>
    </aside>
  )
}

/** A loud, unmistakable gap. Never render real-looking dummy data instead. */
export function Placeholder({ what }: { what: string }) {
  return (
    <span className="inline-block rounded-xs bg-caution-soft px-1.5 py-0.5 font-mono text-[0.8em] font-medium text-caution">
      [TO BE COMPLETED BEFORE LAUNCH: {what}]
    </span>
  )
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
                Draft dated{' '}
                <time dateTime={LEGAL_DRAFT_DATE}>{LEGAL_DRAFT_DATE}</time>
              </span>
            </p>
            <h1 className="mt-4 text-3xl leading-[1.1] sm:text-4xl">{title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-paper-2">{lede}</p>
            <hr className="mt-8 border-line" />
          </header>

          <DraftNotice />

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
