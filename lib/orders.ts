import { put, head } from '@vercel/blob'

const ORDERS_KEY = 'admin/orders.json'

export interface OrderItem {
  id: string
  name: string
  price: number
  qty: number
}

export interface Order {
  id: string
  createdAt: string
  status: 'pending_payment' | 'confirmed' | 'cancelled'
  emailSent?: boolean
  customer: {
    name: string
    email: string
    phone: string
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  deliveryFee: number
  total: number
  delivery: {
    type: 'pickup' | 'delivery'
    address: string
    date: string    // ISO date string  e.g. "2026-06-12"
    time: string    // e.g. "14:00"
  }
  stripePaymentIntentId: string
  approvalToken: string
  rejectionReason?: string
}

export async function loadOrders(): Promise<Order[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []
  try {
    const info = await head(ORDERS_KEY, { token })
    const res = await fetch(info.url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await put(ORDERS_KEY, JSON.stringify(orders, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await loadOrders()
  return orders.find(o => o.id === id) ?? null
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const orders = await loadOrders()
  const idx = orders.findIndex(o => o.id === id)
  if (idx === -1) return null
  orders[idx] = { ...orders[idx], ...patch }
  await saveOrders(orders)
  return orders[idx]
}
