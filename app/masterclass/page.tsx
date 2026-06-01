'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChefHat, Star, CheckCircle2, Loader2 } from 'lucide-react'
import Logo from '@/components/Logo'
import BotanicalDivider, { BotanicalOverlay } from '@/components/BotanicalDivider'

const FATURAMENTO_OPTIONS = [
  { value: 'Até $20k/mês',       label: 'A', desc: 'Até 20 mil/ mês' },
  { value: 'De $20k à $50k/mês', label: 'B', desc: 'De 20 mil à 50 mil/ mês' },
  { value: 'De $50k à $100k/mês',label: 'C', desc: 'De 50 mil à 100 mil/ mês' },
  { value: 'De $100k à $200k/mês',label: 'D', desc: 'De 100 mil à 200 mil/ mês' },
  { value: 'Acima de $200k/mês', label: 'E', desc: 'Acima de 200 mil/ mês' },
]

const MODELO_OPTIONS = [
  'Profissional liberal (médico, advogado etc.)',
  'Empresa de serviços',
  'Negócio físico',
  'Infoproduto',
  'Indústria',
]

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function MasterclassPage() {
  const [form, setForm] = useState({
    nomeCompleto: '',
    instagram: '',
    email: '',
    whatsapp: '',
    faturamento: '',
    modeloNegocio: [] as string[],
    modeloOutro: '',
    maiorDificuldade: '',
    maiorObjetivo: '',
    perguntaEstrategica: '',
    agreed: false,
  })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function setText(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleModelo(opt: string) {
    setForm(f => ({
      ...f,
      modeloNegocio: f.modeloNegocio.includes(opt)
        ? f.modeloNegocio.filter(v => v !== opt)
        : [...f.modeloNegocio, opt],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.agreed) return

    // Build modeloNegocio list including "Outro" text if filled
    const modeloFinal = [
      ...form.modeloNegocio,
      ...(form.modeloNegocio.includes('Outro') && form.modeloOutro
        ? [`Outro: ${form.modeloOutro}`]
        : []),
    ].filter(v => !v.startsWith('Outro:') || form.modeloNegocio.includes('Outro'))

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/masterclass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCompleto: form.nomeCompleto,
          instagram: form.instagram,
          email: form.email,
          whatsapp: form.whatsapp,
          faturamento: form.faturamento,
          modeloNegocio: modeloFinal,
          modeloOutro: form.modeloOutro,
          maiorDificuldade: form.maiorDificuldade,
          maiorObjetivo: form.maiorObjetivo,
          perguntaEstrategica: form.perguntaEstrategica,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar aplicação')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido')
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-darkbrown flex flex-col items-center justify-center px-6 text-center">
        <BotanicalOverlay opacity={0.04} />
        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={36} className="text-gold" />
          </div>
          <div className="w-12 h-px bg-gold mx-auto mb-6" />
          <h1 className="font-fraunces text-3xl md:text-4xl text-cream mb-4">
            Aplicação Enviada!
          </h1>
          <p className="font-inter-tight text-cream/70 text-base leading-relaxed mb-8">
            Sua aplicação foi recebida com sucesso. A Karlota e a equipe irão analisar seu perfil
            pessoalmente e entraremos em contato caso você seja aprovado.
          </p>
          <div className="w-12 h-px bg-gold mx-auto mb-8" />
          <Link href="/" className="btn-gold">
            Voltar ao site
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-darkbrown">
        <Image
          src="/image 1.JPG"
          alt="Karlota Gourmet Masterclass"
          fill
          priority
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-darkbrown/60 via-darkbrown/40 to-darkbrown/90" />
        <BotanicalOverlay opacity={0.05} />

        <div className="relative z-10 text-center px-6 py-24 max-w-3xl mx-auto">
          <div className="mb-8">
            <Logo variant="light" size="sm" />
          </div>

          <p className="font-inter-tight text-xs tracking-[0.35em] uppercase text-gold font-semibold mb-4">
            Curso Master
          </p>

          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-gold fill-gold" />
            ))}
          </div>

          <h1 className="font-fraunces text-4xl sm:text-5xl md:text-6xl text-cream leading-tight mb-4">
            Masterclass
            <br />
            <span className="italic text-gold">Chef das Estrelas</span>
          </h1>

          <div className="w-14 h-px bg-gold mx-auto my-6" />

          <p className="font-inter-tight text-cream/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Aplicação Masterclass Chef das estrelas. Preencha com atenção. Iremos avaliar o seu
            perfil e entraremos em contato caso seja aprovado.
          </p>
        </div>
      </section>

      {/* ─── FORM ────────────────────────────────────────────────────── */}
      <section className="bg-darkbrown py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} noValidate className="space-y-10">

            {/* Nome completo */}
            <Field label="Qual é seu nome completo?" required>
              <input
                type="text"
                required
                placeholder="Seu nome completo"
                value={form.nomeCompleto}
                onChange={e => setText('nomeCompleto', e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Instagram */}
            <Field label="Qual é seu Instagram?" required>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter-tight text-cream/40 text-sm">@</span>
                <input
                  type="text"
                  required
                  placeholder="seuperfil"
                  value={form.instagram}
                  onChange={e => setText('instagram', e.target.value)}
                  className={`${inputClass} pl-9`}
                />
              </div>
            </Field>

            {/* Email */}
            <Field label="E seu e-mail?" required>
              <input
                type="email"
                required
                placeholder="voce@exemplo.com"
                value={form.email}
                onChange={e => setText('email', e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* WhatsApp */}
            <Field label="Qual é o seu número de WhatsApp?" required>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={form.whatsapp}
                onChange={e => setText('whatsapp', e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Faturamento */}
            <Field label="Qual o seu faturamento médio mensal (US Dollars)?" required>
              <div className="space-y-3 mt-1">
                {FATURAMENTO_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-4 px-5 py-4 rounded-sm border cursor-pointer transition-all duration-150 group ${
                      form.faturamento === opt.value
                        ? 'border-gold bg-gold/10'
                        : 'border-cream/10 hover:border-cream/30 bg-cream/5'
                    }`}
                  >
                    <input
                      type="radio"
                      name="faturamento"
                      value={opt.value}
                      checked={form.faturamento === opt.value}
                      onChange={() => setText('faturamento', opt.value)}
                      className="sr-only"
                    />
                    <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center font-inter-tight font-semibold text-sm transition-all ${
                      form.faturamento === opt.value
                        ? 'border-gold bg-gold text-darkbrown'
                        : 'border-cream/20 text-cream/50 group-hover:border-cream/40'
                    }`}>
                      {opt.label}
                    </span>
                    <span className={`font-inter-tight text-sm transition-colors ${
                      form.faturamento === opt.value ? 'text-cream' : 'text-cream/60'
                    }`}>
                      {opt.desc}
                    </span>
                  </label>
                ))}
              </div>
            </Field>

            {/* Modelo de negócio */}
            <Field label="Qual é o seu modelo de negócio hoje?" required hint="Você pode marcar mais que uma opção">
              <div className="space-y-3 mt-1">
                {MODELO_OPTIONS.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center gap-4 px-5 py-4 rounded-sm border cursor-pointer transition-all duration-150 group ${
                      form.modeloNegocio.includes(opt)
                        ? 'border-gold bg-gold/10'
                        : 'border-cream/10 hover:border-cream/30 bg-cream/5'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.modeloNegocio.includes(opt)}
                      onChange={() => toggleModelo(opt)}
                      className="sr-only"
                    />
                    <span className={`flex-shrink-0 w-5 h-5 rounded-[3px] border-2 flex items-center justify-center transition-all ${
                      form.modeloNegocio.includes(opt)
                        ? 'border-gold bg-gold'
                        : 'border-cream/20 group-hover:border-cream/40'
                    }`}>
                      {form.modeloNegocio.includes(opt) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#3B2A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={`font-inter-tight text-sm transition-colors ${
                      form.modeloNegocio.includes(opt) ? 'text-cream' : 'text-cream/60'
                    }`}>
                      {opt}
                    </span>
                  </label>
                ))}

                {/* Outro */}
                <label
                  className={`flex items-center gap-4 px-5 py-4 rounded-sm border cursor-pointer transition-all duration-150 group ${
                    form.modeloNegocio.includes('Outro')
                      ? 'border-gold bg-gold/10'
                      : 'border-cream/10 hover:border-cream/30 bg-cream/5'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.modeloNegocio.includes('Outro')}
                    onChange={() => toggleModelo('Outro')}
                    className="sr-only"
                  />
                  <span className={`flex-shrink-0 w-5 h-5 rounded-[3px] border-2 flex items-center justify-center transition-all ${
                    form.modeloNegocio.includes('Outro')
                      ? 'border-gold bg-gold'
                      : 'border-cream/20 group-hover:border-cream/40'
                  }`}>
                    {form.modeloNegocio.includes('Outro') && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#3B2A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`font-inter-tight text-sm transition-colors ${
                    form.modeloNegocio.includes('Outro') ? 'text-cream' : 'text-cream/60'
                  }`}>
                    Outro
                  </span>
                </label>

                {form.modeloNegocio.includes('Outro') && (
                  <input
                    type="text"
                    placeholder="Descreva seu modelo de negócio"
                    value={form.modeloOutro}
                    onChange={e => setText('modeloOutro', e.target.value)}
                    className={`${inputClass} mt-1`}
                  />
                )}
              </div>
            </Field>

            {/* Maior dificuldade */}
            <Field label="Qual sua maior dificuldade para estruturar ou escalar seu negócio digital?" required>
              <textarea
                required
                rows={4}
                placeholder="Descreva sua maior dificuldade..."
                value={form.maiorDificuldade}
                onChange={e => setText('maiorDificuldade', e.target.value)}
                className={textareaClass}
              />
            </Field>

            {/* Maior objetivo */}
            <Field label="E qual é o seu maior objetivo profissional hoje?" required>
              <textarea
                required
                rows={4}
                placeholder="Descreva seu maior objetivo..."
                value={form.maiorObjetivo}
                onChange={e => setText('maiorObjetivo', e.target.value)}
                className={textareaClass}
              />
            </Field>

            {/* Pergunta estratégica */}
            <Field label="Se você pudesse fazer uma pergunta estratégica ao Rodrigo e à Adriana sobre seu negócio hoje, qual seria?" required>
              <textarea
                required
                rows={4}
                placeholder="Qual seria sua pergunta estratégica?"
                value={form.perguntaEstrategica}
                onChange={e => setText('perguntaEstrategica', e.target.value)}
                className={textareaClass}
              />
            </Field>

            {/* Important notice + agreement */}
            <div className="border border-gold/30 rounded-sm p-6 bg-gold/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  <ChefHat size={16} className="text-gold" />
                </div>
                <p className="font-fraunces text-lg text-gold">Importante!</p>
              </div>
              <p className="font-inter-tight text-cream/70 text-sm leading-relaxed mb-6">
                A sua aplicação será analisada pessoalmente pela Karlota e equipe. Se fizer sentido
                e entendermos que você está realmente pronto, você poderá se tornar parte do seleto
                grupo Masterclass Chef das estrelas.
              </p>
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={e => setForm(f => ({ ...f, agreed: e.target.checked }))}
                  className="sr-only"
                />
                <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[3px] border-2 flex items-center justify-center transition-all ${
                  form.agreed
                    ? 'border-gold bg-gold'
                    : 'border-cream/30 group-hover:border-cream/50'
                }`}>
                  {form.agreed && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#3B2A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="font-inter-tight text-sm text-cream/80 leading-relaxed">
                  Estou de acordo
                </span>
              </label>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <div className="border border-red-500/40 bg-red-500/10 rounded-sm px-5 py-4">
                <p className="font-inter-tight text-red-400 text-sm">{errorMsg || 'Ocorreu um erro. Tente novamente.'}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!form.agreed || status === 'loading'}
              className="btn-gold w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando…
                </>
              ) : (
                'Enviar Aplicação'
              )}
            </button>

          </form>
        </div>
      </section>

      {/* ─── FOOTER STRIP ────────────────────────────────────────────── */}
      <section className="bg-darkbrown border-t border-cream/10 py-10">
        <BotanicalDivider className="absolute top-0 left-0 right-0" opacity={0.04} />
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Logo variant="light" size="sm" />
          <p className="font-inter-tight text-cream/30 text-xs tracking-widest uppercase mt-4">
            Karlota Gourmet — Masterclass Chef das Estrelas
          </p>
        </div>
      </section>
    </>
  )
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block font-fraunces text-lg text-cream mb-1">
        {label}
        {required && <span className="text-gold ml-1 text-base">*</span>}
      </label>
      {hint && <p className="font-inter-tight text-xs text-cream/40 tracking-wide mb-3">{hint}</p>}
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-cream/5 border border-cream/15 rounded-sm px-4 py-3 font-inter-tight text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors duration-150'

const textareaClass =
  'w-full bg-cream/5 border border-cream/15 rounded-sm px-4 py-3 font-inter-tight text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-gold transition-colors duration-150 resize-none'
