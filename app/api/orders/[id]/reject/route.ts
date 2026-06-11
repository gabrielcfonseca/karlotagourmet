import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getOrderById, updateOrder } from '@/lib/orders'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const order = await getOrderById(params.id)

    if (!order) return new Response(html('Order Not Found', 'This order could not be found.', false), { headers: { 'Content-Type': 'text/html' } })
    if (order.approvalToken !== token) return new Response(html('Invalid Link', 'This rejection link is invalid.', false), { headers: { 'Content-Type': 'text/html' } })
    if (order.status === 'rejected') return new Response(html('Already Rejected', 'This order was already rejected.', false), { headers: { 'Content-Type': 'text/html' } })
    if (order.status === 'approved') return new Response(html('Already Approved', 'This order was already approved and cannot be rejected.', false), { headers: { 'Content-Type': 'text/html' } })

    await updateOrder(params.id, { status: 'rejected' })

    const resend = getResend()
    await resend.emails.send({
      from: 'Karlota at Home <orders@karlotagourmet.com>',
      to: order.customer.email,
      subject: `Order Update — Karlota at Home`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF0E6;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(59,42,26,0.12);">
    <div style="background:#3B2A1A;padding:28px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Karlota at Home</p>
      <h1 style="margin:8px 0 0;font-size:22px;color:#FAF0E6;font-weight:400;">Order Update</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#5C4033;font-size:15px;line-height:1.6;">Hi <strong>${order.customer.name}</strong>,</p>
      <p style="color:#5C4033;font-size:15px;line-height:1.6;">
        Unfortunately, we were unable to fulfill your order for <strong>${order.delivery.date} at ${order.delivery.time}</strong>.
        We are sorry for the inconvenience.
      </p>
      <p style="color:#5C4033;font-size:15px;line-height:1.6;">
        Your payment of <strong>$${order.total.toFixed(2)}</strong> will be fully refunded within 5–10 business days to your original payment method.
      </p>
      <p style="color:#5C4033;font-size:15px;line-height:1.6;">
        We'd love to make it up to you — please reach out and we'll do our best to accommodate your request on another date.
      </p>
      <p style="color:#5C4033;font-size:13px;margin-top:24px;">
        WhatsApp: <a href="https://wa.me/14078443371" style="color:#C9A84C;">+1 (407) 844-3371</a><br>
        Email: <a href="mailto:karla@karlota.net" style="color:#C9A84C;">karla@karlota.net</a>
      </p>
    </div>
    <div style="padding:16px 32px;background:#3B2A1A;text-align:center;">
      <p style="margin:0;font-size:11px;color:#FAF0E6;opacity:0.4;letter-spacing:2px;text-transform:uppercase;">Karlota Gourmet — Karlota at Home</p>
    </div>
  </div>
</body>
</html>`,
    })

    return new Response(html('Order Rejected', `Cancellation email sent to ${order.customer.email}. Remember to issue the refund in Stripe.`, false), {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    console.error('reject error:', err)
    return new Response(html('Error', String(err), false), { headers: { 'Content-Type': 'text/html' } })
  }
}

function html(title: string, message: string, success: boolean) {
  const color = success ? '#2D6A4F' : '#9B2226'
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF0E6;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;box-sizing:border-box;">
  <div style="max-width:400px;width:100%;background:#fff;border-radius:8px;padding:40px 32px;text-align:center;box-shadow:0 8px 40px rgba(59,42,26,0.12);">
    <div style="width:64px;height:64px;border-radius:50%;background:${success ? '#D8F3DC' : '#FFE8E8'};display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">${success ? '✅' : '❌'}</div>
    <h1 style="margin:0 0 12px;color:#3B2A1A;font-size:22px;font-weight:600;">${title}</h1>
    <p style="margin:0;color:#5C4033;font-size:15px;line-height:1.6;">${message}</p>
    <p style="margin:24px 0 0;"><a href="https://karlotagourmet.com/admin/orders" style="color:${color};font-size:13px;text-decoration:underline;">View all orders →</a></p>
  </div>
</body></html>`
}
