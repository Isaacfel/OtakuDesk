import { NextResponse, type NextRequest } from 'next/server'
import { newsletterBindings } from '@/lib/newsletter-env'
import { isToken, unsubscribeByToken } from '@/lib/newsletter'

/**
 * The link in every issue.
 *
 * GET never changes anything, so mail scanners and link previewers that
 * fetch the link cannot unsubscribe anyone. GET shows a one-button
 * "Unsubscribe" page; the button POSTs here and the record is deleted.
 *
 * POST is also the RFC 8058 one-click endpoint: mail clients POST to the
 * List-Unsubscribe URL (token in the query string) with
 * `List-Unsubscribe=One-Click`, and that still works in a single step.
 */
export const dynamic = 'force-dynamic'

type State = 'unsubscribe' | 'unsubscribed' | 'invalid' | 'unavailable'

function to(state: State, token?: string): NextResponse {
  const res = new NextResponse(null, { status: 303 })
  const query = token ? `state=${state}&token=${token}` : `state=${state}`
  res.headers.set('Location', `/newsletter?${query}`)
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

async function tokenFrom(request: NextRequest): Promise<string> {
  const fromQuery = request.nextUrl.searchParams.get('token')
  if (fromQuery) return fromQuery
  const form = await request.formData().catch(() => null)
  return String(form?.get('token') ?? '')
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  return isToken(token) ? to('unsubscribe', token) : to('invalid')
}

export async function POST(request: NextRequest) {
  const token = await tokenFrom(request)
  const bindings = await newsletterBindings()
  if (!bindings) return to('unavailable')
  const ok = await unsubscribeByToken(bindings.kv, token)
  return to(ok ? 'unsubscribed' : 'invalid')
}
