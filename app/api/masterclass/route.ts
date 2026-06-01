import { NextResponse } from 'next/server'
import { put, head } from '@vercel/blob'

const APPLICATIONS_KEY = 'admin/masterclass-applications.json'

export interface MasterclassApplication {
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

async function loadApplications(): Promise<MasterclassApplication[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []

  try {
    const info = await head(APPLICATIONS_KEY, { token })
    const res = await fetch(info.url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

async function saveApplications(apps: MasterclassApplication[]): Promise<void> {
  await put(APPLICATIONS_KEY, JSON.stringify(apps, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  })
}

// POST — submit a new application
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Basic validation
    const required = ['nomeCompleto', 'instagram', 'email', 'whatsapp', 'faturamento', 'maiorDificuldade', 'maiorObjetivo', 'perguntaEstrategica']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo obrigatório ausente: ${field}` }, { status: 400 })
      }
    }

    const newApp: MasterclassApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
      nomeCompleto: body.nomeCompleto,
      instagram: body.instagram,
      email: body.email,
      whatsapp: body.whatsapp,
      faturamento: body.faturamento,
      modeloNegocio: Array.isArray(body.modeloNegocio) ? body.modeloNegocio : [],
      modeloOutro: body.modeloOutro || '',
      maiorDificuldade: body.maiorDificuldade,
      maiorObjetivo: body.maiorObjetivo,
      perguntaEstrategica: body.perguntaEstrategica,
    }

    const apps = await loadApplications()
    apps.unshift(newApp) // newest first
    await saveApplications(apps)

    return NextResponse.json({ success: true, id: newApp.id })
  } catch (err) {
    console.error('Masterclass application error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// GET — list all applications (admin only, checked by middleware)
export async function GET() {
  try {
    const apps = await loadApplications()
    return NextResponse.json(apps)
  } catch (err) {
    console.error('Masterclass fetch error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
