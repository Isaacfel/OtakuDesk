/**
 * The Otakudesk wordmark: heavy uppercase display type, slightly italic,
 * OTAKU in ink and DESK in the accent red, with a desk-and-monitor glyph in
 * front drawn at the same visual weight. Original, no characters, no text
 * beyond the name.
 */

/** A desk with a monitor on it, drawn in blocks so it matches the letterforms. */
export function DeskMark({ className = 'h-6 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 30" fill="currentColor" aria-hidden="true" className={className}>
      {/* Monitor and stand. */}
      <rect x="10" y="1" width="20" height="13" rx="1.5" />
      <rect x="18.5" y="14" width="3" height="3" />
      {/* Tabletop. */}
      <rect x="1" y="17" width="38" height="4.5" rx="1" />
      {/* Legs, splayed like the italic letters. */}
      <path d="M6 21.5h4.5L8 30H3.5z" />
      <path d="M29.5 21.5H34l2.5 8.5H32z" />
    </svg>
  )
}

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2">
      <DeskMark className={`shrink-0 text-accent ${lg ? 'h-8 w-11' : 'h-6 w-8'}`} />
      <span
        className={`font-display uppercase italic leading-none tracking-tight ${lg ? 'text-3xl' : 'text-2xl'}`}
        style={{ transform: 'skewX(-6deg)' }}
      >
        <span className="text-fg">Otaku</span>
        <span className="text-accent">desk</span>
      </span>
    </span>
  )
}
