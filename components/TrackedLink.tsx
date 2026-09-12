'use client'

import { track } from '@/lib/analytics'

/**
 * The client half of an outbound link: it exists only to fire the analytics
 * event on click.
 *
 * It receives primitives, never a `Pick`. That is the whole point of splitting
 * it out — a client component's props are serialized into the RSC payload and
 * shipped to the browser, so handing this the full pick object would publish
 * `purchaseUrl` (the raw, untagged merchant destination) in the page source.
 * Nobody would see it, but it would be there: readable by anyone, and a way to
 * reach the merchant while bypassing the tracking we get paid through.
 *
 * A TypeScript `Omit` would not have fixed that. Types are erased at runtime;
 * only narrowing the actual object at the boundary keeps the field out of the
 * payload.
 */
export function TrackedLink({
  href,
  pickSlug,
  merchant,
  network,
  from,
  className,
  children,
}: {
  href: string
  pickSlug: string
  merchant: string
  network: string
  from: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      rel="sponsored nofollow noopener"
      target="_blank"
      className={className}
      onClick={() =>
        track({ name: 'outbound_click', pickSlug, merchant, network, from })
      }
    >
      {children}
    </a>
  )
}
