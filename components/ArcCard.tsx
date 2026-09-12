import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Collection } from '@/data/types'
import { EditorialBadge, RegistrationMark, SpeedBurst } from './motifs'

/**
 * "Choose your arc" — an oversized illustrated card per collection.
 *
 * Collections have no route of their own in v1, so each card links to the
 * Desk with the collection filter applied. The art is original per arc: a
 * blueprint desk, a hanging tee with a stitch line, a run of display plinths,
 * a badge on a lanyard, a pen nib and ink drop. Nothing depicts a franchise.
 *
 * Hover tilts the art and lifts the card; on touch there is no hover state and
 * the card is simply a large, fully labelled link — nothing is hidden behind
 * the interaction.
 */

const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

type ArcArt = {
  tone: 'blue' | 'green' | 'lilac' | 'orange' | 'red'
  accent: string
  /** Tailwind classes for the art field background. */
  field: string
  art: React.ReactNode
}

const ART: Record<string, ArcArt> = {
  'desk-and-room-arc': {
    tone: 'blue',
    accent: '#7f9dff',
    field: 'blueprint',
    art: (
      <>
        <path d="M20 150h200" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="70" y="60" width="100" height="64" rx="3" fill="#17151a" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="78" y="68" width="84" height="48" fill="#7f9dff" fillOpacity="0.75" />
        <path d="M112 124v14h16v-14" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="96" y="138" width="48" height="6" fill="#f3ebdd" />
        <path d="M34 150v-52l22-20" stroke="#f3ebdd" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 72l18 6-6 12-18-6z" fill="#ff9d42" />
        <rect x="186" y="128" width="26" height="22" rx="2" fill="#f3ebdd" fillOpacity="0.85" />
      </>
    ),
  },
  'streetwear-arc': {
    tone: 'green',
    accent: '#c7f36b',
    field: 'halftone',
    art: (
      <>
        <path d="M120 22v10" stroke="#f3ebdd" strokeWidth="3" />
        <path d="M60 46h120" stroke="#f3ebdd" strokeWidth="3" strokeLinecap="round" />
        <path d="M120 32l-58 14" stroke="#f3ebdd" strokeWidth="3" />
        <path d="M120 32l58 14" stroke="#f3ebdd" strokeWidth="3" />
        <path d="M92 56l-28 16 12 22 14-8v66h60V86l14 8 12-22-28-16-14 8h-28z" fill="#17151a" stroke="#f3ebdd" strokeWidth="3" strokeLinejoin="round" />
        <path d="M80 140h56" stroke="#c7f36b" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M80 132h56" stroke="#c7f36b" strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
        <rect x="102" y="84" width="22" height="22" fill="#c7f36b" />
        <rect x="150" y="90" width="18" height="28" fill="#f3ebdd" transform="rotate(12 159 104)" />
        <path d="M159 90v-8" stroke="#f3ebdd" strokeWidth="2" />
      </>
    ),
  },
  'collector-arc': {
    tone: 'lilac',
    accent: '#b7a4ff',
    field: 'halftone-lg',
    art: (
      <>
        <path d="M16 150h208" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="30" y="118" width="50" height="32" fill="#17151a" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="90" y="100" width="60" height="50" fill="#17151a" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="160" y="84" width="50" height="66" fill="#17151a" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="100" y="58" width="40" height="42" fill="#b7a4ff" fillOpacity="0.16" stroke="#b7a4ff" strokeWidth="2" />
        <path d="M120 66c-6 0-9 4-9 9 0 3 2 6 4 7-5 2-8 6-8 10v6h26v-6c0-4-3-8-8-10 2-1 4-4 4-7 0-5-3-9-9-9z" fill="#f3ebdd" />
        <path d="M40 40h160" stroke="#ff9d42" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 44l-16 34h192l-16-34z" fill="#ff9d42" opacity="0.12" />
        <circle cx="185" cy="72" r="5" fill="#b7a4ff" />
      </>
    ),
  },
  'convention-ready': {
    tone: 'orange',
    accent: '#ff9d42',
    field: '',
    art: (
      <>
        <path d="M84 16c10 40 22 62 36 62s26-22 36-62" fill="none" stroke="#f3ebdd" strokeWidth="5" strokeLinecap="round" />
        <rect x="108" y="76" width="24" height="10" fill="#f3ebdd" />
        <rect x="76" y="86" width="88" height="70" rx="4" fill="#17151a" stroke="#f3ebdd" strokeWidth="3" />
        <rect x="86" y="98" width="30" height="30" fill="#ff9d42" />
        <path d="M124 104h32M124 116h32M86 140h70" stroke="#f3ebdd" strokeWidth="3" opacity="0.8" />
        <circle cx="190" cy="120" r="10" fill="#ff3b4d" />
        <circle cx="46" cy="132" r="7" fill="#7f9dff" />
      </>
    ),
  },
  'original-artist-picks': {
    tone: 'red',
    accent: '#ff3b4d',
    field: 'paper-grain',
    art: (
      <>
        <path d="M60 140c40-70 70-90 110-110" fill="none" stroke="#f3ebdd" strokeWidth="5" strokeLinecap="round" />
        <path d="M170 30l14-6-6 14z" fill="#f3ebdd" />
        <path d="M56 150c0-10 8-22 8-22s8 12 8 22a8 8 0 0 1-16 0z" fill="#ff3b4d" />
        <path d="M100 150c14-8 22-2 30-10s14 4 26-4 16-6 30 0" fill="none" stroke="#ff3b4d" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M196 60a10 10 0 1 0 0.1 0M186 70h20M196 60v20" stroke="#f3ebdd" strokeWidth="1.5" opacity="0.7" />
        <path d="M30 40a10 10 0 1 0 0.1 0M20 50h20M30 40v20" stroke="#f3ebdd" strokeWidth="1.5" opacity="0.7" />
      </>
    ),
  },
}

const FALLBACK: ArcArt = ART['desk-and-room-arc']

const TONE_TEXT: Record<ArcArt['tone'], string> = {
  blue: 'text-blue',
  green: 'text-green',
  lilac: 'text-lilac',
  orange: 'text-orange',
  red: 'text-shu-electric',
}

export function ArcCard({
  collection,
  index,
  size = 'standard',
}: {
  collection: Collection
  index: number
  size?: 'lead' | 'standard'
}) {
  const art = ART[collection.slug] ?? FALLBACK
  const number = String(index + 1).padStart(2, '0')

  return (
    <Link
      href={{ pathname: '/desk', query: { collection: collection.slug } }}
      aria-label={`${collection.name}: ${collection.blurb}. Browse this arc on the Desk.`}
      className={`group relative flex flex-col overflow-hidden border-2 border-paper bg-panel text-panel-type transition-transform duration-300 ease-out hover:-translate-y-1 hover:offset-print ${
        size === 'lead' ? 'min-h-[22rem] lg:flex-row' : 'min-h-[20rem]'
      }`}
      style={ON_DARK}
    >
      {/* Art field */}
      <div
        aria-hidden="true"
        className={`relative overflow-hidden ${art.field} ${
          size === 'lead' ? 'aspect-[16/9] lg:aspect-auto lg:w-1/2' : 'aspect-[16/9]'
        }`}
        style={{ background: `linear-gradient(160deg, ${art.accent}22, transparent 60%), var(--panel-2)` }}
      >
        {art.tone === 'orange' && <SpeedBurst className="opacity-60" />}
        <svg
          viewBox="0 0 240 170"
          fill="none"
          className="absolute inset-0 h-full w-full p-4 transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-[1.04] sm:p-6"
        >
          {art.art}
        </svg>
        <EditorialBadge tone={art.tone} className="absolute top-3 left-3">
          Arc {number}
        </EditorialBadge>
      </div>

      {/* Copy */}
      <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3
            className={`${size === 'lead' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'} text-panel-type`}
          >
            {collection.name}
          </h3>
          <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-panel-type/75">
            {size === 'lead' ? collection.description : collection.blurb}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <span className={`label-xs ${TONE_TEXT[art.tone]}`}>
            Browse the arc <span aria-hidden="true">→</span>
          </span>
          <RegistrationMark className="h-4 w-4 text-panel-line transition-colors group-hover:text-panel-type" />
        </div>
      </div>
    </Link>
  )
}
