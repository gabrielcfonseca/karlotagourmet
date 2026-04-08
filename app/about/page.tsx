'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
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

export default function AboutPage() {
  useFadeUp()
  const { t } = useLang()

  return (
    <>
      {/* ─── PAGE HERO ───────────────────────────────────────────────────── */}
      <section className="relative bg-darkbrown pt-36 pb-24 overflow-hidden">
        <BotanicalOverlay opacity={0.05} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center animate-fade-in">
          <p className="section-label text-gold">{t('A Story of Love & Food', 'Uma História de Amor e Comida')}</p>
          <h1 className="font-playfair text-5xl md:text-6xl text-cream leading-tight">
            {t('Our', 'Nossa')} <span className="italic">{t('Story', 'História')}</span>
          </h1>
          <div className="w-12 h-px bg-gold mx-auto my-6" />
          <p className="font-lato text-cream/60 text-base leading-relaxed">
            {t(
              'Born in Brazil. Rooted in tradition. Made for celebration.',
              'Nascida no Brasil. Com raízes na tradição. Feita para celebrar.'
            )}
          </p>
        </div>
      </section>

      {/* ─── STORY SECTION ───────────────────────────────────────────────── */}
      <section className="relative bg-cream py-24 overflow-hidden">
        <BotanicalDivider className="absolute top-0 left-0 right-0" opacity={0.06} />

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Image */}
            <div className="fade-up relative aspect-[3/4] rounded-sm overflow-hidden shadow-[0_20px_70px_rgba(59,42,26,0.2)] order-2 lg:order-1">
              <Image
                src="/image 6.JPG"
                alt="Chef Karlota"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-gold/60" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-gold/60" />
            </div>

            {/* Text */}
            <div className="fade-up order-1 lg:order-2" style={{ transitionDelay: '0.15s' }}>
              <p className="section-label">{t('The Heart Behind the Brand', 'O Coração da Marca')}</p>
              <h2 className="font-playfair text-4xl md:text-5xl text-darkbrown leading-tight mb-6">
                {t('Meet', 'Conheça')} <span className="italic">Karlota</span>
              </h2>
              <div className="w-10 h-px bg-gold mb-7" />

              {/* English story */}
              {t('en', 'pt') === 'en' ? (
                <>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    Karlota Gourmet was born in Paraíba from a simple belief: food is not just served — it is remembered. For Chef Karlota, every table is an opportunity to create emotion, connection, and unforgettable experiences.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    Raised in Brazil in a family where gatherings revolved around generous tables, long conversations, and the warmth of homemade meals, Karlota learned early that cooking was never only about flavor — it was about people. It was about celebrating life, honoring moments, and bringing hearts together.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    When she moved to the United States, she carried that philosophy with her. But she quickly noticed something missing. Many celebrations had beautiful venues and décor, yet lacked the soul, warmth, and personalization that turn an event into a true memory. That is when Karlota Gourmet was born.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    What started as intimate gatherings soon became a highly sought-after luxury catering experience. Known today for creating sophisticated events, personalized menus, and emotionally unforgettable tables, Karlota Gourmet blends Brazilian hospitality with elevated culinary artistry.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    From elegant weddings to exclusive private celebrations, every detail is intentionally designed — from the first conversation to the final bite. Because for Karlota, this has never been just about food. It&apos;s about creating moments families will talk about for years. It&apos;s about transforming celebrations into memories. It&apos;s about serving emotion — beautifully.
                  </p>
                  <p className="font-playfair text-darkbrown text-lg italic">
                    Not just food. A memory served on a silver tray.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    A Karlota Gourmet nasceu na Paraíba de uma crença simples: a comida não é apenas servida — ela é lembrada. Para a Chef Karlota, cada mesa é uma oportunidade de criar emoção, conexão e experiências inesquecíveis.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    Criada no Brasil em uma família onde os encontros giravam em torno de mesas generosas, longas conversas e o calor das refeições caseiras, Karlota aprendeu cedo que cozinhar nunca foi apenas sobre sabor — era sobre pessoas. Era sobre celebrar a vida, honrar momentos e unir corações.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    Quando ela veio para os Estados Unidos, trouxe essa filosofia consigo. Mas logo percebeu algo faltando. Muitas celebrações tinham locais e decorações lindas, mas faltava a alma, o calor e a personalização que transformam um evento em uma verdadeira memória. Foi então que nasceu a Karlota Gourmet.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    O que começou como encontros íntimos logo se tornou uma experiência de catering de luxo muito procurada. Conhecida hoje por criar eventos sofisticados, menus personalizados e mesas emocionalmente inesquecíveis, a Karlota Gourmet une a hospitalidade brasileira à arte culinária elevada.
                  </p>
                  <p className="font-lato text-mocha/75 text-base leading-relaxed mb-5">
                    De casamentos elegantes a celebrações privadas exclusivas, cada detalhe é intencionalmente planejado — da primeira conversa à última garfada. Porque para Karlota, isso nunca foi apenas sobre comida. É sobre criar momentos que as famílias vão lembrar por anos. É sobre transformar celebrações em memórias. É sobre servir emoção — lindamente.
                  </p>
                  <p className="font-playfair text-darkbrown text-lg italic">
                    Não apenas comida. Uma memória servida em uma bandeja de prata.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Values */}
          <div className="fade-up">
            <div className="text-center mb-12">
              <p className="section-label">{t('What Drives Us', 'O Que Nos Move')}</p>
              <h2 className="font-playfair text-3xl md:text-4xl text-darkbrown">
                {t('Our', 'Nossos')} <span className="italic">{t('Values', 'Valores')}</span>
              </h2>
              <div className="gold-rule" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Raízes / Roots',
                  content: t(
                    'Every recipe we serve is anchored in the authentic culinary traditions of Brazil — honoring the ingredients and techniques passed down through generations.',
                    'Cada receita que servimos está ancorada nas tradições culinárias autênticas do Brasil — honrando os ingredientes e técnicas passados de geração em geração.'
                  ),
                  delay: '0s',
                },
                {
                  title: 'Amor / Love',
                  content: t(
                    'We cook the way a mother cooks — with presence, intention, and care. Every plate reflects our commitment to excellence.',
                    'Cozinhamos como uma mãe cozinha — com presença, intenção e cuidado. Cada prato reflete nosso compromisso com a excelência.'
                  ),
                  delay: '0.1s',
                },
                {
                  title: 'Celebração / Celebration',
                  content: t(
                    "We believe that gathering around a beautiful table is one of life's greatest joys. We are honored to be part of your story.",
                    'Acreditamos que se reunir ao redor de uma mesa linda é uma das maiores alegrias da vida. É uma honra fazer parte da sua história.'
                  ),
                  delay: '0.2s',
                },
              ].map(({ title, content, delay }) => (
                <div
                  key={title}
                  className="fade-up flex flex-col items-center text-center p-8 bg-white/50 border border-cream-dark rounded-sm"
                  style={{ transitionDelay: delay }}
                >
                  <Heart size={22} className="text-gold mb-4" />
                  <h3 className="font-playfair text-xl text-darkbrown mb-3">{title}</h3>
                  <p className="font-lato text-sm text-mocha/70 leading-relaxed">{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BotanicalDivider className="absolute bottom-0 left-0 right-0" opacity={0.06} flip />
      </section>

      {/* ─── FOOD IMAGERY STRIP ──────────────────────────────────────────── */}
      <section className="bg-mocha py-20 relative overflow-hidden">
        <BotanicalOverlay opacity={0.05} />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-3 sm:gap-5">
            {[
              { src: '/image 3.JPG', alt: 'Karlota Gourmet event' },
              { src: '/image 4.JPG', alt: 'Karlota Gourmet catering' },
              { src: '/image 5.jpeg', alt: 'Karlota Gourmet table' },
            ].map(({ src, alt }, i) => (
              <div
                key={i}
                className="fade-up aspect-square relative rounded-sm overflow-hidden"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <Image src={src} alt={alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="33vw" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-cream py-20">
        <div className="max-w-2xl mx-auto px-6 text-center fade-up">
          <p className="section-label">{t('Become Part of Our Story', 'Faça Parte da Nossa História')}</p>
          <h2 className="font-playfair text-4xl text-darkbrown mb-5">
            {t("Let's Celebrate", 'Vamos Celebrar')} <span className="italic">{t('Together', 'Juntos')}</span>
          </h2>
          <div className="gold-rule" />
          <p className="font-lato text-mocha/70 text-base leading-relaxed mb-10">
            {t(
              'Every event we cater becomes part of our story — and we would be honored to be part of yours.',
              'Cada evento que servimos se torna parte da nossa história — e seria uma honra fazer parte da sua.'
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
