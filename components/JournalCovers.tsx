import Link from 'next/link'
import type { CSSProperties } from 'react'
import { loadAllPosts, formatPostDate, type JournalSlug } from '@/app/journal/_posts'
import { EditorialBadge, RegistrationMark } from './motifs'

/**
 * Journal stories as magazine covers.
 *
 * Post metadata comes from `app/journal/_posts.ts`; articles carry no
 * category field, so the label is assigned here by slug with a neutral
 * fallback. The cover graphic is a large print motif deliberately cropped by
 * the panel edge — the "strong crop" of a cover rather than a centred icon.
 *
 * The date shown is the post's own; nothing here is an issue number we made up.
 */

const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

type Cover = {
  label: string
  tone: 'blue' | 'lilac' | 'orange' | 'ink'
  accent: string
  motif: string
}

const COVERS: Partial<Record<JournalSlug, Cover>> = {
  'licensed-vs-bootleg': {
    label: 'Licensing',
    tone: 'lilac',
    accent: '#b7a4ff',
    motif: 'halftone-lg',
  },
  'what-officially-licensed-means': {
    label: 'Licensing',
    tone: 'lilac',
    accent: '#b7a4ff',
    motif: 'speed-lines',
  },
  'anime-desk-without-the-merch-stall': {
    label: 'Setup',
    tone: 'blue',
    accent: '#7f9dff',
    motif: 'blueprint',
  },
  'convention-sling-packing-checklist': {
    label: 'Convention',
    tone: 'orange',
    accent: '#ff9d42',
    motif: 'halftone',
  },
}

const FALLBACK: Cover = { label: 'Notes', tone: 'ink', accent: '#a79e93', motif: 'paper-grain' }

export async function JournalCovers({ limit = 4 }: { limit?: number }) {
  const posts = (await loadAllPosts()).slice(0, limit)

  if (posts.length === 0) {
    return (
      <p className="text-sm text-muted">
        No articles yet.{' '}
        <Link href="/journal" className="text-paper-2 underline underline-offset-2">
          The journal
        </Link>{' '}
        opens as they are written.
      </p>
    )
  }

  return (
    <ul className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:thin] lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
      {posts.map((post, i) => {
        const cover = COVERS[post.slug] ?? FALLBACK
        return (
          <li
            key={post.slug}
            className="w-[76%] shrink-0 snap-start sm:w-[52%] lg:w-auto"
          >
            <Link
              href={`/journal/${post.slug}`}
              className="group relative flex aspect-[3/4] flex-col overflow-hidden border-2 border-paper bg-panel text-panel-type transition-transform duration-300 hover:-translate-y-1 hover:offset-print"
              style={{
                ...ON_DARK,
                background: `linear-gradient(200deg, ${cover.accent}2e, transparent 55%), var(--panel)`,
              }}
            >
              {/* Cover motif, cropped by the frame. */}
              <div
                aria-hidden="true"
                className={`${cover.motif} pointer-events-none absolute -right-16 -bottom-20 h-[75%] w-[110%] opacity-60 transition-transform duration-500 group-hover:-translate-y-2`}
                style={{ '--paper': cover.accent } as CSSProperties}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 top-[14%] h-40 w-40 rounded-full border-[14px] opacity-80 transition-transform duration-500 group-hover:-translate-y-2"
                style={{ borderColor: cover.accent }}
              />
              {/* Fade behind the type so the title reads over any motif. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-panel-2 via-panel-2/85 to-transparent"
              />

              <div className="relative flex items-start justify-between p-4">
                <EditorialBadge tone={cover.tone === 'ink' ? 'ink' : cover.tone}>
                  {cover.label}
                </EditorialBadge>
                <RegistrationMark className="h-4 w-4 text-panel-line" />
              </div>

              <div className="relative mt-auto p-4">
                <time dateTime={post.date} className="tnum block text-[11px] text-panel-muted">
                  {formatPostDate(post.date)}
                </time>
                <h3 className="mt-2 text-xl leading-tight text-panel-type sm:text-2xl">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-panel-type/70">
                  {post.description}
                </p>
                <span className="label-xs mt-3 inline-block text-shu-electric">
                  Read <span aria-hidden="true">→</span>
                </span>
              </div>

              {/* Spine stripe, like the bound edge of a volume. */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1.5"
                style={{ background: cover.accent }}
              />
              <span className="sr-only">{i === 0 ? 'Latest article.' : ''}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
