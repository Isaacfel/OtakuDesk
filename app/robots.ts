import type { MetadataRoute } from 'next'
import { CATALOG_IS_SAMPLE } from '@/data/picks'

/**
 * Two rules, one of which clears itself.
 *
 * 1. `/go/` must never be indexed. Those are tracking endpoints, not pages; an
 *    indexed redirect leaks the affiliate tag into search results and burns
 *    crawl budget on things that are not content. The route handler also sets
 *    `X-Robots-Tag: noindex` — robots.txt is a crawl directive, not an
 *    indexing guarantee, so both are needed.
 *
 * 2. While the catalog is sample data, the WHOLE site stays out of the index.
 *    A placeholder site is a bad first impression that is expensive to undo:
 *    Google's first crawl of a domain sets expectations, thin affiliate pages
 *    are exactly what recent updates punish, and — more immediately — affiliate
 *    programs review your live site when you apply. An application reviewer
 *    landing on twelve products marked SAMPLE is a rejection.
 *
 *    This is driven by the data rather than a flag someone has to remember to
 *    flip: publish one real verified pick and indexing turns itself on, the
 *    same way the sample banner turns itself off.
 */
export default function robots(): MetadataRoute.Robots {
  if (CATALOG_IS_SAMPLE) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/go/'],
    },
    sitemap: 'https://otakudesk.com/sitemap.xml',
  }
}
