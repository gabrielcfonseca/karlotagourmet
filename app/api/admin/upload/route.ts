import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Build a unique storage path preserving original file extension
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const storagePath = `admin/media/${Date.now()}-${safeName}`

    // Store at original quality — no processing, no compression
    const blob = await put(storagePath, file, {
      access: 'private',
      addRandomSuffix: false,
      contentType: file.type || undefined,
    })

    return NextResponse.json({
      url: blob.url,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/upload]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export const maxDuration = 60
