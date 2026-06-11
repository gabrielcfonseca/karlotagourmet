'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  RefreshCw, ChevronDown, ChevronUp, Calendar, Users,
  Clock, Truck, ShoppingBag, Loader2, Search, CheckCircle2,
  AlertCircle, DollarSign, Phone, Mail, Mailbox,
} from 'lucide-react'
import type { Order } from '@/lib/orders'

const STATUS_CONFIG = {
  pending_payment: { label: 'Pending Payment', color: 'text-yellow-600', bg: 'bg-yellow-50',  border: 'border-yellow-200', icon: AlertCircle },
  confirmed:       { label: 'Confirmed',        color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200',  icon: CheckCircle2 },
  cancelled:       { label: 'Cancelled',        color: 'text-red-600',    bg: 'bg-red-50',     border: 'border-red-200',    icon: AlertCircle },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const cfg = STATUS_CONFIG[order.status]
  const StatusIcon = cfg.icon

  return (
    <div className="border border-cream-dark rounded-sm bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 hover:bg-cream/40 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/25 flex-shrink-0 flex items-center justify-center">
            <span className="font-fraunces text-gold text-sm">{order.customer.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0">
            <p className="font-fraunces text-darkbrown text-base truncate">{order.customer.name}</p>
            <p className="font-inter-tight text-mocha/50 text-xs">
              #{order.id.slice(-8).toUpperCase()} · {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:block font-inter-tight font-semibold text-darkbrown text-sm">${order.total.toFixed(2)}</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-xs font-inter-tight font-medium ${cfg.bg} ${cfg.border} ${cfg.color}`}>
            <StatusIcon size={11} />
            {cfg.label}
          </span>
          {open ? <ChevronUp size={15} className="text-mocha/40" /> : <ChevronDown size={15} className="text-mocha/40" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-cream-dark px-5 py-5 space-y-5">
          {/* Contact + delivery info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InfoRow icon={Mail}    label="Email"   value={order.customer.email} href={`mailto:${order.customer.email}`} />
            <InfoRow icon={Phone}   label="Phone"   value={order.customer.phone} href={`tel:${order.customer.phone}`} />
            <InfoRow icon={order.delivery.type === 'delivery' ? Truck : ShoppingBag}
                     label={order.delivery.type === 'delivery' ? 'Delivery' : 'Pickup'}
                     value={order.delivery.type === 'delivery' ? order.delivery.address : 'Pickup at kitchen'} />
            <InfoRow icon={Calendar} label="Date & Time" value={`${order.delivery.date} at ${order.delivery.time}`} />
          </div>

          <div className="border-t border-cream-dark pt-4">
            <p className="font-inter-tight text-[10px] tracking-widest uppercase text-gold mb-3">Items</p>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between font-inter-tight text-sm">
                  <span className="text-mocha">{item.qty}× {item.name}</span>
                  <span className="text-darkbrown font-medium">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-cream-dark pt-2 mt-2 space-y-1">
                <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>Tax (6.5%)</span><span>${order.tax.toFixed(2)}</span></div>
                {order.deliveryFee > 0 && <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>Delivery</span><span>${order.deliveryFee.toFixed(2)}</span></div>}
                <div className="flex justify-between font-inter-tight font-semibold text-sm text-darkbrown border-t border-gold/30 pt-2 mt-1">
                  <span>Total</span><span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Email status */}
          <div className="flex items-center gap-2 pt-1">
            <Mailbox size={13} className={order.emailSent ? 'text-green-600' : 'text-mocha/30'} />
            <span className="font-inter-tight text-xs text-mocha/50">
              {order.emailSent ? 'Customer requested email confirmation' : 'No email confirmation requested'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-2.5 p-3 rounded-sm border border-cream-dark hover:border-gold/30 transition-colors group">
      <Icon size={13} className="text-gold mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="font-inter-tight text-[10px] tracking-widest uppercase text-mocha/40 mb-0.5">{label}</p>
        <p className="font-inter-tight text-xs text-mocha/80 truncate">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <div>{content}</div>
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-white border border-cream-dark rounded-sm px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-gold" />
        <p className="font-inter-tight text-[10px] tracking-widest uppercase text-mocha/40">{label}</p>
      </div>
      <p className="font-fraunces text-2xl text-darkbrown">{value}</p>
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | Order['status']>('all')

  const fetch_ = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/orders')
      if (!res.ok) throw new Error('Failed to load orders')
      setOrders(await res.json())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false
    const q = search.toLowerCase()
    return !q || o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
  })

  const confirmed = orders.filter(o => o.status === 'confirmed').length
  const revenue = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.total, 0)

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-inter-tight text-[10px] tracking-[0.3em] uppercase text-gold font-semibold mb-1">Karlota at Home</p>
          <h1 className="font-fraunces text-2xl text-darkbrown">Orders</h1>
        </div>
        <button onClick={fetch_} disabled={loading} className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold font-inter-tight text-xs tracking-widest uppercase rounded-sm hover:bg-gold/5 transition-all disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard icon={Users}        label="Total Orders" value={loading ? '—' : String(orders.length)} />
        <StatCard icon={CheckCircle2} label="Confirmed"    value={loading ? '—' : String(confirmed)} />
        <StatCard icon={Clock}        label="This Week"    value={loading ? '—' : String(orders.filter(o => (Date.now() - new Date(o.createdAt).getTime()) / 86400000 <= 7).length)} />
        <StatCard icon={DollarSign}   label="Revenue"      value={loading ? '—' : `$${revenue.toFixed(0)}`} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mocha/40" />
          <input
            type="text" placeholder="Search by name, email or order ID…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-cream-dark rounded-sm font-inter-tight text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <select
          value={filter} onChange={e => setFilter(e.target.value as typeof filter)}
          className="px-3 py-2.5 bg-white border border-cream-dark rounded-sm font-inter-tight text-sm text-darkbrown focus:outline-none focus:border-gold transition-colors"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-mocha/50">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-inter-tight text-sm">Loading orders…</span>
        </div>
      ) : error ? (
        <div className="border border-red-200 bg-red-50 rounded-sm px-5 py-4">
          <p className="font-inter-tight text-red-600 text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={32} className="text-mocha/20 mx-auto mb-4" />
          <p className="font-fraunces text-xl text-darkbrown/40">{search || filter !== 'all' ? 'No orders match' : 'No orders yet'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => <OrderCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  )
}
