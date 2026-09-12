import type { ComponentType } from 'react'

/**
 * The journal registry.
 *
 * @next/mdx has no frontmatter, so each article exports a `metadata` object
 * alongside its default component. The slug list lives here because three
 * places need it — the index, the article route's generateStaticParams, and
 * the sitemap — and a page file may not export arbitrary values.
 *
 * Adding an article: drop `content/journal/<slug>.mdx` and add the slug below.
 */

export type PostMeta = {
  title: string
  description: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  /** Pick slugs referenced in the article, rendered as cards at the end. */
  picks?: string[]
}

export type PostModule = {
  default: ComponentType
  metadata: PostMeta
}

export const JOURNAL_SLUGS = [
  'licensed-vs-bootleg',
  'what-officially-licensed-means',
  'anime-desk-without-the-merch-stall',
  'convention-sling-packing-checklist',
] as const

export type JournalSlug = (typeof JOURNAL_SLUGS)[number]

export function isJournalSlug(slug: string): slug is JournalSlug {
  return (JOURNAL_SLUGS as readonly string[]).includes(slug)
}

/**
 * Load one article. The template-literal import lets Turbopack bundle every
 * file under content/journal/ while resolving one at request time.
 */
export async function loadPost(slug: JournalSlug): Promise<PostModule> {
  return (await import(`@/content/journal/${slug}.mdx`)) as PostModule
}

/** Every article's metadata, newest first. */
export async function loadAllPosts(): Promise<Array<PostMeta & { slug: JournalSlug }>> {
  const posts = await Promise.all(
    JOURNAL_SLUGS.map(async (slug) => {
      const { metadata } = await loadPost(slug)
      return { slug, ...metadata }
    }),
  )
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

/** Dates are stored as bare ISO days; pin to UTC so they never shift a day. */
export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
