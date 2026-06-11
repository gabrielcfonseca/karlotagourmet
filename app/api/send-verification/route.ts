import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const SECRET = process.env.VERIFICATION_SECRET || 'karlota-secret-key'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function signToken(email: string, code: string, timestamp: number): string {
  return createHmac('sha256', SECRET)
    .update(`${email}:${code}:${timestamp}`)
    .digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email, lang } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const code = generateCode()
    const timestamp = Date.now()
    const token = signToken(email, code, timestamp)

    const isPortuguese = lang === 'pt'

    await resend.emails.send({
      from: 'Karlota Gourmet <noreply@karlotagourmet.com>',
      to: email,
      subject: isPortuguese ? 'Seu código de verificação — Karlota Gourmet' : 'Your verification code — Karlota Gourmet',
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; background: #FAF0E6; padding: 40px 32px; border-radius: 4px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #C9A84C; margin: 0 0 8px;">KARLOTA GOURMET</p>
            <h1 style="font-size: 26px; color: #3B2A1A; margin: 0;">${isPortuguese ? 'Seu código de verificação' : 'Your Verification Code'}</h1>
          </div>
          <div style="background: #3B2A1A; border-radius: 4px; padding: 32px; text-align: center; margin-bottom: 28px;">
            <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 3px; color: #C9A84C; margin: 0 0 12px;">${isPortuguese ? 'CÓDIGO DE VERIFICAÇÃO' : 'VERIFICATION CODE'}</p>
            <p style="font-size: 48px; font-weight: bold; color: #FAF0E6; letter-spacing: 12px; margin: 0;">${code}</p>
          </div>
          <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 14px; color: #5C4033; line-height: 1.6; text-align: center;">
            ${isPortuguese
              ? 'Este código expira em <strong>10 minutos</strong>. Por favor, não compartilhe este código com ninguém.'
              : 'This code expires in <strong>10 minutes</strong>. Please do not share this code with anyone.'}
          </p>
          <hr style="border: none; border-top: 1px solid #C9A84C33; margin: 28px 0;" />
          <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 12px; color: #7A5C4F; text-align: center; margin: 0;">
            ${isPortuguese ? 'Se você não solicitou isso, pode ignorar este e-mail.' : "If you didn't request this, you can safely ignore this email."}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ token, timestamp })
  } catch (err) {
    console.error('send-verification error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
