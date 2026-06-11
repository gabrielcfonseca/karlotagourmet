import { NextResponse } from 'next/server'
import { loadOrders } from '@/lib/orders'

// GET — list all orders (admin panel)
export async function GET() {
  try {
    const orders = await loadOrders()
    return NextResponse.json(orders)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
