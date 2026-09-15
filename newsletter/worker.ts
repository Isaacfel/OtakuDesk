import { PICKS } from '../data/picks'
import {
  NEWSLETTER,
  NewsletterConfigError,
  issueWindowStart,
  listConfirmed,
  picksAddedSince,
  renderIssueEmail,
  sendBatch,
  unsubscribeUrl,
  type KVLike,
  type OutgoingEmail,
} from '../lib/newsletter'

/**
 * The weekly issue, as its own small Worker (see newsletter/wrangler.jsonc).
 *
 * Kept separate from the site's Worker so a cron handler can never break the
 * site build. It shares the SUBSCRIBERS KV namespace and reads the same
 * catalog the site renders, so "new this week" is exactly what the site says.
 */

type Env = { SUBSCRIBERS: KVLike; RESEND_API_KEY?: string }
type ScheduledEvent = { scheduledTime: number; cron: string }

export async function sendWeeklyIssue(env: Env, now: Date = new Date()): Promise<void> {
  if (!env.SUBSCRIBERS) throw new NewsletterConfigError('SUBSCRIBERS KV binding is missing')
  if (!env.RESEND_API_KEY) throw new NewsletterConfigError('RESEND_API_KEY is not set')
  if (!NEWSLETTER.postalAddress)
    throw new NewsletterConfigError('NEWSLETTER.postalAddress is not set (lib/newsletter.ts)')

  const day = now.toISOString().slice(0, 10)
  const issueKey = `issue:${day}`
  if (await env.SUBSCRIBERS.get(issueKey)) {
    console.log(JSON.stringify({ event: 'newsletter_issue_skipped', reason: 'already sent', day }))
    return
  }

  const picks = picksAddedSince(PICKS, issueWindowStart(now))
  if (picks.length === 0) {
    console.log(JSON.stringify({ event: 'newsletter_issue_skipped', reason: 'no new products', day }))
    return
  }

  const subscribers = await listConfirmed(env.SUBSCRIBERS)
  const messages: OutgoingEmail[] = subscribers.map((s) => {
    const unsub = unsubscribeUrl(s.token)
    return {
      to: s.email,
      ...renderIssueEmail(picks, unsub, NEWSLETTER.postalAddress),
      headers: {
        'List-Unsubscribe': `<${unsub}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }
  })

  if (messages.length > 0) await sendBatch(env.RESEND_API_KEY, messages)

  await env.SUBSCRIBERS.put(
    issueKey,
    JSON.stringify({ sentAt: now.toISOString(), recipients: messages.length, picks: picks.map((p) => p.slug) }),
  )
  console.log(
    JSON.stringify({ event: 'newsletter_issue_sent', day, recipients: messages.length, products: picks.length }),
  )
}

const worker = {
  // Awaited, not handed to waitUntil: the runtime keeps a scheduled
  // invocation alive only as long as the returned promise.
  async scheduled(event: ScheduledEvent, env: Env) {
    try {
      await sendWeeklyIssue(env, new Date(event.scheduledTime))
    } catch (err) {
      console.error(
        JSON.stringify({
          event: err instanceof NewsletterConfigError ? 'newsletter_misconfigured' : 'newsletter_issue_failed',
          reason: err instanceof Error ? err.message : String(err),
        }),
      )
    }
  },

  // This Worker has no public surface. Anything that reaches it over HTTP
  // gets a 404; the site lives on the otakudesk Worker.
  async fetch() {
    return new Response('Not found', { status: 404 })
  },
}

export default worker
