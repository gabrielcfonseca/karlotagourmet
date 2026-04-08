'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Check, Star } from 'lucide-react'
import { PACKAGES } from '@/lib/config'
import BotanicalDivider, { BotanicalOverlay } from '@/components/BotanicalDivider'
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

export default function PackagesPage() {
  useFadeUp()
  const { t, lang } = useLang()

  return (
    <>
      {/* ─── PAGE HERO ───────────────────────────────────────────────────── */}
      <section className="relative bg-darkbrown pt-36 pb-20 overflow-hidden">
        <BotanicalOverlay opacity={0.05} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center animate-fade-in">
          <p className="section-label text-gold">{t('Investment in Excellence', 'Investimento em Excelência')}</p>
          <h1 className="font-playfair text-5xl md:text-6xl text-cream leading-tight">
            {t('Our', 'Nossos')} <span className="italic">{t('Packages', 'Pacotes')}</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto my-6" />
          <p className="font-lato text-cream/60 text-base leading-relaxed">
            {t(
              "Every package is a fully curated experience — not just a meal. Choose the level that matches your vision, and we'll handle the rest.",
              'Cada pacote é uma experiência totalmente personalizada — não apenas uma refeição. Escolha o nível que combina com sua visão e cuidamos do resto.'
            )}
          </p>
        </div>
      </section>

      {/* ─── PACKAGES ────────────────────────────────────────────────────── */}
      <section className="relative bg-cream py-24 overflow-hidden">
        <BotanicalDivider className="absolute top-0 left-0 right-0" opacity={0.06} />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {PACKAGES.map((pkg, idx) => {
              const name        = lang === 'pt' ? pkg.namePt : pkg.name
              const tagline     = lang === 'pt' ? pkg.taglinePt : pkg.tagline
              const inclusions  = lang === 'pt' ? pkg.inclusionsPt : pkg.inclusions

              return (
                <div
                  key={pkg.id}
                  className={`fade-up relative flex flex-col rounded-sm border transition-all duration-300 overflow-hidden ${
                    pkg.popular
                      ? 'border-gold shadow-[0_16px_60px_rgba(201,168,76,0.22)] scale-[1.02] md:scale-105'
                      : 'border-cream-dark hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(92,64,51,0.12)]'
                  }`}
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gold text-darkbrown text-center py-1.5">
                      <span className="font-lato font-semibold text-xs tracking-[0.25em] uppercase flex items-center justify-center gap-1.5">
                        <Star size={11} className="fill-darkbrown" />
                        {t('Most Popular', 'Mais Popular')}
                        <Star size={11} className="fill-darkbrown" />
                      </span>
                    </div>
                  )}

                  <div className={`flex flex-col flex-1 p-8 ${pkg.popular ? 'pt-12 bg-mocha' : 'bg-white/70'}`}>
                    <div className="mb-6">
                      <h2 className={`font-playfair text-3xl ${pkg.popular ? 'text-cream' : 'text-darkbrown'}`}>
                        {name}
                      </h2>
                      <p className={`font-lato text-sm mt-1 ${pkg.popular ? 'text-cream/60' : 'text-mocha/60'}`}>
                        {tagline}
                      </p>
                    </div>

                    <div className={`flex items-end gap-1 mb-6 pb-6 border-b ${pkg.popular ? 'border-cream/15' : 'border-cream-dark'}`}>
                      <span className={`font-playfair text-5xl font-bold ${pkg.popular ? 'text-gold' : 'text-mocha'}`}>
                        ${pkg.price}
                      </span>
                      <span className={`font-lato text-sm mb-2 ${pkg.popular ? 'text-cream/50' : 'text-mocha/50'}`}>
                        / {t('person', 'pessoa')}
                      </span>
                    </div>

                    <ul className="flex flex-col gap-3 flex-1 mb-8">
                      {inclusions.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${pkg.popular ? 'bg-gold/20' : 'bg-mocha/10'}`}>
                            <Check size={10} className={pkg.popular ? 'text-gold' : 'text-mocha'} strokeWidth={3} />
                          </div>
                          <span className={`font-lato text-sm leading-relaxed ${pkg.popular ? 'text-cream/75' : 'text-mocha/75'}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/questionnaire?package=${pkg.id}`}
                      className={`w-full text-center py-3.5 font-lato font-semibold text-sm tracking-widest uppercase rounded-sm transition-all duration-200 cursor-pointer ${
                        pkg.popular
                          ? 'bg-gold text-darkbrown hover:bg-gold-light'
                          : 'bg-mocha text-cream hover:bg-mocha-light'
                      }`}
                    >
                      {t('Request This Package', 'Solicitar Este Pacote')}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Custom note */}
          <div className="text-center mt-14 fade-up">
            <div className="gold-rule" />
            <p className="font-playfair text-xl text-darkbrown italic mb-3">
              {t('Looking for something truly one-of-a-kind?', 'Procurando algo verdadeiramente único?')}
            </p>
            <p className="font-lato text-sm text-mocha/60 mb-6 max-w-md mx-auto">
              {t(
                "We offer fully custom menu curation for large-scale events and corporate clients. Let's talk.",
                'Oferecemos curadoria de menu totalmente personalizada para eventos de grande escala e clientes corporativos. Vamos conversar.'
              )}
            </p>
            <Link href="/contact" className="btn-outline-gold">
              {t('Inquire for Custom Packages', 'Solicitar Pacotes Personalizados')}
            </Link>
          </div>
        </div>

        <BotanicalDivider className="absolute bottom-0 left-0 right-0" opacity={0.06} flip />
      </section>

      {/* ─── FAQ STRIP ───────────────────────────────────────────────────── */}
      <section className="bg-mocha/8 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-10 fade-up">
            <p className="section-label">{t('Good to Know', 'Bom Saber')}</p>
            <h2 className="font-playfair text-3xl text-darkbrown">{t('Frequently Asked', 'Perguntas Frequentes')}</h2>
          </div>
          <div className="grid gap-5">
            {[
              {
                q: t('Is there a minimum guest count?', 'Há um número mínimo de convidados?'),
                a: t(
                  'We cater events with a minimum of 20 guests. Contact us for smaller intimate gatherings — we may be able to accommodate.',
                  'Atendemos eventos com mínimo de 20 convidados. Entre em contato para encontros menores — podemos nos acomodar.'
                ),
              },
              {
                q: t('Can we customize the menu?', 'Podemos personalizar o menu?'),
                a: t(
                  'Absolutely. Every package includes a consultation where you can select your preferred dishes from our curated menu.',
                  'Com certeza. Cada pacote inclui uma consulta onde você pode selecionar seus pratos preferidos do nosso menu.'
                ),
              },
              {
                q: t('How far in advance should I book?', 'Com quanto tempo de antecedência devo reservar?'),
                a: t(
                  'We recommend booking at least 6–8 weeks in advance for weekends, and 4 weeks for weekday events.',
                  'Recomendamos reservar com pelo menos 6 a 8 semanas de antecedência para fins de semana e 4 semanas para eventos nos dias de semana.'
                ),
              },
              {
                q: t('Do you serve outside Florida?', 'Vocês atendem fora da Flórida?'),
                a: t(
                  "We proudly serve all around the United States. Reach out and let's see what's possible.",
                  'Atendemos com orgulho em todo os Estados Unidos. Entre em contato e vamos ver o que é possível.'
                ),
              },
            ].map(({ q, a }, i) => (
              <div
                key={i}
                className="fade-up bg-white/60 border border-cream-dark p-6 rounded-sm"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <h3 className="font-playfair text-lg text-darkbrown mb-2">{q}</h3>
                <p className="font-lato text-sm text-mocha/70 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
