import type { Pick } from '../data/types'
import { isPriceFresh, isPurchasable } from '../data/types'
import { SITE } from './site'

/**
 * The weekly newsletter: subscriber storage, double opt-in, and the issue.
 *
 * Imported by two runtimes — the site's route handlers and the separate cron
 * Worker in newsletter/ — so everything here is plain Web APIs plus the
 * catalog. No Next imports, no `@/` aliases.
 *
 * Rules this file enforces:
 *   - Nobody is emailed until they click the confirmation link (double opt-in).
 *   - Every issue carries a one-click unsubscribe link and a postal address.
 *   - Emails link to product pages on the site, never to a merchant. Several
 *     affiliate programs (Amazon included) forbid affiliate links in email.
 *   - Missing configuration fails loudly instead of sending something wrong.
 */

export const NEWSLETTER = {
  siteUrl: SITE.url,
  /** Must be on a domain verified in Resend. */
  from: 'Otakudesk <newsletter@otakudesk.com>',
  /**
   * Required in every marketing email by anti-spam law (CAN-SPAM and others).
   * Derived from lib/site.ts so the legal pages and the email footer cannot
   * drift apart. Empty means no issue is sent, by design.
   */
  postalAddress: `${SITE.legalName}, ${SITE.address}`,
  /** Products added within this many days of the send go into the issue. */
  windowDays: 7,
  /** Unconfirmed signups expire after this long. */
  pendingTtlSeconds: 7 * 24 * 60 * 60,
} as const

export class NewsletterConfigError extends Error {}

/** The subset of a Cloudflare KV namespace this module uses. */
export type KVLike = {
  get(key: string): Promise<string | null>
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string; cursor?: string; limit?: number }): Promise<{
    keys: Array<{ name: string }>
    list_complete: boolean
    cursor?: string
  }>
}

export type Subscriber = {
  email: string
  status: 'pending' | 'confirmed'
  /** One token per subscriber, used for both the confirm and unsubscribe links. */
  token: string
  createdAt: string
  confirmedAt?: string
}

const SUB_PREFIX = 'sub:'
const TOKEN_PREFIX = 'tok:'
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- Input ---------------------------------------------------------------

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const email = raw.trim().toLowerCase()
  if (email.length === 0 || email.length > 254) return null
  if (!EMAIL_SHAPE.test(email)) return null
  return email
}

const TOKEN_SHAPE = /^[a-f0-9]{64}$/

export function isToken(raw: unknown): raw is string {
  return typeof raw === 'string' && TOKEN_SHAPE.test(raw)
}

export function newToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// --- Storage -------------------------------------------------------------

const subKey = (email: string) => `${SUB_PREFIX}${email}`
const tokenKey = (token: string) => `${TOKEN_PREFIX}${token}`

export async function getSubscriber(kv: KVLike, email: string): Promise<Subscriber | null> {
  const raw = await kv.get(subKey(email))
  return raw ? (JSON.parse(raw) as Subscriber) : null
}

async function writeSubscriber(kv: KVLike, sub: Subscriber): Promise<void> {
  const ttl = sub.status === 'pending' ? { expirationTtl: NEWSLETTER.pendingTtlSeconds } : undefined
  await kv.put(subKey(sub.email), JSON.stringify(sub), ttl)
  await kv.put(tokenKey(sub.token), sub.email, ttl)
}

/**
 * Start (or restart) a signup. A confirmed subscriber is left alone; a pending
 * one keeps its token so a second confirmation email carries the same link.
 */
export async function beginSubscription(
  kv: KVLike,
  email: string,
  now: Date = new Date(),
): Promise<{ subscriber: Subscriber; created: boolean }> {
  const existing = await getSubscriber(kv, email)
  if (existing) {
    if (existing.status === 'pending') await writeSubscriber(kv, existing) // refresh TTL
    return { subscriber: existing, created: false }
  }
  const subscriber: Subscriber = {
    email,
    status: 'pending',
    token: newToken(),
    createdAt: now.toISOString(),
  }
  await writeSubscriber(kv, subscriber)
  return { subscriber, created: true }
}

export async function confirmByToken(
  kv: KVLike,
  token: string,
  now: Date = new Date(),
): Promise<Subscriber | null> {
  if (!isToken(token)) return null
  const email = await kv.get(tokenKey(token))
  if (!email) return null
  const sub = await getSubscriber(kv, email)
  if (!sub || sub.token !== token) return null
  if (sub.status === 'confirmed') return sub
  const confirmed: Subscriber = { ...sub, status: 'confirmed', confirmedAt: now.toISOString() }
  await writeSubscriber(kv, confirmed)
  return confirmed
}

export async function unsubscribeByToken(kv: KVLike, token: string): Promise<boolean> {
  if (!isToken(token)) return false
  const email = await kv.get(tokenKey(token))
  if (!email) return false
  await kv.delete(subKey(email))
  await kv.delete(tokenKey(token))
  return true
}

export async function listConfirmed(kv: KVLike): Promise<Subscriber[]> {
  const out: Subscriber[] = []
  let cursor: string | undefined
  do {
    const page = await kv.list({ prefix: SUB_PREFIX, cursor, limit: 1000 })
    for (const { name } of page.keys) {
      const raw = await kv.get(name)
      if (!raw) continue
      const sub = JSON.parse(raw) as Subscriber
      if (sub.status === 'confirmed') out.push(sub)
    }
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)
  return out
}

// --- The issue -----------------------------------------------------------

/** ISO date (YYYY-MM-DD) `days` before `now`, in UTC. */
export function issueWindowStart(now: Date, days: number = NEWSLETTER.windowDays): string {
  const d = new Date(now.getTime() - days * 86_400_000)
  return d.toISOString().slice(0, 10)
}

/** Picks whose `addedAt` is on or after `since`, newest first. */
export function picksAddedSince(picks: readonly Pick[], since: string): Pick[] {
  return picks
    .filter((p) => p.addedAt >= since)
    .sort(
      (a, b) =>
        b.addedAt.localeCompare(a.addedAt) ||
        Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
        a.title.localeCompare(b.title),
    )
}

export const confirmUrl = (token: string) =>
  `${NEWSLETTER.siteUrl}/api/newsletter/confirm?token=${token}`
export const unsubscribeUrl = (token: string) =>
  `${NEWSLETTER.siteUrl}/api/newsletter/unsubscribe?token=${token}`
export const productUrl = (pick: Pick) => `${NEWSLETTER.siteUrl}/desk/${pick.slug}`

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function priceLine(pick: Pick): string {
  if (!isPurchasable(pick)) return 'Unavailable'
  if (pick.price !== null && isPriceFresh(pick.priceCheckedAt)) return `$${pick.price.toFixed(2)}`
  return 'See price'
}

export type EmailContent = { subject: string; html: string; text: string }

const STYLE = {
  body: 'margin:0;padding:24px 16px;background:#f6f6f7;font-family:Inter,system-ui,Segoe UI,Arial,sans-serif;color:#141416;',
  card: 'max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e6ea;border-radius:8px;padding:24px;',
  brand: 'font-size:20px;font-weight:800;letter-spacing:-0.01em;margin:0 0 16px;',
  accent: 'color:#dc1a2b;',
  button:
    'display:inline-block;background:#dc1a2b;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;',
  muted: 'color:#6b6b73;font-size:12px;line-height:1.6;',
  item: 'padding:14px 0;border-top:1px solid #e6e6ea;',
} as const

function shell(inner: string): string {
  return `<!doctype html><html><body style="${STYLE.body}"><div style="${STYLE.card}"><p style="${STYLE.brand}">Otaku<span style="${STYLE.accent}">desk</span></p>${inner}</div></body></html>`
}

export function renderConfirmationEmail(url: string): EmailContent {
  return {
    subject: 'Confirm your Otakudesk subscription',
    html: shell(
      `<p style="font-size:16px;line-height:1.6;margin:0 0 20px;">Click below to start getting new products once a week.</p>` +
        `<p style="margin:0 0 24px;"><a href="${url}" style="${STYLE.button}">Confirm subscription</a></p>` +
        `<p style="${STYLE.muted}">If you didn&rsquo;t sign up, ignore this email and nothing happens.</p>`,
    ),
    text: `Confirm your Otakudesk subscription:\n${url}\n\nIf you didn't sign up, ignore this email and nothing happens.\n`,
  }
}

export function renderIssueEmail(
  picks: readonly Pick[],
  unsubscribe: string,
  postalAddress: string,
): EmailContent {
  if (!postalAddress) throw new NewsletterConfigError('NEWSLETTER.postalAddress is not set')
  const n = picks.length
  const subject = `${n} new ${n === 1 ? 'product' : 'products'} this week`

  const items = picks
    .map((p) => {
      const url = productUrl(p)
      const img = p.images[0]?.src
        ? `<td style="width:88px;vertical-align:top;padding-right:14px;"><a href="${url}"><img src="${escapeHtml(p.images[0].src)}" alt="" width="80" height="80" style="display:block;width:80px;height:80px;object-fit:contain;border:1px solid #e6e6ea;border-radius:6px;background:#fff;"></a></td>`
        : ''
      return (
        `<div style="${STYLE.item}"><table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;"><tr>${img}` +
        `<td style="vertical-align:top;"><a href="${url}" style="color:#141416;text-decoration:none;font-weight:600;font-size:15px;line-height:1.4;">${escapeHtml(p.title)}</a>` +
        `<div style="margin-top:6px;font-weight:700;">${escapeHtml(priceLine(p))}</div></td></tr></table></div>`
      )
    })
    .join('')

  const html = shell(
    `<p style="font-size:16px;line-height:1.6;margin:0 0 8px;">New on Otakudesk this week.</p>${items}` +
      `<p style="margin:20px 0 24px;"><a href="${NEWSLETTER.siteUrl}/desk?sort=newest" style="${STYLE.button}">See all products</a></p>` +
      `<p style="${STYLE.muted}">You&rsquo;re getting this because you confirmed a subscription at otakudesk.com. ` +
      `<a href="${unsubscribe}" style="color:#6b6b73;">Unsubscribe</a> with one click.<br>${escapeHtml(postalAddress)}</p>`,
  )

  const text =
    `New on Otakudesk this week:\n\n` +
    picks.map((p) => `- ${p.title} — ${priceLine(p)}\n  ${productUrl(p)}`).join('\n') +
    `\n\nAll products: ${NEWSLETTER.siteUrl}/desk?sort=newest\n\nUnsubscribe: ${unsubscribe}\n${postalAddress}\n`

  return { subject, html, text }
}

// --- Sending (Resend) ----------------------------------------------------

export type OutgoingEmail = EmailContent & { to: string; headers?: Record<string, string> }

const RESEND_URL = 'https://api.resend.com/emails'

function toResendPayload(msg: OutgoingEmail) {
  return {
    from: NEWSLETTER.from,
    to: [msg.to],
    subject: msg.subject,
    html: msg.html,
    text: msg.text,
    ...(msg.headers ? { headers: msg.headers } : {}),
  }
}

async function post(apiKey: string, url: string, body: unknown): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 300)}`)
  }
}

export async function sendEmail(apiKey: string, msg: OutgoingEmail): Promise<void> {
  if (!apiKey) throw new NewsletterConfigError('RESEND_API_KEY is not set')
  await post(apiKey, RESEND_URL, toResendPayload(msg))
}

/** Resend's batch endpoint takes up to 100 messages per call. */
export async function sendBatch(apiKey: string, msgs: OutgoingEmail[]): Promise<void> {
  if (!apiKey) throw new NewsletterConfigError('RESEND_API_KEY is not set')
  for (let i = 0; i < msgs.length; i += 100) {
    await post(apiKey, `${RESEND_URL}/batch`, msgs.slice(i, i + 100).map(toResendPayload))
  }
}
