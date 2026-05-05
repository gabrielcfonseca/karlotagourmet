import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy route for private Vercel Blob media.
 * The browser can't add auth headers to <img> or <video> src,
 * so we fetch the private blob server-side and stream it back.
 *
 * Usage: /api/admin/media?url=<encoded-blob-url>
 */
export async function GET(req: NextRequest) {
  const blobUrl = req.nextUrl.searchParams.get('url')

  if (!blobUrl) {
    return new NextResponse('Missing url parameter', { status: 400 })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    return new NextResponse('Storage not configured', { status: 500 })
  }

  try {
    const res = await fetch(blobUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      return new NextResponse('File not found', { status: res.status })
    }

    const contentType = res.headers.get('Content-Type') || 'application/octet-stream'
    const contentLength = res.headers.get('Content-Length')

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
    })
    if (contentLength) headers.set('Content-Length', contentLength)

    return new NextResponse(res.body, { headers })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[admin/media proxy]', msg)
    return new NextResponse('Proxy error', { status: 500 })
  }
}
