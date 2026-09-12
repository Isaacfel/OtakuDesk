import { useId } from 'react'

/**
 * The desk spirit — Otakudesk's original mascot.
 *
 * WHAT IT IS
 * A slip of the site's own paper stock that has come to life: a soft rounded
 * sheet with one dog-eared corner folded down (the fold shows a red underside,
 * the only accent on the body), two large lash-lined eyes, stub mitten arms and
 * a blush. It hovers a finger's width above the desk and watches you work.
 *
 * WHY IT IS ORIGINAL BY CONSTRUCTION
 * It is built from the site's own print metaphor — a sheet of paper, a fold, an
 * ink line — rather than from any animal, ghost, star or blob silhouette, so it
 * has no existing-character neighbour to be mistaken for. Every path below was
 * written by hand in this file. Nothing is traced, referenced or imported.
 *
 * DRAWING RULES
 * - Line work is `currentColor`, so callers pick the ink with a text colour.
 * - The body fill and accent are theme tokens (`--surface`, `--shu`) with
 *   overrides, so it sits correctly on paper, on the dark panels, and in the
 *   dark theme.
 * - Flat cel shading: ONE shadow tone (currentColor at low opacity), one blush.
 * - Eye highlights are cut OUT of the pupil with `fill-rule: evenodd`, so the
 *   highlight is always the body colour underneath. That is what lets the
 *   head-only `MascotMark` be pure `currentColor` and render in the favicon.
 * - Animation is decorative only, starts from and returns to the complete
 *   pose, and is switched off under `prefers-reduced-motion`.
 */

export type MascotPose = 'idle' | 'peek' | 'point' | 'sleep'

export type MascotProps = {
  /** Rendered width and height. CSS sizing via `className` still wins. */
  size?: number | string
  pose?: MascotPose
  className?: string
  /** Accessible description. Pass `null` to mark the drawing decorative. */
  title?: string | null
  /** Body colour. Defaults to the paper surface token. */
  fill?: string
  /** Accent colour for the folded corner and blush. Defaults to the action red. */
  accent?: string
  /** Gentle hover / breathing bob. Decorative; off under reduced motion. */
  animate?: boolean
}

const TITLES: Record<MascotPose, string> = {
  idle: "Otakudesk's desk spirit: a small paper-slip creature with a folded red corner, hovering and smiling",
  peek: "Otakudesk's desk spirit peeking over the edge of a desk, eyes wide, hands on the edge",
  point: "Otakudesk's desk spirit leaning forward and pointing to the right",
  sleep: "Otakudesk's desk spirit asleep, eyes closed, drifting with a trail of sleep bubbles",
}

/* Body geometry, in a 120 x 120 box. The body is a rounded sheet spanning
   x 28-84 and y 26-90, with its top-right corner cut on the diagonal and the
   cut-off triangle folded back over the face as a dog-ear. */
const BODY = 'M44 26H68L84 42V74A16 16 0 0 1 68 90H44A16 16 0 0 1 28 74V42A16 16 0 0 1 44 26Z'
const FLAP = 'M68 26C64.6 31.5 64.6 36.8 68 42H84Z'
const SHADOW = 'M28 58V74A16 16 0 0 0 44 90H72C56 89 38 80 28 58Z'

const INK = 'currentColor'
const STROKE = 3
const MASCOT_STYLE = `
@keyframes od-mascot-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-2.5px)}}
.od-mascot-bob{animation:od-mascot-bob 3.4s ease-in-out infinite}
.od-mascot-breathe{animation:od-mascot-bob 5.2s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.od-mascot-bob,.od-mascot-breathe{animation:none}}
`

/** An ellipse as a path subpath, so it can be combined under one fill rule. */
function ellipseD(cx: number, cy: number, rx: number, ry: number) {
  return `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`
}

/** A large anime eye: tall pupil with two highlight dots cut out of it. */
function OpenEye({ cx, cy, wide = false }: { cx: number; cy: number; wide?: boolean }) {
  const rx = wide ? 7 : 6.5
  const ry = wide ? 9.5 : 8.5
  const hi = wide ? 2.9 : 2.4
  const d =
    ellipseD(cx, cy, rx, ry) +
    ellipseD(cx - 2.2, cy - 3.2, hi, hi) +
    ellipseD(cx + 2.6, cy + 3.6, 1.1, 1.1)
  return (
    <>
      <path d={d} fill={INK} fillRule="evenodd" />
      {/* The upper lash line — the single stroke that makes the eye read as anime. */}
      <path
        d={`M${cx - 8} ${cy - 3}Q${cx} ${cy - (wide ? 15 : 14)} ${cx + 8} ${cy - 3}`}
        stroke={INK}
        strokeWidth={2.4}
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

/** A contented closed eye: a downward arc. */
function ClosedEye({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path
      d={`M${cx - 6} ${cy - 1}Q${cx} ${cy + 5} ${cx + 6} ${cy - 1}`}
      stroke={INK}
      strokeWidth={2.6}
      strokeLinecap="round"
      fill="none"
    />
  )
}

/** The head-and-body sheet, shared by every pose. */
function Sheet({ fill, accent, blush = true }: { fill: string; accent: string; blush?: boolean }) {
  return (
    <>
      <path d={BODY} fill={fill} />
      <path d={SHADOW} fill={INK} opacity={0.13} />
      <path d={BODY} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" fill="none" />
      {/* The folded corner. Its underside is the one accent on the body. */}
      <path d={FLAP} fill={accent} stroke={INK} strokeWidth={STROKE} strokeLinejoin="round" />
      {blush && (
        <>
          <ellipse cx={37} cy={63} rx={4} ry={2.2} fill={accent} opacity={0.5} />
          <ellipse cx={75} cy={63} rx={4} ry={2.2} fill={accent} opacity={0.5} />
        </>
      )}
    </>
  )
}

/** A stub mitten arm, drawn on top of the body edge so it reads as attached. */
function Arm({
  cx,
  cy,
  tilt,
  fill,
}: {
  cx: number
  cy: number
  tilt: number
  fill: string
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={4.6}
      ry={7}
      transform={`rotate(${tilt} ${cx} ${cy})`}
      fill={fill}
      stroke={INK}
      strokeWidth={2.6}
    />
  )
}

/** A small four-point spark, used as the spirit's own little flourish. */
function Spark({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  const p = r * 0.16
  return (
    <path
      d={`M${cx} ${cy - r}C${cx + p} ${cy - p} ${cx + p} ${cy - p} ${cx + r} ${cy}C${cx + p} ${cy + p} ${cx + p} ${cy + p} ${cx} ${cy + r}C${cx - p} ${cy + p} ${cx - p} ${cy + p} ${cx - r} ${cy}C${cx - p} ${cy - p} ${cx - p} ${cy - p} ${cx} ${cy - r}Z`}
      fill={fill}
    />
  )
}

export function Mascot({
  size = 96,
  pose = 'idle',
  className = '',
  title,
  fill = 'var(--surface)',
  accent = 'var(--shu)',
  animate = true,
}: MascotProps) {
  const rawId = useId()
  const clipId = `od-peek-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`
  const label = title === undefined ? TITLES[pose] : title
  const a11y = label === null ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': label }
  const bobClass = !animate ? '' : pose === 'sleep' ? 'od-mascot-breathe' : pose === 'peek' ? '' : 'od-mascot-bob'

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      fill="none"
      {...a11y}
    >
      {animate && <style>{MASCOT_STYLE}</style>}

      {pose === 'peek' && (
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="120" height="66" />
          </clipPath>
        </defs>
      )}

      {/* Ground shadow — the cue that it floats. Stays put while the body bobs. */}
      {pose !== 'peek' && (
        <ellipse cx={56} cy={101} rx={pose === 'sleep' ? 22 : 19} ry={3.4} fill={INK} opacity={0.16} />
      )}

      {pose === 'idle' && (
        <g className={bobClass}>
          <Sheet fill={fill} accent={accent} />
          <Arm cx={27} cy={66} tilt={18} fill={fill} />
          <Arm cx={85} cy={66} tilt={-18} fill={fill} />
          <OpenEye cx={45} cy={56} />
          <OpenEye cx={67} cy={56} />
          <path d="M52 68Q56 72.5 60 68" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
          <Spark cx={95} cy={24} r={5} fill={accent} />
        </g>
      )}

      {pose === 'point' && (
        <g className={bobClass}>
          <g transform="rotate(5 56 60)">
            <Sheet fill={fill} accent={accent} />
            <Arm cx={27} cy={66} tilt={18} fill={fill} />
            {/* The pointing arm: an outlined limb made of two strokes, then a mitten. */}
            <path d="M82 62Q94 60 103 52" stroke={INK} strokeWidth={9.5} strokeLinecap="round" />
            <path d="M82 62Q94 60 103 52" stroke={fill} strokeWidth={4.6} strokeLinecap="round" />
            <circle cx={104} cy={51} r={5} fill={fill} stroke={INK} strokeWidth={2.6} />
            <path d="M106 47L111 41" stroke={INK} strokeWidth={5.6} strokeLinecap="round" />
            <path d="M106 47L111 41" stroke={fill} strokeWidth={1.6} strokeLinecap="round" />
            <OpenEye cx={45} cy={56} />
            <OpenEye cx={67} cy={56} />
            <circle cx={56} cy={69.5} r={2.4} fill={INK} />
          </g>
          {/* Emphasis ticks off the fingertip. */}
          <path d="M115 36l4-4M117 44h5M112 31l1-5" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <Spark cx={97} cy={22} r={4.5} fill={accent} />
        </g>
      )}

      {pose === 'sleep' && (
        <g className={bobClass}>
          <g transform="rotate(-8 56 60)">
            <Sheet fill={fill} accent={accent} />
            <Arm cx={30} cy={70} tilt={30} fill={fill} />
            <Arm cx={82} cy={70} tilt={-30} fill={fill} />
            <ClosedEye cx={45} cy={56} />
            <ClosedEye cx={67} cy={56} />
            <path d="M54 69Q56 71 58 69" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          </g>
          {/* Sleep bubbles, drifting up and away. Pulse is decorative and ends complete. */}
          <circle cx={92} cy={44} r={2} stroke={INK} strokeWidth={2} className="motion-safe:animate-pulse" />
          <circle cx={99} cy={34} r={3} stroke={INK} strokeWidth={2} className="motion-safe:animate-pulse" style={{ animationDelay: '0.5s' }} />
          <circle cx={108} cy={21} r={4.2} stroke={INK} strokeWidth={2} className="motion-safe:animate-pulse" style={{ animationDelay: '1s' }} />
        </g>
      )}

      {pose === 'peek' && (
        <>
          <g clipPath={`url(#${clipId})`}>
            <Sheet fill={fill} accent={accent} blush={false} />
            <OpenEye cx={45} cy={54} wide />
            <OpenEye cx={67} cy={54} wide />
          </g>
          {/* The desk edge, and two mittens gripping it. */}
          <path d="M6 66H114" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" />
          <ellipse cx={40} cy={66.5} rx={6.5} ry={4.2} fill={fill} stroke={INK} strokeWidth={2.6} />
          <ellipse cx={72} cy={66.5} rx={6.5} ry={4.2} fill={fill} stroke={INK} strokeWidth={2.6} />
          <Spark cx={95} cy={22} r={4.5} fill={accent} />
        </>
      )}
    </svg>
  )
}

/* -------------------------------------------------------------------------
   MascotMark — the head-only mark.

   Same character, cropped to the sheet, in a 48-box, drawn ONLY with
   `currentColor` (fills, strokes, opacity and an evenodd cut-out for the eye
   highlights). No CSS variables, no clip paths, no ids. That constraint is
   deliberate: `app/icon.tsx` rasterises this through `next/og`, which can only
   resolve `currentColor`. It is also what lets it sit in the wordmark chip and
   in empty states with a single text-colour class.
   ---------------------------------------------------------------------- */

export function MascotMark({
  className = '',
  title = 'Otakudesk desk spirit',
}: {
  className?: string
  title?: string
}) {
  const eye = (cx: number, cy: number) =>
    ellipseD(cx, cy, 4.2, 5.4) + ellipseD(cx - 1.4, cy - 2, 1.6, 1.6) + ellipseD(cx + 1.7, cy + 2.3, 0.75, 0.75)
  const lid = (cx: number, cy: number) => `M${cx - 5.2} ${cy - 2}Q${cx} ${cy - 9} ${cx + 5.2} ${cy - 2}`

  return (
    <svg viewBox="0 0 48 48" role="img" aria-label={title} className={className} fill="none">
      {/* One cel-shadow tone along the lower-left of the sheet. */}
      <path d="M7 27V33A10 10 0 0 0 17 43H34C24 42 13 37 7 27Z" fill="currentColor" opacity="0.14" />
      {/* The sheet. */}
      <path
        d="M17 5H29.5L41 16.5V33A10 10 0 0 1 31 43H17A10 10 0 0 1 7 33V15A10 10 0 0 1 17 5Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      {/* The dog-eared corner, folded over the face. */}
      <path d="M29.5 5C27 9 27 13 29.5 16.5H41Z" fill="currentColor" />
      {/* Eyes: pupils with highlights cut out, so they show whatever is behind. */}
      <path d={eye(17.5, 25) + eye(30.5, 25)} fill="currentColor" fillRule="evenodd" />
      <path d={lid(17.5, 25) + lid(30.5, 25)} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Mouth and blush. */}
      <path d="M21.5 33.5Q24 36 26.5 33.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <ellipse cx="11.5" cy="29.5" rx="2.6" ry="1.4" fill="currentColor" opacity="0.35" />
      <ellipse cx="36.5" cy="29.5" rx="2.6" ry="1.4" fill="currentColor" opacity="0.35" />
    </svg>
  )
}
