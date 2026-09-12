import { glowVars, GLOW, type CategoryAccent } from './PickThumb'

/**
 * The dossier's section heading.
 *
 * The pick page reads as a numbered file — a collectible's card back —
 * rather than a store listing: every section carries a two-digit index set
 * large in the lit red, the way an action panel numbers its beats. The
 * numbering is presentational: the section order is fixed by the page, so
 * the numbers are passed in rather than counted, and a section that is
 * omitted (no caveat, no alternatives) leaves a gap the reader never notices.
 */
export function DossierHeading({
  n,
  title,
  kicker,
  id,
  tone = 'paper',
  as: Tag = 'h2',
}: {
  n: string
  title: string
  kicker?: string
  id?: string
  tone?: 'paper' | 'dark'
  as?: 'h2' | 'h3'
}) {
  const num = tone === 'dark' ? 'text-shu-electric' : 'text-shu'
  const text = tone === 'dark' ? 'text-panel-type' : 'text-paper'
  const sub = tone === 'dark' ? 'text-panel-muted' : 'text-muted'
  const rule = tone === 'dark' ? 'border-panel-line' : 'border-line'

  return (
    <div className={`relative flex items-start gap-4 border-t pt-5 ${rule}`}>
      {/* A short lit segment at the start of the rule. */}
      <span
        aria-hidden="true"
        className="absolute top-[-1px] left-0 h-px w-12 bg-shu shadow-[0_0_10px_var(--shu)]"
      />
      <span
        aria-hidden="true"
        className={`tnum text-glow-red shrink-0 pt-0.5 font-display text-2xl leading-none font-extrabold sm:text-3xl ${num}`}
      >
        {n}
      </span>
      <div className="min-w-0">
        <Tag id={id} className={`font-display text-2xl leading-tight sm:text-3xl ${text}`}>
          {title}
        </Tag>
        {kicker && (
          <p className={`mt-1.5 max-w-[56ch] text-sm leading-relaxed ${sub}`}>{kicker}</p>
        )}
      </div>
    </div>
  )
}

/**
 * A lit panel: the dossier's standard container. Square, hairline border,
 * and — when given a `light` — a glow in that colour, so each section is
 * its own lamp in the room rather than another box on a page.
 */
export function DossierPanel({
  children,
  light,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  light?: CategoryAccent['cssVar'] | '--paper'
  className?: string
  as?: 'div' | 'section'
}) {
  return (
    <Tag
      style={light ? glowVars(light) : undefined}
      className={`relative border border-line bg-surface ${light ? GLOW : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
