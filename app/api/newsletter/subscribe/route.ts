import { NextResponse, type NextRequest } from 'next/server'
import { newsletterBindings } from '@/lib/newsletter-env'
import {
  beginSubscription,
  confirmUrl,
  normalizeEmail,
  renderConfirmationEmail,
  sendEmail,
} from '@/lib/newsletter'

/**
 * Footer signup. A plain HTML form posts here, so it works without JavaScript;
 * every outcome is a redirect to /newsletter with a `state` the page explains.
 *
 * Double opt-in: this only stores a pending record and sends the confirmation
 * link. Nothing is subscribed until /api/newsletter/confirm is hit.
 */
export const dynamic = 'force-dynamic'

export type SubscribeState = 'check-email' | 'already' | 'invalid' | 'unavailable'

function to(state: SubscribeState): NextResponse {
  const res = new NextResponse(null, { status: 303 })
  res.headers.set('Location', `/newsletter?state=${state}`)
  res.headers.set('Cache-Control', 'no-store')
  return res
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null)
  if (!form) return to('invalid')

  // Honeypot: real browsers leave the hidden field empty. Bots that fill it get
  // the success page and nothing is stored.
  if (String(form.get('website') ?? '') !== '') return to('check-email')

  const email = normalizeEmail(form.get('email'))
  if (!email) return to('invalid')

  const bindings = await newsletterBindings()
  if (!bindings) return to('unavailable')

  const { subscriber } = await beginSubscription(bindings.kv, email)
  if (subscriber.status === 'confirmed') return to('already')

  try {
    await sendEmail(bindings.resendApiKey, {
      to: email,
      ...renderConfirmationEmail(confirmUrl(subscriber.token)),
    })
  } catch (err) {
    console.error(
      JSON.stringify({
        event: 'newsletter_confirmation_failed',
        reason: err instanceof Error ? err.message : String(err),
      }),
    )
    return to('unavailable')
  }

  return to('check-email')
}
