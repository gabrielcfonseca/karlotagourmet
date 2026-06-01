import type { Metadata } from 'next'
import { Fraunces, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import ConditionalLayout from '@/components/ConditionalLayout'

// ─── Karlota Gourmet — Design System Fonts ───────────────────────────────────

// Fraunces — display / editorial / headings
// Optical serif with warmth; used for all h1–h6, section titles, hero text
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

// Inter Tight — UI / body / labels / buttons
// Clean condensed sans-serif; used for all body copy, captions, UI elements
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-inter-tight',
  display: 'swap',
})

// JetBrains Mono — monospace / technical accents
// Used sparingly for codes, tracking numbers, technical labels
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
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
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <LanguageProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </LanguageProvider>
      </body>
    </html>
  )
}
