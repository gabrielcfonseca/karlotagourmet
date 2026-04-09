import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, whatsapp, weddingDate, guestCount, howHeard } = await req.json()

    if (!name || !email || !whatsapp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Bridal Experience <noreply@karlotagourmet.com>',
      to: 'bridalexperiencebykarlota@gmail.com',
      subject: `💍 New Pre-Registration — ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #FAF0E6; padding: 40px 32px; border-radius: 4px;">
          <div style="text-align: center; margin-bottom: 28px;">
            <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #C9A84C; margin: 0 0 6px;">BRIDAL EXPERIENCE BY KARLOTA</p>
            <h1 style="font-size: 24px; color: #3B2A1A; margin: 0;">New Pre-Registration 💍</h1>
          </div>

          <div style="background: #3B2A1A; border-radius: 4px; padding: 28px 32px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Name</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${name}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Email</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${email}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">WhatsApp</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${whatsapp}</td>
              </tr>
              ${weddingDate ? `
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Wedding Date</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${weddingDate}</td>
              </tr>` : ''}
              ${guestCount ? `
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">Est. Guests</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${guestCount}</td>
              </tr>` : ''}
              ${howHeard ? `
              <tr style="border-top: 1px solid rgba(255,255,255,0.08);">
                <td style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #C9A84C; padding: 8px 0 4px;">How They Heard</td>
                <td style="font-family: Georgia, serif; font-size: 16px; color: #FAF0E6; padding: 8px 0 4px; text-align: right;">${howHeard}</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="text-align: center;">
            <a href="https://wa.me/1${whatsapp.replace(/\D/g, '')}" style="display: inline-block; padding: 12px 28px; background: #25D366; color: white; font-family: 'Helvetica Neue', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 2px;">
              Reply on WhatsApp
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #C9A84C33; margin: 28px 0;" />
          <p style="font-family: 'Helvetica Neue', sans-serif; font-size: 11px; color: #7A5C4F; text-align: center; margin: 0;">
            Bridal Experience by Karlota · June 7, 2025 · Orlando, FL
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('bridal-registration error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
