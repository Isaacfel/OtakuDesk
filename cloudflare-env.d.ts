import type { KVLike } from './lib/newsletter'
import type { RateLimiterLike } from './lib/newsletter-env'

/**
 * Bindings declared in wrangler.jsonc, typed for `getCloudflareContext().env`.
 * Optional because a misconfigured deploy must be handled, not assumed away.
 */
declare global {
  interface CloudflareEnv {
    SUBSCRIBERS?: KVLike
    RESEND_API_KEY?: string
    /** Outbound click log, written by /go and read by /api/clicks. */
    CLICKS?: KVLike
    /** Bearer token for /api/clicks. Set with `wrangler secret put ADMIN_TOKEN`. */
    ADMIN_TOKEN?: string
    /** Per-IP limit on newsletter signups (Workers Rate Limiting binding). */
    NEWSLETTER_RATE_LIMITER?: RateLimiterLike
  }
}

export {}
