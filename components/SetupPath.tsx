import Link from 'next/link'
import type { Category } from '@/data/types'
import { EditorialBadge } from './motifs'

/**
 * "Build your setup" — a three-panel path for planning a room.
 *
 * This is room planning, not a bundle. There is no combined price and no
 * discount, because neither is ours to give: each step simply opens the Desk
 * filtered to the category that belongs at that stage. The blueprint grid is
 * used here on purpose — globals.css reserves it for desk and setup contexts.
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
        <path d="M10 92h120" stroke="currentColor" strokeWidth="3" />
        <rect x="40" y="38" width="60" height="38" rx="2" stroke="currentColor" strokeWidth="3" />
        <path d="M64 76v10h12V76" stroke="currentColor" strokeWidth="3" />
        <path d="M54 86h32" stroke="currentColor" strokeWidth="3" />
        <path d="M20 92V60l14-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <rect x="104" y="80" width="18" height="12" rx="1" fill="currentColor" />
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
        <rect x="28" y="14" width="84" height="74" stroke="currentColor" strokeWidth="3" />
        <rect x="38" y="24" width="64" height="54" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="82" cy="44" r="9" fill="currentColor" opacity="0.85" />
        <path d="M38 70l16-18 12 12 8-8 20 14" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M70 6v8" stroke="currentColor" strokeWidth="2" />
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
        <path d="M10 92h120" stroke="currentColor" strokeWidth="3" />
        <rect x="24" y="66" width="30" height="26" stroke="currentColor" strokeWidth="3" />
        <rect x="62" y="50" width="30" height="42" stroke="currentColor" strokeWidth="3" />
        <rect x="100" y="36" width="24" height="56" stroke="currentColor" strokeWidth="3" />
        <path d="M20 20h100" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M20 24l-8 18h116l-8-18z" fill="currentColor" opacity="0.15" />
      </>
    ),
  },
]

const TONE = {
  blue: { badge: 'blue' as const, text: 'text-blue', soft: 'bg-blue-soft' },
  lilac: { badge: 'lilac' as const, text: 'text-lilac', soft: 'bg-lilac-soft' },
  orange: { badge: 'orange' as const, text: 'text-orange', soft: 'bg-orange-soft' },
}

export function SetupPath() {
  return (
    <div className="blueprint relative border-2 border-paper bg-surface offset-print">
      <ol className="grid divide-y-2 divide-paper md:grid-cols-3 md:divide-x-2 md:divide-y-0">
        {STEPS.map((step, i) => {
          const tone = TONE[step.tone]
          return (
            <li key={step.label} className="relative">
              <Link
                href={{ pathname: '/desk', query: { category: step.category } }}
                className="group flex h-full flex-col p-5 transition-colors hover:bg-surface-2/70 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <EditorialBadge tone={tone.badge}>{step.label}</EditorialBadge>
                  <span className="tnum text-xs text-muted">
                    {String(i + 1).padStart(2, '0')} / 03
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className={`mt-5 flex aspect-[4/3] w-full items-center justify-center ${tone.soft} ${tone.text}`}
                >
                  <svg viewBox="0 0 140 100" fill="none" className="h-[70%] w-[70%] transition-transform duration-300 group-hover:-translate-y-1">
                    {step.art}
                  </svg>
                </div>

                <h3 className="mt-5 text-2xl text-paper">{step.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-2">{step.body}</p>

                <span className={`label-xs mt-5 ${tone.text}`}>
                  Open {step.category} <span aria-hidden="true">→</span>
                </span>
              </Link>

              {/* Path connector between panels on wide screens. */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -right-3 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center border-2 border-paper bg-ink text-xs text-paper md:flex"
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
