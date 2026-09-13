import type { MetadataRoute } from 'next'

/**
 * `/go/` must never be indexed: those are tracking endpoints, not pages. The
 * route handler also sets `X-Robots-Tag: noindex`; robots.txt is a crawl
 * directive, not an indexing guarantee, so both are needed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/go/'],
    },
    sitemap: 'https://otakudesk.com/sitemap.xml',
  }
}
