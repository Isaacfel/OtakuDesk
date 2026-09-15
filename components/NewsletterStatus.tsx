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
  unavailable: {
    title: 'Signups are paused.',
    body: 'The newsletter isn’t set up yet. Try again in a day or two.',
  },
}

export function NewsletterStatus() {
  const state = useSearchParams().get('state') ?? ''
  const msg = MESSAGES[state] ?? {
    title: 'New products, once a week.',
    body: 'Use the form at the bottom of any page to sign up.',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-fg sm:text-3xl">{msg.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted">{msg.body}</p>
      <Link
        href="/desk"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        All products
      </Link>
    </div>
  )
}
