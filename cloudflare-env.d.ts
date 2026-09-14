import type { KVLike } from './lib/newsletter'

/**
 * Bindings declared in wrangler.jsonc, typed for `getCloudflareContext().env`.
 * Optional because a misconfigured deploy must be handled, not assumed away.
 */
declare global {
  interface CloudflareEnv {
    SUBSCRIBERS?: KVLike
    RESEND_API_KEY?: string
  }
}

export {}
