/**
 * Newsletter rules: double opt-in, one-click unsubscribe, no merchant links in
 * email, and loud failure on missing configuration.
 *
 * Run: npm test
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  NEWSLETTER,
  NewsletterConfigError,
  beginSubscription,
  confirmByToken,
  issueWindowStart,
  listConfirmed,
  normalizeEmail,
  picksAddedSince,
  renderConfirmationEmail,
  renderIssueEmail,
  unsubscribeByToken,
  type KVLike,
} from '../lib/newsletter'
import { PICKS } from '../data/picks'

/** In-memory stand-in for a KV namespace. */
function fakeKv(): KVLike & { store: Map<string, string> } {
  const store = new Map<string, string>()
  return {
    store,
    async get(key) {
      return store.get(key) ?? null
    },
    async put(key, value) {
      store.set(key, value)
    },
    async delete(key) {
      store.delete(key)
    },
    async list({ prefix = '' } = {}) {
      return {
        keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })),
        list_complete: true,
      }
    },
  }
}

test('normalizeEmail: trims, lowercases, rejects junk', () => {
  assert.equal(normalizeEmail('  Fan@Example.com '), 'fan@example.com')
  for (const bad of ['', 'nope', 'a@b', 'a b@c.d', null, 42, 'x'.repeat(250) + '@a.bc'])
    assert.equal(normalizeEmail(bad), null, String(bad))
})

test('double opt-in: pending until the token is confirmed; unsubscribe deletes', async () => {
  const kv = fakeKv()
  const { subscriber, created } = await beginSubscription(kv, 'fan@example.com')
  assert.ok(created)
  assert.equal(subscriber.status, 'pending')
  assert.equal((await listConfirmed(kv)).length, 0, 'pending signups never receive issues')

  // Signing up again keeps the same token and does not duplicate.
  const again = await beginSubscription(kv, 'fan@example.com')
  assert.equal(again.created, false)
  assert.equal(again.subscriber.token, subscriber.token)

  assert.equal(await confirmByToken(kv, 'not-a-token'), null)
  const confirmed = await confirmByToken(kv, subscriber.token)
  assert.equal(confirmed?.status, 'confirmed')
  assert.deepEqual(
    (await listConfirmed(kv)).map((s) => s.email),
    ['fan@example.com'],
  )

  assert.equal(await unsubscribeByToken(kv, 'not-a-token'), false)
  assert.equal(await unsubscribeByToken(kv, subscriber.token), true)
  assert.equal((await listConfirmed(kv)).length, 0)
  assert.equal(kv.store.size, 0, 'unsubscribe leaves nothing behind')
})

test('issue window: picks added within the window, newest first', () => {
  const now = new Date('2026-09-18T15:00:00Z')
  assert.equal(issueWindowStart(now, 7), '2026-09-11')
  const fresh = picksAddedSince(PICKS, '2026-09-13')
  assert.ok(fresh.length > 0)
  assert.ok(fresh.every((p) => p.addedAt >= '2026-09-13'))
  assert.equal(picksAddedSince(PICKS, '2099-01-01').length, 0)
})

test('issue email: unsubscribe link, postal address, product-page links only', () => {
  const picks = PICKS.slice(0, 3)
  const unsub = 'https://otakudesk.com/api/newsletter/unsubscribe?token=abc'
  const { subject, html, text } = renderIssueEmail(picks, unsub, '123 Example St, Springfield, US')
  assert.equal(subject, '3 new products this week')
  for (const body of [html, text]) {
    assert.ok(body.includes(unsub), 'unsubscribe link present')
    assert.ok(body.includes('123 Example St'), 'postal address present')
    assert.ok(!body.includes('/go/'), 'no tracked redirect links in email')
    assert.ok(!/amazon\.com\/dp/.test(body), 'no merchant links in email')
    for (const p of picks) assert.ok(body.includes(`${NEWSLETTER.siteUrl}/desk/${p.slug}`))
  }
})

test('issue email refuses to render without a postal address', () => {
  assert.throws(
    () => renderIssueEmail(PICKS.slice(0, 1), 'https://otakudesk.com/x', ''),
    NewsletterConfigError,
  )
})

test('confirmation email carries the confirm link and nothing else actionable', () => {
  const url = 'https://otakudesk.com/api/newsletter/confirm?token=abc'
  const { html, text } = renderConfirmationEmail(url)
  assert.ok(html.includes(url) && text.includes(url))
  assert.ok(!html.includes('/go/'))
})
