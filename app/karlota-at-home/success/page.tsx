import Link from 'next/link'
import { Clock, CheckCircle2 } from 'lucide-react'
import Logo from '@/components/Logo'

export default function KarlotaAtHomeSuccess() {
  return (
    <div className="min-h-screen bg-darkbrown flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <div className="mb-10">
          <Logo variant="light" size="sm" />
        </div>

        <div className="w-20 h-20 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={36} className="text-gold" />
        </div>

        <div className="w-12 h-px bg-gold mx-auto mb-6" />

        <h1 className="font-fraunces text-3xl md:text-4xl text-cream mb-4">
          Payment Received!
        </h1>

        <p className="font-inter-tight text-cream/70 text-base leading-relaxed mb-6">
          Your order is being reviewed by our team. You&apos;ll receive a confirmation email
          once it&apos;s approved — usually within a few hours.
        </p>

        <div className="flex items-center justify-center gap-2 bg-gold/10 border border-gold/20 rounded-sm px-5 py-3 mb-10">
          <Clock size={16} className="text-gold flex-shrink-0" />
          <p className="font-inter-tight text-sm text-cream/80">
            Orders are approved within a few hours. Check your email.
          </p>
        </div>

        <div className="w-12 h-px bg-gold/30 mx-auto mb-8" />

        <Link href="/karlota-at-home" className="btn-outline-gold">
          Order More
        </Link>
        <Link href="/" className="block mt-4 font-inter-tight text-sm text-cream/40 hover:text-cream/70 transition-colors">
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
