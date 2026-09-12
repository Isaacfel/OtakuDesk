import Link from 'next/link'
import type { Pick } from '@/data/types'
import { getPickBySlug } from '@/data/picks'
import { loadAllPosts, formatPostDate } from '@/app/journal/_posts'
import { DossierHeading } from './ProductDossierSection'

/**
 * Related journal stories.
 *
 * Articles carry no tags of their own; what they carry is the list of picks
 * they discuss. So relatedness is computed through the catalog: an article is
 * related if it mentions this pick, or if the picks it mentions share this
 * pick's category or tags. The reason for each match is printed on the card,
 * because a "related" label with no visible rule is exactly the kind of
 * recommendation this site refuses to make.
 *
 * Runs at build time in a static page; there is no request-time cost.
 */

const MAX_RELATED = 3

type Scored = {
  slug: string
  title: string
  description: string
  date: string
  score: number
  reason: string
}

async function relatedPosts(pick: Pick): Promise<Scored[]> {
  const posts = await loadAllPosts()

  return posts
    .map((post): Scored => {
      const refs = (post.picks ?? [])
        .map(getPickBySlug)
        .filter((p): p is Pick => p !== undefined && p.id !== pick.id)

      if (post.picks?.includes(pick.slug)) {
        return { ...post, score: 100, reason: 'Discusses this pick' }
      }

      const sameCategory = refs.filter((r) => r.category === pick.category)
      const sharedTags = [
        ...new Set(refs.flatMap((r) => r.tags).filter((t) => pick.tags.includes(t))),
      ]

      const score = sameCategory.length * 3 + sharedTags.length
      const reason =
        sameCategory.length > 0
          ? `Covers other ${pick.category} picks`
          : sharedTags.length > 0
            ? `Shares the tags ${sharedTags.slice(0, 3).join(', ')}`
            : ''

      return { ...post, score, reason }
    })
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score || b.date.localeCompare(a.date))
    .slice(0, MAX_RELATED)
}

export async function ProductDossierRelated({
  pick,
  n = '07',
  className = '',
}: {
  pick: Pick
  n?: string
  className?: string
}) {
  const posts = await relatedPosts(pick)
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="related-heading" className={className}>
      <DossierHeading
        n={n}
        id="related-heading"
        title="From the journal"
        kicker="Longer reads that touch this pick or its category. Each card says why it is here."
      />

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug} className="min-w-0">
            <Link
              href={`/journal/${post.slug}`}
              className="group panel-frame flex h-full flex-col bg-surface p-5 transition-[box-shadow,transform] hover:-translate-x-px hover:-translate-y-px hover:offset-print focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-shu"
            >
              <p className="label-xs flex flex-wrap items-center gap-x-2 gap-y-1 text-muted">
                <span className="text-shu">Journal</span>
                <span aria-hidden="true">&middot;</span>
                <time dateTime={post.date} className="tnum normal-case tracking-normal">
                  {formatPostDate(post.date)}
                </time>
              </p>
              <h3 className="mt-3 font-display text-lg leading-tight font-bold text-paper transition-colors group-hover:text-shu">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-paper-2">
                {post.description}
              </p>
              <p className="label-xs mt-auto border-t border-line-soft pt-3 text-muted">
                {post.reason}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
