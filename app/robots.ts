import type { MetadataRoute } from 'next'

/**
 * `/go/` and `/api/` must never be indexed: those are tracking and form
 * endpoints, not pages. The route handlers also set `X-Robots-Tag: noindex`;
 * robots.txt is a crawl directive, not an indexing guarantee, so both are
 * needed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/go/', '/api/'],
    },
    sitemap: 'https://otakudesk.com/sitemap.xml',
  }
}
