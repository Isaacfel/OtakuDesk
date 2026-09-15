import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { KVLike } from './newsletter'

/**
 * Bindings the newsletter routes need, read from the Cloudflare context.
 *
 * Returns null when running somewhere without bindings (plain `next start`,
 * or a Worker missing its KV namespace), so callers can answer honestly
 * instead of crashing.
 */
export type NewsletterBindings = { kv: KVLike; resendApiKey: string }

export async function newsletterBindings(): Promise<NewsletterBindings | null> {
  let env: CloudflareEnv
  try {
    env = (await getCloudflareContext({ async: true })).env
  } catch {
    return null
  }
  const kv = env.SUBSCRIBERS
  const resendApiKey = env.RESEND_API_KEY ?? ''
  if (!kv || !resendApiKey) {
    console.error(
      JSON.stringify({
        event: 'newsletter_misconfigured',
        missing: [!kv && 'SUBSCRIBERS', !resendApiKey && 'RESEND_API_KEY'].filter(Boolean),
      }),
    )
    return null
  }
  return { kv, resendApiKey }
}
