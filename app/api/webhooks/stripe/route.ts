import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { loadOrders, saveOrders } from '@/lib/orders'
import type { OrderItem } from '@/lib/orders'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' }) }
function getResend() { return new Resend(process.env.RESEND_API_KEY) }

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  const stripe = getStripe()
  const resend  = getResend()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'payment_intent.succeeded') {
    return NextResponse.json({ received: true })
  }

  const pi      = event.data.object as Stripe.PaymentIntent
  const orderId = pi.metadata?.orderId
  if (!orderId) return NextResponse.json({ received: true })

  // Update order status → pending_approval
  const orders = await loadOrders()
  const idx    = orders.findIndex(o => o.id === orderId)
  if (idx === -1) return NextResponse.json({ received: true })

  orders[idx].status = 'pending_approval'
  await saveOrders(orders)

  const order = orders[idx]
  const approveUrl = `https://karlotagourmet.com/api/orders/${order.id}/approve?token=${order.approvalToken}`
  const rejectUrl  = `https://karlotagourmet.com/api/orders/${order.id}/reject?token=${order.approvalToken}`

  const itemsHtml = order.items
    .map((i: OrderItem) => `<tr>
      <td style="padding:7px 0;border-bottom:1px solid #f0e0d0;color:#3B2A1A;">${i.qty}× ${i.name}</td>
      <td style="padding:7px 0;border-bottom:1px solid #f0e0d0;text-align:right;color:#3B2A1A;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`)
    .join('')

  await resend.emails.send({
    from: 'Karlota at Home <orders@karlotagourmet.com>',
    to:   'karla@karlota.net',
    subject: `🍽️ New Order #${order.id.slice(-6).toUpperCase()} — ${order.customer.name} — $${order.total.toFixed(2)}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;background:#FAF0E6;margin:0;padding:24px;">
<div style="max-width:580px;margin:0 auto;background:#fff;border-radius:4px;overflow:hidden;box-shadow:0 4px 24px rgba(59,42,26,0.12);">

  <div style="background:#3B2A1A;padding:28px 32px;">
    <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-weight:600;">Karlota at Home</p>
    <h1 style="margin:8px 0 0;font-size:22px;color:#FAF0E6;font-weight:400;">New Order Received 🍽️</h1>
  </div>

  <div style="padding:28px 32px;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="color:#5C4033;font-size:12px;padding:5px 0;width:36%;">Order ID</td>    <td style="font-weight:600;color:#3B2A1A;">#${order.id.slice(-8).toUpperCase()}</td></tr>
      <tr><td style="color:#5C4033;font-size:12px;padding:5px 0;">Customer</td>  <td style="font-weight:600;color:#3B2A1A;">${order.customer.name}</td></tr>
      <tr><td style="color:#5C4033;font-size:12px;padding:5px 0;">Email</td>     <td style="color:#3B2A1A;">${order.customer.email}</td></tr>
      <tr><td style="color:#5C4033;font-size:12px;padding:5px 0;">Phone</td>     <td style="color:#3B2A1A;">${order.customer.phone}</td></tr>
      <tr><td style="color:#5C4033;font-size:12px;padding:5px 0;">Type</td>      <td style="color:#3B2A1A;text-transform:capitalize;">${order.delivery.type}</td></tr>
      <tr><td style="color:#5C4033;font-size:12px;padding:5px 0;">Date & Time</td><td style="font-weight:600;color:#3B2A1A;">${order.delivery.date} at ${order.delivery.time}</td></tr>
      ${order.delivery.type === 'delivery' ? `<tr><td style="color:#5C4033;font-size:12px;padding:5px 0;">Address</td><td style="color:#3B2A1A;">${order.delivery.address}</td></tr>` : ''}
    </table>

    <h3 style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin:20px 0 10px;">Items</h3>
    <table style="width:100%;border-collapse:collapse;">
      ${itemsHtml}
      <tr><td style="padding:8px 0;color:#5C4033;">Subtotal</td>      <td style="text-align:right;color:#3B2A1A;">$${order.subtotal.toFixed(2)}</td></tr>
      <tr><td style="padding:4px 0;color:#5C4033;">Tax (6.5%)</td>    <td style="text-align:right;color:#3B2A1A;">$${order.tax.toFixed(2)}</td></tr>
      ${order.deliveryFee > 0 ? `<tr><td style="padding:4px 0;color:#5C4033;">Delivery Fee</td><td style="text-align:right;color:#3B2A1A;">$${order.deliveryFee.toFixed(2)}</td></tr>` : ''}
      <tr><td style="padding:10px 0 0;font-weight:700;color:#3B2A1A;font-size:17px;border-top:2px solid #C9A84C;">TOTAL</td>
          <td style="padding:10px 0 0;text-align:right;font-weight:700;color:#C9A84C;font-size:17px;border-top:2px solid #C9A84C;">$${order.total.toFixed(2)}</td></tr>
    </table>
  </div>

  <div style="padding:28px 32px;background:#FAF0E6;text-align:center;border-top:1px solid #F0DEC8;">
    <p style="margin:0 0 20px;font-size:14px;color:#5C4033;font-weight:600;">Tap to respond to this order:</p>
    <a href="${approveUrl}" style="display:inline-block;margin:0 8px 12px;padding:16px 36px;background:#2D6A4F;color:#fff;text-decoration:none;border-radius:4px;font-weight:700;font-size:16px;">✅ APPROVE</a>
    <a href="${rejectUrl}"  style="display:inline-block;margin:0 8px 12px;padding:16px 36px;background:#9B2226;color:#fff;text-decoration:none;border-radius:4px;font-weight:700;font-size:16px;">❌ REJECT</a>
    <p style="margin:16px 0 0;font-size:12px;color:#5C4033;opacity:0.6;">Or manage from <a href="https://karlotagourmet.com/admin/orders" style="color:#C9A84C;">admin panel</a></p>
  </div>

</div>
</body></html>`,
  })

  return NextResponse.json({ received: true })
}
