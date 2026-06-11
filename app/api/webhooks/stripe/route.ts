import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { loadOrders, saveOrders } from '@/lib/orders'
import { sendOrderTelegram } from '@/lib/telegram'

function getStripe() { return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' }) }

export async function POST(req: Request) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!

  const stripe = getStripe()
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

  // Auto-confirm the order — payment succeeded, no approval needed
  const orders = await loadOrders()
  const idx    = orders.findIndex(o => o.id === orderId)
  if (idx === -1) return NextResponse.json({ received: true })

  // Idempotency: only act the first time it becomes confirmed
  if (orders[idx].status === 'confirmed') return NextResponse.json({ received: true })

  orders[idx].status = 'confirmed'
  await saveOrders(orders)

  // Notify the team on Telegram with full order info (no buttons)
  await sendOrderTelegram(orders[idx])

  return NextResponse.json({ received: true })
}
