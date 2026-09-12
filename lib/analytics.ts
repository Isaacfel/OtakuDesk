/**
 * Analytics events.
 *
 * In an affiliate model we never observe a purchase — the transaction happens
 * on the merchant's site and we learn about it weeks later, in aggregate, from
 * a network dashboard. So there is deliberately no `purchase` event here.
 *
 * `outbound_click` is the conversion event. Everything else is diagnostic.
 * Our own click counts are also the only independent check on whether a
 * network is reporting honestly, which is reason enough to log them ourselves.
 */

export type AnalyticsEvent =
  | {
      name: 'outbound_click'
      pickSlug: string
      merchant: string
      network: string
      /** Which page produced the click — 'pick:neon-panel-desk-mat', 'journal:desk-guide'. */
      from: string
    }
  | { name: 'quiz_complete'; budget: string; style: string; resultCount: number }
  | { name: 'email_signup'; placement: string }
  | { name: 'search'; query: string; resultCount: number }
  | { name: 'save_pick'; pickSlug: string; saved: boolean }
  | { name: 'filter_apply'; facet: string; value: string }

type Plausible = (
  event: string,
  opts?: { props?: Record<string, string | number | boolean> },
) => void

declare global {
  interface Window {
    plausible?: Plausible
  }
}

/**
 * Client-side event. Safe to call before the analytics script has loaded or
 * when it has been blocked — a missing tracker must never throw into the UI.
 */
export function track(event: AnalyticsEvent): void {
  const { name, ...props } = event
  if (typeof window === 'undefined') return
  try {
    window.plausible?.(name, { props: props as Record<string, string | number> })
  } catch {
    // Analytics must never break the page.
  }
}

/**
 * Server-side outbound click log, called from the /go route via `after()` so
 * the reader is never made to wait on it.
 *
 * In production this should post to your analytics endpoint. It is kept as a
 * structured console log here so that the event shape is visible in platform
 * logs from day one, before an analytics provider is chosen.
 */
export function logOutboundClick(data: {
  pickSlug: string
  merchant: string
  network: string
  from: string
}): void {
  console.log(
    JSON.stringify({ event: 'outbound_click', ts: new Date().toISOString(), ...data }),
  )
}
