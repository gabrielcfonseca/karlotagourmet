'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Mail, Loader2, ChefHat } from 'lucide-react'
import Logo from '@/components/Logo'
import { useLang } from '@/lib/language-context'

function SuccessContent() {
  const { t } = useLang()
  const params = useSearchParams()
  const paymentIntentId = params.get('payment_intent')

  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')

  async function requestEmail() {
    if (!paymentIntentId) { setStatus('error'); setError(t('Missing order reference.', 'Referência do pedido ausente.')); return }
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/orders/confirm-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send email')
      setSentTo(data.sentTo || '')
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : t('Could not send email.', 'Não foi possível enviar o e-mail.'))
    }
  }

  return (
    <div className="min-h-screen bg-darkbrown flex flex-col items-center justify-center px-6 text-center py-16">
      <div className="max-w-lg w-full">
        <div className="mb-10"><Logo variant="light" size="sm" /></div>

        <div className="w-20 h-20 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={36} className="text-gold" />
        </div>

        <div className="w-12 h-px bg-gold mx-auto mb-6" />

        <h1 className="font-fraunces text-3xl md:text-4xl text-cream mb-4">
          {t('Order Confirmed!', 'Pedido Confirmado!')}
        </h1>

        <p className="font-inter-tight text-cream/70 text-base leading-relaxed mb-10">
          {t(
            'Thank you! Your payment was received and your order is now being prepared. We look forward to serving you.',
            'Obrigado! Seu pagamento foi recebido e seu pedido já está sendo preparado. Mal podemos esperar para atendê-lo.'
          )}
        </p>

        {/* Email opt-in */}
        <div className="bg-cream/5 border border-cream/15 rounded-sm px-6 py-6 mb-8 text-left">
          {status === 'sent' ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-inter-tight text-sm text-cream font-semibold">{t('Email sent!', 'E-mail enviado!')}</p>
                <p className="font-inter-tight text-xs text-cream/50 mt-1">
                  {t('Your order details were sent to', 'Os detalhes do seu pedido foram enviados para')} <strong className="text-cream/70">{sentTo}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Mail size={16} className="text-gold" />
                <p className="font-inter-tight text-sm text-cream font-semibold">
                  {t('Want a copy by email?', 'Deseja receber por e-mail?')}
                </p>
              </div>
              <p className="font-inter-tight text-xs text-cream/50 mb-4 leading-relaxed">
                {t(
                  'We can send your full order details and pickup/delivery info to your email.',
                  'Podemos enviar os detalhes completos do seu pedido e as informações de retirada/entrega para o seu e-mail.'
                )}
              </p>
              <button
                onClick={requestEmail}
                disabled={status === 'loading'}
                className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading'
                  ? <><Loader2 size={16} className="animate-spin" /> {t('Sending…', 'Enviando…')}</>
                  : <><Mail size={16} /> {t('Email me the order details', 'Enviar detalhes por e-mail')}</>}
              </button>
              {status === 'error' && (
                <p className="font-inter-tight text-xs text-red-400 mt-3">{error}</p>
              )}
            </>
          )}
        </div>

        <div className="w-12 h-px bg-gold/30 mx-auto mb-8" />

        <Link href="/karlota-at-home" className="btn-outline-gold">
          {t('Order More', 'Pedir Mais')}
        </Link>
        <Link href="/" className="block mt-4 font-inter-tight text-sm text-cream/40 hover:text-cream/70 transition-colors">
          {t('Back to homepage', 'Voltar ao site')}
        </Link>
      </div>
    </div>
  )
}

export default function KarlotaAtHomeSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-darkbrown flex items-center justify-center">
        <ChefHat size={28} className="text-gold animate-pulse" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
