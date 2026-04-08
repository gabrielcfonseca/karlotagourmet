'use client'

import Link from 'next/link'
import { Camera, Mail } from 'lucide-react'
import Logo from './Logo'
import { config } from '@/lib/config'
import { useLang } from '@/lib/language-context'

export default function Footer() {
  const year = new Date().getFullYear()
  const { t } = useLang()

  const navLinks = [
    { href: '/',               label: t('Home', 'Início') },
    { href: '/packages',      label: t('Packages', 'Pacotes') },
    { href: '/questionnaire', label: t('Plan Your Event', 'Planeje seu Evento') },
    { href: '/about',         label: t('Our Story', 'Nossa História') },
    { href: '/contact',       label: t('Contact', 'Contato') },
  ]

  return (
    <footer className="bg-darkbrown text-cream/70 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo & tagline */}
          <div className="flex flex-col items-start gap-4">
            <Logo variant="light" size="sm" />
            <p className="font-lato text-sm leading-relaxed text-cream/60 max-w-xs mt-2">
              {t(
                'Luxury Brazilian catering crafted with love, tradition, and excellence.',
                'Buffet brasileiro de luxo feito com amor, tradição e excelência.'
              )}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-playfair text-gold text-sm tracking-widest uppercase mb-5">
              {t('Navigate', 'Navegar')}
            </h3>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="font-lato text-sm text-cream/60 hover:text-gold transition-colors duration-200 cursor-pointer"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair text-gold text-sm tracking-widest uppercase mb-5">
              {t('Connect', 'Contato')}
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${config.contact.email}`}
                className="flex items-center gap-2 font-lato text-sm text-cream/60 hover:text-gold transition-colors duration-200"
              >
                <Mail size={15} />
                {config.contact.email}
              </a>
              <a
                href={`https://instagram.com/${config.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-lato text-sm text-cream/60 hover:text-gold transition-colors duration-200"
              >
                <Camera size={15} />
                {config.contact.instagram}
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-lato text-xs text-cream/40 tracking-wide">
            © {year} Karlota Gourmet. {t('All rights reserved.', 'Todos os direitos reservados.')}
          </p>
          <p className="font-lato text-xs text-cream/30 tracking-wide">
            {t('Luxury Brazilian Catering · United States', 'Buffet Brasileiro de Luxo · Estados Unidos')}
          </p>
        </div>
      </div>
    </footer>
  )
}
