import type { Category } from '@/data/types'

/**
 * Original print motifs.
 *
 * Everything here is drawn from scratch in SVG or CSS. The anime feeling comes
 * from PRINT TECHNIQUE — halftone, speed lines, registration marks, panel
 * gutters, sticker die-cuts — which is a visual vocabulary rather than anyone's
 * intellectual property. There is no franchise artwork, no character
 * reference, and nothing traced.
 *
 * That is not only a legal position, it is the honest one for a site whose
 * whole argument is that it tells you the truth about licensing.
 */

/* -------------------------------------------------------------------------
   Mascot — the drawer spirit.
   An original emblem: a panel doorway with a spark escaping it. Abstract by
   design, so it cannot be mistaken for an existing character. Used as the
   favicon, the empty-state mark, and a small decorative stamp.
   ---------------------------------------------------------------------- */

export function MascotMark({
  className = '',
  title = 'Otakudesk mark',
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
    >
      {/* The panel it steps out of */}
      <rect
        x="6"
        y="8"
        width="30"
        height="34"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
      />
      {/* Gutter, as on a manga page */}
      <path d="M6 20h30" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      {/* The spark escaping the frame — the only element allowed to break it */}
      <path
        d="M34 6l2.6 7.4L44 16l-7.4 2.6L34 26l-2.6-7.4L24 16l7.4-2.6L34 6z"
        fill="currentColor"
      />
      {/* Two dots. Enough to read as alive, not enough to be a face. */}
      <circle cx="16" cy="30" r="2.4" fill="currentColor" />
      <circle cx="26" cy="30" r="2.4" fill="currentColor" />
    </svg>
  )
}

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
  const tones = {
    red: 'bg-shu text-white',
    blue: 'bg-blue text-white',
    lilac: 'bg-lilac text-white',
    green: 'bg-green text-white',
    orange: 'bg-orange text-white',
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
   SpeedBurst — radiating lines behind a focal element. Implies motion without
   animating, which keeps it readable and reduced-motion-safe by default.
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
