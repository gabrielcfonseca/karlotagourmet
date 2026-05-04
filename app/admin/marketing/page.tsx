'use client'

import { useState, useEffect, useCallback, useRef, DragEvent, ChangeEvent, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Plus, X, Pencil, Trash2, Download, Clock, Calendar,
  FileVideo, Upload, ChevronDown, Search
} from 'lucide-react'
import type { Post } from '@/app/api/admin/posts/route'

// ─── constants ────────────────────────────────────────────────────────────────

const TYPE_META: Record<Post['type'], { label: string; color: string; bg: string; border: string; dot: string }> = {
  reel:      { label: 'Reel',     color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  story:     { label: 'Story',    color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-200',   dot: 'bg-pink-500' },
  carousel:  { label: 'Carousel', color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  post:      { label: 'Post',     color: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200',dot: 'bg-emerald-500' },
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ─── empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  type: 'post' as Post['type'],
  date: '',
  time: '09:00',
  description: '',
  caption: '',
  hashtags: '',
  fileUrl: '',
  fileName: '',
  fileSize: 0,
  fileType: '',
}

// ─── main component ───────────────────────────────────────────────────────────

export default function MarketingPage() {
  return (
    <Suspense fallback={<div className="p-8 font-lato text-sm text-mocha/50">Loading…</div>}>
      <MarketingContent />
    </Suspense>
  )
}

function MarketingContent() {
  const searchParams = useSearchParams()
  const preDate = searchParams.get('date') || ''
  const editId  = searchParams.get('edit') || ''

  const [posts, setPosts]         = useState<Post[]>([])
  const [loading, setLoading]     = useState(true)
  const [panelOpen, setPanelOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [form, setForm]           = useState({ ...EMPTY_FORM, date: preDate })
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [deleteConfirm, setDeleteConfirm]   = useState<string | null>(null)
  const [filterType, setFilterType]   = useState<Post['type'] | 'all'>('all')
  const [filterMonth, setFilterMonth] = useState('')
  const [search, setSearch]           = useState('')
  const [dragOver, setDragOver]       = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── load posts ──
  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/posts')
      if (res.ok) setPosts(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  // ── open edit if ?edit= param present ──
  useEffect(() => {
    if (editId && posts.length > 0) {
      const p = posts.find(x => x.id === editId)
      if (p) openEdit(p)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, posts])

  // ── open pre-filled new form if ?date= param present ──
  useEffect(() => {
    if (preDate && !editId) {
      setForm(f => ({ ...f, date: preDate }))
      setPanelOpen(true)
    }
  }, [preDate, editId])

  function openNew() {
    setEditingPost(null)
    setForm({ ...EMPTY_FORM, date: preDate })
    setPanelOpen(true)
  }

  function openEdit(post: Post) {
    setEditingPost(post)
    setForm({
      type: post.type,
      date: post.date,
      time: post.time,
      description: post.description,
      caption: post.caption,
      hashtags: post.hashtags,
      fileUrl: post.fileUrl || '',
      fileName: post.fileName || '',
      fileSize: post.fileSize || 0,
      fileType: post.fileType || '',
    })
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setEditingPost(null)
    setForm({ ...EMPTY_FORM, date: preDate })
  }

  // ── file upload ──
  async function uploadFile(file: File) {
    if (!file) return
    setUploading(true)
    setUploadProgress(`Uploading ${file.name}…`)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setForm(f => ({
        ...f,
        fileUrl: data.url,
        fileName: data.name,
        fileSize: data.size,
        fileType: data.type,
      }))
      setUploadProgress('')
    } catch {
      setUploadProgress('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  function clearFile() {
    setForm(f => ({ ...f, fileUrl: '', fileName: '', fileSize: 0, fileType: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── save post ──
  async function savePost() {
    if (!form.type || !form.date || !form.time) return
    setSaving(true)
    try {
      const payload = {
        ...form,
        ...(editingPost ? { id: editingPost.id } : {}),
      }
      const method = editingPost ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/posts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        await loadPosts()
        closePanel()
      }
    } finally {
      setSaving(false)
    }
  }

  // ── delete post ──
  async function deletePost(id: string) {
    try {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      await loadPosts()
      setDeleteConfirm(null)
    } catch {
      // no-op
    }
  }

  // ── filtered posts ──
  const filtered = posts.filter(p => {
    if (filterType !== 'all' && p.type !== filterType) return false
    if (filterMonth && !p.date.startsWith(filterMonth)) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !p.description.toLowerCase().includes(q) &&
        !p.caption.toLowerCase().includes(q) &&
        !p.hashtags.toLowerCase().includes(q) &&
        !p.date.includes(q)
      ) return false
    }
    return true
  })

  // ── stats ──
  const stats = {
    total: posts.length,
    reel: posts.filter(p => p.type === 'reel').length,
    story: posts.filter(p => p.type === 'story').length,
    carousel: posts.filter(p => p.type === 'carousel').length,
    post: posts.filter(p => p.type === 'post').length,
  }

  const today = new Date()
  const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-lato text-xs tracking-[4px] uppercase text-gold mb-1">Instagram Marketing</p>
          <h1 className="font-playfair text-2xl md:text-3xl text-darkbrown">Posts</h1>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-darkbrown text-cream font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-mocha transition-colors"
        >
          <Plus size={14} />
          New Post
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="bg-white rounded-sm shadow-sm px-4 py-3 md:col-span-1">
          <p className="font-lato text-[10px] tracking-widest uppercase text-mocha/50 mb-1">Total</p>
          <p className="font-playfair text-2xl text-darkbrown">{stats.total}</p>
        </div>
        {(Object.keys(TYPE_META) as Post['type'][]).map(t => (
          <div key={t} className={`rounded-sm shadow-sm px-4 py-3 border ${TYPE_META[t].border} ${TYPE_META[t].bg}`}>
            <p className={`font-lato text-[10px] tracking-widest uppercase mb-1 ${TYPE_META[t].color}`}>
              {TYPE_META[t].label}
            </p>
            <p className={`font-playfair text-2xl ${TYPE_META[t].color}`}>{stats[t]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-mocha/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-sm font-lato text-xs text-darkbrown placeholder-mocha/40 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-sm px-1 py-1">
          {(['all', 'reel', 'story', 'carousel', 'post'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-sm font-lato text-[10px] tracking-widest uppercase transition-colors ${
                filterType === t
                  ? 'bg-darkbrown text-cream'
                  : 'text-mocha/60 hover:text-mocha'
              }`}
            >
              {t === 'all' ? 'All' : TYPE_META[t].label}
            </button>
          ))}
        </div>

        {/* Month filter */}
        <div className="relative">
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-sm pl-3 pr-7 py-2 font-lato text-xs text-darkbrown focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold cursor-pointer"
          >
            <option value="">All months</option>
            {MONTHS.map((m, i) => {
              const val = `${today.getFullYear()}-${String(i+1).padStart(2,'0')}`
              return <option key={val} value={val}>{m} {today.getFullYear()}</option>
            })}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-mocha/40 pointer-events-none" />
        </div>
      </div>

      {/* Post list */}
      {loading ? (
        <div className="py-16 text-center font-lato text-sm text-mocha/50">Loading posts…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} className="text-mocha/30" />
          </div>
          <p className="font-playfair text-lg text-mocha/50 mb-2">No posts found</p>
          <p className="font-lato text-sm text-mocha/30 mb-4">
            {posts.length === 0 ? 'Start building your posting schedule' : 'Try adjusting your filters'}
          </p>
          {posts.length === 0 && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 px-5 py-2 bg-darkbrown text-cream font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-mocha transition-colors"
            >
              <Plus size={14} />
              Create First Post
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex items-stretch">
                {/* Color stripe */}
                <div className={`w-1 flex-shrink-0 ${TYPE_META[post.type].dot}`} />

                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-sm font-lato text-[10px] tracking-widest uppercase border ${TYPE_META[post.type].bg} ${TYPE_META[post.type].color} ${TYPE_META[post.type].border} flex-shrink-0`}>
                        {TYPE_META[post.type].label}
                      </span>
                      <span className="flex items-center gap-1.5 font-lato text-xs text-mocha/60">
                        <Calendar size={11} />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5 font-lato text-xs text-mocha/60">
                        <Clock size={11} />
                        {post.time}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(post)}
                        className="p-1.5 text-mocha/30 hover:text-gold transition-colors rounded-sm hover:bg-gold/10"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="p-1.5 text-mocha/30 hover:text-red-500 transition-colors rounded-sm hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {post.description && (
                    <p className="font-lato text-sm text-mocha mt-2 line-clamp-2">{post.description}</p>
                  )}

                  {post.caption && (
                    <p className="font-lato text-xs text-mocha/60 mt-1 line-clamp-1 italic">"{post.caption}"</p>
                  )}

                  {post.hashtags && (
                    <p className="font-lato text-xs text-blue-500 mt-1 line-clamp-1">{post.hashtags}</p>
                  )}

                  {/* File attachment */}
                  {post.fileUrl && (
                    <div className="mt-3 flex items-center gap-3">
                      {post.fileType?.startsWith('image/') ? (
                        <div className="w-14 h-14 rounded-sm overflow-hidden bg-gray-100 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={post.fileUrl}
                            alt={post.fileName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-sm bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <FileVideo size={20} className="text-mocha/30" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-lato text-xs text-mocha truncate">{post.fileName}</p>
                        <p className="font-lato text-[10px] text-mocha/40">{formatFileSize(post.fileSize)}</p>
                        <a
                          href={post.fileUrl}
                          download={post.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1 font-lato text-[10px] text-gold hover:underline"
                        >
                          <Download size={10} />
                          Download original
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-sm shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-playfair text-lg text-darkbrown mb-2">Delete Post?</h3>
            <p className="font-lato text-sm text-mocha/70 mb-6">
              This action cannot be undone. The post and its details will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 border border-gray-200 text-mocha font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deletePost(deleteConfirm)}
                className="flex-1 py-2 bg-red-600 text-white font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit panel ── */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={closePanel}
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark/50 flex-shrink-0" style={{ backgroundColor: '#FAF0E6' }}>
              <div>
                <p className="font-lato text-[10px] tracking-[4px] uppercase text-gold">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </p>
                <h2 className="font-playfair text-xl text-darkbrown">
                  {editingPost ? 'Update your content' : 'Schedule content'}
                </h2>
              </div>
              <button
                onClick={closePanel}
                className="p-2 text-mocha/40 hover:text-mocha transition-colors rounded-sm hover:bg-darkbrown/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Post type */}
              <div>
                <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                  Post Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(TYPE_META) as Post['type'][]).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, type: t }))}
                      className={`py-2.5 rounded-sm font-lato text-xs tracking-widest uppercase border transition-all ${
                        form.type === t
                          ? `${TYPE_META[t].bg} ${TYPE_META[t].color} ${TYPE_META[t].border} font-semibold shadow-sm`
                          : 'bg-white border-gray-200 text-mocha/50 hover:border-gray-300'
                      }`}
                    >
                      {TYPE_META[t].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date + Time row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-sm font-lato text-sm text-darkbrown focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
                  />
                </div>
                <div>
                  <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-sm font-lato text-sm text-darkbrown focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                  Content Description
                </label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the content, visual concept, key messages, filming notes…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-sm font-lato text-sm text-darkbrown placeholder-mocha/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                  Instagram Caption
                </label>
                <textarea
                  value={form.caption}
                  onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                  rows={3}
                  placeholder="Write your Instagram caption here…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-sm font-lato text-sm text-darkbrown placeholder-mocha/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold resize-none"
                />
              </div>

              {/* Hashtags */}
              <div>
                <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                  Hashtags
                </label>
                <input
                  type="text"
                  value={form.hashtags}
                  onChange={e => setForm(f => ({ ...f, hashtags: e.target.value }))}
                  placeholder="#karlotagourmet #braziliancatering #weddingfood"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-sm font-lato text-sm text-darkbrown placeholder-mocha/30 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="block font-lato text-[10px] tracking-widest uppercase text-mocha/60 mb-2">
                  Media File
                  <span className="ml-2 font-lato text-[9px] text-mocha/40 normal-case tracking-normal">
                    Photos & videos stored at original quality
                  </span>
                </label>

                {form.fileUrl ? (
                  /* File preview */
                  <div className="border border-gray-200 rounded-sm overflow-hidden">
                    {form.fileType?.startsWith('image/') ? (
                      <div className="relative aspect-video bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.fileUrl}
                          alt={form.fileName}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-4 bg-gray-50">
                        <div className="w-10 h-10 rounded-sm bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <FileVideo size={18} className="text-mocha/50" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-lato text-sm text-darkbrown truncate">{form.fileName}</p>
                          <p className="font-lato text-xs text-mocha/50">{formatFileSize(form.fileSize)}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
                      <a
                        href={form.fileUrl}
                        download={form.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-lato text-xs text-gold hover:underline"
                      >
                        <Download size={12} />
                        Download original
                      </a>
                      <button
                        onClick={clearFile}
                        className="font-lato text-xs text-mocha/40 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Drop zone */
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all ${
                      dragOver
                        ? 'border-gold bg-gold/5'
                        : 'border-gray-200 hover:border-gold/50 hover:bg-gray-50'
                    }`}
                  >
                    {uploading ? (
                      <div>
                        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="font-lato text-xs text-mocha/50">{uploadProgress}</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-mocha/30 mx-auto mb-2" />
                        <p className="font-lato text-sm text-mocha/60 mb-1">
                          Drag & drop or <span className="text-gold">browse</span>
                        </p>
                        <p className="font-lato text-xs text-mocha/30">
                          Photos and videos · Stored at original quality (4K/8K)
                        </p>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Panel footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                onClick={closePanel}
                className="px-5 py-2.5 border border-gray-200 text-mocha font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePost}
                disabled={saving || !form.date || !form.time || uploading}
                className="flex-1 py-2.5 bg-darkbrown text-cream font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-mocha transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : editingPost ? 'Update Post' : 'Schedule Post'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
