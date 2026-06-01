import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import ConditionalLayout from '@/components/ConditionalLayout'

// ─── Design-system fonts ─────────────────────────────────────────────────────
// Playfair Display — headings, display text, editorial moments
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

// Lato — all UI text, labels, body copy, buttons
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lato',
  display: 'swap',
})
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'Karlota Gourmet — Luxury Brazilian Catering',
    template: '%s | Karlota Gourmet',
  },
  description:
    'Luxury Brazilian catering crafted with love, tradition, and excellence. Serving all around the United States.',
  keywords: ['Brazilian catering', 'luxury catering Florida', 'wedding catering', 'Brazilian food', 'event catering'],
  openGraph: {
    title: 'Karlota Gourmet — Luxury Brazilian Catering',
    description: 'Where Every Event Becomes a Memory.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
