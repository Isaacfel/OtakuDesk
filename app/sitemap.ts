import type { MetadataRoute } from 'next'
import { PICKS } from '@/data/picks'
import { loadAllPosts } from '@/app/journal/_posts'

/**
 * Sitemap.
 *
 * Must agree with app/layout.tsx `metadataBase` and app/robots.ts. The /go
 * redirects are deliberately absent: they are tracking endpoints, disallowed
 * in robots.txt and tagged noindex by the route handler.
 */
const BASE = 'https://otakuvault.example'

const STATIC_ROUTES: Array<{
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/vault', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/journal', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/disclosure', changeFrequency: 'monthly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await loadAllPosts()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${BASE}${r.path}`,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const pickEntries: MetadataRoute.Sitemap = PICKS.map((pick) => ({
    url: `${BASE}/picks/${pick.slug}`,
    lastModified: new Date(`${pick.lastVerifiedAt}T00:00:00Z`),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const journalEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/journal/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticEntries, ...pickEntries, ...journalEntries]
}
