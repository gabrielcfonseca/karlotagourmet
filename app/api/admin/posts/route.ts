import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const POSTS_KEY = 'admin/posts.json'

export interface Post {
  id: string
  type: 'reel' | 'story' | 'carousel' | 'post'
  date: string      // YYYY-MM-DD
  time: string      // HH:MM
  description: string
  caption: string
  hashtags: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  createdAt: string
  updatedAt: string
}

async function getPosts(): Promise<Post[]> {
  const { blobs } = await list({ prefix: POSTS_KEY })
  if (blobs.length === 0) return []

  // Private blobs need the token as Authorization header
  const res = await fetch(blobs[0].url, {
    cache: 'no-store',
    headers: process.env.BLOB_READ_WRITE_TOKEN
      ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      : {},
  })
  if (!res.ok) return []
  return (await res.json()) as Post[]
}

async function savePosts(posts: Post[]): Promise<void> {
  await put(POSTS_KEY, JSON.stringify(posts, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}

export async function GET() {
  try {
    const posts = await getPosts()
    posts.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`))
    return NextResponse.json(posts)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/posts GET]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.type || !body.date || !body.time) {
      return NextResponse.json({ error: 'type, date, and time are required' }, { status: 400 })
    }

    const posts = await getPosts()

    const newPost: Post = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: body.type,
      date: body.date,
      time: body.time,
      description: body.description || '',
      caption: body.caption || '',
      hashtags: body.hashtags || '',
      fileUrl: body.fileUrl || undefined,
      fileName: body.fileName || undefined,
      fileSize: body.fileSize || undefined,
      fileType: body.fileType || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    posts.push(newPost)
    await savePosts(posts)

    return NextResponse.json(newPost, { status: 201 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/posts POST]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const posts = await getPosts()
    const index = posts.findIndex(p => p.id === body.id)

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    posts[index] = {
      ...posts[index],
      ...body,
      id: posts[index].id,
      createdAt: posts[index].createdAt,
      updatedAt: new Date().toISOString(),
    }

    await savePosts(posts)
    return NextResponse.json(posts[index])
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/posts PUT]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const posts = await getPosts()
    const filtered = posts.filter(p => p.id !== id)

    if (filtered.length === posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await savePosts(filtered)
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/posts DELETE]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
