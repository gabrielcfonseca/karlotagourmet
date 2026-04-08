import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

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
    <html lang="en">
      <body className="antialiased">
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  )
}
