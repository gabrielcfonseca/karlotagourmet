'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type Lang = 'en' | 'pt'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (en: string, pt: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (en: string, pt: string) => lang === 'pt' ? pt : en
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
