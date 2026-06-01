'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AtSign,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  TrendingUp,
  Target,
  MessageSquare,
  Calendar,
  Users,
  Loader2,
  Search,
} from 'lucide-react'

interface Application {
  id: string
  submittedAt: string
  nomeCompleto: string
  instagram: string
  email: string
  whatsapp: string
  faturamento: string
  modeloNegocio: string[]
  modeloOutro: string
  maiorDificuldade: string
  maiorObjetivo: string
  perguntaEstrategica: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function ApplicationCard({ app }: { app: Application }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-cream/10 rounded-sm overflow-hidden" style={{ backgroundColor: '#2E1F11' }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-cream/5 transition-colors duration-150"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex-shrink-0 flex items-center justify-center">
            <span className="font-fraunces text-gold text-sm font-semibold">
              {app.nomeCompleto.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-fraunces text-cream text-base truncate">{app.nomeCompleto}</p>
            <p className="font-inter-tight text-cream/40 text-xs truncate">@{app.instagram}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="hidden sm:inline-flex font-inter-tight text-xs text-cream/30 items-center gap-1">
            <Calendar size={11} />
            {formatDate(app.submittedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/20 rounded-sm px-2.5 py-1 font-inter-tight text-xs">
            {app.faturamento.split('/')[0].replace('De ', '').replace('Até ', '<').replace('Acima de ', '>')}
          </span>
          {expanded ? <ChevronUp size={16} className="text-cream/40" /> : <ChevronDown size={16} className="text-cream/40" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-cream/10 px-5 py-5 space-y-5">

          {/* Contact row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ContactItem icon={AtSign} label="Instagram" value={`@${app.instagram}`} href={`https://instagram.com/${app.instagram}`} />
            <ContactItem icon={Mail}      label="Email"     value={app.email}           href={`mailto:${app.email}`} />
            <ContactItem icon={Phone}     label="WhatsApp"  value={app.whatsapp}        href={`https://wa.me/${app.whatsapp.replace(/\D/g, '')}`} />
          </div>

          <Divider />

          {/* Revenue */}
          <DetailItem icon={DollarSign} label="Faturamento médio mensal">
            {app.faturamento}
          </DetailItem>

          {/* Modelo de negócio */}
          {app.modeloNegocio.length > 0 && (
            <DetailItem icon={Briefcase} label="Modelo de negócio">
              <div className="flex flex-wrap gap-2 mt-1">
                {app.modeloNegocio.map(m => (
                  <span key={m} className="bg-cream/8 border border-cream/10 rounded-sm px-3 py-1 font-inter-tight text-xs text-cream/70">
                    {m}
                  </span>
                ))}
              </div>
            </DetailItem>
          )}

          <Divider />

          {/* Text answers */}
          <DetailItem icon={TrendingUp} label="Maior dificuldade">
            {app.maiorDificuldade}
          </DetailItem>

          <DetailItem icon={Target} label="Maior objetivo profissional">
            {app.maiorObjetivo}
          </DetailItem>

          <DetailItem icon={MessageSquare} label="Pergunta estratégica">
            {app.perguntaEstrategica}
          </DetailItem>

          {/* Date footer */}
          <div className="pt-2 border-t border-cream/5 flex items-center gap-1.5">
            <Calendar size={11} className="text-cream/30" />
            <p className="font-inter-tight text-xs text-cream/30">Enviado em {formatDate(app.submittedAt)}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ContactItem({
  icon: Icon, label, value, href,
}: { icon: React.ElementType; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-sm border border-cream/8 hover:border-gold/30 hover:bg-gold/5 transition-all duration-150 group"
    >
      <Icon size={14} className="text-gold mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="font-inter-tight text-[10px] tracking-widest uppercase text-cream/30 mb-0.5">{label}</p>
        <p className="font-inter-tight text-xs text-cream/70 group-hover:text-cream truncate">{value}</p>
      </div>
    </a>
  )
}

function DetailItem({
  icon: Icon, label, children,
}: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={13} className="text-gold" />
        <p className="font-inter-tight text-[11px] tracking-widest uppercase text-cream/40">{label}</p>
      </div>
      <div className="font-inter-tight text-sm text-cream/75 leading-relaxed pl-5">{children}</div>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-cream/8" />
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchApps = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/masterclass')
      if (!res.ok) throw new Error('Falha ao carregar aplicações')
      const data = await res.json()
      setApplications(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchApps() }, [fetchApps])

  const filtered = applications.filter(a => {
    const q = search.toLowerCase()
    return (
      !q ||
      a.nomeCompleto.toLowerCase().includes(q) ||
      a.instagram.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.whatsapp.includes(q)
    )
  })

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-inter-tight text-[10px] tracking-[0.3em] uppercase text-gold font-semibold mb-1">
            Masterclass Chef das Estrelas
          </p>
          <h1 className="font-fraunces text-2xl text-darkbrown">Aplicações</h1>
        </div>
        <button
          onClick={fetchApps}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold font-inter-tight text-xs tracking-widest uppercase rounded-sm hover:bg-gold/5 transition-all duration-150 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total de aplicações"
          value={loading ? '—' : String(applications.length)}
        />
        <StatCard
          icon={Calendar}
          label="Mais recente"
          value={
            loading || applications.length === 0
              ? '—'
              : new Date(applications[0].submittedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
          }
        />
        <StatCard
          icon={TrendingUp}
          label="Esta semana"
          value={
            loading
              ? '—'
              : String(
                  applications.filter(a => {
                    const d = new Date(a.submittedAt)
                    const now = new Date()
                    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
                    return diffDays <= 7
                  }).length
                )
          }
        />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-mocha/40" />
        <input
          type="text"
          placeholder="Buscar por nome, Instagram, email ou WhatsApp..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-cream-dark rounded-sm font-inter-tight text-sm text-darkbrown placeholder-mocha/40 focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-mocha/50">
          <Loader2 size={20} className="animate-spin" />
          <span className="font-inter-tight text-sm">Carregando aplicações…</span>
        </div>
      ) : error ? (
        <div className="border border-red-300 bg-red-50 rounded-sm px-5 py-4">
          <p className="font-inter-tight text-red-600 text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-mocha/8 flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-mocha/30" />
          </div>
          <p className="font-fraunces text-xl text-darkbrown/50 mb-2">
            {search ? 'Nenhuma aplicação encontrada' : 'Nenhuma aplicação ainda'}
          </p>
          <p className="font-inter-tight text-sm text-mocha/40">
            {search ? 'Tente ajustar a busca' : 'As aplicações aparecerão aqui quando forem enviadas'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon, label, value,
}: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-white border border-cream-dark rounded-sm px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={13} className="text-gold" />
        <p className="font-inter-tight text-[10px] tracking-widest uppercase text-mocha/40">{label}</p>
      </div>
      <p className="font-fraunces text-2xl text-darkbrown">{value}</p>
    </div>
  )
}
