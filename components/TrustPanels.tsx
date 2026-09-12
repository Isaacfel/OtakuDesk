import type { CSSProperties } from 'react'
import { PRICE_MAX_AGE_DAYS } from '@/data/types'
import { AnimePanel, GlowOrb, RegistrationMark } from './motifs'

/**
 * The trust panel — three manga panels: Seller, License, Price. This is the
 * site's whole argument.
 *
 * Every sentence here is a description of how the site works, not a promise
 * about outcomes. Nothing is a guarantee, a rating, or a count.
 *
 * Each panel is lit in one colour, by role: the seller panel in lamplight
 * (who is in the room with you), the licence panel in the verified green,
 * the price panel in screen blue (a number checked on a date).
 */

const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

type Panel = {
  n: string
  kicker: string
  title: string
  body: string
  why: string
  icon: React.ReactNode
  motif: string
  tone: 'orange' | 'green' | 'blue'
}

const TONE = {
  orange: { text: 'text-orange', ring: 'bloom-orange border-orange/60', glow: 'orange' as const },
  green: {
    text: 'text-green',
    ring: 'border-green/60 [box-shadow:0_0_0_1px_color-mix(in_srgb,var(--green)_40%,transparent),0_0_34px_-6px_color-mix(in_srgb,var(--green)_55%,transparent)]',
    glow: 'green' as const,
  },
  blue: { text: 'text-blue', ring: 'bloom-blue border-blue/60', glow: 'blue' as const },
}

const PANELS: Panel[] = [
  {
    n: '01',
    kicker: 'Seller',
    tone: 'orange',
    title: 'We name the seller.',
    body: 'Every pick says whether you are buying from a licensed retailer, the brand itself, a marketplace seller, or an independent artist — and names them.',
    why: 'The seller decides your returns, your shipping time, and whether the thing that arrives is the thing in the photo.',
    motif: 'halftone',
    icon: (
      <>
        <rect x="8" y="14" width="48" height="36" rx="2" stroke="currentColor" strokeWidth="3" />
        <circle cx="32" cy="14" r="3.5" fill="#242029" stroke="currentColor" strokeWidth="2.5" />
        <path d="M16 28h20M16 36h32M16 44h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="42" y="24" width="8" height="8" fill="currentColor" />
      </>
    ),
  },
  {
    n: '02',
    kicker: 'License',
    tone: 'green',
    title: 'We state the licence.',
    body: 'Each pick is marked officially licensed, original design, or still being verified. A pick we have not verified never gets a buy link — it gets a panel saying we are still checking.',
    why: 'Bootleg merchandise pays nobody who made the work you love, and telling the difference is the hardest part of shopping this space.',
    motif: 'speed-lines',
    icon: (
      <>
        <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="3" />
        <circle cx="32" cy="32" r="13" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d="M24 32l6 6 12-12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 4v6M32 54v6M4 32h6M54 32h6" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    n: '03',
    kicker: 'Price',
    tone: 'blue',
    title: 'We date every price.',
    body: `A price is shown with the day we last checked it, and a price older than ${PRICE_MAX_AGE_DAYS} days is not shown at all. There is no “was / now” pricing anywhere on this site.`,
    why: 'A stale price is a small lie, and a guide that tells small lies is not a guide.',
    motif: 'blueprint',
    icon: (
      <>
        <rect x="10" y="12" width="44" height="42" rx="2" stroke="currentColor" strokeWidth="3" />
        <path d="M10 24h44" stroke="currentColor" strokeWidth="3" />
        <path d="M20 8v8M44 8v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="18" y="32" width="8" height="8" fill="currentColor" opacity="0.4" />
        <rect x="30" y="32" width="8" height="8" fill="currentColor" opacity="0.4" />
        <rect x="42" y="32" width="6" height="8" fill="currentColor" />
        <rect x="18" y="44" width="8" height="6" fill="currentColor" opacity="0.4" />
      </>
    ),
  },
]

export function TrustPanels() {
  return (
    <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
      {PANELS.map((panel, i) => {
        const tone = TONE[panel.tone]
        return (
          <AnimePanel
            key={panel.n}
            as="li"
            tone="dark"
            className={`group flex flex-col overflow-hidden ${i === 1 ? 'md:-translate-y-4' : ''}`}
          >
            <div style={ON_DARK} className="relative flex h-full flex-col p-6">
              {/* The panel's light source, top-right, behind everything. */}
              <GlowOrb tone={tone.glow} size={260} intensity="low" blend="screen" className="-top-24 -right-20" />
              {/* Subtle print motif, faded so the copy stays readable. */}
              <div
                aria-hidden="true"
                className={`${panel.motif} pointer-events-none absolute -top-8 -right-8 h-44 w-44 opacity-40 [mask-image:radial-gradient(circle_at_70%_30%,#000_10%,transparent_75%)]`}
              />

              <div className="relative flex items-start justify-between">
                <span className={`label-xs ${tone.text}`}>
                  Panel {panel.n} &middot; {panel.kicker}
                </span>
                <RegistrationMark className="h-4 w-4 text-panel-line" />
              </div>

              <div
                aria-hidden="true"
                className={`relative mt-6 flex h-20 w-20 items-center justify-center border-2 bg-panel-2 ${tone.ring} ${tone.text}`}
              >
                <svg viewBox="0 0 64 64" fill="none" className="h-12 w-12">
                  {panel.icon}
                </svg>
              </div>

              <h3 className="relative mt-6 text-2xl text-panel-type">{panel.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-panel-type/80">{panel.body}</p>
              <p className={`relative mt-auto border-l-2 pt-4 pl-4 text-sm leading-relaxed text-panel-muted ${tone.text.replace('text-', 'border-')}`}>
                {panel.why}
              </p>
            </div>
          </AnimePanel>
        )
      })}
    </ol>
  )
}
