'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Calendar, Star, ChevronDown, Check, MessageCircle, Mail, MessageSquare, X, Users, Sparkles, Gift } from 'lucide-react'
import Logo from '@/components/Logo'
import { BotanicalOverlay } from '@/components/BotanicalDivider'
import { useLang } from '@/lib/language-context'
import { config } from '@/lib/config'

// ── Countdown ─────────────────────────────────────────────────────────────────
function Countdown() {
  const eventDate = new Date('2025-06-07T10:00:00')
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = eventDate.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex gap-4 justify-center">
      {[
        { value: timeLeft.days,    label: 'Dias / Days' },
        { value: timeLeft.hours,   label: 'Horas / Hours' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Seg / Sec' },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-darkbrown/60 border border-gold/40 rounded-sm flex items-center justify-center">
            <span className="font-playfair text-2xl sm:text-3xl text-gold font-bold">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="font-lato text-[10px] text-cream/50 mt-1 tracking-wider uppercase">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Registration form modal ────────────────────────────────────────────────────
type LeadForm = {
  name: string
  email: string
  whatsapp: string
  weddingDate: string
  guestCount: string
  howHeard: string
}

const INITIAL: LeadForm = { name: '', email: '', whatsapp: '', weddingDate: '', guestCount: '', howHeard: '' }

function buildLeadMessage(form: LeadForm): string {
  return (
    `Olá Karlota! Me chamo ${form.name} e tenho interesse em participar do Bridal Experience by Karlota no dia 7 de junho em Orlando! ` +
    `Meu WhatsApp é ${form.whatsapp} e meu e-mail é ${form.email}. ` +
    (form.weddingDate ? `Meu casamento está previsto para ${form.weddingDate}. ` : '') +
    (form.guestCount  ? `Espero ter aproximadamente ${form.guestCount} convidados. ` : '') +
    (form.howHeard    ? `Fiquei sabendo através de: ${form.howHeard}. ` : '') +
    `Aguardo mais informações sobre como garantir minha vaga! 💍✨`
  )
}

function SubmitModal({ form, onClose }: { form: LeadForm; onClose: () => void }) {
  const message = buildLeadMessage(form)
  const waLink    = `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`
  const smsLink   = `sms:${config.contact.whatsapp}&body=${encodeURIComponent(message)}`
  const subject   = encodeURIComponent(`Bridal Experience by Karlota — Pré-Cadastro — ${form.name}`)
  const gmailLink = `https://mail.google.com/mail/?view=cm&to=${config.contact.email}&su=${subject}&body=${encodeURIComponent(message)}`

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-darkbrown/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-mocha rounded-sm border border-gold/30 shadow-2xl p-8 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors cursor-pointer">
          <X size={20} />
        </button>
        <div className="text-center mb-6">
          <Heart size={28} className="text-gold mx-auto mb-3" />
          <h3 className="font-playfair text-2xl text-cream mb-1">Quase lá!</h3>
          <p className="font-lato text-sm text-cream/60">Escolha como enviar seu pré-cadastro para Karlota</p>
        </div>
        <div className="flex flex-col gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 bg-[#25D366]/15 border border-[#25D366]/40 rounded-sm hover:bg-[#25D366]/25 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle size={20} className="text-[#25D366]" />
            </div>
            <div>
              <p className="font-lato font-semibold text-cream text-sm">WhatsApp</p>
              <p className="font-lato text-cream/50 text-xs">Envia sua mensagem pelo WhatsApp</p>
            </div>
          </a>
          <a href={smsLink}
            className="flex items-center gap-4 px-5 py-4 bg-blue-500/10 border border-blue-400/30 rounded-sm hover:bg-blue-500/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-lato font-semibold text-cream text-sm">SMS</p>
              <p className="font-lato text-cream/50 text-xs">Abre o aplicativo de mensagens</p>
            </div>
          </a>
          <a href={gmailLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-4 px-5 py-4 bg-red-500/10 border border-red-400/30 rounded-sm hover:bg-red-500/20 transition-all cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <Mail size={20} className="text-red-400" />
            </div>
            <div>
              <p className="font-lato font-semibold text-cream text-sm">E-mail</p>
              <p className="font-lato text-cream/50 text-xs">Abre o Gmail com sua mensagem</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BridalFairPage() {
  const { t } = useLang()
  const [form, setForm]           = useState<LeadForm>(INITIAL)
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = (field: keyof LeadForm, value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  const canSubmit = form.name && form.email && form.whatsapp

  const inputClass = "w-full bg-white/10 border border-cream/20 rounded-sm px-4 py-3 font-lato text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSubmitted(true)
  }

  const HIGHLIGHTS = [
    { icon: Star,     pt: 'Os melhores fornecedores de Orlando em um só lugar', en: 'The best Orlando vendors all in one place' },
    { icon: Gift,     pt: 'Descontos especiais para fechamento no dia do evento', en: 'Special discounts for bookings on event day' },
    { icon: Sparkles, pt: 'Experiências gastronômicas exclusivas by Karlota', en: 'Exclusive culinary experiences by Karlota' },
    { icon: Users,    pt: 'Networking com outras noivas da região', en: 'Network with other brides in the area' },
  ]

  return (
    <div className="min-h-screen bg-darkbrown">
      <BotanicalOverlay opacity={0.04} />

      {/* ── Navbar strip ───────────────────────────────────────────────── */}
      <div className="relative z-50 bg-darkbrown/95 backdrop-blur-md shadow-lg py-4 px-6 flex items-center justify-between">
        <Link href="/">
          <Logo variant="light" size="sm" />
        </Link>
        <Link href="/" className="font-lato text-xs tracking-widest uppercase text-cream/60 hover:text-gold transition-colors">
          ← {t('Back to Site', 'Voltar ao Site')}
        </Link>
      </div>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/40 rounded-full bg-gold/10 mb-8">
          <Heart size={12} className="text-gold" />
          <span className="font-lato text-xs tracking-[0.2em] uppercase text-gold">
            {t('Bridal Experience by Karlota', 'Bridal Experience by Karlota')}
          </span>
        </div>

        <h1 className="font-playfair text-5xl sm:text-7xl text-cream mb-4 leading-tight">
          Bridal Experience<br />
          <span className="italic text-gold">by Karlota</span>
        </h1>

        <div className="w-24 h-px bg-gold mx-auto my-6" />

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-8">
          <div className="flex items-center gap-2 text-cream/80">
            <Calendar size={16} className="text-gold" />
            <span className="font-lato text-sm tracking-wide">{t('Date — TBD', 'Data — Em breve')}</span>
          </div>
          <div className="flex items-center gap-2 text-cream/80">
            <MapPin size={16} className="text-gold" />
            <span className="font-lato text-sm tracking-wide">Orlando, FL — {t('Location TBD', 'Local — Em breve')}</span>
          </div>
        </div>

        <p className="font-lato text-cream/70 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
          {t(
            'An exclusive experience day uniting the best vendors in the Orlando area. Brides will have access to tastings, special discounts, and unique experiences — all in one day.',
            'Um dia de experiência exclusivo reunindo os melhores fornecedores da região de Orlando. As noivas terão acesso a degustações, descontos especiais e experiências únicas — tudo em um só dia.'
          )}
        </p>

        {/* Coming soon strip */}
        <div className="mb-10 px-6 py-4 border border-gold/30 rounded-sm bg-gold/8 text-center">
          <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold/70 mb-1">
            {t('Official details coming soon', 'Detalhes oficiais em breve')}
          </p>
          <p className="font-lato text-sm text-cream/60">
            {t('Register now to be the first to know the date & location.', 'Cadastre-se agora para ser a primeira a saber a data e o local.')}
          </p>
        </div>

        <a href="#register"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-darkbrown font-lato font-bold tracking-widest uppercase text-sm rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer">
          <Heart size={16} />
          {t('Reserve My Spot', 'Garantir Minha Vaga')}
        </a>

        <div className="mt-6 animate-bounce">
          <ChevronDown size={20} className="text-gold/40" />
        </div>
      </section>

      {/* ── What to expect ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6 bg-mocha/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold/70 mb-3">
              {t('The Experience', 'A Experiência')}
            </p>
            <h2 className="font-playfair text-4xl text-cream">
              {t('What awaits you', 'O que te espera')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, pt, en }) => (
              <div key={pt} className="flex gap-4 items-start p-6 bg-darkbrown/40 border border-cream/8 rounded-sm">
                <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={18} className="text-gold" />
                </div>
                <p className="font-lato text-cream/80 text-sm leading-relaxed">{t(en, pt)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Karlota section ────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold/70 mb-3">
            {t('Curated by', 'Organizado por')}
          </p>
          <h2 className="font-playfair text-4xl text-cream mb-6">
            {t('The Karlota Touch', 'O Toque Karlota')}
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mb-6" />
          <p className="font-lato text-cream/70 text-base leading-relaxed mb-4">
            {t(
              'Karlota Gourmet has been creating unforgettable culinary experiences for Florida\'s most cherished celebrations. The Bridal Experience by Karlota is an extension of that same love and dedication — carefully curated so that every bride leaves feeling inspired and ready to plan the wedding of her dreams.',
              'A Karlota Gourmet tem criado experiências gastronômicas inesquecíveis para as celebrações mais especiais da Flórida. O Bridal Experience by Karlota é uma extensão desse mesmo amor e dedicação — cuidadosamente curado para que cada noiva saia inspirada e pronta para planejar o casamento dos seus sonhos.'
            )}
          </p>
          <p className="font-playfair text-gold italic text-lg">
            {t('"Because your wedding deserves only the best."', '"Porque o seu casamento merece apenas o melhor."')}
          </p>
        </div>
      </section>

      {/* ── Registration form ──────────────────────────────────────────── */}
      <section id="register" className="relative z-10 py-20 px-6 bg-mocha/30">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="font-lato text-xs tracking-[0.25em] uppercase text-gold/70 mb-3">
              {t('Limited Spots', 'Vagas Limitadas')}
            </p>
            <h2 className="font-playfair text-4xl text-cream mb-3">
              {t('Reserve Your Spot', 'Garanta Sua Vaga')}
            </h2>
            <p className="font-lato text-cream/60 text-sm leading-relaxed">
              {t(
                'Fill out the form below and Karlota will reach out with all the details to confirm your registration.',
                'Preencha o formulário abaixo e Karlota entrará em contato com todos os detalhes para confirmar sua inscrição.'
              )}
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-gold" />
              </div>
              <h3 className="font-playfair text-3xl text-cream mb-3">
                {t('You\'re on the list!', 'Você está na lista!')} 💍
              </h3>
              <p className="font-lato text-cream/60 text-sm leading-relaxed max-w-sm mx-auto">
                {t(
                  'Karlota will contact you soon with all the event details. We can\'t wait to celebrate with you!',
                  'Karlota entrará em contato em breve com todos os detalhes do evento. Mal podemos esperar para celebrar com você!'
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-darkbrown/60 backdrop-blur-sm border border-cream/8 rounded-sm p-8 flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="font-lato text-sm font-semibold text-cream tracking-wide">
                  {t('Full Name', 'Nome Completo')} <span className="text-gold">*</span>
                </label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                  className={inputClass} placeholder="Maria da Silva" required />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="font-lato text-sm font-semibold text-cream tracking-wide">
                  {t('Email', 'E-mail')} <span className="text-gold">*</span>
                </label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  className={inputClass} placeholder="noiva@email.com" required />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-2">
                <label className="font-lato text-sm font-semibold text-cream tracking-wide">
                  {t('WhatsApp', 'WhatsApp')} <span className="text-gold">*</span>
                </label>
                <input type="tel" value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)}
                  className={inputClass} placeholder="+1 (407) 000-0000" required />
              </div>

              {/* Wedding date */}
              <div className="flex flex-col gap-2">
                <label className="font-lato text-sm font-semibold text-cream tracking-wide">
                  {t('Estimated Wedding Date', 'Data Prevista do Casamento')}
                  <span className="text-cream/40 font-normal ml-1">({t('optional', 'opcional')})</span>
                </label>
                <input type="month" value={form.weddingDate} onChange={e => update('weddingDate', e.target.value)}
                  className="w-full bg-white border-2 border-gold/40 rounded-sm px-4 py-3 font-lato text-sm text-darkbrown focus:outline-none focus:border-gold transition-all duration-200 cursor-pointer" />
              </div>

              {/* Guest count */}
              <div className="flex flex-col gap-2">
                <label className="font-lato text-sm font-semibold text-cream tracking-wide">
                  {t('Estimated Guest Count', 'Número Estimado de Convidados')}
                  <span className="text-cream/40 font-normal ml-1">({t('optional', 'opcional')})</span>
                </label>
                <input type="number" min={10} value={form.guestCount} onChange={e => update('guestCount', e.target.value)}
                  className={inputClass} placeholder="150" />
              </div>

              {/* How heard */}
              <div className="flex flex-col gap-2">
                <label className="font-lato text-sm font-semibold text-cream tracking-wide">
                  {t('How did you hear about us?', 'Como ficou sabendo?')}
                  <span className="text-cream/40 font-normal ml-1">({t('optional', 'opcional')})</span>
                </label>
                <select value={form.howHeard} onChange={e => update('howHeard', e.target.value)}
                  className="w-full bg-white/10 border border-cream/20 rounded-sm px-4 py-3 font-lato text-sm text-cream focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all duration-200 cursor-pointer">
                  <option value="" className="bg-darkbrown">{t('Select…', 'Selecione…')}</option>
                  <option value="Instagram" className="bg-darkbrown">Instagram</option>
                  <option value="Indicação de amiga" className="bg-darkbrown">{t('Friend referral', 'Indicação de amiga')}</option>
                  <option value="Facebook" className="bg-darkbrown">Facebook</option>
                  <option value="Google" className="bg-darkbrown">Google</option>
                  <option value="TikTok" className="bg-darkbrown">TikTok</option>
                  <option value="Outro" className="bg-darkbrown">{t('Other', 'Outro')}</option>
                </select>
              </div>

              <button type="submit" disabled={!canSubmit}
                className="mt-2 w-full py-4 bg-gold text-darkbrown font-lato font-bold tracking-widest uppercase text-sm rounded-sm hover:bg-gold-light transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                <Heart size={16} />
                {t('Reserve My Spot', 'Garantir Minha Vaga')}
              </button>

              <p className="font-lato text-xs text-cream/30 text-center">
                {t(
                  'This is a pre-registration only. Karlota will reach out with more details soon.',
                  'Este é apenas um pré-cadastro para demonstrar interesse. Karlota entrará em contato em breve com mais informações.'
                )}
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer strip ───────────────────────────────────────────────── */}
      <footer className="relative z-10 py-10 px-6 text-center border-t border-cream/8">
        <Logo variant="light" size="sm" />
        <p className="font-lato text-xs text-cream/30 mt-4 tracking-wide">
          © 2025 Karlota Gourmet · {t('All rights reserved', 'Todos os direitos reservados')}
        </p>
        <p className="font-lato text-xs text-cream/20 mt-1">
          {t('Official event details will be announced soon.', 'Detalhes oficiais do evento serão divulgados em breve.')}
        </p>
      </footer>

      {showModal && <SubmitModal form={form} onClose={handleModalClose} />}
    </div>
  )
}
