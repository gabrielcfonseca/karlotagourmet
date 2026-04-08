'use client'

import { useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ChevronLeft, ChevronRight, MessageCircle, Mail, MessageSquare, X, ShieldCheck, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'
import { DISHES, DISHES_PT, config } from '@/lib/config'
import { BotanicalOverlay } from '@/components/BotanicalDivider'
import { useLang } from '@/lib/language-context'

const TOTAL_STEPS = 6

type FormData = {
  name: string
  email: string
  whatsapp: string
  eventType: string
  eventDate: string
  guestCount: number
  venueName: string
  cityState: string
  venueType: string
  package: string
  dishes: string[]
  notes: string
}

const INITIAL: FormData = {
  name: '', email: '', whatsapp: '',
  eventType: '', eventDate: '', guestCount: 50,
  venueName: '', cityState: '', venueType: '',
  package: '', dishes: [], notes: '',
}

const inputClass = "w-full bg-white/70 border border-cream-dark rounded-sm px-4 py-3 font-lato text-sm text-darkbrown placeholder:text-mocha/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200"

// ── Build the full-paragraph WhatsApp/SMS message ─────────────────────────
function buildMessage(form: FormData, otherDish: string, lang: string): string {
  const allDishes = [...form.dishes, ...(otherDish.trim() ? [otherDish.trim()] : [])]
  const dishList  = allDishes.length > 0 ? allDishes.join(', ') : null

  const formatDate = (d: string) => {
    if (!d) return ''
    const [y, m, day] = d.split('-')
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    return `${months[parseInt(m) - 1]} ${parseInt(day)}, ${y}`
  }

  const pkgLabel = form.package === 'essencial'   ? 'Essencial ($89/person)'
                 : form.package === 'classic'      ? 'Classic ($109/person)'
                 : form.package === 'grand-luxe'   ? 'Grand Luxe ($129/person)'
                 : 'not yet decided'

  const venue = [form.venueName, form.cityState].filter(Boolean).join(', ')

  if (lang === 'pt') {
    return (
      `Olá Karlota! Meu nome é ${form.name}. ` +
      `Meu número de WhatsApp é ${form.whatsapp} e meu e-mail é ${form.email}. ` +
      `Estou entrando em contato para solicitar seus serviços de buffet para o meu ${form.eventType || 'evento'}. ` +
      (form.eventDate ? `A data do evento será ${formatDate(form.eventDate)}` : '') +
      (venue          ? `, no local ${venue}` : '') +
      (form.venueType ? ` (${form.venueType})` : '') +
      `, com aproximadamente ${form.guestCount} convidados. ` +
      `Tenho interesse no pacote ${pkgLabel}. ` +
      (dishList ? `Para o cardápio, adoraria incluir: ${dishList}. ` : '') +
      (form.notes ? `Informações adicionais: ${form.notes} ` : '') +
      `Aguardo ansiosamente o seu retorno! 🌿✨`
    )
  }

  return (
    `Hi Karlota! My name is ${form.name}. ` +
    `My WhatsApp number is ${form.whatsapp} and my email is ${form.email}. ` +
    `I am reaching out to inquire about your catering services for my ${form.eventType || 'event'}. ` +
    (form.eventDate ? `The event date will be ${formatDate(form.eventDate)}` : '') +
    (venue          ? `, at ${venue}` : '') +
    (form.venueType ? ` (${form.venueType})` : '') +
    `, with approximately ${form.guestCount} guests. ` +
    `I am interested in the ${pkgLabel} package. ` +
    (dishList ? `For the menu, I would love to include: ${dishList}. ` : '') +
    (form.notes ? `Additional notes: ${form.notes} ` : '') +
    `Looking forward to hearing from you! 🌿✨`
  )
}

// ── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between max-w-xs mx-auto">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-lato font-semibold transition-all duration-300 ${
            i < step  ? 'bg-gold text-darkbrown'
            : i === step ? 'bg-gold/20 border-2 border-gold text-gold'
            : 'bg-cream-dark/40 text-mocha/40'
          }`}>
            {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
          </div>
          {i < TOTAL_STEPS - 1 && (
            <div className={`h-px w-8 sm:w-12 mx-1 transition-all duration-500 ${i < step ? 'bg-gold' : 'bg-cream-dark/40'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Labelled field wrapper ─────────────────────────────────────────────────
function InputField({ label, id, required = true, children }: {
  label: string; id: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-lato text-sm font-semibold text-cream tracking-wide">
        {label}{required && <span className="text-gold ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Submit options modal ───────────────────────────────────────────────────
function SubmitModal({
  onClose, message, form, t,
}: {
  onClose: () => void
  message: string
  form: FormData
  t: (en: string, pt: string) => string
}) {
  const waLink   = `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`
  const smsLink  = `sms:${config.contact.whatsapp}&body=${encodeURIComponent(message)}`
  const subject  = encodeURIComponent(`Catering Inquiry — ${form.name} — ${form.eventType}`)
  const gmailLink = `https://mail.google.com/mail/?view=cm&to=${config.contact.email}&su=${subject}&body=${encodeURIComponent(message)}`

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('Choose how to send your request', 'Escolha como enviar sua solicitação')}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-darkbrown/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-mocha rounded-sm border border-gold/30 shadow-[0_24px_80px_rgba(0,0,0,0.5)] p-8 animate-fade-in">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h3 className="font-playfair text-2xl text-cream mb-2">
          {t('How would you like to send?', 'Como você gostaria de enviar?')}
        </h3>
        <p className="font-lato text-sm text-cream/50 mb-7 leading-relaxed">
          {t(
            'Choose your preferred channel — your full event details will be pre-filled as a message.',
            'Escolha seu canal preferido — todos os detalhes do evento serão preenchidos automaticamente.'
          )}
        </p>

        <div className="flex flex-col gap-3">
          {/* WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 bg-[#25D366]/15 border border-[#25D366]/40 rounded-sm hover:bg-[#25D366]/25 hover:border-[#25D366]/70 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/35 transition-colors">
              <MessageCircle size={20} className="text-[#25D366]" />
            </div>
            <div>
              <p className="font-lato font-semibold text-cream text-sm">WhatsApp</p>
              <p className="font-lato text-cream/50 text-xs">{t('Opens WhatsApp with your message ready to send', 'Abre o WhatsApp com sua mensagem pronta para enviar')}</p>
            </div>
          </a>

          {/* SMS / Messages */}
          <a
            href={smsLink}
            className="flex items-center gap-4 px-5 py-4 bg-blue-500/10 border border-blue-400/30 rounded-sm hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/25 transition-colors">
              <MessageSquare size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-lato font-semibold text-cream text-sm">{t('Text Message (SMS)', 'Mensagem de Texto (SMS)')}</p>
              <p className="font-lato text-cream/50 text-xs">{t('Opens your Messages app with your details', 'Abre seu aplicativo de Mensagens com seus detalhes')}</p>
            </div>
          </a>

          {/* Gmail */}
          <a
            href={gmailLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 bg-red-500/10 border border-red-400/30 rounded-sm hover:bg-red-500/20 hover:border-red-400/60 transition-all duration-200 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/25 transition-colors">
              <Mail size={20} className="text-red-400" />
            </div>
            <div>
              <p className="font-lato font-semibold text-cream text-sm">Gmail</p>
              <p className="font-lato text-cream/50 text-xs">{t('Opens Gmail with your inquiry pre-written', 'Abre o Gmail com sua consulta já escrita')}</p>
            </div>
          </a>
        </div>

        <p className="font-lato text-xs text-cream/30 text-center mt-6 leading-relaxed">
          {t(
            'Your full event details are included in every message.',
            'Todos os detalhes do seu evento estão incluídos em cada mensagem.'
          )}
        </p>
      </div>
    </div>
  )
}

// ── Main questionnaire ─────────────────────────────────────────────────────
function QuestionnaireInner() {
  const searchParams = useSearchParams()
  const initialPkg   = searchParams.get('package') ?? ''
  const { t, lang }  = useLang()

  const [step, setStep]           = useState(0)
  const [form, setForm]           = useState<FormData>({ ...INITIAL, package: initialPkg })
  const [animDir, setAnimDir]     = useState<'forward' | 'back'>('forward')
  const [visible, setVisible]     = useState(true)
  const [done, setDone]           = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [otherDish, setOtherDish] = useState('')
  const [showOther, setShowOther] = useState(false)

  // Email verification state
  const [emailVerified, setEmailVerified]         = useState(false)
  const [verifyToken, setVerifyToken]             = useState('')
  const [verifyTimestamp, setVerifyTimestamp]     = useState(0)
  const [verifyCode, setVerifyCode]               = useState('')
  const [verifyStatus, setVerifyStatus]           = useState<'idle'|'sending'|'waiting'|'verifying'|'verified'|'error'>('idle')
  const [verifyError, setVerifyError]             = useState('')
  const codeInputRef                              = useRef<HTMLInputElement>(null)

  const update = (field: keyof FormData, value: FormData[keyof FormData]) =>
    setForm(f => ({ ...f, [field]: value }))

  const toggleDish = (dish: string) =>
    setForm(f => ({
      ...f,
      dishes: f.dishes.includes(dish) ? f.dishes.filter(d => d !== dish) : [...f.dishes, dish],
    }))

  const transition = (nextStep: number, dir: 'forward' | 'back') => {
    setAnimDir(dir)
    setVisible(false)
    setTimeout(() => { setStep(nextStep); setVisible(true) }, 280)
  }

  const next = () => transition(Math.min(step + 1, TOTAL_STEPS - 1), 'forward')
  const back = () => transition(Math.max(step - 1, 0), 'back')

  const progressPct = ((step + 1) / TOTAL_STEPS) * 100

  const message = buildMessage(
    { ...form, dishes: [...form.dishes, ...(otherDish.trim() ? [otherDish.trim()] : [])] },
    '',
    lang
  )

  const handleOpenModal = () => setShowModal(true)
  const handleCloseModal = () => {
    setShowModal(false)
    setDone(true)
  }

  const EVENT_TYPES = [
    t('Wedding', 'Casamento'),
    t('Corporate Event', 'Evento Corporativo'),
    t('Birthday Party', 'Aniversário'),
    t('Engagement Party', 'Noivado'),
    t('Baby Shower', 'Chá de Bebê'),
    t('Other', 'Outro'),
  ]

  const VENUE_TYPES = [
    t('Indoor', 'Interno'),
    t('Outdoor', 'Externo'),
    t('Both / Hybrid', 'Ambos / Híbrido'),
  ]

  const PACKAGES_OPTIONS = [
    `Essencial — $89/${t('person', 'pessoa')}`,
    `${t('Classic', 'Clássico')} — $109/${t('person', 'pessoa')}`,
    `Grand Luxe — $129/${t('person', 'pessoa')}`,
    t('Not sure yet — help me decide', 'Não tenho certeza — me ajude a decidir'),
  ]

  const STEP_LABELS = [
    t('Your Info', 'Suas Informações'),
    t('Your Event', 'Seu Evento'),
    t('Location', 'Localização'),
    t('Your Package', 'Seu Pacote'),
    t('Must-Have Dishes', 'Pratos Preferidos'),
    t('Final Notes', 'Observações Finais'),
  ]

  const currentDishes = lang === 'pt' ? DISHES_PT : DISHES

  // Email verification handler
  const sendVerificationCode = async () => {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setVerifyError(t('Please enter a valid email address first.', 'Por favor, insira um e-mail válido primeiro.'))
      return
    }
    setVerifyStatus('sending')
    setVerifyError('')
    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setVerifyToken(data.token)
      setVerifyTimestamp(data.timestamp)
      setVerifyStatus('waiting')
      setTimeout(() => codeInputRef.current?.focus(), 100)
    } catch {
      setVerifyStatus('error')
      setVerifyError(t('Failed to send code. Please try again.', 'Falha ao enviar código. Por favor, tente novamente.'))
    }
  }

  const confirmVerificationCode = async () => {
    if (verifyCode.length !== 6) return
    setVerifyStatus('verifying')
    setVerifyError('')
    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: verifyCode, token: verifyToken, timestamp: verifyTimestamp }),
      })
      const data = await res.json()
      if (!res.ok) {
        setVerifyStatus('waiting')
        setVerifyError(
          data.error === 'Code expired'
            ? t('Code expired. Please request a new one.', 'Código expirado. Por favor, solicite um novo.')
            : t('Incorrect code. Please try again.', 'Código incorreto. Por favor, tente novamente.')
        )
        return
      }
      setVerifyStatus('verified')
      setEmailVerified(true)
    } catch {
      setVerifyStatus('waiting')
      setVerifyError(t('Verification failed. Please try again.', 'Verificação falhou. Por favor, tente novamente.'))
    }
  }

  const canAdvance = (() => {
    if (step === 0) return form.name && form.email && form.whatsapp && emailVerified
    if (step === 1) return form.eventType && form.eventDate
    if (step === 2) return form.cityState && form.venueType
    if (step === 3) return !!form.package
    return true
  })()

  return (
    <div className="relative min-h-dvh bg-darkbrown flex flex-col overflow-hidden">
      <BotanicalOverlay opacity={0.05} />

      {/* Gold progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-mocha-light/30">
        <div
          className="h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center pt-10 pb-6 px-6">
        <Logo variant="light" size="sm" />
        <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold/70 mt-4">
          {t('Event Questionnaire', 'Questionário de Evento')}
        </p>
      </div>

      {/* ── Confirmation screen ──────────────────────────────────────────── */}
      {done ? (
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 pb-12">
          <div className="max-w-md w-full text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-6">
              <Check size={28} className="text-gold" />
            </div>
            <h2 className="font-playfair text-4xl text-cream mb-4">
              <span className="italic">{t('Thank you,', 'Obrigada,')}</span>
              <br />{form.name.split(' ')[0]}!
            </h2>
            <div className="w-12 h-px bg-gold mx-auto my-5" />
            <p className="font-lato text-cream/70 text-base leading-relaxed mb-3">
              {t('Your request has been sent.', 'Sua solicitação foi enviada.')}
            </p>
            <p className="font-playfair text-cream text-lg italic">
              &ldquo;{t('Karlota will reach out within 24 hours.', 'Karlota entrará em contato em até 24 horas.')}&rdquo;
            </p>
          </div>
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col items-center px-6 pb-12">
          <div className="w-full max-w-lg mb-8">
            <StepIndicator step={step} />
          </div>

          {/* Card */}
          <div
            className={`w-full max-w-lg bg-mocha-dark/60 backdrop-blur-sm border border-cream/8 rounded-sm p-8 ${
              visible ? 'opacity-100 translate-y-0' : animDir === 'forward' ? 'opacity-0 translate-y-4' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transition: 'opacity 0.28s ease-out, transform 0.28s ease-out' }}
          >
            <div className="mb-7">
              <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold/70 mb-1">
                {t('Step', 'Etapa')} {step + 1} {t('of', 'de')} {TOTAL_STEPS}
              </p>
              <h2 className="font-playfair text-2xl text-cream">{STEP_LABELS[step]}</h2>
            </div>

            {/* ── STEP 0: Your Info ───────────────────────────────────── */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <InputField label={t('Full Name', 'Nome Completo')} id="name">
                  <input id="name" type="text" value={form.name}
                    onChange={e => update('name', e.target.value)}
                    className={inputClass} placeholder="Maria da Silva"
                    autoComplete="name" required />
                </InputField>
                <InputField label={t('Email Address', 'Endereço de Email')} id="email">
                  <div className="flex flex-col gap-2">
                    {/* Email input row */}
                    <div className="flex gap-2">
                      <input id="email" type="email" value={form.email}
                        onChange={e => {
                          update('email', e.target.value)
                          if (emailVerified) { setEmailVerified(false); setVerifyStatus('idle'); setVerifyCode('') }
                        }}
                        className={`${inputClass} flex-1 ${emailVerified ? 'border-green-500/60' : ''}`}
                        placeholder="maria@email.com"
                        autoComplete="email" required
                        disabled={verifyStatus === 'waiting' || verifyStatus === 'verifying' || emailVerified}
                      />
                      {!emailVerified && (
                        <button
                          type="button"
                          onClick={verifyStatus === 'waiting' ? sendVerificationCode : sendVerificationCode}
                          disabled={verifyStatus === 'sending' || verifyStatus === 'verifying'}
                          className="px-3 py-2 bg-gold text-darkbrown font-lato font-semibold text-xs tracking-wide rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                        >
                          {verifyStatus === 'sending' ? (
                            <><Loader2 size={13} className="animate-spin" /> {t('Sending…', 'Enviando…')}</>
                          ) : verifyStatus === 'waiting' ? (
                            t('Resend', 'Reenviar')
                          ) : (
                            t('Send Code', 'Enviar Código')
                          )}
                        </button>
                      )}
                      {emailVerified && (
                        <div className="flex items-center gap-1.5 px-3 text-green-400 font-lato text-xs font-semibold whitespace-nowrap">
                          <ShieldCheck size={15} /> {t('Verified', 'Verificado')}
                        </div>
                      )}
                    </div>

                    {/* Code input */}
                    {(verifyStatus === 'waiting' || verifyStatus === 'verifying') && (
                      <div className="flex flex-col gap-2 mt-1 animate-fade-in">
                        <p className="font-lato text-xs text-cream/60">
                          {t('A 6-digit code was sent to your email. Enter it below:', 'Um código de 6 dígitos foi enviado para seu e-mail. Digite abaixo:')}
                        </p>
                        <div className="flex gap-2">
                          <input
                            ref={codeInputRef}
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={verifyCode}
                            onChange={e => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="000000"
                            className="flex-1 bg-white/70 border-2 border-gold/50 rounded-sm px-4 py-3 font-lato text-sm text-darkbrown text-center tracking-[0.4em] placeholder:tracking-normal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200"
                          />
                          <button
                            type="button"
                            onClick={confirmVerificationCode}
                            disabled={verifyCode.length !== 6 || verifyStatus === 'verifying'}
                            className="px-4 py-2 bg-gold text-darkbrown font-lato font-semibold text-xs tracking-wide rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                          >
                            {verifyStatus === 'verifying' ? (
                              <><Loader2 size={13} className="animate-spin" /> {t('Checking…', 'Verificando…')}</>
                            ) : (
                              t('Confirm', 'Confirmar')
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Error message */}
                    {verifyError && (
                      <p className="font-lato text-xs text-red-400 mt-1">{verifyError}</p>
                    )}
                  </div>
                </InputField>
                <InputField label={t('WhatsApp Number', 'Número de WhatsApp')} id="whatsapp">
                  <input id="whatsapp" type="tel" value={form.whatsapp}
                    onChange={e => update('whatsapp', e.target.value)}
                    className={inputClass} placeholder="+1 (407) 000-0000"
                    autoComplete="tel" required />
                </InputField>
              </div>
            )}

            {/* ── STEP 1: Your Event ──────────────────────────────────── */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <InputField label={t('Event Type', 'Tipo de Evento')} id="event-type">
                  <div className="grid grid-cols-2 gap-2">
                    {EVENT_TYPES.map(type => (
                      <button key={type} type="button" onClick={() => update('eventType', type)}
                        className={`px-3 py-2.5 font-lato text-sm rounded-sm border text-left transition-all duration-200 cursor-pointer ${
                          form.eventType === type
                            ? 'bg-gold text-darkbrown border-gold'
                            : 'bg-white/10 text-cream/70 border-cream/15 hover:border-gold/40 hover:text-cream'
                        }`}
                      >{type}</button>
                    ))}
                  </div>
                </InputField>

                <InputField label={t('Event Date', 'Data do Evento')} id="event-date">
                  <input
                    id="event-date" type="date" value={form.eventDate}
                    onChange={e => update('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]} required
                    className="w-full bg-white border-2 border-gold/50 rounded-sm px-4 py-3 font-lato text-sm text-darkbrown focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30 transition-all duration-200 cursor-pointer"
                  />
                </InputField>

                {/* Guest count: slider + number input */}
                <InputField label={t('Estimated Guest Count', 'Número Estimado de Convidados')} id="guests" required={false}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        id="guests"
                        type="range" min={10} max={500} step={5}
                        value={form.guestCount}
                        onChange={e => update('guestCount', Number(e.target.value))}
                        className="flex-1 accent-gold cursor-pointer"
                      />
                      <input
                        type="number" min={10} max={500}
                        value={form.guestCount}
                        onChange={e => {
                          const v = Math.min(500, Math.max(10, Number(e.target.value)))
                          update('guestCount', isNaN(v) ? 10 : v)
                        }}
                        className="w-20 bg-white/70 border border-cream-dark rounded-sm px-3 py-2 font-lato text-sm text-darkbrown text-center focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200"
                        aria-label={t('Guest count', 'Número de convidados')}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span className="font-lato text-cream/40 text-xs">10</span>
                      <span className="font-lato text-cream/40 text-xs">500</span>
                    </div>
                  </div>
                </InputField>
              </div>
            )}

            {/* ── STEP 2: Location ────────────────────────────────────── */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <InputField label={t('Venue Name or Address', 'Nome ou Endereço do Local')} id="venue-name" required={false}>
                  <input
                    id="venue-name"
                    type="text"
                    value={form.venueName}
                    onChange={e => update('venueName', e.target.value)}
                    className={inputClass}
                    placeholder={t('e.g. The Grand Ballroom, 123 Main St...', 'ex. Grand Ballroom, Rua Principal 123...')}
                  />
                </InputField>
                <InputField label={t('City & State', 'Cidade & Estado')} id="city-state">
                  <input id="city-state" type="text" value={form.cityState}
                    onChange={e => update('cityState', e.target.value)}
                    className={inputClass} placeholder="Orlando, FL" required />
                </InputField>
                <InputField label={t('Venue Type', 'Tipo de Local')} id="venue-type">
                  <div className="flex gap-3">
                    {VENUE_TYPES.map(type => (
                      <button key={type} type="button" onClick={() => update('venueType', type)}
                        className={`flex-1 py-2.5 font-lato text-xs rounded-sm border text-center transition-all duration-200 cursor-pointer ${
                          form.venueType === type
                            ? 'bg-gold text-darkbrown border-gold'
                            : 'bg-white/10 text-cream/70 border-cream/15 hover:border-gold/40'
                        }`}
                      >{type}</button>
                    ))}
                  </div>
                </InputField>
              </div>
            )}

            {/* ── STEP 3: Package ─────────────────────────────────────── */}
            {step === 3 && (
              <div className="flex flex-col gap-3">
                {PACKAGES_OPTIONS.map((pkg) => {
                  const pkgId = pkg.split(' ')[0].toLowerCase()
                  const isSelected = form.package === pkgId
                  return (
                    <button key={pkg} type="button" onClick={() => update('package', pkgId)}
                      className={`w-full px-5 py-4 font-lato text-sm rounded-sm border text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-gold text-darkbrown border-gold font-semibold'
                          : 'bg-white/10 text-cream/75 border-cream/15 hover:border-gold/40 hover:text-cream'
                      }`}
                    >{pkg}</button>
                  )
                })}
              </div>
            )}

            {/* ── STEP 4: Dishes ──────────────────────────────────────── */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <p className="font-lato text-sm text-cream/50 -mt-2">
                  {t(
                    "Select any dishes you'd love to include. We'll use this as a starting point.",
                    'Selecione os pratos que gostaria de incluir. Usaremos isso como ponto de partida.'
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currentDishes.map((dish, idx) => {
                    const key      = DISHES[idx]
                    const selected = form.dishes.includes(key)
                    return (
                      <button key={key} type="button" onClick={() => toggleDish(key)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-sm border text-left text-sm font-lato transition-all duration-200 cursor-pointer ${
                          selected
                            ? 'bg-gold/20 border-gold text-gold'
                            : 'bg-white/8 border-cream/12 text-cream/65 hover:border-gold/30 hover:text-cream'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${selected ? 'bg-gold border-gold' : 'border-cream/30'}`}>
                          {selected && <Check size={10} className="text-darkbrown" strokeWidth={3} />}
                        </div>
                        {dish}
                      </button>
                    )
                  })}

                  {/* Other */}
                  <button type="button" onClick={() => setShowOther(v => !v)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-sm border text-left text-sm font-lato transition-all duration-200 cursor-pointer col-span-2 ${
                      showOther
                        ? 'bg-gold/20 border-gold text-gold'
                        : 'bg-white/8 border-cream/12 text-cream/65 hover:border-gold/30 hover:text-cream'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${showOther ? 'bg-gold border-gold' : 'border-cream/30'}`}>
                      {showOther && <Check size={10} className="text-darkbrown" strokeWidth={3} />}
                    </div>
                    {t('Other — specify a dish', 'Outro — especifique um prato')}
                  </button>
                </div>

                {showOther && (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="other-dish" className="font-lato text-xs text-cream/60">
                      {t('Type your dish below:', 'Digite seu prato abaixo:')}
                    </label>
                    <input id="other-dish" type="text" value={otherDish}
                      onChange={e => setOtherDish(e.target.value)}
                      className={inputClass}
                      placeholder={t('e.g. Bacalhau, Escondidinho...', 'ex. Bacalhau, Escondidinho...')}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 5: Notes ───────────────────────────────────────── */}
            {step === 5 && (
              <div className="flex flex-col gap-4">
                <InputField
                  label={t('Anything else we should know?', 'Mais alguma coisa que devemos saber?')}
                  id="notes" required={false}
                >
                  <textarea id="notes" value={form.notes}
                    onChange={e => update('notes', e.target.value)}
                    className={`${inputClass} min-h-[140px] resize-none`}
                    placeholder={t(
                      'Dietary restrictions, allergies, theme, special requests...',
                      'Restrições alimentares, alergias, tema, pedidos especiais...'
                    )}
                    rows={5} />
                </InputField>
                <div className="bg-gold/10 border border-gold/25 rounded-sm p-4">
                  <p className="font-lato text-xs text-cream/60 leading-relaxed">
                    {t(
                      "Click 'Submit Request' and choose how to send — WhatsApp, SMS, or Gmail. Your full event details will be pre-written for you.",
                      "Clique em 'Enviar Solicitação' e escolha como enviar — WhatsApp, SMS ou Gmail. Todos os detalhes serão preenchidos automaticamente."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="w-full max-w-lg flex items-center justify-between mt-6 gap-4">
            <button type="button" onClick={back} disabled={step === 0}
              className={`flex items-center gap-2 px-5 py-2.5 font-lato text-sm text-cream/60 hover:text-cream transition-colors duration-200 cursor-pointer ${step === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft size={16} />
              {t('Back', 'Voltar')}
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button type="button" onClick={next} disabled={!canAdvance}
                className={`flex items-center gap-2 px-8 py-3 font-lato font-semibold text-sm tracking-widest uppercase rounded-sm transition-all duration-200 cursor-pointer ${
                  canAdvance
                    ? 'bg-gold text-darkbrown hover:bg-gold-light'
                    : 'bg-cream/10 text-cream/30 cursor-not-allowed'
                }`}
              >
                {t('Continue', 'Continuar')}
                <ChevronRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={handleOpenModal}
                className="flex items-center gap-2 px-8 py-3 bg-gold text-darkbrown font-lato font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-gold-light transition-all duration-200 cursor-pointer"
              >
                <Check size={16} />
                {t('Submit Request', 'Enviar Solicitação')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submit modal */}
      {showModal && (
        <SubmitModal
          onClose={handleCloseModal}
          message={message}
          form={form}
          t={t}
        />
      )}
    </div>
  )
}

export default function QuestionnairePage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-darkbrown flex items-center justify-center">
        <div className="text-gold font-playfair text-2xl italic animate-pulse">Loading...</div>
      </div>
    }>
      <QuestionnaireInner />
    </Suspense>
  )
}
