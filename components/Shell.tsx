import Link from 'next/link'
import { DisclosureBanner, SampleCatalogNotice } from './Disclosure'
import { MascotMark, RegistrationMark } from './motifs'

/**
 * The site shell — the door and the floor of the night room.
 *
 * Nav is deliberately short. v1 ships Desk, Journal and About — collections,
 * new-drops and saved are deferred (their data already exists, so the routes
 * can be added later without rework). A nav with six entries and three real
 * destinations is how a small site announces that it is padding.
 *
 * The two banners above the header are compliance, not decoration: the
 * sample-catalog notice and the affiliate disclosure stay first and are not
 * styled away. The header's bottom rule is the room's light strip — red into
 * blue into lilac — rather than a printed border.
 */

const NAV = [
  { href: '/desk', label: 'The Desk' },
  { href: '/journal', label: 'Journal' },
  { href: '/about', label: 'About' },
]

function Wordmark({ size = 'md' }: { size?: 'md' | 'lg' }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`bloom-red flex items-center justify-center border border-shu/50 bg-panel-2 text-paper ${
          size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
        }`}
      >
        <MascotMark className={size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'} title="Otakudesk desk spirit" />
      </span>
      <span
        className={`font-display font-extrabold tracking-tight text-paper ${
          size === 'lg' ? 'text-2xl' : 'text-xl'
        }`}
      >
        Otaku<span className="text-shu">desk</span>
      </span>
    </span>
  )
}

/** The light strip: one thin line of the room's three colours. */
function LightStrip({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none block h-0.5 w-full ${className}`}
      style={{
        background:
          'linear-gradient(90deg, var(--shu) 0%, var(--shu) 28%, var(--blue) 52%, var(--lilac) 78%, transparent 100%)',
      }}
    />
  )
}

export function Header() {
  return (
    <>
      <SampleCatalogNotice />
      <DisclosureBanner />
      <header className="relative bg-ink">
        <div aria-hidden="true" className="room-light pointer-events-none absolute inset-0 opacity-60" />
        <RegistrationMark className="pointer-events-none absolute top-1.5 left-1.5 h-3 w-3 text-line" />
        <RegistrationMark className="pointer-events-none absolute top-1.5 right-1.5 h-3 w-3 text-line" />

        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-4">
          <Link href="/" aria-label="Otakudesk home">
            <Wordmark />
          </Link>

          <nav aria-label="Main">
            <ul className="flex items-center gap-5 sm:gap-7">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="label-xs relative py-2 text-paper-2 transition-colors hover:text-shu"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <LightStrip />
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-surface">
      <LightStrip className="absolute inset-x-0 top-0 opacity-70" />
      <div aria-hidden="true" className="room-light pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden="true" className="halftone pointer-events-none absolute inset-x-0 top-0 h-6 opacity-50" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pt-14 pb-10 sm:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Wordmark size="lg" />
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-paper-2">
            A trusted anime room and desk shopping guide. We name the seller and
            state the licence on every pick, and we date every price.
          </p>
          <p className="label-xs mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted">
            <span>Seller named</span>
            <span aria-hidden="true" className="text-shu">·</span>
            <span>License stated</span>
            <span aria-hidden="true" className="text-shu">·</span>
            <span>Price dated</span>
          </p>
        </div>

        <nav aria-label="Browse">
          <h2 className="label-xs mb-4 border-b border-line pb-2 text-muted">Browse</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper-2 transition-colors hover:text-shu">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="label-xs mb-4 border-b border-line pb-2 text-muted">Legal</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link href="/disclosure" className="text-paper-2 transition-colors hover:text-shu">
                Affiliate disclosure
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-paper-2 transition-colors hover:text-shu">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-paper-2 transition-colors hover:text-shu">
                Terms
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="relative border-t border-line">
        <RegistrationMark className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 text-line" />
        <RegistrationMark className="pointer-events-none absolute right-1.5 bottom-1.5 h-3 w-3 text-line" />
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-3 px-5 py-4">
          <p className="max-w-[70ch] text-xs leading-relaxed text-muted">
            Otakudesk is an independent shopping guide. It is not affiliated with,
            endorsed by, or sponsored by any anime studio, publisher, or licensor.
            All marks and illustrations on this site are original.
          </p>
          <p className="label-xs text-muted">Lights on late. Drawn by hand.</p>
        </div>
      </div>
    </footer>
  )
}
