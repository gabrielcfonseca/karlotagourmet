'use client'

import { MessageCircle } from 'lucide-react'
import { config } from '@/lib/config'

export default function WhatsAppButton() {
  const href = `https://wa.me/${config.contact.whatsapp}?text=Hi%2C%20I%27m%20interested%20in%20Karlota%20Gourmet%20catering%20services!`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-[#25D366] hover:bg-[#1ebe5a]
        text-white font-lato font-semibold text-sm
        px-4 py-3 rounded-full
        shadow-[0_4px_20px_rgba(37,211,102,0.4)]
        hover:shadow-[0_6px_28px_rgba(37,211,102,0.55)]
        transition-all duration-200 cursor-pointer
        group
      "
    >
      <MessageCircle size={20} className="flex-shrink-0" />
      <span className="hidden sm:inline group-hover:inline transition-all duration-200 whitespace-nowrap">
        Chat with us
      </span>
    </a>
  )
}
