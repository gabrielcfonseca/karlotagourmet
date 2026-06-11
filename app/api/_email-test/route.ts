import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// TEMPORARY diagnostic endpoint — remove after verifying email deliverability.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const to = searchParams.get('to')
  const secret = searchParams.get('secret')

  if (secret !== 'karlota-email-check-2026') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!to) return NextResponse.json({ error: 'missing ?to=' }, { status: 400 })

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const result = await resend.emails.send({
      from: 'Karlota at Home <orders@karlotagourmet.com>',
      to,
      subject: 'Karlota at Home — Email deliverability test ✅',
      html: '<p style="font-family:sans-serif;color:#3B2A1A;">This is a test email confirming Karlota at Home can send order confirmations to customers. If you received this, customer emails are working. 🎉</p>',
    })
    return NextResponse.json({ ok: !result.error, result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
