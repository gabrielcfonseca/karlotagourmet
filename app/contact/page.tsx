'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, Mail, Camera, MapPin } from 'lucide-react'
import { config } from '@/lib/config'
import { BotanicalOverlay } from '@/components/BotanicalDivider'
import BotanicalDivider from '@/components/BotanicalDivider'
import { useLang } from '@/lib/language-context'

function useFadeUp() {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-up')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function ContactPage() {
  useFadeUp()
  const { t } = useLang()

  const whatsappHref = `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent("Hi, I'm interested in Karlota Gourmet catering for my event!")}`
  const instagramHandle = config.contact.instagram.replace('@', '')

  return (
    <>
      {/* ─── PAGE HERO ───────────────────────────────────────────────────── */}
      <section className="relative bg-darkbrown pt-36 pb-24 overflow-hidden">
        <BotanicalOverlay opacity={0.05} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center animate-fade-in">
          <p className="section-label text-gold">{t("We're Here", 'Estamos Aqui')}</p>
          <h1 className="font-playfair text-5xl md:text-6xl text-cream leading-tight">
            {t('Get In', 'Entre Em')} <span className="italic">{t('Touch', 'Contato')}</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto my-6" />
          <p className="font-lato text-cream/60 text-base leading-relaxed max-w-md mx-auto">
            {t(
              "We'd love to be part of your celebration. Reach out and let's start creating something beautiful together.",
              'Adoraríamos fazer parte da sua celebração. Entre em contato e vamos criar algo lindo juntos.'
            )}
          </p>
        </div>
      </section>

      {/* ─── CONTACT OPTIONS ─────────────────────────────────────────────── */}
      <section className="relative bg-cream py-24 overflow-hidden">
        <BotanicalDivider className="absolute top-0 left-0 right-0" opacity={0.06} />

        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up group flex flex-col items-start gap-4 p-8 bg-[#25D366]/10 border border-[#25D366]/30 rounded-sm hover:border-[#25D366]/60 hover:shadow-[0_8px_40px_rgba(37,211,102,0.15)] transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center group-hover:bg-[#25D366]/25 transition-colors duration-200">
                <MessageCircle size={22} className="text-[#25D366]" />
              </div>
              <div>
                <h2 className="font-playfair text-xl text-darkbrown mb-1">WhatsApp</h2>
                <p className="font-lato text-sm text-mocha/60 mb-3 leading-relaxed">
                  {t(
                    'The fastest way to reach us. Message Karlota directly for quick responses.',
                    'A maneira mais rápida de nos contatar. Mande mensagem diretamente para Karlota.'
                  )}
                </p>
                <span className="font-lato font-semibold text-sm text-[#25D366]">
                  {t('Chat on WhatsApp →', 'Conversar no WhatsApp →')}
                </span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${config.contact.email}`}
              className="fade-up group flex flex-col items-start gap-4 p-8 bg-white/60 border border-cream-dark rounded-sm hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(92,64,51,0.10)] transition-all duration-300 cursor-pointer"
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200">
                <Mail size={22} className="text-gold" />
              </div>
              <div>
                <h2 className="font-playfair text-xl text-darkbrown mb-1">Email</h2>
                <p className="font-lato text-sm text-mocha/60 mb-3 leading-relaxed">
                  {t(
                    'Prefer email? We typically respond within 24 hours on business days.',
                    'Prefere email? Geralmente respondemos em até 24 horas nos dias úteis.'
                  )}
                </p>
                <span className="font-lato font-semibold text-sm text-gold">
                  {config.contact.email}
                </span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={`https://instagram.com/${instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="fade-up group flex flex-col items-start gap-4 p-8 bg-white/60 border border-cream-dark rounded-sm hover:border-pink-300/50 hover:shadow-[0_8px_40px_rgba(219,39,119,0.08)] transition-all duration-300 cursor-pointer"
              style={{ transitionDelay: '0.2s' }}
            >
              <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center group-hover:bg-pink-100 transition-colors duration-200">
                <Camera size={22} className="text-pink-500" />
              </div>
              <div>
                <h2 className="font-playfair text-xl text-darkbrown mb-1">Instagram</h2>
                <p className="font-lato text-sm text-mocha/60 mb-3 leading-relaxed">
                  {t(
                    'Follow us for behind-the-scenes, menu inspiration, and event highlights.',
                    'Nos siga para ver bastidores, inspirações de menu e destaques de eventos.'
                  )}
                </p>
                <span className="font-lato font-semibold text-sm text-pink-500">
                  {config.contact.instagram}
                </span>
              </div>
            </a>

            {/* Location */}
            <div
              className="fade-up flex flex-col items-start gap-4 p-8 bg-white/60 border border-cream-dark rounded-sm"
              style={{ transitionDelay: '0.3s' }}
            >
              <div className="w-12 h-12 rounded-full bg-mocha/8 flex items-center justify-center">
                <MapPin size={22} className="text-mocha" />
              </div>
              <div>
                <h2 className="font-playfair text-xl text-darkbrown mb-1">
                  {t('Service Area', 'Área de Atendimento')}
                </h2>
                <p className="font-lato text-sm text-mocha/70 leading-relaxed">
                  {t(
                    'We are based in Florida and proudly serve all around the United States.',
                    'Temos base na Flórida e atendemos com orgulho em todo os Estados Unidos.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div className="text-center mt-14 fade-up">
            <div className="gold-rule" />
            <p className="font-playfair text-2xl text-darkbrown italic">
              &ldquo;{t(
                "We'd love to be part of your celebration.",
                'Adoraríamos fazer parte da sua celebração.'
              )}&rdquo;
            </p>
            <p className="font-lato text-sm text-mocha/50 mt-3 tracking-widest uppercase">
              — Karlota Gourmet
            </p>
          </div>
        </div>

        <BotanicalDivider className="absolute bottom-0 left-0 right-0" opacity={0.06} flip />
      </section>

      {/* ─── PLAN CTA ────────────────────────────────────────────────────── */}
      <section className="relative bg-mocha py-20 overflow-hidden">
        <BotanicalOverlay opacity={0.05} />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center fade-up">
          <p className="font-lato text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-4">
            {t('Ready to Begin?', 'Pronto para Começar?')}
          </p>
          <h2 className="font-playfair text-4xl text-cream leading-tight mb-6">
            {t('Start with Our', 'Comece com Nosso')}{' '}
            <span className="italic">{t('Event Questionnaire', 'Questionário de Evento')}</span>
          </h2>
          <p className="font-lato text-cream/60 text-base leading-relaxed mb-10">
            {t(
              'Our structured questionnaire ensures we capture every detail so we can deliver a truly personalized proposal.',
              'Nosso questionário estruturado garante que capturemos cada detalhe para entregar uma proposta verdadeiramente personalizada.'
            )}
          </p>
          <Link href="/questionnaire" className="btn-gold">
            {t('Plan Your Event', 'Planeje seu Evento')}
          </Link>
        </div>
      </section>
    </>
  )
}
