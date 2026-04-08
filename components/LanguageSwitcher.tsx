'use client'

import { useLang } from '@/lib/language-context'

export default function LanguageSwitcher({ onDark = true }: { onDark?: boolean }) {
  const { lang, setLang } = useLang()

  return (
    <div className="flex items-center gap-0.5 rounded-sm overflow-hidden border border-cream/20" aria-label="Language selector">
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 font-lato text-xs font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer ${
          lang === 'en'
            ? 'bg-gold text-darkbrown'
            : onDark
              ? 'text-cream/50 hover:text-cream'
              : 'text-mocha/50 hover:text-mocha'
        }`}
        aria-pressed={lang === 'en'}
        aria-label="Switch to English"
      >
        EN
      </button>
      <div className="w-px h-4 bg-cream/20" aria-hidden="true" />
      <button
        onClick={() => setLang('pt')}
        className={`px-2.5 py-1 font-lato text-xs font-semibold tracking-widest uppercase transition-all duration-200 cursor-pointer ${
          lang === 'pt'
            ? 'bg-gold text-darkbrown'
            : onDark
              ? 'text-cream/50 hover:text-cream'
              : 'text-mocha/50 hover:text-mocha'
        }`}
        aria-pressed={lang === 'pt'}
        aria-label="Mudar para Português"
      >
        PT
      </button>
    </div>
  )
}
