'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Incorrect password. Please try again.')
        setPassword('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#3B2A1A' }}
    >
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 25% 25%, #C9A84C 1px, transparent 1px), radial-gradient(circle at 75% 75%, #C9A84C 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-10">
          <p className="font-lato text-xs tracking-[6px] uppercase text-gold mb-2">Karlota Gourmet</p>
          <h1 className="font-playfair text-3xl text-cream">Admin Panel</h1>
          <div className="w-12 h-px bg-gold mx-auto mt-4 opacity-60" />
        </div>

        {/* Card */}
        <div className="rounded-sm overflow-hidden shadow-2xl" style={{ backgroundColor: '#FAF0E6' }}>
          <div className="px-8 py-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-darkbrown flex items-center justify-center flex-shrink-0">
                <Lock size={14} className="text-gold" />
              </div>
              <div>
                <p className="font-lato text-xs tracking-widest uppercase text-mocha-light">Secure Access</p>
                <p className="font-playfair text-lg text-darkbrown leading-tight">Enter your password</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoFocus
                  className="w-full px-4 py-3 pr-12 rounded-sm border border-mocha/20 bg-white font-lato text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mocha/40 hover:text-mocha transition-colors"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="font-lato text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 bg-darkbrown text-cream font-lato text-sm tracking-widest uppercase rounded-sm hover:bg-mocha transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying…' : 'Enter'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-6 font-lato text-xs text-cream/30">
          © {new Date().getFullYear()} Karlota Gourmet · Internal Use Only
        </p>
      </div>
    </div>
  )
}
