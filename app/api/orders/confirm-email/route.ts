import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { loadOrders, updateOrder } from '@/lib/orders'
import type { Order, OrderItem } from '@/lib/orders'

function getResend() { return new Resend(process.env.RESEND_API_KEY) }

// POST { paymentIntentId } — customer opts in to receive the order confirmation email
export async function POST(req: Request) {
  try {
    const { paymentIntentId } = await req.json()
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Missing payment reference' }, { status: 400 })
    }

    const orders = await loadOrders()
    const order = orders.find(o => o.stripePaymentIntentId === paymentIntentId)
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const result = await sendConfirmationEmail(order)
    if (result.error) {
      console.error('Resend error:', result.error)
      return NextResponse.json({ error: 'Could not send email. Please try again.' }, { status: 502 })
    }

    await updateOrder(order.id, { emailSent: true })
    return NextResponse.json({ success: true, sentTo: order.customer.email })
  } catch (err) {
    console.error('confirm-email error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

async function sendConfirmationEmail(order: Order) {
  const resend = getResend()

  const itemsHtml = order.items
    .map((i: OrderItem) => `<tr>
      <td style="padding:7px 0;border-bottom:1px solid #f0e0d0;color:#3B2A1A;">${i.qty}× ${i.name}</td>
      <td style="padding:7px 0;border-bottom:1px solid #f0e0d0;text-align:right;color:#3B2A1A;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`)
    .join('')

  const deliveryLine = order.delivery.type === 'pickup'
    ? 'Your order will be ready for <strong>pickup</strong> at our kitchen.'
    : `Your order will be <strong>delivered</strong> to:<br>${order.delivery.address}`

  return resend.emails.send({
    from: 'Karlota at Home <orders@karlotagourmet.com>',
    to: order.customer.email,
    subject: `Your Karlota at Home Order — #${order.id.slice(-6).toUpperCase()}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF0E6;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(59,42,26,0.12);">
    <div style="background:#3B2A1A;padding:28px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Karlota at Home</p>
      <h1 style="margin:8px 0 0;font-size:24px;color:#FAF0E6;font-weight:400;">Order Confirmed 🎉</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#5C4033;font-size:15px;line-height:1.6;">Hi <strong>${order.customer.name}</strong>,<br><br>
      Thank you for your order! Your payment was received and your food is being prepared with love.</p>

      <div style="background:#FAF0E6;border-left:3px solid #C9A84C;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;">Pickup / Delivery</p>
        <p style="margin:0;color:#3B2A1A;font-size:15px;">${deliveryLine}</p>
        <p style="margin:8px 0 0;color:#3B2A1A;font-weight:600;">📅 ${order.delivery.date} at ${order.delivery.time}</p>
      </div>

      <h3 style="font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#C9A84C;margin:24px 0 12px;">Your Order #${order.id.slice(-6).toUpperCase()}</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${itemsHtml}
        <tr><td style="padding:8px 0;color:#5C4033;">Subtotal</td><td style="text-align:right;color:#3B2A1A;">$${order.subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#5C4033;">Tax (6.5%)</td><td style="text-align:right;color:#3B2A1A;">$${order.tax.toFixed(2)}</td></tr>
        ${order.deliveryFee > 0 ? `<tr><td style="padding:4px 0;color:#5C4033;">Delivery Fee</td><td style="text-align:right;color:#3B2A1A;">$${order.deliveryFee.toFixed(2)}</td></tr>` : ''}
        <tr><td style="padding:8px 0;font-weight:700;color:#3B2A1A;font-size:16px;border-top:2px solid #C9A84C;">TOTAL PAID</td><td style="text-align:right;font-weight:700;color:#C9A84C;font-size:16px;border-top:2px solid #C9A84C;">$${order.total.toFixed(2)}</td></tr>
      </table>

      <p style="color:#5C4033;font-size:13px;margin-top:24px;line-height:1.6;">Questions? Reply to this email or WhatsApp us at <a href="https://wa.me/14078443371" style="color:#C9A84C;">+1 (407) 844-3371</a>.</p>
    </div>
    <div style="padding:16px 32px;background:#3B2A1A;text-align:center;">
      <p style="margin:0;font-size:11px;color:#FAF0E6;opacity:0.4;letter-spacing:2px;text-transform:uppercase;">Karlota Gourmet — Karlota at Home</p>
    </div>
  </div>
</body></html>`,
  })
}
