import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { TAX_RATE } from '@/lib/menu'
import { loadOrders, saveOrders } from '@/lib/orders'
import type { Order } from '@/lib/orders'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, deliveryType, deliveryFee, deliveryAddress, deliveryDate, deliveryTime, customer } = body

    if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 })
    if (!customer?.name || !customer?.email || !customer?.phone) return NextResponse.json({ error: 'Customer info required' }, { status: 400 })
    if (!deliveryDate || !deliveryTime) return NextResponse.json({ error: 'Date and time required' }, { status: 400 })

    const subtotal = items.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0)
    const tax      = subtotal * TAX_RATE
    const delivery = deliveryType === 'delivery' ? (deliveryFee ?? 0) : 0
    const total    = subtotal + tax + delivery
    const amountCents = Math.round(total * 100)

    // Generate approval token
    const approvalToken = crypto.randomUUID()
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

    // Create Stripe PaymentIntent
    const stripe = getStripe()
    const pi = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      receipt_email: customer.email,
      metadata: { orderId, customerName: customer.name },
    })

    // Persist order as pending_payment
    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'pending_payment',
      customer,
      items,
      subtotal,
      tax,
      deliveryFee: delivery,
      total,
      delivery: {
        type: deliveryType,
        address: deliveryAddress ?? '',
        date: deliveryDate,
        time: deliveryTime,
      },
      stripePaymentIntentId: pi.id,
      approvalToken,
    }

    const orders = await loadOrders()
    orders.unshift(order)
    await saveOrders(orders)

    return NextResponse.json({ clientSecret: pi.client_secret, orderId })
  } catch (err) {
    console.error('create-payment-intent error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
