/**
 * The Otakudesk mark: a stylised eye in the accent red, drawn from scratch.
 * No character, no series; the only thing it quotes is the genre's line
 * style. Wordmark beside it, katakana reading underneath.
 */
export function LogoMark({ className = 'h-7 w-11' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" aria-hidden="true" className={className}>
      {/* Upper lid, with the outer-corner flick. */}
      <path d="M6 23C15 9 49 9 58 23" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M57 22l5-6" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* Two lashes. */}
      <path d="M47 11l2-5M40 8.5l1-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lower lid. */}
      <path d="M12 25c8 9 32 9 40 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Iris and highlight. */}
      <circle cx="32" cy="22" r="7" fill="currentColor" />
      <circle cx="34.5" cy="19.5" r="2" fill="#ffffff" />
    </svg>
  )
}

export function Logo({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const lg = size === 'lg'
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className={`text-accent ${lg ? 'h-9 w-14' : 'h-7 w-11'}`} />
      <span className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight text-fg ${lg ? 'text-2xl' : 'text-xl'}`}>
          Otaku<span className="text-accent">desk</span>
        </span>
        <span lang="ja" className="mt-1 text-[10px] font-medium tracking-[0.22em] text-fg-muted">
          オタクデスク
        </span>
      </span>
    </span>
  )
}
