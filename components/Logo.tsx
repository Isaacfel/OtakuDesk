/**
 * The Otakudesk logo: a small desk with a face, and the name beside it.
 *
 * The desk is drawn as line art in the text colour with a red tabletop and a
 * red mug on top. The face (two eyes, a smile, a blush) sits on the drawer
 * front. The name is OTAKUDESK in spaced Poppins capitals, one colour, so the
 * desk does the talking.
 */

/**
 * The desk mascot on its own. Strokes use `currentColor`, so set a text
 * colour on the parent to recolour the line art; the tabletop and mug take
 * the accent red from the theme.
 */
export function DeskMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="2 2 124 98"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* Legs. */}
      <rect x="16" y="44" width="12" height="52" rx="4" fill="var(--bg)" />
      <rect x="92" y="44" width="12" height="52" rx="4" fill="var(--bg)" />
      {/* Drawer front, with the face. */}
      <rect x="24" y="44" width="72" height="34" rx="8" fill="var(--bg)" />
      <g stroke="none" fill="currentColor">
        <circle cx="44.6" cy="58" r="4.8" />
        <circle cx="75.4" cy="58" r="4.8" />
      </g>
      <path d="M52.3 65.7q7.7 6.6 15.4 0" strokeWidth="4.4" />
      <g stroke="none" fill="#ffb3c0">
        <ellipse cx="35.8" cy="65.7" rx="5.1" ry="3.1" />
        <ellipse cx="84.2" cy="65.7" rx="5.1" ry="3.1" />
      </g>
      {/* Tabletop. */}
      <rect x="6" y="28" width="108" height="16" rx="6" fill="var(--accent)" />
      {/* Mug. */}
      <path d="M112 12h4a5.5 5.5 0 0 1 0 11h-4" />
      <rect x="96" y="6" width="16" height="22" rx="3" fill="var(--accent)" />
    </svg>
  )
}

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2.5 text-fg">
      <DeskMark className={`shrink-0 ${lg ? 'h-12' : 'h-9'} w-auto`} />
      <span
        className={`font-display font-bold uppercase leading-none ${
          lg ? 'text-[22px] tracking-[0.18em]' : 'text-[17px] tracking-[0.16em]'
        }`}
      >
        Otakudesk
      </span>
    </span>
  )
}

/** The stacked version: desk on top, name underneath. For pages and social. */
export function LogoStacked() {
  return (
    <span className="inline-flex flex-col items-center gap-3 text-fg">
      <DeskMark className="h-24 w-auto" />
      <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.22em] pl-[0.22em]">
        Otakudesk
      </span>
    </span>
  )
}
