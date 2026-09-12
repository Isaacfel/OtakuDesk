import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

/**
 * Cloudflare Workers build config.
 *
 * The site is static apart from /go/[slug], which has to run server-side: it
 * tags the affiliate URL, records the click, and redirects. That one route is
 * why this cannot be a plain static export.
 *
 * The incremental cache is REQUIRED, not an optimisation. Without one, OpenNext
 * cannot serve prerendered output at all: every request re-renders the page,
 * and any route with `dynamicParams = false` — the journal articles — fails
 * outright with NoFallbackError, because Next refuses to render a page on
 * demand that was meant to be pre-generated. That produced a 404 on every
 * article in production while `next build`, `next start` and `wrangler dev`
 * all looked fine.
 *
 * staticAssetsIncrementalCache serves that prerendered output from the
 * Worker's own static assets. It suits this site exactly: everything is built
 * at deploy time, nothing revalidates at runtime, and it needs no KV or R2 —
 * so there is no extra service to provision or pay for.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
})
