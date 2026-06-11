import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getOrderById, updateOrder } from '@/lib/orders'
import type { OrderItem } from '@/lib/orders'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')
    const order = await getOrderById(params.id)

    if (!order) return new Response(html('Order Not Found', 'This order could not be found.', false), { headers: { 'Content-Type': 'text/html' } })
    if (order.approvalToken !== token) return new Response(html('Invalid Link', 'This approval link is invalid.', false), { headers: { 'Content-Type': 'text/html' } })
    if (order.status === 'approved') return new Response(html('Already Approved', 'This order was already approved.', true), { headers: { 'Content-Type': 'text/html' } })
    if (order.status === 'rejected') return new Response(html('Already Rejected', 'This order was already rejected and cannot be approved.', false), { headers: { 'Content-Type': 'text/html' } })

    await updateOrder(params.id, { status: 'approved' })

    const resend = getResend()
    // Send confirmation email to customer
    const itemsHtml = order.items
      .map((i: OrderItem) => `<tr><td style="padding:6px 0;border-bottom:1px solid #f0e0d0;">${i.qty}× ${i.name}</td><td style="padding:6px 0;border-bottom:1px solid #f0e0d0;text-align:right;">$${(i.price * i.qty).toFixed(2)}</td></tr>`)
      .join('')

    const deliveryLine = order.delivery.type === 'pickup'
      ? 'Your order will be ready for <strong>pickup</strong>.'
      : `Your order will be <strong>delivered</strong> to:<br>${order.delivery.address}`

    await resend.emails.send({
      from: 'Karlota at Home <orders@karlotagourmet.com>',
      to: order.customer.email,
      subject: `✅ Order Confirmed — Karlota at Home`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF0E6;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(59,42,26,0.12);">
    <div style="background:#3B2A1A;padding:28px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Karlota at Home</p>
      <h1 style="margin:8px 0 0;font-size:24px;color:#FAF0E6;font-weight:400;">Your Order is Confirmed! 🎉</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#5C4033;font-size:15px;line-height:1.6;">Hi <strong>${order.customer.name}</strong>,<br><br>
      Great news! Your Karlota at Home order has been confirmed and is being prepared with love.</p>

      <div style="background:#FAF0E6;border-left:3px solid #C9A84C;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">Pickup / Delivery</p>
        <p style="margin:0;color:#3B2A1A;font-size:15px;">${deliveryLine}</p>
        <p style="margin:8px 0 0;color:#3B2A1A;font-weight:600;">📅 ${order.delivery.date} at ${order.delivery.time}</p>
      </div>

      <h3 style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin:24px 0 12px;">Your Order</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${itemsHtml}
        <tr><td style="padding:8px 0;color:#5C4033;">Subtotal</td><td style="text-align:right;color:#3B2A1A;">$${order.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#5C4033;">Tax (6.5%)</td><td style="text-align:right;color:#3B2A1A;">$${order.tax.toFixed(2)}</td></tr>
        ${order.deliveryFee > 0 ? `<tr><td style="padding:4px 0;color:#5C4033;">Delivery Fee</td><td style="text-align:right;color:#3B2A1A;">$${order.deliveryFee.toFixed(2)}</td></tr>` : ''}
        <tr><td style="padding:8px 0;font-weight:700;color:#3B2A1A;font-size:16px;border-top:2px solid #C9A84C;">TOTAL CHARGED</td><td style="text-align:right;font-weight:700;color:#C9A84C;font-size:16px;border-top:2px solid #C9A84C;">$${order.total.toFixed(2)}</td></tr>
      </table>

      <p style="color:#5C4033;font-size:13px;margin-top:24px;line-height:1.6;">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/14078443371" style="color:#C9A84C;">+1 (407) 844-3371</a>.</p>
    </div>
    <div style="padding:16px 32px;background:#3B2A1A;text-align:center;">
      <p style="margin:0;font-size:11px;color:#FAF0E6;opacity:0.4;letter-spacing:2px;text-transform:uppercase;">Karlota Gourmet — Karlota at Home</p>
    </div>
  </div>
</body>
</html>`,
    })

    return new Response(html('Order Approved! ✅', `Confirmation email sent to ${order.customer.email}.`, true), {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    console.error('approve error:', err)
    return new Response(html('Error', String(err), false), { headers: { 'Content-Type': 'text/html' } })
  }
}

function html(title: string, message: string, success: boolean) {
  const color = success ? '#2D6A4F' : '#9B2226'
  const bg = success ? '#D8F3DC' : '#FFE8E8'
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF0E6;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;box-sizing:border-box;">
  <div style="max-width:400px;width:100%;background:#fff;border-radius:8px;padding:40px 32px;text-align:center;box-shadow:0 8px 40px rgba(59,42,26,0.12);">
    <div style="width:64px;height:64px;border-radius:50%;background:${bg};display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;">${success ? '✅' : '❌'}</div>
    <h1 style="margin:0 0 12px;color:#3B2A1A;font-size:22px;font-weight:600;">${title}</h1>
    <p style="margin:0;color:#5C4033;font-size:15px;line-height:1.6;">${message}</p>
    <p style="margin:24px 0 0;"><a href="https://karlotagourmet.com/admin/orders" style="color:${color};font-size:13px;text-decoration:underline;">View all orders →</a></p>
  </div>
</body></html>`
}
