'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import LanguageSwitcher from './LanguageSwitcher'
import { useLang } from '@/lib/language-context'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLang()

  const NAV_LINKS = [
    { href: '/',               label: t('Home', 'Início') },
    { href: '/packages',      label: t('Packages', 'Pacotes') },
    { href: '/questionnaire', label: t('Plan Your Event', 'Planeje seu Evento') },
    { href: '/about',         label: t('Our Story', 'Nossa História') },
    { href: '/contact',       label: t('Contact', 'Contato') },
    { href: '/bridal-fair',   label: t('Bridal Experience 💍', 'Bridal Experience 💍'), highlight: true },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const isHeroPage = pathname === '/'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen || !isHeroPage
            ? 'bg-darkbrown/95 backdrop-blur-md shadow-lg py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Karlota Gourmet — Home">
            <Logo variant="light" size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label, highlight }) => (
              <Link
                key={href}
                href={href}
                className={`font-lato text-sm tracking-widest uppercase transition-colors duration-200 cursor-pointer ${
                  highlight
                    ? 'text-gold border border-gold/40 px-3 py-1 rounded-sm hover:bg-gold/10'
                    : pathname === href ? 'text-gold' : 'text-cream/80 hover:text-gold'
                }`}
              >
                {label}
              </Link>
            ))}
            <LanguageSwitcher onDark />
            <Link
              href="/questionnaire"
              className="ml-1 px-5 py-2 bg-gold text-darkbrown font-lato font-semibold text-sm tracking-widest uppercase rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer"
            >
              {t('Book Now', 'Reserve Agora')}
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-cream p-2 cursor-pointer"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#3B2A1A' }}
        aria-hidden={!menuOpen}
      >
        <Logo variant="light" size="md" />
        <nav className="flex flex-col items-center gap-6 mt-4" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label, highlight }) => (
            <Link
              key={href}
              href={href}
              className={`font-playfair text-2xl transition-colors duration-200 cursor-pointer ${
                highlight ? 'text-gold' : pathname === href ? 'text-gold' : 'text-cream hover:text-gold'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher onDark />
        <Link
          href="/questionnaire"
          className="mt-2 px-8 py-3 bg-gold text-darkbrown font-lato font-semibold tracking-widest uppercase rounded-sm text-sm cursor-pointer"
        >
          {t('Book Now', 'Reserve Agora')}
        </Link>
      </div>
    </>
  )
}
