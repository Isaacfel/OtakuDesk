import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Collection } from '@/data/types'
import { EditorialBadge, GlowOrb, SparkleField, SpeedStreaks } from './motifs'

/**
 * "Choose your arc" — an oversized, lit panel per collection.
 *
 * Collections have no route of their own in v1, so each card links to the
 * Desk with the collection filter applied. Every arc has its OWN colour of
 * light and its own original night scene: a desk under a monitor's glow, a
 * hoodie on a rail under a neon rectangle, a shelf of cases lit from behind,
 * a sling and lanyard mid-dash, a pen and an ink splash under a lamp. Nothing
 * depicts a franchise or anyone's character.
 *
 * The art is cut on the diagonal where it meets the copy — a manga gutter,
 * not a card divider — and the cut alternates direction across the set so the
 * grid reads as a page of panels rather than a row of tiles.
 *
 * On touch there is no hover state; the card is simply a large, fully
 * labelled link. Nothing is hidden behind the interaction.
 */

const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

type Tone = 'blue' | 'green' | 'lilac' | 'orange' | 'red'

type ArcArt = {
  tone: Tone
  art: React.ReactNode
}

const PAPER = '#f3ebdd'
const INK = '#100e13'

const ART: Record<string, ArcArt> = {
  'desk-and-room-arc': {
    tone: 'blue',
    art: (
      <>
        <defs>
          <linearGradient id="arc-desk-screen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6d9bff" />
            <stop offset="1" stopColor="#3a2f8f" />
          </linearGradient>
        </defs>
        {/* Screen glow on the wall and the desk */}
        <ellipse cx="124" cy="86" rx="92" ry="58" fill="#4d7cfe" opacity="0.22" />
        <ellipse cx="124" cy="146" rx="80" ry="10" fill="#4d7cfe" opacity="0.2" />
        {/* Desk */}
        <path d="M14 142h212" stroke={PAPER} strokeWidth="3" />
        <rect x="52" y="146" width="150" height="14" rx="3" fill={INK} stroke={PAPER} strokeOpacity="0.4" strokeWidth="2" />
        {/* Monitor */}
        <rect x="104" y="128" width="40" height="14" fill={INK} />
        <rect x="66" y="48" width="116" height="76" rx="4" fill={INK} stroke={PAPER} strokeWidth="3" />
        <rect x="74" y="56" width="100" height="60" fill="url(#arc-desk-screen)" />
        <rect x="82" y="66" width="40" height="24" fill={INK} fillOpacity="0.5" stroke={PAPER} strokeOpacity="0.7" strokeWidth="1.5" />
        <rect x="128" y="66" width="38" height="10" fill="#ff3b4d" fillOpacity="0.9" />
        <path d="M82 100h84M82 108h60" stroke={PAPER} strokeOpacity="0.6" strokeWidth="2.5" />
        {/* Keyboard with underglow */}
        <rect x="86" y="148" width="76" height="9" rx="2" fill="#2c2733" stroke={PAPER} strokeOpacity="0.5" strokeWidth="1.5" />
        <path d="M86 159h76" stroke="#8fb0ff" strokeWidth="2" />
        {/* Lamp, warm, from the left */}
        <path d="M30 142V92l30-24" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M54 62l22 8-8 16-22-8z" fill={INK} stroke="#ff9d42" strokeOpacity="0.8" strokeWidth="1.5" />
        <path d="M60 84l60 58H30z" fill="#ff9d42" opacity="0.14" />
        <circle cx="66" cy="80" r="8" fill="#ff9d42" opacity="0.4" />
        {/* Mug */}
        <rect x="204" y="120" width="16" height="20" rx="2" fill={PAPER} fillOpacity="0.85" />
        <path d="M220 124h5a4 4 0 0 1 0 8h-5" fill="none" stroke={PAPER} strokeOpacity="0.85" strokeWidth="2" />
      </>
    ),
  },
  'streetwear-arc': {
    tone: 'green',
    art: (
      <>
        {/* A neon rectangle on the wall behind the rail — a sign with no words */}
        <rect x="48" y="26" width="144" height="118" rx="4" fill="none" stroke="#c7f36b" strokeOpacity="0.9" strokeWidth="3" />
        <rect x="48" y="26" width="144" height="118" rx="4" fill="#c7f36b" opacity="0.08" />
        <ellipse cx="120" cy="85" rx="110" ry="70" fill="#c7f36b" opacity="0.1" />
        {/* Rail and hanger */}
        <path d="M20 22h200" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
        <path d="M120 22v8" stroke={PAPER} strokeWidth="3" />
        <path d="M120 30l-40 12M120 30l40 12" stroke={PAPER} strokeWidth="3" strokeLinecap="round" />
        {/* Hoodie */}
        <path d="M92 52l-30 16 12 24 14-8v70h64V84l14 8 12-24-30-16-10 10h-36z" fill={INK} stroke={PAPER} strokeWidth="3" strokeLinejoin="round" />
        <path d="M102 52c0 12 8 18 18 18s18-6 18-18" fill="none" stroke={PAPER} strokeWidth="2.5" />
        <path d="M112 70v26M128 70v26" stroke={PAPER} strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
        <rect x="100" y="110" width="40" height="18" rx="2" fill="none" stroke={PAPER} strokeOpacity="0.6" strokeWidth="1.5" />
        {/* A patch, and a stitch line */}
        <rect x="140" y="84" width="16" height="16" fill="#c7f36b" transform="rotate(-8 148 92)" />
        <path d="M88 146h64" stroke="#c7f36b" strokeWidth="2" strokeDasharray="4 4" />
        {/* An enamel pin on the chest */}
        <circle cx="92" cy="92" r="4" fill="#ff3b4d" />
      </>
    ),
  },
  'collector-arc': {
    tone: 'lilac',
    art: (
      <>
        {/* Backlight behind the shelf */}
        <ellipse cx="120" cy="96" rx="110" ry="54" fill="#b7a4ff" opacity="0.16" />
        <path d="M40 40h160" stroke="#b7a4ff" strokeWidth="3" strokeLinecap="round" />
        <path d="M40 44l-22 40h204l-22-40z" fill="#b7a4ff" opacity="0.14" />
        {/* Shelf */}
        <path d="M16 150h208" stroke={PAPER} strokeWidth="3" />
        {/* Cases, each with a silhouette — shapes, not characters */}
        <rect x="30" y="112" width="50" height="38" fill={INK} stroke={PAPER} strokeWidth="3" />
        <rect x="90" y="92" width="60" height="58" fill={INK} stroke={PAPER} strokeWidth="3" />
        <rect x="160" y="80" width="50" height="70" fill={INK} stroke={PAPER} strokeWidth="3" />
        <rect x="98" y="100" width="44" height="50" fill="#b7a4ff" fillOpacity="0.14" />
        <path d="M120 106c-6 0-9 4-9 9 0 3 2 6 4 7-5 2-8 6-8 10v18h26v-18c0-4-3-8-8-10 2-1 4-4 4-7 0-5-3-9-9-9z" fill={PAPER} />
        <path d="M185 100c-4 0-6 3-6 6 0 2 1 4 2 5-3 1-5 4-5 7v32h18v-32c0-3-2-6-5-7 1-1 2-3 2-5 0-3-2-6-6-6z" fill={PAPER} fillOpacity="0.75" />
        <rect x="40" y="128" width="30" height="22" fill="#b7a4ff" fillOpacity="0.28" />
        {/* Glass glints */}
        <path d="M96 98l14 16M166 86l14 16" stroke={PAPER} strokeOpacity="0.3" strokeWidth="4" />
        <circle cx="200" cy="66" r="4" fill="#b7a4ff" />
      </>
    ),
  },
  'convention-ready': {
    tone: 'orange',
    art: (
      <>
        <ellipse cx="120" cy="100" rx="90" ry="56" fill="#ff9d42" opacity="0.14" />
        {/* Lanyard and badge */}
        <path d="M84 12c10 40 22 62 36 62s26-22 36-62" fill="none" stroke={PAPER} strokeWidth="5" strokeLinecap="round" />
        <rect x="108" y="72" width="24" height="10" fill={PAPER} />
        <rect x="76" y="82" width="88" height="70" rx="4" fill={INK} stroke={PAPER} strokeWidth="3" />
        <rect x="86" y="94" width="30" height="30" fill="#ff9d42" />
        <path d="M124 100h32M124 112h32M86 136h70" stroke={PAPER} strokeWidth="3" opacity="0.8" />
        {/* Sling, behind, in motion */}
        <path d="M172 96c22-10 40 6 44 30s-14 34-34 26" fill={INK} stroke={PAPER} strokeOpacity="0.85" strokeWidth="3" strokeLinejoin="round" />
        <path d="M180 108h30" stroke={PAPER} strokeOpacity="0.5" strokeWidth="2" />
        {/* Pins scattered like they came off in the bag */}
        <circle cx="46" cy="126" r="8" fill="#4d7cfe" stroke={PAPER} strokeWidth="2" />
        <circle cx="30" cy="96" r="6" fill="#ff3b4d" stroke={PAPER} strokeWidth="2" />
        <circle cx="206" cy="60" r="7" fill="#c7f36b" stroke={PAPER} strokeWidth="2" />
        {/* A bottle */}
        <rect x="36" y="140" width="14" height="24" rx="3" fill={INK} stroke={PAPER} strokeOpacity="0.8" strokeWidth="2" />
        <rect x="40" y="134" width="6" height="6" fill={PAPER} />
      </>
    ),
  },
  'original-artist-picks': {
    tone: 'red',
    art: (
      <>
        {/* A lamp cone from above, over the drawing board */}
        <path d="M120 0l90 120H30z" fill="#ff9d42" opacity="0.1" />
        <ellipse cx="120" cy="110" rx="80" ry="34" fill="#ff3b4d" opacity="0.12" />
        {/* The sheet, tilted */}
        <g transform="rotate(-6 120 100)">
          <rect x="60" y="56" width="120" height="96" fill={PAPER} fillOpacity="0.9" />
          <path d="M160 56l20 20h-20z" fill="#ff3b4d" />
          <path d="M76 86c20-14 40 8 60-6s28 4 32-2" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M76 104h40M76 114h56M76 124h32" stroke={INK} strokeOpacity="0.35" strokeWidth="2" />
          <circle cx="146" cy="120" r="10" fill="#ff3b4d" opacity="0.85" />
        </g>
        {/* Pen and a drop of ink */}
        <path d="M180 150L112 82" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M180 150L112 82" stroke={PAPER} strokeWidth="4" strokeLinecap="round" />
        <path d="M112 82l-10-10 2-4 4 2z" fill={INK} />
        <path d="M56 150c0-8 6-16 6-16s6 8 6 16a6 6 0 0 1-12 0z" fill="#ff3b4d" />
        <path d="M210 40a8 8 0 1 0 .1 0M202 48h16M210 40v16" stroke={PAPER} strokeWidth="1.5" opacity="0.7" />
      </>
    ),
  },
}

const FALLBACK: ArcArt = ART['desk-and-room-arc']

const TONE: Record<
  Tone,
  { text: string; glow: 'blue' | 'green' | 'lilac' | 'orange' | 'electric'; bloom: string; line: string }
> = {
  blue: { text: 'text-blue', glow: 'blue', bloom: 'hover:bloom-blue focus-visible:bloom-blue', line: 'bg-blue' },
  green: {
    text: 'text-green',
    glow: 'green',
    bloom:
      'hover:[box-shadow:0_0_0_1px_color-mix(in_srgb,var(--green)_40%,transparent),0_0_34px_-6px_color-mix(in_srgb,var(--green)_55%,transparent)]',
    line: 'bg-green',
  },
  lilac: { text: 'text-lilac', glow: 'lilac', bloom: 'hover:bloom-lilac focus-visible:bloom-lilac', line: 'bg-lilac' },
  orange: { text: 'text-orange', glow: 'orange', bloom: 'hover:bloom-orange focus-visible:bloom-orange', line: 'bg-orange' },
  red: { text: 'text-shu-electric', glow: 'electric', bloom: 'hover:bloom-red focus-visible:bloom-red', line: 'bg-shu-electric' },
}

/* The diagonal gutter between art and copy. Stacked cards cut the art's
   bottom edge; the lead card (art beside copy on large screens) cuts its
   right edge instead. `rise`/`fall` alternate so the page does not repeat. */
const CUT_STACK = {
  rise: 'polygon(0 0, 100% 0, 100% calc(100% - 26px), 0 100%)',
  fall: 'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 26px))',
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
  const tone = TONE[art.tone]
  const number = String(index + 1).padStart(2, '0')
  const slope = index % 2 === 0 ? 'rise' : 'fall'
  const lead = size === 'lead'

  return (
    <Link
      href={{ pathname: '/desk', query: { collection: collection.slug } }}
      aria-label={`${collection.name}: ${collection.blurb}. Browse this arc on the Desk.`}
      className={`group relative flex h-full flex-col overflow-hidden border-2 border-panel-line bg-panel text-panel-type transition-[box-shadow,transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-panel-type ${tone.bloom} ${
        lead ? 'lg:flex-row' : ''
      }`}
      style={ON_DARK}
    >
      {/* Art field: the scene, lit in the arc's own colour, cut on the diagonal. */}
      <div
        aria-hidden="true"
        className={`relative shrink-0 overflow-hidden bg-panel-2 [clip-path:var(--arc-cut)] ${
          lead
            ? 'aspect-[16/9] lg:aspect-auto lg:w-[56%] lg:[--arc-cut:polygon(0_0,100%_0,calc(100%_-_44px)_100%,0_100%)]'
            : 'aspect-[16/10]'
        }`}
        style={{ '--arc-cut': CUT_STACK[slope] } as CSSProperties}
      >
        <div className="halftone-lg absolute inset-0 opacity-60" />
        <GlowOrb tone={tone.glow} size="120%" intensity="mid" blend="screen" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        {art.tone === 'orange' && <SpeedStreaks from="right" density="mid" seed="con" className="opacity-80" />}
        {art.tone === 'red' && <SparkleField seed="artist" count={5} tone="electric" minSize={8} maxSize={18} />}
        <svg
          viewBox="0 0 240 170"
          fill="none"
          className="absolute inset-0 h-full w-full p-5 transition-transform duration-500 ease-out group-hover:-rotate-1 group-hover:scale-[1.04] sm:p-7"
        >
          {art.art}
        </svg>
        <EditorialBadge tone="ink" className="absolute top-3 left-3">
          Arc {number}
        </EditorialBadge>
      </div>

      {/* Copy */}
      <div className={`relative flex flex-1 flex-col justify-between p-5 sm:p-6 ${lead ? 'lg:p-8' : ''}`}>
        <span aria-hidden="true" className={`absolute top-0 left-5 h-1 w-10 sm:left-6 ${tone.line} ${lead ? 'lg:top-8 lg:left-0 lg:h-10 lg:w-1' : ''}`} />
        <div>
          <h3 className={`${lead ? 'text-3xl sm:text-4xl xl:text-5xl' : 'text-2xl sm:text-3xl'} text-panel-type`}>
            {collection.name}
          </h3>
          <p className={`mt-3 leading-relaxed text-panel-type/75 ${lead ? 'max-w-[40ch] text-sm sm:text-base' : 'max-w-[36ch] text-sm'}`}>
            {lead ? collection.description : collection.blurb}
          </p>
        </div>

        <span className={`label-xs mt-6 inline-flex items-center gap-2 ${tone.text}`}>
          Browse the arc
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  )
}
