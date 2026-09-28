import { NextResponse, type NextRequest } from 'next/server'
import { newsletterBindings } from '@/lib/newsletter-env'
import { confirmByToken, isToken } from '@/lib/newsletter'

/**
 * The link in the confirmation email.
 *
 * GET never changes anything: mail security scanners and link previewers
 * fetch every link in an email, and they must not be able to confirm a
 * signup the recipient never asked for. GET sends the reader to a page with
 * a "Confirm subscription" button; that button POSTs here, and only the
 * POST flips a pending signup to confirmed.
 */
export const dynamic = 'force-dynamic'

type State = 'confirm' | 'confirmed' | 'invalid' | 'unavailable'

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
  return isToken(token) ? to('confirm', token) : to('invalid')
}

export async function POST(request: NextRequest) {
  const token = await tokenFrom(request)
  const bindings = await newsletterBindings()
  if (!bindings) return to('unavailable')
  const sub = await confirmByToken(bindings.kv, token)
  return to(sub ? 'confirmed' : 'invalid')
}
