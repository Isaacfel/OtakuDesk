import { NextResponse, type NextRequest } from 'next/server'
import { newsletterBindings } from '@/lib/newsletter-env'
import { confirmByToken } from '@/lib/newsletter'

/** The link in the confirmation email. Flips a pending signup to confirmed. */
export const dynamic = 'force-dynamic'

function to(state: 'confirmed' | 'invalid' | 'unavailable'): NextResponse {
  const res = new NextResponse(null, { status: 302 })
  res.headers.set('Location', `/newsletter?state=${state}`)
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const bindings = await newsletterBindings()
  if (!bindings) return to('unavailable')
  const sub = await confirmByToken(bindings.kv, token)
  return to(sub ? 'confirmed' : 'invalid')
}
