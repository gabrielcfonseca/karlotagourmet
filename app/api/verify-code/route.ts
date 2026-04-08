import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

const SECRET = process.env.VERIFICATION_SECRET || 'karlota-secret-key'
const CODE_TTL_MS = 10 * 60 * 1000 // 10 minutes

function signToken(email: string, code: string, timestamp: number): string {
  return createHmac('sha256', SECRET)
    .update(`${email}:${code}:${timestamp}`)
    .digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email, code, token, timestamp } = await req.json()

    if (!email || !code || !token || !timestamp) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Check expiry
    if (Date.now() - timestamp > CODE_TTL_MS) {
      return NextResponse.json({ error: 'Code expired' }, { status: 400 })
    }

    // Verify signature
    const expected = signToken(email, code, timestamp)
    if (expected !== token) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('verify-code error:', err)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
