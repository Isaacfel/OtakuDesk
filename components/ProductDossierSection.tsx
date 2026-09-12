/**
 * The dossier's section heading.
 *
 * The pick page reads as a numbered file rather than a store listing: every
 * section carries a two-digit index in the action red, the way an editorial
 * spread numbers its captions. The numbering is presentational — the section
 * order is fixed by the page, so the numbers are passed in rather than
 * counted, and a section that is omitted (no caveat, no alternatives) leaves
 * a gap the reader will never notice.
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
    <div className={`flex items-start gap-4 border-t-2 pt-4 ${rule}`}>
      <span aria-hidden="true" className={`tnum shrink-0 pt-1.5 text-sm font-semibold ${num}`}>
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
