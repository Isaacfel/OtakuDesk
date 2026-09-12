import Link from 'next/link'
import type { Category } from '@/data/types'
import { EditorialBadge, GlowOrb, SpeedStreaks } from './motifs'

/**
 * "Build your setup" — three panels for planning a room, read left to right
 * like a page: Arc 01, Arc 02, the final panel.
 *
 * This is room planning, not a bundle. There is no combined price and no
 * discount, because neither is ours to give: each step simply opens the Desk
 * filtered to the category that belongs at that stage.
 *
 * Each panel's art is lit in its own colour and cut on the diagonal where it
 * meets the copy; speed streaks run through the gutters between panels so
 * the three read as one motion rather than three tiles.
 */

type Step = {
  label: string
  title: string
  body: string
  category: Category
  tone: 'blue' | 'lilac' | 'orange'
  art: React.ReactNode
}

const STEPS: Step[] = [
  {
    label: 'Arc 01',
    title: 'Start with the desk',
    body: 'The mat, the riser, the light. What sits at hand decides how the whole room reads, so it comes first.',
    category: 'Desk & Room',
    tone: 'blue',
    art: (
      <>
        <ellipse cx="70" cy="60" rx="46" ry="30" fill="currentColor" opacity="0.16" />
        <path d="M10 92h120" stroke="currentColor" strokeWidth="3" />
        <rect x="40" y="38" width="60" height="38" rx="2" fill="#100e13" stroke="currentColor" strokeWidth="3" />
        <rect x="46" y="44" width="48" height="26" fill="currentColor" opacity="0.55" />
        <path d="M64 76v10h12V76" stroke="currentColor" strokeWidth="3" />
        <path d="M54 86h32" stroke="currentColor" strokeWidth="3" />
        <path d="M20 92V60l14-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="36" cy="46" r="5" fill="#ff9d42" opacity="0.7" />
        <rect x="104" y="80" width="18" height="12" rx="1" fill="currentColor" />
        <path d="M48 96h44" stroke="currentColor" strokeWidth="2" opacity="0.8" />
      </>
    ),
  },
  {
    label: 'Arc 02',
    title: 'Add the wall',
    body: 'One focal print, hung where it catches the light rather than fights it. The wall is where restraint pays off most.',
    category: 'Wall Art',
    tone: 'lilac',
    art: (
      <>
        <ellipse cx="70" cy="50" rx="52" ry="40" fill="currentColor" opacity="0.14" />
        <rect x="28" y="14" width="84" height="74" fill="#100e13" stroke="currentColor" strokeWidth="3" />
        <rect x="38" y="24" width="64" height="54" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="82" cy="44" r="9" fill="#ff9d42" opacity="0.9" />
        <path d="M38 70l16-18 12 12 8-8 20 14" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M70 6v8" stroke="currentColor" strokeWidth="2" />
        <path d="M20 96h100" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <path d="M112 30l10-6M112 40h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </>
    ),
  },
  {
    label: 'Final panel',
    title: 'Finish with the details',
    body: 'Display, protection, and shelf lighting. The pieces that make a collection look kept rather than stored.',
    category: 'Storage & Display',
    tone: 'orange',
    art: (
      <>
        <path d="M20 20h100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M20 24l-8 22h116l-8-22z" fill="currentColor" opacity="0.18" />
        <ellipse cx="70" cy="70" rx="50" ry="26" fill="currentColor" opacity="0.1" />
        <path d="M10 92h120" stroke="currentColor" strokeWidth="3" />
        <rect x="24" y="66" width="30" height="26" fill="#100e13" stroke="currentColor" strokeWidth="3" />
        <rect x="62" y="50" width="30" height="42" fill="#100e13" stroke="currentColor" strokeWidth="3" />
        <rect x="100" y="36" width="24" height="56" fill="#100e13" stroke="currentColor" strokeWidth="3" />
        <path d="M77 58c-4 0-6 3-6 6 0 2 1 3 2 4-3 1-5 4-5 7v17h18V75c0-3-2-6-5-7 1-1 2-2 2-4 0-3-2-6-6-6z" fill="currentColor" opacity="0.85" />
        <rect x="30" y="74" width="18" height="18" fill="currentColor" opacity="0.3" />
        <path d="M104 40l12 14" stroke="currentColor" strokeWidth="3" opacity="0.3" />
      </>
    ),
  },
]

const TONE = {
  blue: { badge: 'blue' as const, text: 'text-blue', field: 'blueprint', glow: 'blue' as const },
  lilac: { badge: 'lilac' as const, text: 'text-lilac', field: 'halftone-lg', glow: 'lilac' as const },
  orange: { badge: 'orange' as const, text: 'text-orange', field: 'speed-lines', glow: 'orange' as const },
}

const CUT = [
  'polygon(0 0, 100% 0, 100% calc(100% - 22px), 0 100%)',
  'polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 22px))',
  'polygon(0 0, 100% 0, 100% calc(100% - 22px), 0 100%)',
]

export function SetupPath() {
  return (
    <div className="relative overflow-hidden border-2 border-line bg-surface">
      {/* One motion through the whole strip. */}
      <SpeedStreaks from="left" density="low" tone="ink" seed="setup" className="opacity-40" />

      <ol className="relative grid divide-y-2 divide-line md:grid-cols-3 md:divide-x-2 md:divide-y-0">
        {STEPS.map((step, i) => {
          const tone = TONE[step.tone]
          return (
            <li key={step.label} className="relative">
              <Link
                href={{ pathname: '/desk', query: { category: step.category } }}
                className="group flex h-full flex-col transition-colors hover:bg-surface-2/70"
              >
                <div
                  aria-hidden="true"
                  className={`relative aspect-[16/10] overflow-hidden bg-panel-2 ${tone.text}`}
                  style={{ clipPath: CUT[i] }}
                >
                  <div className={`${tone.field} absolute inset-0 opacity-50`} />
                  <GlowOrb tone={tone.glow} size="110%" intensity="mid" blend="screen" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  <svg
                    viewBox="0 0 140 100"
                    fill="none"
                    className="absolute inset-0 h-full w-full p-6 transition-transform duration-300 group-hover:-translate-y-1 sm:p-8"
                  >
                    {step.art}
                  </svg>
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <EditorialBadge tone="ink">{step.label}</EditorialBadge>
                  </div>
                  <span className="tnum absolute top-3 right-3 text-xs text-panel-muted">
                    {String(i + 1).padStart(2, '0')} / 03
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5 pt-3 sm:p-6 sm:pt-4">
                  <h3 className="text-2xl text-paper">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-2">{step.body}</p>
                  <span className={`label-xs mt-5 inline-flex items-center gap-2 ${tone.text}`}>
                    Open {step.category}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>

              {/* Path connector between panels on wide screens. */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-[30%] -right-3.5 z-10 hidden h-7 w-7 -translate-y-1/2 items-center justify-center border-2 border-paper bg-ink text-xs text-paper md:flex"
                >
                  →
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
