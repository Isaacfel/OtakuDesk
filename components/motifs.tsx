import type { Category } from '@/data/types'
import type { CSSProperties } from 'react'

/**
 * Original anime motifs.
 *
 * Everything here is drawn from scratch in SVG or CSS. The anime feeling comes
 * from two places, and both are a visual vocabulary rather than anyone's
 * intellectual property:
 *
 *   1. A CHARACTER. `Mascot` / `MascotMark` (see ./mascot.tsx) is an original
 *      desk spirit — anime is character-driven, and a site with no character
 *      reads as print design however good the halftone is.
 *   2. ENERGY. Concentration bursts, speed streaks, glow, diagonal panel cuts
 *      and sparkles — the action-panel grammar — alongside the quieter print
 *      grammar (registration marks, panel frames, sticker badges).
 *
 * There is no franchise artwork, no character reference, no Japanese text and
 * nothing traced. That is not only a legal position, it is the honest one for
 * a site whose whole argument is that it tells you the truth about licensing.
 *
 * Motion is decorative and degrades to a static, complete state under
 * `prefers-reduced-motion`; nothing waits at opacity 0 for a scroll.
 */

export { Mascot, MascotMark } from './mascot'
export type { MascotPose, MascotProps } from './mascot'

/* -------------------------------------------------------------------------
   Shared: tone tokens and a seeded generator.

   Tones are expressed as Tailwind text-colour classes so every motif inherits
   `currentColor` and the theme swap comes for free. `inherit` leaves the
   colour to the parent. Note the role naming from globals.css: `text-paper`
   is the INK colour (near-black on the light theme).
   ---------------------------------------------------------------------- */

export type MotifTone = 'ink' | 'shu' | 'electric' | 'blue' | 'lilac' | 'orange' | 'green' | 'paper' | 'inherit'

const TONE_TEXT: Record<MotifTone, string> = {
  ink: 'text-paper',
  shu: 'text-shu',
  electric: 'text-shu-electric',
  blue: 'text-blue',
  lilac: 'text-lilac',
  orange: 'text-orange',
  green: 'text-green',
  paper: 'text-ink',
  inherit: '',
}

/** Raw CSS variables for the tones, for gradients that cannot use classes. */
const TONE_VAR: Record<Exclude<MotifTone, 'inherit'>, string> = {
  ink: '--paper',
  shu: '--shu',
  electric: '--shu-electric',
  blue: '--blue',
  lilac: '--lilac',
  orange: '--orange',
  green: '--green',
  paper: '--ink',
}

/**
 * A tiny deterministic generator (FNV-1a hash into an LCG). Given the same
 * seed it always yields the same sequence, so the "scattered" layouts below
 * are identical on every build and between server and client render.
 */
function seeded(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  let s = (h >>> 0) || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

const f1 = (x: number) => Math.round(x * 10) / 10

/* -------------------------------------------------------------------------
   Registration marks — the printer's alignment crosses at a sheet's corners.
   A quiet signal that the page is a printed object.
   ---------------------------------------------------------------------- */

export function RegistrationMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className} fill="none">
      <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M10 0v20M0 10h20" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

/* -------------------------------------------------------------------------
   AnimePanel — a framed manga panel. The site's primary container.
   Square corners, a hard ink rule, and an optional offset second impression
   like a slightly misregistered print run.
   ---------------------------------------------------------------------- */

export function AnimePanel({
  children,
  tone = 'paper',
  offset = false,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  tone?: 'paper' | 'dark' | 'accent'
  offset?: boolean
  className?: string
  as?: 'div' | 'article' | 'section' | 'li'
}) {
  const tones = {
    paper: 'bg-surface text-paper border-paper',
    dark: 'bg-panel text-panel-type border-panel-line',
    accent: 'bg-shu-dim text-paper border-shu',
  }[tone]

  return (
    <Tag
      className={`relative border-2 ${tones} ${offset ? 'offset-print' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}

/* -------------------------------------------------------------------------
   EditorialBadge — a die-cut sticker. Sits slightly rotated, as if applied by
   hand. Used for arc labels and editorial flags, NEVER for scarcity or
   urgency: there is no "only 2 left" in this vocabulary.
   ---------------------------------------------------------------------- */

export function EditorialBadge({
  children,
  tone = 'red',
  className = '',
}: {
  children: React.ReactNode
  tone?: 'red' | 'blue' | 'lilac' | 'green' | 'orange' | 'ink'
  className?: string
}) {
  // Dark type on every bright accent. White on lime, orange or lilac fails
  // WCAG AA outright at this size — the label is small, uppercase and tracked,
  // so it needs the full 4.5:1, and red and blue only scrape ~3.5:1 with white.
  // Using the ground colour for type passes on all five and keeps the sticker
  // reading as a die-cut object rather than a glowing chip.
  const tones = {
    red: 'bg-shu text-ink',
    blue: 'bg-blue text-ink',
    lilac: 'bg-lilac text-ink',
    green: 'bg-green text-ink',
    orange: 'bg-orange text-ink',
    ink: 'bg-paper text-ink',
  }[tone]

  return (
    <span
      className={`label-xs inline-block -rotate-2 px-2.5 py-1 ${tones} ${className}`}
    >
      {children}
    </span>
  )
}

/* -------------------------------------------------------------------------
   SpeedBurst — evenly radiating lines behind a focal element (CSS conic).
   Kept for existing callers; `EnergyBurst` below is the hand-drawn, tapered
   version and the one to reach for in new work.
   ---------------------------------------------------------------------- */

export function SpeedBurst({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`speed-lines pointer-events-none absolute inset-0 ${className}`}
    />
  )
}

/* -------------------------------------------------------------------------
   EnergyBurst — the action-panel impact burst.

   Tapered wedges radiating from a focal point, each with its own inner
   radius, width and weight, so the ring reads as inked by hand rather than
   generated. Sits absolutely behind a focal element (a hero word, a price
   stamp, the mascot). Static by design: the energy is in the drawing.
   ---------------------------------------------------------------------- */

export function EnergyBurst({
  intensity = 'mid',
  tone = 'ink',
  originX = 50,
  originY = 50,
  seed = 'burst',
  className = '',
}: {
  intensity?: 'low' | 'mid' | 'high'
  tone?: MotifTone
  /** Focal point, in percent of the box. */
  originX?: number
  originY?: number
  seed?: string
  className?: string
}) {
  const spec = {
    low: { count: 28, inner: [34, 30], spread: 0.9, opacity: 0.16 },
    mid: { count: 52, inner: [22, 28], spread: 1.1, opacity: 0.24 },
    high: { count: 92, inner: [14, 24], spread: 1.35, opacity: 0.34 },
  }[intensity]

  const rand = seeded(`${seed}:${intensity}`)
  const R = 140
  const wedges: { d: string; o: number }[] = []
  for (let i = 0; i < spec.count; i++) {
    const a = ((i + (rand() - 0.5) * 0.85) / spec.count) * Math.PI * 2
    const inner = spec.inner[0] + rand() * spec.inner[1]
    const half = (0.003 + rand() * 0.011) * spec.spread
    const ax = originX + Math.cos(a) * inner
    const ay = originY + Math.sin(a) * inner
    const bx = originX + Math.cos(a - half) * R
    const by = originY + Math.sin(a - half) * R
    const cx = originX + Math.cos(a + half) * R
    const cy = originY + Math.sin(a + half) * R
    wedges.push({
      d: `M${f1(ax)} ${f1(ay)}L${f1(bx)} ${f1(by)}L${f1(cx)} ${f1(cy)}Z`,
      o: f1(spec.opacity * (0.55 + rand() * 0.8) * 100) / 100,
    })
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${TONE_TEXT[tone]} ${className}`}
      fill="currentColor"
    >
      {wedges.map((w, i) => (
        <path key={i} d={w.d} opacity={w.o} />
      ))}
    </svg>
  )
}

/* -------------------------------------------------------------------------
   SpeedStreaks — directional speed lines.

   Long tapered slivers trailing off in one direction. Horizontal for section
   transitions and card hovers; diagonal for a dash of momentum on a dark
   panel. The streaks fade out along their trailing edge with a mask so they
   never end in a hard cut.
   ---------------------------------------------------------------------- */

export function SpeedStreaks({
  direction = 'horizontal',
  from = 'right',
  density = 'mid',
  tone = 'ink',
  seed = 'streaks',
  fade = true,
  className = '',
}: {
  direction?: 'horizontal' | 'diagonal' | 'vertical'
  /** The edge the streaks come in from. */
  from?: 'left' | 'right'
  density?: 'low' | 'mid' | 'high'
  tone?: MotifTone
  seed?: string
  fade?: boolean
  className?: string
}) {
  const count = { low: 14, mid: 26, high: 44 }[density]
  const rand = seeded(`${seed}:${direction}:${density}`)
  const dir = from === 'right' ? -1 : 1

  // Overscan so the field still covers the box after rotation.
  const streaks: { d: string; o: number }[] = []
  for (let i = 0; i < count; i++) {
    const y = -40 + rand() * 180
    const start = from === 'right' ? 240 - rand() * 90 : -40 + rand() * 90
    const len = 30 + rand() * 110
    const t = 0.25 + rand() * 1.5
    const end = start + dir * len
    streaks.push({
      d: `M${f1(start)} ${f1(y - t / 2)}L${f1(start)} ${f1(y + t / 2)}L${f1(end)} ${f1(y)}Z`,
      o: f1((0.16 + rand() * 0.34) * 100) / 100,
    })
  }

  const rotate = { horizontal: 0, diagonal: from === 'right' ? -24 : 24, vertical: 90 }[direction]
  const towards = from === 'right' ? 'to left' : 'to right'
  const maskStyle: CSSProperties | undefined = fade
    ? {
        WebkitMaskImage: `linear-gradient(${towards}, #000 15%, transparent 92%)`,
        maskImage: `linear-gradient(${towards}, #000 15%, transparent 92%)`,
      }
    : undefined

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${TONE_TEXT[tone]} ${className}`}
      style={maskStyle}
      fill="currentColor"
    >
      <g transform={rotate ? `rotate(${rotate} 100 50)` : undefined}>
        {streaks.map((s, i) => (
          <path key={i} d={s.d} opacity={s.o} />
        ))}
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------------------
   GlowOrb — a soft light source for the night-room atmosphere.

   A monitor's bloom, a desk lamp, a strip light behind a shelf. Pure radial
   gradients, so it costs nothing to paint. Position it with `className`
   (e.g. `-top-24 left-1/3`) inside a `relative overflow-hidden` parent.
   ---------------------------------------------------------------------- */

export function GlowOrb({
  tone = 'electric',
  size = 320,
  intensity = 'mid',
  blend = 'normal',
  pulse = false,
  className = '',
  style,
}: {
  tone?: Exclude<MotifTone, 'inherit'>
  size?: number | string
  intensity?: 'low' | 'mid' | 'high'
  /** `screen` on dark panels, `multiply` on paper, `normal` otherwise. */
  blend?: 'normal' | 'screen' | 'multiply'
  /** Slow breathing. Decorative; ends fully visible under reduced motion. */
  pulse?: boolean
  className?: string
  style?: CSSProperties
}) {
  const [core, mid] = { low: [26, 8], mid: [44, 14], high: [66, 24] }[intensity]
  const v = TONE_VAR[tone]
  const dim = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full ${pulse ? 'motion-safe:animate-pulse' : ''} ${className}`}
      style={{
        width: dim,
        height: dim,
        background: `radial-gradient(circle closest-side, color-mix(in srgb, var(${v}) ${core}%, transparent) 0%, color-mix(in srgb, var(${v}) ${mid}%, transparent) 42%, transparent 100%)`,
        mixBlendMode: blend,
        animationDuration: pulse ? '5s' : undefined,
        ...style,
      }}
    />
  )
}

/* -------------------------------------------------------------------------
   PanelCut — a diagonal manga panel divider between two sections.

   A full-width band: the top tone above the cut, the bottom tone below it,
   and an ink rule along the diagonal — the gutter between two panels on a
   page. Pure clip-path and one non-scaling SVG stroke, so the rule stays a
   crisp 3px at any width.
   ---------------------------------------------------------------------- */

type PanelCutTone =
  | 'ink'
  | 'surface'
  | 'surface-2'
  | 'panel'
  | 'panel-2'
  | 'shu'
  | 'shu-dim'
  | 'paper'
  | 'transparent'

const CUT_BG: Record<PanelCutTone, string> = {
  ink: 'bg-ink',
  surface: 'bg-surface',
  'surface-2': 'bg-surface-2',
  panel: 'bg-panel',
  'panel-2': 'bg-panel-2',
  shu: 'bg-shu',
  'shu-dim': 'bg-shu-dim',
  paper: 'bg-paper',
  transparent: 'bg-transparent',
}

export function PanelCut({
  top = 'ink',
  bottom = 'panel',
  slope = 'rise',
  height = 56,
  rule = 'shu',
  className = '',
}: {
  /** Background of the section above; fills the band above the cut. */
  top?: PanelCutTone
  /** Background of the section below; fills the band below the cut. */
  bottom?: PanelCutTone
  /** `rise` climbs left-to-right, `fall` descends. */
  slope?: 'rise' | 'fall'
  height?: number
  /** The rule drawn along the cut. `none` for a bare colour change. */
  rule?: 'shu' | 'ink' | 'paper' | 'none'
  className?: string
}) {
  const clip =
    slope === 'rise' ? 'polygon(0 100%, 100% 0, 100% 100%)' : 'polygon(0 0, 100% 100%, 0 100%)'
  const line = slope === 'rise' ? { x1: 0, y1: 100, x2: 100, y2: 0 } : { x1: 0, y1: 0, x2: 100, y2: 100 }
  const ruleClass = { shu: 'text-shu', ink: 'text-paper', paper: 'text-ink', none: '' }[rule]

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden ${CUT_BG[top]} ${className}`}
      style={{ height }}
    >
      <div className={`absolute inset-0 ${CUT_BG[bottom]}`} style={{ clipPath: clip }} />
      {rule !== 'none' && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`absolute inset-0 h-full w-full ${ruleClass}`}
        >
          <line {...line} stroke="currentColor" strokeWidth={3} vectorEffect="non-scaling-stroke" />
        </svg>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------
   SparkleField — a few four-point sparkles at seeded positions.

   The shine on a freshly unboxed thing. Positions, sizes, pinch and rotation
   all come from the seed, so a given field is identical on every build. The
   optional twinkle is a plain pulse that begins and ends fully visible.
   ---------------------------------------------------------------------- */

export function SparkleField({
  seed = 'sparkle',
  count = 6,
  tone = 'shu',
  minSize = 10,
  maxSize = 22,
  twinkle = true,
  className = '',
}: {
  seed?: string
  count?: number
  tone?: MotifTone
  minSize?: number
  maxSize?: number
  twinkle?: boolean
  className?: string
}) {
  const rand = seeded(`${seed}:${count}`)
  const sparkles = Array.from({ length: count }, () => {
    const p = 0.1 + rand() * 0.14
    return {
      left: f1(6 + rand() * 88),
      top: f1(6 + rand() * 88),
      size: Math.round(minSize + rand() * (maxSize - minSize)),
      rot: Math.round((rand() - 0.5) * 30),
      o: f1((0.55 + rand() * 0.45) * 100) / 100,
      delay: f1(rand() * 2.4),
      dur: f1(2.2 + rand() * 1.8),
      d: `M0 -1C${p} ${-p} ${p} ${-p} 1 0C${p} ${p} ${p} ${p} 0 1C${-p} ${p} ${-p} ${p} -1 0C${-p} ${-p} ${-p} ${-p} 0 -1Z`,
    }
  })

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${TONE_TEXT[tone]} ${className}`}
    >
      {sparkles.map((s, i) => (
        <svg
          key={i}
          viewBox="-1.1 -1.1 2.2 2.2"
          className={`absolute ${twinkle ? 'motion-safe:animate-pulse' : ''}`}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: s.o,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
          fill="currentColor"
        >
          <path d={s.d} />
        </svg>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------
   CategoryPattern — the art-directed placeholder.

   The brief asked for placeholders that look deliberately art-directed rather
   than like empty coloured rectangles, with a distinct pattern family per
   category. Each is an original SVG that says something true about the
   category: a desk grid, a stitch line, a display plinth, a lanyard, a frame.

   These appear ONLY where no licensed product image exists. They are never
   presented as photographs of the product.
   ---------------------------------------------------------------------- */

const PATTERNS: Record<Category, { accent: string; render: React.ReactNode }> = {
  'Desk & Room': {
    accent: 'text-blue',
    render: (
      <>
        <path d="M8 78h104M8 78v12M112 78v12" stroke="currentColor" strokeWidth="2" />
        <rect x="30" y="40" width="60" height="34" stroke="currentColor" strokeWidth="2" />
        <path d="M52 74h16v4H52z" fill="currentColor" />
        <path d="M20 66h8M92 62h8" stroke="currentColor" strokeWidth="2" opacity=".6" />
      </>
    ),
  },
  'Wall Art': {
    accent: 'text-lilac',
    render: (
      <>
        <rect x="26" y="22" width="68" height="62" stroke="currentColor" strokeWidth="2" />
        <rect x="36" y="32" width="48" height="42" stroke="currentColor" strokeWidth="1" opacity=".55" />
        <path d="M36 66l14-18 10 12 8-8 16 14" stroke="currentColor" strokeWidth="2" />
        <circle cx="70" cy="42" r="5" fill="currentColor" opacity=".8" />
      </>
    ),
  },
  Accessories: {
    accent: 'text-orange',
    render: (
      <>
        <path d="M40 34h40l8 46H32l8-46z" stroke="currentColor" strokeWidth="2" />
        <path d="M50 34V26a10 10 0 0 1 20 0v8" stroke="currentColor" strokeWidth="2" />
        <path d="M32 58h56" stroke="currentColor" strokeWidth="1" opacity=".5" />
      </>
    ),
  },
  Apparel: {
    accent: 'text-green',
    render: (
      <>
        <path d="M44 28l-18 10 8 14 8-5v33h36V47l8 5 8-14-18-10-13 7-13-7z" stroke="currentColor" strokeWidth="2" />
        <path d="M44 74h32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity=".7" />
        <path d="M44 68h32" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity=".4" />
      </>
    ),
  },
  'Storage & Display': {
    accent: 'text-shu',
    render: (
      <>
        <path d="M22 80h76" stroke="currentColor" strokeWidth="2" />
        <rect x="34" y="56" width="24" height="24" stroke="currentColor" strokeWidth="2" />
        <rect x="64" y="44" width="24" height="36" stroke="currentColor" strokeWidth="2" />
        <path d="M30 34h60" stroke="currentColor" strokeWidth="1" opacity=".5" />
      </>
    ),
  },
}

export function CategoryPattern({
  category,
  seed,
  className = '',
  label,
}: {
  category: Category
  seed: string
  className?: string
  label: string
}) {
  const pattern = PATTERNS[category] ?? PATTERNS['Desk & Room']

  // A stable per-pick rotation so a grid of placeholders does not read as one
  // repeated tile, without introducing randomness that changes between builds.
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0
  const tilt = ((Math.abs(h) % 7) - 3) * 0.6

  return (
    <div
      role="img"
      aria-label={label}
      className={`halftone relative flex aspect-[4/3] w-full max-w-full items-center justify-center overflow-hidden bg-surface-2 ${className}`}
    >
      <svg
        viewBox="0 0 120 100"
        aria-hidden="true"
        fill="none"
        className={`h-[72%] w-[72%] ${pattern.accent}`}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {pattern.render}
      </svg>
      <span className="label-xs absolute right-0 bottom-0 m-2 bg-paper px-2 py-1 text-ink">
        No photo yet
      </span>
    </div>
  )
}
