'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const MESSAGES: Record<string, { title: string; body: string }> = {
  'check-email': {
    title: 'Check your email.',
    body: 'We sent a confirmation link. Click it and you’re in.',
  },
  confirmed: { title: 'You’re in.', body: 'New products, once a week. Unsubscribe any time.' },
  already: { title: 'Already subscribed.', body: 'That address is on the list.' },
  unsubscribed: { title: 'Unsubscribed.', body: 'That address has been removed.' },
  invalid: { title: 'That didn’t work.', body: 'Check the address or the link and try again.' },
  'slow-down': { title: 'Too many tries.', body: 'Wait a minute, then try again.' },
  unavailable: {
    title: 'Signups are paused.',
    body: 'The newsletter isn’t set up yet. Try again in a day or two.',
  },
}

/**
 * States that need one explicit click. The email links land here via GET
 * (which changes nothing, so link scanners are harmless); the button POSTs
 * to the API route, which does the actual confirm or unsubscribe.
 */
const ACTIONS: Record<string, { title: string; body: string; action: string; button: string }> = {
  confirm: {
    title: 'Confirm your subscription.',
    body: 'One click and you’re in. New products, once a week.',
    action: '/api/newsletter/confirm',
    button: 'Confirm subscription',
  },
  unsubscribe: {
    title: 'Unsubscribe?',
    body: 'This removes your address from the weekly email.',
    action: '/api/newsletter/unsubscribe',
    button: 'Unsubscribe',
  },
}

const TOKEN_SHAPE = /^[a-f0-9]{64}$/

const BUTTON =
  'mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover'

export function NewsletterStatus() {
  const params = useSearchParams()
  const state = params.get('state') ?? ''
  const token = params.get('token') ?? ''

  const pending = ACTIONS[state]
  if (pending && TOKEN_SHAPE.test(token)) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-fg sm:text-3xl">{pending.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted">{pending.body}</p>
        <form method="post" action={pending.action}>
          <input type="hidden" name="token" value={token} />
          <button type="submit" className={BUTTON}>
            {pending.button}
          </button>
        </form>
      </div>
    )
  }

  const msg = MESSAGES[state] ?? {
    title: 'New products, once a week.',
    body: 'Use the form at the bottom of any page to sign up.',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">{msg.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted">{msg.body}</p>
      <Link href="/desk" className={BUTTON}>
        All products
      </Link>
    </div>
  )
}
