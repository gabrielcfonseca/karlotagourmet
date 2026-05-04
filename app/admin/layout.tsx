'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, ImagePlay, LogOut, Menu, X, ChefHat } from 'lucide-react'

const NAV = [
  { href: '/admin/dashboard',  label: 'Calendar',  icon: CalendarDays },
  { href: '/admin/marketing',  label: 'Posts',     icon: ImagePlay },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Login page: no chrome
  if (pathname === '/admin') return <>{children}</>

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={`flex flex-col h-full ${mobile ? 'pt-4' : ''}`}
      style={{ backgroundColor: '#3B2A1A' }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b border-cream/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <ChefHat size={16} className="text-gold" />
          </div>
          <div>
            <p className="font-lato text-[10px] tracking-[4px] uppercase text-gold leading-none">Karlota Gourmet</p>
            <p className="font-playfair text-sm text-cream leading-tight mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-lato text-sm tracking-wide transition-all duration-150 ${
                active
                  ? 'bg-gold/15 text-gold'
                  : 'text-cream/70 hover:text-cream hover:bg-cream/5'
              }`}
            >
              <Icon size={16} className={active ? 'text-gold' : 'text-cream/50'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-cream/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm font-lato text-sm text-cream/50 hover:text-cream/80 hover:bg-cream/5 transition-all duration-150"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 md:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar mobile />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 shadow-sm sticky top-0 z-20"
          style={{ backgroundColor: '#3B2A1A' }}
        >
          <div className="flex items-center gap-2">
            <ChefHat size={16} className="text-gold" />
            <p className="font-playfair text-sm text-cream">Admin</p>
          </div>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="text-cream/70 p-1"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
