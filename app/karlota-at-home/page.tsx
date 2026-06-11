'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import {
  ShoppingCart, Plus, Minus, Trash2, ChevronRight, ChevronLeft,
  Truck, ShoppingBag, Calendar, Loader2, X, Star, ChefHat,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { useLang } from '@/lib/language-context'
import { MENU, CATEGORIES, TAX_RATE } from '@/lib/menu'
import type { MenuItem, CategoryKey } from '@/lib/menu'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)

interface CartItem extends MenuItem { qty: number }
type Step = 'menu' | 'details' | 'payment'
interface CustomerInfo { name: string; email: string; phone: string }
type Lang = 'en' | 'pt'

// ─── Date / time slot generation (reliable dropdowns, 24h notice) ─────────────

function generateDateOptions(lang: Lang) {
  // Build the next 21 days starting tomorrow (so any business-hour slot is ≥24h out)
  const opts: { value: string; label: string }[] = []
  const now = new Date()
  for (let i = 1; i <= 21; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const label = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      weekday: 'long', month: 'short', day: 'numeric',
    })
    opts.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) })
  }
  return opts
}

// Business-hours slots: 10:00 AM – 7:00 PM, every 30 min
const TIME_SLOTS: { value: string; label: string }[] = (() => {
  const slots: { value: string; label: string }[] = []
  for (let h = 10; h <= 19; h++) {
    for (const m of [0, 30]) {
      if (h === 19 && m === 30) continue
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const ampm = h < 12 ? 'AM' : 'PM'
      const h12 = h % 12 === 0 ? 12 : h % 12
      slots.push({ value, label: `${h12}:${String(m).padStart(2, '0')} ${ampm}` })
    }
  }
  return slots
})()

// ─── Cart drawer ─────────────────────────────────────────────────────────────

function CartDrawer({
  cart, open, onClose, onAdd, onRemove, onCheckout, lang, t,
}: {
  cart: CartItem[]; open: boolean; onClose: () => void
  onAdd: (id: string) => void; onRemove: (id: string) => void
  onCheckout: () => void; lang: Lang; t: (en: string, pt: string) => string
}) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
           style={{ backgroundColor: '#FAF0E6' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark" style={{ backgroundColor: '#3B2A1A' }}>
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-gold" />
            <span className="font-fraunces text-cream text-lg">{t('Your Order', 'Seu Pedido')}</span>
          </div>
          <button onClick={onClose} className="text-cream/60 hover:text-cream p-1"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart size={32} className="text-mocha/20 mx-auto mb-3" />
              <p className="font-inter-tight text-sm text-mocha/50">{t('Your cart is empty', 'Seu carrinho está vazio')}</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-white border border-cream-dark rounded-sm px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-inter-tight text-sm font-medium text-darkbrown truncate">{item.name[lang]}</p>
                {item.serves && <p className="font-inter-tight text-xs text-mocha/50">{item.serves[lang]}</p>}
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
            <div className="flex justify-between font-inter-tight text-sm text-mocha/70"><span>{t('Subtotal', 'Subtotal')}</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between font-inter-tight text-sm text-mocha/70"><span>{t('Tax (6.5%)', 'Imposto (6,5%)')}</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-inter-tight font-semibold text-darkbrown text-base border-t border-cream-dark pt-2 mt-1">
              <span>{t('Est. Total', 'Total Est.')}</span><span>${total.toFixed(2)}</span>
            </div>
            <p className="font-inter-tight text-xs text-mocha/40">{t('Delivery fee added at checkout', 'Taxa de entrega adicionada no checkout')}</p>
            <button onClick={onCheckout} className="btn-gold w-full mt-3">
              {t('Continue', 'Continuar')} <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Menu card ────────────────────────────────────────────────────────────────

function MenuCard({ item, qty, onAdd, onRemove, lang, t }: {
  item: MenuItem; qty: number; onAdd: () => void; onRemove: () => void
  lang: Lang; t: (en: string, pt: string) => string
}) {
  return (
    <div className={`bg-white border rounded-sm p-5 transition-all duration-200 hover:shadow-md ${qty > 0 ? 'border-gold/50 shadow-[0_0_0_1px_rgba(201,168,76,0.3)]' : 'border-cream-dark'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-fraunces text-darkbrown text-base leading-tight mb-1">{item.name[lang]}</h3>
          {item.badge && (
            <span className="inline-block font-inter-tight text-[10px] tracking-widest uppercase text-gold border border-gold/30 px-2 py-0.5 rounded-sm mb-2">
              {item.badge[lang]}
            </span>
          )}
          <p className="font-inter-tight text-xs text-mocha/60 leading-relaxed mb-1">{item.description[lang]}</p>
          {item.serves && <p className="font-inter-tight text-xs text-mocha/50 italic">{item.serves[lang]}</p>}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="font-fraunces text-lg text-darkbrown">${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-dark">
        {qty === 0 ? (
          <button onClick={onAdd} className="flex items-center gap-2 font-inter-tight text-sm text-gold border border-gold/40 px-4 py-2 rounded-sm hover:bg-gold/10 transition-colors">
            <Plus size={14} /> {t('Add to Order', 'Adicionar')}
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
        {qty > 0 && <p className="font-inter-tight text-sm font-semibold text-gold">${(item.price * qty).toFixed(2)}</p>}
      </div>
    </div>
  )
}

// ─── Stripe checkout form ─────────────────────────────────────────────────────

function CheckoutForm({ onSuccess, t }: { onSuccess: () => void; t: (en: string, pt: string) => string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    if (confirmErr) { setError(confirmErr.message ?? 'Payment failed'); setLoading(false) }
    else onSuccess()
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
        {loading ? <><Loader2 size={16} className="animate-spin" /> {t('Processing…', 'Processando…')}</> : t('Pay & Place Order', 'Pagar e Finalizar')}
      </button>
    </form>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function KarlotaAtHomePage() {
  const router = useRouter()
  const { lang, t } = useLang()
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [step, setStep] = useState<Step>('menu')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('petiscos')

  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup')
  const [address, setAddress] = useState('')
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null)
  const [feeLoading, setFeeLoading] = useState(false)
  const [feeError, setFeeError] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', email: '', phone: '' })
  const [detailsError, setDetailsError] = useState('')

  const [clientSecret, setClientSecret] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const addressTimeout = useRef<NodeJS.Timeout>()
  const dateOptions = useMemo(() => generateDateOptions(lang), [lang])

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

  const cartQty = cart.reduce((s, c) => s + c.qty, 0)
  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0)
  const tax = subtotal * TAX_RATE
  const delivery = deliveryType === 'delivery' ? (deliveryFee ?? 0) : 0
  const total = subtotal + tax + delivery

  useEffect(() => {
    if (deliveryType !== 'delivery' || !address.trim()) { setDeliveryFee(null); setFeeError(''); return }
    clearTimeout(addressTimeout.current)
    addressTimeout.current = setTimeout(async () => {
      setFeeLoading(true); setFeeError('')
      try {
        const res = await fetch('/api/delivery-fee', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ address }) })
        const data = await res.json()
        if (!res.ok) { setFeeError(data.error ?? t('Could not calculate delivery fee', 'Não foi possível calcular a taxa de entrega')); setDeliveryFee(null) }
        else setDeliveryFee(data.fee)
      } catch {
        setFeeError(t('Could not calculate delivery fee', 'Não foi possível calcular a taxa de entrega'))
      } finally {
        setFeeLoading(false)
      }
    }, 800)
  }, [address, deliveryType, t])

  async function proceedToPayment() {
    setDetailsError('')
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) { setDetailsError(t('Please fill in all your contact details.', 'Preencha todos os seus dados de contato.')); return }
    if (!deliveryDate || !deliveryTime) { setDetailsError(t('Please select a pickup/delivery date and time.', 'Selecione a data e o horário de retirada/entrega.')); return }
    if (deliveryType === 'delivery' && (!address.trim() || deliveryFee === null)) { setDetailsError(t('Please enter a valid delivery address.', 'Insira um endereço de entrega válido.')); return }
    const chosen = new Date(`${deliveryDate}T${deliveryTime}`)
    if (chosen.getTime() - Date.now() < 24 * 60 * 60 * 1000) { setDetailsError(t('Please allow at least 24 hours notice for orders.', 'É necessário pelo menos 24 horas de antecedência.')); return }

    setPaymentLoading(true); setPaymentError('')
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(c => ({ id: c.id, name: c.name.pt, price: c.price, qty: c.qty })),
          deliveryType, deliveryFee: delivery, deliveryAddress: address,
          deliveryDate, deliveryTime, customer,
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

  const selectClass = 'w-full border border-cream-dark rounded-sm px-3 py-3 font-inter-tight text-sm text-darkbrown focus:outline-none focus:border-gold bg-white appearance-none cursor-pointer bg-[url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%226%22%20viewBox%3D%220%200%2010%206%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L5%205L9%201%22%20stroke%3D%22%235C4033%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22/%3E%3C/svg%3E")] bg-[length:10px] bg-[right_0.9rem_center] bg-no-repeat pr-9'

  return (
    <>
      <CartDrawer
        cart={cart} open={cartOpen} onClose={() => setCartOpen(false)}
        onAdd={addItem} onRemove={removeItem}
        onCheckout={() => { setCartOpen(false); setStep('details') }}
        lang={lang} t={t}
      />

      {/* Hero */}
      <section className="relative bg-darkbrown overflow-hidden" style={{ minHeight: '40vh' }}>
        <Image src="/image 1.JPG" alt="Karlota at Home" fill priority className="object-cover opacity-25" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-darkbrown/50 to-darkbrown/95" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="mb-6"><Logo variant="light" size="sm" /></div>
          <p className="font-inter-tight text-xs tracking-[0.35em] uppercase text-gold font-semibold mb-3">
            {t('Pickup & Delivery', 'Retirada e Entrega')}
          </p>
          <h1 className="font-fraunces text-4xl sm:text-5xl text-cream leading-tight mb-3">
            Karlota <span className="italic text-gold">at Home</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto my-5" />
          <p className="font-inter-tight text-cream/60 text-base max-w-lg mx-auto leading-relaxed">
            {t('Authentic Brazilian flavors, crafted in our kitchen and delivered to your door.', 'Sabores brasileiros autênticos, preparados em nossa cozinha e entregues na sua porta.')}{' '}
            <strong className="text-cream/80">{t('Orders require 24 hours notice.', 'Pedidos requerem 24 horas de antecedência.')}</strong>
          </p>
          <div className="flex items-center justify-center gap-1 mt-5">
            {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-gold fill-gold" />)}
            <span className="font-inter-tight text-xs text-cream/40 ml-2">Winter Garden, FL</span>
          </div>
        </div>
      </section>

      {/* Step indicator */}
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
                  <span className="hidden sm:inline">{s === 'menu' ? t('Menu', 'Menu') : s === 'details' ? t('Details', 'Detalhes') : t('Payment', 'Pagamento')}</span>
                </button>
              </div>
            ))}
          </div>
          {step === 'menu' && (
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 font-inter-tight text-sm text-cream/80 hover:text-gold transition-colors">
              <ShoppingCart size={18} />
              {cartQty > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-darkbrown text-[10px] font-bold flex items-center justify-center">{cartQty}</span>}
              <span className="hidden sm:inline">{t('Cart', 'Carrinho')} ({cartQty})</span>
            </button>
          )}
        </div>
      </div>

      {/* STEP: Menu */}
      {step === 'menu' && (
        <section className="bg-cream min-h-screen">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex-shrink-0 font-inter-tight text-xs tracking-widest uppercase px-4 py-2 rounded-sm border transition-all ${activeCategory === cat.key ? 'bg-darkbrown text-gold border-darkbrown' : 'bg-white text-mocha border-cream-dark hover:border-mocha/30'}`}
                >
                  {cat.label[lang]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MENU.filter(m => m.category === activeCategory).map(item => (
                <MenuCard
                  key={item.id} item={item}
                  qty={cart.find(c => c.id === item.id)?.qty ?? 0}
                  onAdd={() => addItem(item.id)} onRemove={() => removeItem(item.id)}
                  lang={lang} t={t}
                />
              ))}
            </div>

            {cartQty > 0 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-sm px-4">
                <button onClick={() => { setCartOpen(false); setStep('details') }} className="btn-gold w-full shadow-[0_8px_32px_rgba(201,168,76,0.4)] justify-between">
                  <span className="bg-gold-dark/30 rounded-sm px-2 py-0.5 font-bold text-sm">{cartQty}</span>
                  {t('Continue to Details', 'Continuar')}
                  <span>${(subtotal * (1 + TAX_RATE)).toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* STEP: Details */}
      {step === 'details' && (
        <section className="bg-cream min-h-screen">
          <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
            <button onClick={() => setStep('menu')} className="flex items-center gap-2 font-inter-tight text-sm text-mocha/60 hover:text-mocha transition-colors">
              <ChevronLeft size={16} /> {t('Back to menu', 'Voltar ao menu')}
            </button>

            {/* Delivery type */}
            <div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-4">{t('Pickup or Delivery?', 'Retirada ou Entrega?')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {([['pickup', ShoppingBag, t('Pickup', 'Retirada'), t('Ready at our kitchen', 'Pronto em nossa cozinha')], ['delivery', Truck, t('Delivery', 'Entrega'), t('We bring it to you', 'Levamos até você')]] as const).map(([type, Icon, label, sub]) => (
                  <button key={type} onClick={() => { setDeliveryType(type as 'pickup' | 'delivery'); setDeliveryFee(null); setFeeError('') }}
                    className={`flex flex-col items-center gap-2 p-5 border-2 rounded-sm transition-all ${deliveryType === type ? 'border-gold bg-gold/5' : 'border-cream-dark bg-white hover:border-mocha/30'}`}>
                    <Icon size={22} className={deliveryType === type ? 'text-gold' : 'text-mocha/40'} />
                    <span className={`font-inter-tight font-semibold text-sm ${deliveryType === type ? 'text-darkbrown' : 'text-mocha/60'}`}>{label}</span>
                    <span className="font-inter-tight text-xs text-mocha/40">{sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            {deliveryType === 'delivery' && (
              <div>
                <label className="block font-inter-tight text-sm font-medium text-darkbrown mb-2">{t('Delivery Address', 'Endereço de Entrega')}</label>
                <input type="text" placeholder={t('Enter your full address', 'Insira seu endereço completo')} value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full border border-cream-dark rounded-sm px-4 py-3 font-inter-tight text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:border-gold transition-colors bg-white" />
                <div className="mt-2 h-5">
                  {feeLoading && <span className="font-inter-tight text-xs text-mocha/50 flex items-center gap-1"><Loader2 size={11} className="animate-spin" /> {t('Calculating delivery fee…', 'Calculando taxa de entrega…')}</span>}
                  {feeError && <span className="font-inter-tight text-xs text-red-500">{feeError}</span>}
                  {deliveryFee !== null && !feeLoading && <span className="font-inter-tight text-xs text-green-700 font-semibold">✓ {t('Delivery fee', 'Taxa de entrega')}: ${deliveryFee.toFixed(2)}</span>}
                </div>
              </div>
            )}

            {/* Date & Time — dropdowns */}
            <div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-1">
                <Calendar size={18} className="inline mr-2 text-gold" />
                {t('When do you need it?', 'Quando você precisa?')}
              </h2>
              <p className="font-inter-tight text-xs text-mocha/50 mb-4">{t('Minimum 24 hours notice required.', 'Mínimo de 24 horas de antecedência.')}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-inter-tight text-xs text-mocha/60 mb-1.5">{t('Date', 'Data')}</label>
                  <select value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className={selectClass}>
                    <option value="">{t('Select a date', 'Selecione a data')}</option>
                    {dateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-inter-tight text-xs text-mocha/60 mb-1.5">{t('Time', 'Horário')}</label>
                  <select value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} className={selectClass}>
                    <option value="">{t('Select a time', 'Selecione o horário')}</option>
                    {TIME_SLOTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-4">{t('Your Information', 'Seus Dados')}</h2>
              <div className="space-y-3">
                {([['name','text',t('Full Name','Nome Completo'),t('Your full name','Seu nome completo')], ['email','email',t('Email','E-mail'),'your@email.com'], ['phone','tel',t('Phone / WhatsApp','Telefone / WhatsApp'),'+1 (407) 000-0000']] as const).map(([field, type, label, placeholder]) => (
                  <div key={field}>
                    <label className="block font-inter-tight text-xs text-mocha/60 mb-1.5">{label}</label>
                    <input type={type} placeholder={placeholder} value={customer[field as keyof CustomerInfo]} onChange={e => setCustomer(p => ({ ...p, [field]: e.target.value }))}
                      className="w-full border border-cream-dark rounded-sm px-4 py-3 font-inter-tight text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:border-gold transition-colors bg-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Order summary */}
            <div className="bg-white border border-cream-dark rounded-sm px-5 py-5">
              <h3 className="font-inter-tight text-[10px] tracking-widest uppercase text-gold mb-4">{t('Order Summary', 'Resumo do Pedido')}</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between font-inter-tight text-sm mb-2">
                  <span className="text-mocha">{item.qty}× {item.name[lang]}</span>
                  <span className="text-darkbrown">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-cream-dark mt-3 pt-3 space-y-1">
                <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>{t('Subtotal', 'Subtotal')}</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>{t('Tax (6.5%)', 'Imposto (6,5%)')}</span><span>${tax.toFixed(2)}</span></div>
                {deliveryType === 'delivery' && <div className="flex justify-between font-inter-tight text-xs text-mocha/60"><span>{t('Delivery', 'Entrega')}</span><span>{deliveryFee !== null ? `$${delivery.toFixed(2)}` : '—'}</span></div>}
                <div className="flex justify-between font-inter-tight font-semibold text-darkbrown text-base border-t border-cream-dark pt-2 mt-1">
                  <span>{t('Total', 'Total')}</span>
                  <span>{deliveryType === 'delivery' && deliveryFee === null ? '—' : `$${total.toFixed(2)}`}</span>
                </div>
              </div>
            </div>

            {detailsError && <div className="border border-red-200 bg-red-50 rounded-sm px-4 py-3"><p className="font-inter-tight text-sm text-red-600">{detailsError}</p></div>}
            {paymentError && <div className="border border-red-200 bg-red-50 rounded-sm px-4 py-3"><p className="font-inter-tight text-sm text-red-600">{paymentError}</p></div>}

            <button onClick={proceedToPayment} disabled={paymentLoading || (deliveryType === 'delivery' && (feeLoading || deliveryFee === null))}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {paymentLoading ? <><Loader2 size={16} className="animate-spin" /> {t('Preparing checkout…', 'Preparando checkout…')}</> : <>{t('Proceed to Payment', 'Ir para Pagamento')} <ChevronRight size={16} /></>}
            </button>
          </div>
        </section>
      )}

      {/* STEP: Payment */}
      {step === 'payment' && clientSecret && (
        <section className="bg-cream min-h-screen">
          <div className="max-w-lg mx-auto px-6 py-10">
            <button onClick={() => setStep('details')} className="flex items-center gap-2 font-inter-tight text-sm text-mocha/60 hover:text-mocha transition-colors mb-8">
              <ChevronLeft size={16} /> {t('Back to details', 'Voltar aos detalhes')}
            </button>

            <div className="bg-white border border-cream-dark rounded-sm px-6 py-6 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <ChefHat size={16} className="text-gold" />
                <p className="font-inter-tight text-[10px] tracking-widest uppercase text-gold">Karlota at Home</p>
              </div>
              <h2 className="font-fraunces text-xl text-darkbrown mb-4">{t('Secure Payment', 'Pagamento Seguro')}</h2>
              <div className="flex justify-between font-inter-tight font-semibold text-darkbrown text-lg border-t border-cream-dark pt-4">
                <span>{t('Total Due', 'Total a Pagar')}</span>
                <span className="text-gold">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white border border-cream-dark rounded-sm px-6 py-6">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat', variables: { colorPrimary: '#C9A84C', fontFamily: 'Inter, sans-serif' } } }}>
                <CheckoutForm onSuccess={() => router.push('/karlota-at-home/success')} t={t} />
              </Elements>
            </div>

            <p className="font-inter-tight text-xs text-mocha/40 text-center mt-4">
              🔒 {t('Payments secured by Stripe. Your card will be charged only after confirmation.', 'Pagamentos protegidos pela Stripe. Seu cartão será cobrado somente após a confirmação.')}
            </p>
          </div>
        </section>
      )}
    </>
  )
}
