import { NextRequest, NextResponse } from 'next/server'

async function getValidSession(password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode('karlota-admin-session-v1')
  )
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin/* (sub-routes), not /admin itself (login page)
  if (pathname.match(/^\/admin\/.+/)) {
    const session = req.cookies.get('admin-session')?.value

    if (!session) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    const password = process.env.ADMIN_PASSWORD || 'karlota2025'
    const validSession = await getValidSession(password)

    if (session !== validSession) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path+'],
}
