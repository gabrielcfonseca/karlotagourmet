'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Star, ChefHat, Award } from 'lucide-react'
import Logo from '@/components/Logo'
import BotanicalDivider, { BotanicalOverlay } from '@/components/BotanicalDivider'
import { useLang } from '@/lib/language-context'

function useFadeUp() {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-up')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

export default function HomePage() {
  useFadeUp()
  const { t } = useLang()

  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-darkbrown">
        <Image
          src="/image 1.JPG"
          alt="Elegant catering event spread"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-gradient" />
        <BotanicalOverlay opacity={0.06} />

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-24">
          <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Logo variant="light" size="lg" />
          </div>

          <div className="w-12 h-px bg-gold mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }} />

          <h1
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream leading-tight max-w-4xl animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {t('Where Every Event', 'Onde Cada Evento')}
            <br />
            <span className="italic text-gold">
              {t('Becomes a Memory', 'Se Torna uma Memória')}
            </span>
          </h1>

          <p
            className="font-lato font-light text-cream/80 text-lg md:text-xl mt-6 max-w-xl leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.55s' }}
          >
            {t(
              'Luxury Brazilian catering crafted with love, tradition, and excellence.',
              'Buffet brasileiro de luxo feito com amor, tradição e excelência.'
            )}
          </p>

          <Link
            href="/questionnaire"
            className="btn-gold mt-10 animate-fade-in"
            style={{ animationDelay: '0.7s' }}
          >
            {t('Plan Your Event', 'Planeje seu Evento')}
          </Link>

          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in"
            style={{ animationDelay: '1.2s' }}
            aria-hidden="true"
          >
            <span className="font-lato text-[10px] tracking-[0.3em] uppercase text-cream/40">
              {t('Scroll', 'Rolar')}
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-cream/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── WHY KARLOTA ─────────────────────────────────────────────────── */}
      <section className="relative bg-cream py-24 overflow-hidden">
        <BotanicalDivider className="absolute top-0 left-0 right-0" opacity={0.06} />

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-up">
            <p className="section-label">{t('The Karlota Difference', 'A Diferença Karlota')}</p>
            <h2 className="section-title">
              {t('Why Families Choose', 'Por Que as Famílias Escolhem')}{' '}
              <span className="italic text-mocha">Karlota</span>
            </h2>
            <div className="gold-rule" />
            <p className="font-lato text-mocha/70 max-w-xl mx-auto text-base leading-relaxed">
              {t(
                "We don't just cater events — we create moments that your guests will talk about for years.",
                'Não apenas servimos eventos — criamos momentos que seus convidados vão lembrar por anos.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                Icon: Leaf,
                title: t('Authentic Brazilian Flavors', 'Sabores Brasileiros Autênticos'),
                desc: t(
                  'Every dish is rooted in generations of Brazilian culinary tradition — brought lovingly to your table.',
                  'Cada prato tem raízes em gerações de tradição culinária brasileira — trazido com amor para a sua mesa.'
                ),
                delay: '0s',
              },
              {
                Icon: ChefHat,
                title: t('Premium Ingredients', 'Ingredientes Premium'),
                desc: t(
                  'We source only the finest seasonal produce, imported Brazilian staples, and locally sourced meats — freshness you can taste.',
                  'Utilizamos apenas os melhores produtos sazonais, importados brasileiros e carnes locais — frescor que se sente no paladar.'
                ),
                delay: '0.15s',
              },
              {
                Icon: Award,
                title: t('White-Glove Service', 'Serviço de Alto Padrão'),
                desc: t(
                  'From first consultation to final cleanup, our dedicated team ensures every detail exceeds your expectations — effortlessly.',
                  'Da primeira consulta à limpeza final, nossa equipe dedicada garante que cada detalhe supere suas expectativas.'
                ),
                delay: '0.3s',
              },
            ].map(({ Icon, title, desc, delay }) => (
              <div
                key={title}
                className="fade-up flex flex-col items-center text-center p-8 bg-white/60 rounded-sm border border-cream-dark hover:shadow-[0_8px_40px_rgba(92,64,51,0.10)] transition-shadow duration-300"
                style={{ transitionDelay: delay }}
              >
                <div className="w-14 h-14 rounded-full bg-mocha/8 flex items-center justify-center mb-5 border border-gold/30">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="font-playfair text-xl text-darkbrown mb-3">{title}</h3>
                <p className="font-lato text-sm text-mocha/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <BotanicalDivider className="absolute bottom-0 left-0 right-0" opacity={0.06} flip />
      </section>

      {/* ─── SOCIAL PROOF STRIP ──────────────────────────────────────────── */}
      <section className="bg-mocha py-14 relative overflow-hidden">
        <BotanicalOverlay opacity={0.05} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center fade-up">
          <div className="flex items-center justify-center gap-1 mb-4" aria-label="5 stars">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="text-gold fill-gold" />
            ))}
          </div>
          <p className="font-playfair text-2xl md:text-3xl text-cream italic leading-snug">
            &ldquo;{t(
              'Trusted by hundreds of families across the United States',
              'A confiança de centenas de famílias em todo os Estados Unidos'
            )}&rdquo;
          </p>
          <p className="font-lato text-sm text-cream/50 tracking-widest uppercase mt-4">
            {t(
              'Weddings · Corporate Events · Birthday Parties · Private Celebrations',
              'Casamentos · Eventos Corporativos · Aniversários · Celebrações Privadas'
            )}
          </p>
        </div>
      </section>

      {/* ─── FEATURED MOMENT ─────────────────────────────────────────────── */}
      <section className="bg-cream py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up relative aspect-[4/3] rounded-sm overflow-hidden shadow-[0_16px_60px_rgba(59,42,26,0.18)]">
              <Image
                src="/image 2.jpg"
                alt="Elegant dining table setup by Karlota Gourmet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-gold/60" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-gold/60" />
            </div>

            <div className="fade-up flex flex-col justify-center" style={{ transitionDelay: '0.15s' }}>
              <p className="section-label">{t('A Taste of Brazil', 'O Sabor do Brasil')}</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-darkbrown leading-tight mb-6">
                {t('Food That Tells', 'Comida que Conta')}
                <br />
                <span className="italic text-mocha">{t('a Story', 'uma História')}</span>
              </h2>
              <div className="w-12 h-px bg-gold mb-6" />
              <p className="font-lato text-mocha/70 text-base leading-relaxed mb-4">
                {t(
                  'Behind every dish is a memory from Brazil — the smell of churrasco at a family Sunday, the comfort of pão de queijo fresh from the oven, the warmth of a moqueca simmering on the stove.',
                  'Por trás de cada prato há uma memória do Brasil — o cheiro do churrasco no domingo em família, o conforto do pão de queijo saindo do forno, o calor da moqueca borbulhando no fogão.'
                )}
              </p>
              <p className="font-lato text-mocha/70 text-base leading-relaxed mb-8">
                {t(
                  'Karlota Gourmet brings that warmth to your most cherished celebrations, crafting menus that honor your heritage and delight every guest.',
                  'A Karlota Gourmet traz esse calor para suas celebrações mais especiais, criando menus que honram sua herança e encantam cada convidado.'
                )}
              </p>
              <Link href="/about" className="btn-outline-gold self-start">
                {t('Our Story', 'Nossa História')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PACKAGES PREVIEW ────────────────────────────────────────────── */}
      <section className="bg-darkbrown py-24 relative overflow-hidden">
        <BotanicalOverlay opacity={0.04} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="fade-up">
            <p className="font-lato text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-3">
              {t('Curated for Every Occasion', 'Criado para Cada Ocasião')}
            </p>
            <h2 className="font-playfair text-4xl md:text-5xl text-cream leading-tight mb-6">
              {t('Packages Designed', 'Pacotes Criados')}
              <br />
              <span className="italic text-gold">{t('for Your Vision', 'para Sua Visão')}</span>
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mb-6" />
            <p className="font-lato text-cream/60 text-base leading-relaxed max-w-xl mx-auto mb-10">
              {t(
                'From intimate family gatherings to grand wedding receptions — we have a curated experience for every scale, every dream.',
                'De encontros familiares íntimos a grandes recepções de casamento — temos uma experiência para cada escala, cada sonho.'
              )}
            </p>
            <Link href="/packages" className="btn-gold">
              {t('View Packages', 'Ver Pacotes')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIAL ─────────────────────────────────────────────────── */}
      <section className="bg-cream py-24 relative overflow-hidden">
        <BotanicalDivider className="absolute top-0 left-0 right-0" opacity={0.05} />
        <div className="max-w-3xl mx-auto px-6 text-center fade-up">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-gold fill-gold" />
            ))}
          </div>
          <blockquote className="font-playfair text-2xl md:text-3xl text-darkbrown italic leading-relaxed mb-6">
            &ldquo;{t(
              'Karlota Gourmet made our wedding feel like a dream. Every bite reminded us of home — and our guests could not stop asking for the recipes.',
              'A Karlota Gourmet tornou nosso casamento um sonho. Cada garfada nos lembrou do Brasil — e nossos convidados não paravam de pedir as receitas.'
            )}&rdquo;
          </blockquote>
          <div className="gold-rule" />
          <p className="font-lato text-sm text-mocha/60 tracking-widest uppercase">
            Ana & Ricardo — Miami Wedding, 2024
          </p>
        </div>
        <BotanicalDivider className="absolute bottom-0 left-0 right-0" opacity={0.05} flip />
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────────── */}
      <section className="relative bg-mocha py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1920&q=70"
          alt="Luxury event table"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center fade-up">
          <p className="font-lato text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-4">
            {t("Let's Begin", 'Vamos Começar')}
          </p>
          <h2 className="font-playfair text-4xl md:text-5xl text-cream leading-tight mb-6">
            {t('Ready to Create', 'Pronto para Criar')}
            <br />
            <span className="italic">{t('Your Memory?', 'Sua Memória?')}</span>
          </h2>
          <p className="font-lato text-cream/70 text-base leading-relaxed mb-10">
            {t(
              'Fill out our event questionnaire and Karlota will personally reach out within 24 hours to begin crafting your experience.',
              'Preencha nosso questionário de evento e Karlota entrará em contato em até 24 horas para começar a criar sua experiência.'
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
