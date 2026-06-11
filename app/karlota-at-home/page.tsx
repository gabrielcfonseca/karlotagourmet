'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import {
  ShoppingCart, Plus, Minus, Trash2, ChevronRight, ChevronLeft,
  Truck, ShoppingBag, Calendar, Clock, MapPin, Loader2, X,
  Star, ChefHat,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { MENU, MENU_CATEGORIES, TAX_RATE } from '@/lib/menu'
import type { MenuItem } from '@/lib/menu'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartItem extends MenuItem { qty: number }

type Step = 'menu' | 'details' | 'payment'

interface CustomerInfo {
  name: string; email: string; phone: string
}

// ─── 24h minimum date/time helper ────────────────────────────────────────────

function getMinDateTime() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const date = d.toISOString().split('T')[0]
  const hours   = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return { minDate: date, minTime: `${hours}:${minutes}` }
}

// ─── Cart drawer ─────────────────────────────────────────────────────────────

function CartDrawer({
  cart, open, onClose, onAdd, onRemove, onClear, onCheckout,
}: {
  cart: CartItem[]; open: boolean; onClose: () => void
  onAdd: (id: string) => void; onRemove: (id: string) => void
  onClear: () => void; onCheckout: () => void
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax      = subtotal * TAX_RATE
  const total    = subtotal + tax

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
           style={{ backgroundColor: '#FAF0E6' }}>

        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark" style={{ backgroundColor: '#3B2A1A' }}>
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-gold" />
            <span className="font-fraunces text-cream text-lg">Your Order</span>
          </div>
          <button onClick={onClose} className="text-cream/60 hover:text-cream p-1"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={32} className="text-mocha/20 mx-auto mb-3" />
              <p className="font-inter-tight text-sm text-mocha/50">Your cart is empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-white border border-cream-dark rounded-sm px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-inter-tight text-sm font-medium text-darkbrown truncate">{item.name}</p>
                {item.serves && <p className="font-inter-tight text-xs text-mocha/50">{item.serves}</p>}
                <p className="font-inter-tight text-sm text-gold font-semibold mt-0.5">${(item.price * item.qty).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => onRemove(item.id)} className="w-7 h-7 rounded-full border border-mocha/20 flex items-center justify-center text-mocha hover:border-red-300 hover:text-red-500 transition-colors">
                  {item.qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                </button>
                <span className="font-inter-tight text-sm font-semibold text-darkbrown w-4 text-center">{item.qty}</span>
                <button onClick={() => onAdd(item.id)} className="w-7 h-7 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition-colors">
                  <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-cream-dark space-y-2">
            <div className="flex justify-between font-inter-tight text-sm text-mocha/70"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between font-inter-tight text-sm text-mocha/70"><span>Tax (6.5%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-inter-tight font-semibold text-darkbrown text-base border-t border-cream-dark pt-2 mt-1">
              <span>Est. Total</span><span>${total.toFixed(2)}</span>
            </div>
            <p className="font-inter-tight text-xs text-mocha/40">Delivery fee added at checkout</p>
            <button onClick={onCheckout} className="btn-gold w-full mt-3">
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Menu card ────────────────────────────────────────────────────────────────

function MenuCard({ item, qty, onAdd, onRemove }: { item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void }) {
  return (
    <div className={`bg-white border rounded-sm p-5 transition-all duration-200 hover:shadow-md ${qty > 0 ? 'border-gold/50 shadow-[0_0_0_1px_rgba(201,168,76,0.3)]' : 'border-cream-dark'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-fraunces text-darkbrown text-base leading-tight">{item.name}</h3>
          </div>
          {item.badge && (
            <span className="inline-block font-inter-tight text-[10px] tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5 rounded-sm mb-2">
              {item.badge}
            </span>
          )}
          <p className="font-inter-tight text-xs text-mocha/60 leading-relaxed mb-1">{item.description}</p>
          {item.serves && <p className="font-inter-tight text-xs text-mocha/50 italic">{item.serves}</p>}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-fraunces text-lg text-darkbrown">${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-dark">
        {qty === 0 ? (
          <button onClick={onAdd} className="flex items-center gap-2 font-inter-tight text-sm text-gold border border-gold/40 px-4 py-2 rounded-sm hover:bg-gold/10 transition-colors">
            <Plus size={14} /> Add to Order
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button onClick={onRemove} className="w-8 h-8 rounded-full border border-mocha/20 flex items-center justify-center text-mocha hover:border-red-300 hover:text-red-500 transition-colors">
              {qty === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
            </button>
            <span className="font-inter-tight font-semibold text-darkbrown text-base w-5 text-center">{qty}</span>
            <button onClick={onAdd} className="w-8 h-8 rounded-full bg-gold border border-gold flex items-center justify-center text-darkbrown hover:bg-gold-light transition-colors">
              <Plus size={13} />
            </button>
          </div>
        )}
        {qty > 0 && (
          <p className="font-inter-tight text-sm font-semibold text-gold">${(item.price * qty).toFixed(2)}</p>
        )}
      </div>
    </div>
  )
}

// ─── Stripe checkout form ─────────────────────────────────────────────────────

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError('')

    const { error: submitErr } = await elements.submit()
    if (submitErr) { setError(submitErr.message ?? 'Payment error'); setLoading(false); return }

    const { error: confirmErr } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/karlota-at-home/success` },
    })

    if (confirmErr) {
      setError(confirmErr.message ?? 'Payment failed')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />
      {error && (
        <div className="border border-red-300 bg-red-50 rounded-sm px-4 py-3">
          <p className="font-inter-tight text-sm text-red-600">{error}</p>
        </div>
      )}
      <button type="submit" disabled={!stripe || loading} className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <><Loader2 size={16} className="animate-spin" /> Processing…</> : 'Pay & Place Order'}
      </button>
    </form>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function KarlotaAtHomePage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen]     = useState(false)
  const [step, setStep]             = useState<Step>('menu')
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0])

  // Details step
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [address, setAddress]           = useState('')
  const [deliveryFee, setDeliveryFee]   = useState<number | null>(null)
  const [feeLoading, setFeeLoading]     = useState(false)
  const [feeError, setFeeError]         = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [customer, setCustomer]         = useState<CustomerInfo>({ name: '', email: '', phone: '' })
  const [detailsError, setDetailsError] = useState('')

  // Payment step
  const [clientSecret, setClientSecret] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const addressTimeout = useRef<NodeJS.Timeout>()
  const { minDate } = getMinDateTime()

  // Cart helpers
  const addItem = useCallback((id: string) => {
    const item = MENU.find(m => m.id === id)!
    setCart(prev => {
      const ex = prev.find(c => c.id === id)
      return ex ? prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...item, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((id: string) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === id)
      if (!ex) return prev
      return ex.qty <= 1 ? prev.filter(c => c.id !== id) : prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c)
    })
  }, [])

  const cartQty  = cart.reduce((s, c) => s + c.qty, 0)
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const tax      = subtotal * TAX_RATE
  const delivery = deliveryType === 'delivery' ? (deliveryFee ?? 0) : 0
  const total    = subtotal + tax + delivery

  // Auto-calculate delivery fee when address changes
  useEffect(() => {
    if (deliveryType !== 'delivery' || !address.trim()) {
      setDeliveryFee(null); setFeeError(''); return
    }
    clearTimeout(addressTimeout.current)
    addressTimeout.current = setTimeout(async () => {
      setFeeLoading(true); setFeeError('')
      try {
        const res  = await fetch('/api/delivery-fee', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address }) })
        const data = await res.json()
        if (!res.ok) { setFeeError(data.error ?? 'Could not calculate delivery fee'); setDeliveryFee(null) }
        else setDeliveryFee(data.fee)
      } catch {
        setFeeError('Could not calculate delivery fee')
      } finally {
        setFeeLoading(false)
      }
    }, 800)
  }, [address, deliveryType])

  async function proceedToPayment() {
    setDetailsError('')
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) { setDetailsError('Please fill in all your contact details.'); return }
    if (!deliveryDate || !deliveryTime) { setDetailsError('Please select a pickup/delivery date and time.'); return }
    if (deliveryType === 'delivery' && (!address.trim() || deliveryFee === null)) { setDetailsError('Please enter a valid delivery address.'); return }
    // Validate 24h notice
    const chosen = new Date(`${deliveryDate}T${deliveryTime}`)
    if (chosen.getTime() - Date.now() < 23.5 * 60 * 60 * 1000) { setDetailsError('Please allow at least 24 hours notice for orders.'); return }

    setPaymentLoading(true); setPaymentError('')
    try {
      const res  = await fetch('/api/create-payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, qty: c.qty })),
          deliveryType, deliveryFee: delivery,
          deliveryAddress: address, deliveryDate, deliveryTime, customer,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create payment')
      setClientSecret(data.clientSecret)
      setStep('payment')
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Error creating payment')
    } finally {
      setPaymentLoading(false)
    }
  }

  // ── RENDER ────────────────────────────────────────────────────────────────

  return (
    <>
      <CartDrawer
        cart={cart} open={cartOpen} onClose={() => setCartOpen(false)}
        onAdd={addItem} onRemove={removeItem} onClear={() => setCart([])}
        onCheckout={() => { setCartOpen(false); setStep('details') }}
      />

      {/* ── Hero ── */}
      <section className="relative bg-darkbrown overflow-hidden" style={{ minHeight: '40vh' }}>
        <Image src="/image 1.JPG" alt="Karlota at Home" fill priority className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-darkbrown/50 to-darkbrown/95" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-6"><Logo variant="light" size="sm" /></div>
          <p className="font-inter-tight text-xs tracking-[0.35em] uppercase text-gold font-semibold mb-3">
            Pickup & Delivery
          </p>
          <h1 className="font-fraunces text-4xl sm:text-5xl text-cream leading-tight mb-3">
            Karlota <span className="italic text-gold">at Home</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto my-5" />
          <p className="font-inter-tight text-cream/60 text-base max-w-lg mx-auto leading-relaxed">
            Authentic Brazilian flavors, crafted in our kitchen and delivered to your door.
            Order requires <strong className="text-cream/80">24 hours notice.</strong>
          </p>
          <div className="flex items-center justify-center gap-1 mt-5">
            {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-gold fill-gold" />)}
            <span className="font-inter-tight text-xs text-cream/40 ml-2">Winter Garden, FL</span>
          </div>
        </div>
      </section>

      {/* ── Step indicator ── */}
      <div className="bg-darkbrown/95 border-b border-cream/10 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(['menu', 'details', 'payment'] as Step[]).map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                {idx > 0 && <div className="w-6 h-px bg-cream/20" />}
                <button
                  onClick={() => { if (s === 'menu' || (s === 'details' && step === 'payment')) setStep(s) }}
                  disabled={s === 'payment' || (s === 'details' && step === 'menu')}
                  className={`flex items-center gap-1.5 font-inter-tight text-xs tracking-wide transition-colors ${step === s ? 'text-gold' : (idx < ['menu','details','payment'].indexOf(step) ? 'text-cream/60 hover:text-cream cursor-pointer' : 'text-cream/25 cursor-default')}`}
                >
                  <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${step === s ? 'border-gold bg-gold text-darkbrown' : 'border-cream/25 text-cream/25'}`}>{idx + 1}</span>
                  <span className="hidden sm:inline capitalize">{s === 'menu' ? 'Menu' : s === 'details' ? 'Details' : 'Payment'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Cart button */}
          {step === 'menu' && (
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 font-inter-tight text-sm text-cream/80 hover:text-gold transition-colors">
              <ShoppingCart size={18} />
              {cartQty > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-darkbrown text-[10px] font-bold flex items-center justify-center">{cartQty}</span>
              )}
              <span className="hidden sm:inline">Cart ({cartQty})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── STEP: Menu ── */}
      {step === 'menu' && (
        <section className="bg-cream min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-10">

            {/* Category tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {MENU_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 font-inter-tight text-xs tracking-widest uppercase px-4 py-2 rounded-sm border transition-all ${activeCategory === cat ? 'bg-darkbrown text-gold border-darkbrown' : 'bg-white text-mocha border-cream-dark hover:border-mocha/30'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MENU.filter(m => m.category === activeCategory).map(item => (
                <MenuCard
                  key={item.id} item={item}
                  qty={cart.find(c => c.id === item.id)?.qty ?? 0}
                  onAdd={() => addItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            {/* Floating checkout bar */}
            {cartQty > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
                <button
                  onClick={() => { setCartOpen(false); setStep('details') }}
                  className="btn-gold w-full shadow-[0_8px_32px_rgba(201,168,76,0.4)] justify-between"
                >
                  <span className="bg-gold-dark/30 rounded-sm px-2 py-0.5 font-bold text-sm">{cartQty}</span>
                  Continue to Details
                  <span>${(subtotal * (1 + TAX_RATE)).toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── STEP: Details ── */}
      {step === 'details' && (
        <section className="bg-cream min-h-screen">
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

            <button onClick={() => setStep('menu')} className="flex items-center gap-2 font-inter-tight text-sm text-mocha/60 hover:text-mocha transition-colors">
              <ChevronLeft size={16} /> Back to menu
            </button>

            {/* Delivery type */}
            <div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-4">Pickup or Delivery?</h2>
              <div className="grid grid-cols-2 gap-3">
                {([['pickup', ShoppingBag, 'Pickup', 'Ready at our kitchen'], ['delivery', Truck, 'Delivery', 'We bring it to you']] as const).map(([type, Icon, label, sub]) => (
                  <button
                    key={type}
                    onClick={() => { setDeliveryType(type); setDeliveryFee(null); setFeeError('') }}
                    className={`flex flex-col items-center gap-2 p-5 border-2 rounded-sm transition-all ${deliveryType === type ? 'border-gold bg-gold/5' : 'border-cream-dark bg-white hover:border-mocha/30'}`}
                  >
                    <Icon size={22} className={deliveryType === type ? 'text-gold' : 'text-mocha/40'} />
                    <span className={`font-inter-tight font-semibold text-sm ${deliveryType === type ? 'text-darkbrown' : 'text-mocha/60'}`}>{label}</span>
                    <span className="font-inter-tight text-xs text-mocha/40">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            {deliveryType === 'delivery' && (
              <div>
                <label className="block font-inter-tight text-sm font-medium text-darkbrown mb-2">
                  <MapPin size={14} className="inline mr-1 text-gold" /> Delivery Address
                </label>
                <input
                  type="text"
                  placeholder="Enter your full address"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full border border-cream-dark rounded-sm px-4 py-3 font-inter-tight text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:border-gold transition-colors bg-white"
                />
                <div className="mt-2 h-5">
                  {feeLoading && <span className="font-inter-tight text-xs text-mocha/50 flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> Calculating delivery fee…</span>}
                  {feeError  && <span className="font-inter-tight text-xs text-red-500">{feeError}</span>}
                  {deliveryFee !== null && !feeLoading && <span className="font-inter-tight text-xs text-green-700 font-semibold">✓ Delivery fee: ${deliveryFee.toFixed(2)}</span>}
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-1">
                <Calendar size={18} className="inline mr-2 text-gold" />
                When do you need it?
              </h2>
              <p className="font-inter-tight text-xs text-mocha/50 mb-4">Minimum 24 hours notice required.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-inter-tight text-xs text-mocha/60 mb-1.5">Date</label>
                  <input
                    type="date" min={minDate} value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)}
                    className="w-full border border-cream-dark rounded-sm px-3 py-3 font-inter-tight text-sm text-darkbrown focus:outline-none focus:border-gold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-inter-tight text-xs text-mocha/60 mb-1.5">Time</label>
                  <input
                    type="time" value={deliveryTime}
                    onChange={e => setDeliveryTime(e.target.value)}
                    className="w-full border border-cream-dark rounded-sm px-3 py-3 font-inter-tight text-sm text-darkbrown focus:outline-none focus:border-gold bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-4">Your Information</h2>
              <div className="space-y-3">
                {([['name','text','Full Name','Your full name'], ['email','email','Email','your@email.com'], ['phone','tel','Phone / WhatsApp','+1 (407) 000-0000']] as const).map(([field, type, label, placeholder]) => (
                  <div key={field}>
                    <label className="block font-inter-tight text-xs text-mocha/60 mb-1.5">{label}</label>
                    <input
                      type={type} placeholder={placeholder}
                      value={customer[field as keyof CustomerInfo]}
                      onChange={e => setCustomer(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full border border-cream-dark rounded-sm px-4 py-3 font-inter-tight text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:border-gold transition-colors bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white border border-cream-dark rounded-sm px-5 py-5">
              <h3 className="font-inter-tight text-[10px] tracking-widest uppercase text-gold mb-4">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between font-inter-tight text-sm mb-2">
                  <span className="text-mocha">{item.qty}× {item.name}</span>
                  <span className="text-darkbrown">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-cream-dark mt-3 pt-3 space-y-1">
                <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>Tax (6.5%)</span><span>${tax.toFixed(2)}</span></div>
                {deliveryType === 'delivery' && <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>Delivery</span><span>{deliveryFee !== null ? `$${delivery.toFixed(2)}` : '—'}</span></div>}
                <div className="flex justify-between font-inter-tight font-semibold text-darkbrown text-base border-t border-cream-dark pt-2 mt-1">
                  <span>Total</span>
                  <span>{deliveryType === 'delivery' && deliveryFee === null ? '—' : `$${total.toFixed(2)}`}</span>
                </div>
              </div>
            </div>

            {detailsError && (
              <div className="border border-red-200 bg-red-50 rounded-sm px-4 py-3">
                <p className="font-inter-tight text-sm text-red-600">{detailsError}</p>
              </div>
            )}
            {paymentError && (
              <div className="border border-red-200 bg-red-50 rounded-sm px-4 py-3">
                <p className="font-inter-tight text-sm text-red-600">{paymentError}</p>
              </div>
            )}

            <button
              onClick={proceedToPayment}
              disabled={paymentLoading || (deliveryType === 'delivery' && (feeLoading || deliveryFee === null))}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentLoading ? <><Loader2 size={16} className="animate-spin" /> Preparing checkout…</> : <>Proceed to Payment <ChevronRight size={16} /></>}
            </button>
          </div>
        </section>
      )}

      {/* ── STEP: Payment ── */}
      {step === 'payment' && clientSecret && (
        <section className="bg-cream min-h-screen">
          <div className="max-w-lg mx-auto px-6 py-10">
            <button onClick={() => setStep('details')} className="flex items-center gap-2 font-inter-tight text-sm text-mocha/60 hover:text-mocha transition-colors mb-8">
              <ChevronLeft size={16} /> Back to details
            </button>

            <div className="bg-white border border-cream-dark rounded-sm px-6 py-6 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ChefHat size={16} className="text-gold" />
                <p className="font-inter-tight text-[10px] tracking-widest uppercase text-gold">Karlota at Home</p>
              </div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-4">Secure Payment</h2>
              <div className="flex justify-between font-inter-tight font-semibold text-darkbrown text-lg border-t border-cream-dark pt-4">
                <span>Total Due</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white border border-cream-dark rounded-sm px-6 py-6">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat', variables: { colorPrimary: '#C9A84C', fontFamily: 'Inter, sans-serif' } } }}>
                <CheckoutForm onSuccess={() => router.push('/karlota-at-home/success')} />
              </Elements>
            </div>

            <p className="font-inter-tight text-xs text-mocha/40 text-center mt-4">
              🔒 Payments secured by Stripe. Your card will be charged only after confirmation.
            </p>
          </div>
        </section>
      )}
    </>
  )
}
