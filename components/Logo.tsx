/**
 * The Otakudesk wordmark. The O of OTAKU is a desk: a monitor whose thick
 * rounded frame reads as the letter's ring, on a tabletop with two legs. One
 * red shape, followed by TAKU in ink and DESK in red, set in Kanit Extra-Bold
 * Italic. Original, no characters, nothing but the name.
 */

/**
 * The desk-as-O glyph. Sized in em so it sits on the baseline at the letters'
 * cap height whatever the wordmark's font size.
 */
export function DeskO({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 34"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={className}
      // Cap height of Kanit, slanted to match its italic.
      style={{ height: '0.8em', width: 'auto', transform: 'skewX(-11deg)' }}
    >
      {/* Monitor: a rounded frame with the screen cut out, like an O's counter. */}
      <path d="M6 0h18a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm0 5.5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6 16.5h18a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 24 5.5z" />
      {/* Stand. */}
      <rect x="13" y="22" width="4" height="3.5" />
      {/* Tabletop. */}
      <rect x="0" y="25.5" width="30" height="4" rx="1" />
      {/* Legs, splayed with the italic. */}
      <path d="M4 29.5h4.5L6.5 34H2z" />
      <path d="M21.5 29.5H26l2 4.5h-4.5z" />
    </svg>
  )
}

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <span
      className={`inline-flex items-baseline font-display uppercase leading-none tracking-tight ${lg ? 'text-3xl' : 'text-2xl'}`}
    >
      <span className="sr-only">Otakudesk</span>
      <DeskO className="mr-[0.06em] shrink-0 text-accent" />
      <span aria-hidden="true" className="text-fg">
        taku
      </span>
      <span aria-hidden="true" className="text-accent">
        desk
      </span>
    </span>
  )
}
