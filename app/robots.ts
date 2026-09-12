import type { MetadataRoute } from 'next'

/**
 * The /go redirects must never be indexed. They are tracking endpoints, not
 * content, and an indexed redirect leaks the affiliate tag into search results
 * and wastes crawl budget on pages that are not pages.
 *
 * The route handler also sets `X-Robots-Tag: noindex` — belt and braces,
 * because robots.txt is a crawl directive, not an indexing guarantee.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/go/'],
    },
    sitemap: 'https://otakuvault.example/sitemap.xml',
  }
}
