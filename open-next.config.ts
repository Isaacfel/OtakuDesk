import { defineCloudflareConfig } from '@opennextjs/cloudflare'

/**
 * Cloudflare Workers build config.
 *
 * The site is static apart from /go/[slug], which has to run server-side: it
 * tags the affiliate URL, records the click, and redirects. That one route is
 * why this cannot be a plain static export.
 *
 * Defaults are correct here — no incremental cache or queue is needed, because
 * the catalog is compiled into the bundle rather than fetched.
 */
export default defineCloudflareConfig()
