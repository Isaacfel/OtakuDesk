import { NextResponse, type NextRequest } from 'next/server'
import { newsletterBindings } from '@/lib/newsletter-env'
import { unsubscribeByToken } from '@/lib/newsletter'

/** The link in every issue. One click, no confirmation step, record deleted. */
export const dynamic = 'force-dynamic'

function to(state: 'unsubscribed' | 'invalid' | 'unavailable'): NextResponse {
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
  const ok = await unsubscribeByToken(bindings.kv, token)
  return to(ok ? 'unsubscribed' : 'invalid')
}

/** RFC 8058 one-click unsubscribe: mail clients POST here from the List-Unsubscribe header. */
export const POST = GET
