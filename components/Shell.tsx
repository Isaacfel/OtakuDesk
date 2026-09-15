import Link from 'next/link'
import { PICKS } from '@/data/picks'
import { MERCHANTS } from '@/data/merchants'
import type { Category } from '@/data/types'
import { AMAZON_ATTESTATION } from '@/lib/affiliate'

/**
 * Site shell: a store header with search and category links, and a footer
 * that carries the disclosures. Both are server components; nothing from the
 * catalog beyond category names reaches the client.
 */

const SHORT_LABEL: Record<Category, string> = {
  'Figures & Collectibles': 'Figures',
  'Manga & Books': 'Manga',
  'Desk & Room': 'Desk',
  'Wall Art': 'Wall Art',
  Apparel: 'Apparel',
  Accessories: 'Accessories',
  'Storage & Display': 'Storage',
}

const NAV_ORDER: Category[] = [
  'Figures & Collectibles',
  'Manga & Books',
  'Desk & Room',
  'Wall Art',
  'Apparel',
  'Accessories',
  'Storage & Display',
]

export type CategoryLink = { value: Category; label: string; href: string }

/** Categories that currently have at least one pick, in nav order. */
export function categoryLinks(): CategoryLink[] {
  return NAV_ORDER.filter((c) => PICKS.some((p) => p.category === c)).map((c) => ({
    value: c,
    label: SHORT_LABEL[c],
    href: `/desk?category=${encodeURIComponent(c)}`,
  }))
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`text-xl font-extrabold tracking-tight text-fg ${className}`}>
      Otaku<span className="text-accent">desk</span>
    </span>
  )
}

export function Header() {
  const categories = categoryLinks()

  return (
    <header className="border-b border-line bg-bg">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:gap-6">
        <Link href="/" aria-label="Otakudesk home" className="shrink-0">
          <Wordmark />
        </Link>

        {/* Plain GET form: works without JavaScript and keeps the header static. */}
        <form action="/desk" role="search" className="min-w-0 flex-1 sm:max-w-xl">
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <input
            id="site-search"
            name="q"
            type="search"
            placeholder="Search products"
            autoComplete="off"
            className="w-full rounded-full border border-line bg-bg-soft px-4 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-line-strong focus:bg-bg focus:outline-none"
          />
        </form>

        <Link
          href="/about"
          className="hidden shrink-0 text-sm font-medium text-fg transition-colors hover:text-accent sm:block"
        >
          About
        </Link>
      </div>

      <nav aria-label="Categories" className="border-t border-line">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-2 text-sm sm:justify-center">
          <li>
            <Link
              href="/desk"
              className="block whitespace-nowrap px-2 py-2.5 font-medium text-fg transition-colors hover:text-accent"
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.value}>
              <Link
                href={c.href}
                className="block whitespace-nowrap px-2 py-2.5 text-fg-muted transition-colors hover:text-accent"
              >
                {c.label}
              </Link>
            </li>
          ))}
          <li className="sm:hidden">
            <Link
              href="/about"
              className="block whitespace-nowrap px-2 py-2.5 text-fg-muted transition-colors hover:text-accent"
            >
              About
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

const FOOTER_LINKS = [
  { href: '/desk', label: 'All products' },
  { href: '/about', label: 'About' },
  { href: '/journal', label: 'Guides' },
  { href: '/disclosure', label: 'Affiliate disclosure' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  const usesAmazon = MERCHANTS.some(
    (m) => m.network === 'amazon' && Boolean(m.termsVerifiedAt),
  )

  return (
    <footer className="mt-16 border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Newsletter signup. Plain POST form; /api/newsletter/subscribe sends a
            confirmation link, so nobody is added without clicking it. */}
        <form
          action="/api/newsletter/subscribe"
          method="post"
          className="mb-10 max-w-md border-b border-line pb-10"
        >
          <p className="text-sm font-semibold text-fg">New products, once a week.</p>
          <div className="mt-3 flex gap-2">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-line bg-bg px-4 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-line-strong focus:outline-none"
            />
            {/* Honeypot: hidden from people, filled by bots. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Subscribe
            </button>
          </div>
          <p className="mt-2 text-xs text-fg-muted">Unsubscribe any time.</p>
        </form>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <Wordmark />
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-fg-muted transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-fg-muted">
          <p>
            We earn a commission when you buy through links on this site, at no extra cost to
            you.{usesAmazon && <> {AMAZON_ATTESTATION}</>}
          </p>
          <p className="mt-2">
            Otakudesk is an independent guide and is not affiliated with any anime studio,
            publisher, or licensor.
          </p>
        </div>
      </div>
    </footer>
  )
}
