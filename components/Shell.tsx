import Link from 'next/link'
import { DisclosureBanner, SampleCatalogNotice } from './Disclosure'

/**
 * The site shell.
 *
 * Nav is deliberately short. v1 ships Desk, Journal and About — collections,
 * new-drops and saved are deferred (their data already exists, so the routes
 * can be added later without rework). A nav with six entries and three real
 * destinations is how a small site announces that it is padding.
 */

const NAV = [
  { href: '/desk', label: 'The Desk' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <>
      <SampleCatalogNotice />
      <DisclosureBanner />
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/"
            className="font-display text-xl font-extrabold tracking-tight text-paper"
          >
            Otaku<span className="text-shu">desk</span>
          </Link>

          <nav aria-label="Main">
            <ul className="flex items-center gap-6">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-paper-2 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-extrabold tracking-tight text-paper">
            Otaku<span className="text-shu">desk</span>
          </p>
          <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">
            A trusted anime room and desk shopping guide. We name the seller and
            the licence on every pick.
          </p>
        </div>

        <nav aria-label="Browse">
          <h2 className="label-xs mb-3 text-muted">Browse</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-2 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="label-xs mb-3 text-muted">Legal</h2>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/disclosure" className="text-paper-2 hover:text-paper">
                Affiliate disclosure
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-paper-2 hover:text-paper">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-paper-2 hover:text-paper">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line-soft">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-muted">
          Otakudesk is an independent shopping guide. It is not affiliated with,
          endorsed by, or sponsored by any anime studio, publisher, or licensor.
        </p>
      </div>
    </footer>
  )
}
