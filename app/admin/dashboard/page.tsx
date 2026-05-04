'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Plus, X, Clock, FileVideo, Download, Pencil, CalendarDays } from 'lucide-react'
import type { Post } from '@/app/api/admin/posts/route'

// ─── helpers ────────────────────────────────────────────────────────────────

const TYPE_META: Record<Post['type'], { label: string; color: string; bg: string; dot: string }> = {
  reel:      { label: 'Reel',     color: 'text-blue-700',   bg: 'bg-blue-100',   dot: 'bg-blue-500' },
  story:     { label: 'Story',    color: 'text-pink-700',   bg: 'bg-pink-100',   dot: 'bg-pink-500' },
  carousel:  { label: 'Carousel', color: 'text-purple-700', bg: 'bg-purple-100', dot: 'bg-purple-500' },
  post:      { label: 'Post',     color: 'text-emerald-700',bg: 'bg-emerald-100',dot: 'bg-emerald-500' },
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: { day: number; currentMonth: boolean }[] = []

  // Fill leading cells from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, currentMonth: false })
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true })
  }
  // Fill trailing cells
  const trailing = 42 - cells.length
  for (let i = 1; i <= trailing; i++) {
    cells.push({ day: i, currentMonth: false })
  }

  return cells
}

// ─── component ──────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear]     = useState(today.getFullYear())
  const [month, setMonth]   = useState(today.getMonth())
  const [posts, setPosts]   = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null) // YYYY-MM-DD
  const [deleting, setDeleting] = useState<string | null>(null)

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

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const cells = buildCalendarDays(year, month)

  function postsForDay(day: number) {
    const d = String(day).padStart(2, '0')
    const m = String(month + 1).padStart(2, '0')
    const dateStr = `${year}-${m}-${d}`
    return posts.filter(p => p.date === dateStr)
  }

  const selectedPosts = selected
    ? posts.filter(p => p.date === selected).sort((a, b) => a.time.localeCompare(b.time))
    : []

  async function deletePost(id: string) {
    setDeleting(id)
    try {
      await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      await loadPosts()
    } finally {
      setDeleting(null)
    }
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-lato text-xs tracking-[4px] uppercase text-gold mb-1">Marketing Calendar</p>
          <h1 className="font-playfair text-2xl md:text-3xl text-darkbrown">Instagram Schedule</h1>
        </div>
        <Link
          href="/admin/marketing"
          className="flex items-center gap-2 px-4 py-2 bg-darkbrown text-cream font-lato text-xs tracking-widest uppercase rounded-sm hover:bg-mocha transition-colors"
        >
          <Plus size={14} />
          New Post
        </Link>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {(Object.keys(TYPE_META) as Post['type'][]).map(t => (
          <div key={t} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${TYPE_META[t].dot}`} />
            <span className="font-lato text-xs text-mocha">{TYPE_META[t].label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-sm shadow-sm overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-cream-dark/50" style={{ backgroundColor: '#FAF0E6' }}>
            <button onClick={prevMonth} className="p-1.5 rounded-sm hover:bg-darkbrown/10 transition-colors text-darkbrown">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-playfair text-lg text-darkbrown">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-sm hover:bg-darkbrown/10 transition-colors text-darkbrown">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center font-lato text-xs tracking-widest uppercase text-mocha/50">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          {loading ? (
            <div className="py-16 text-center font-lato text-sm text-mocha/50">Loading posts…</div>
          ) : (
            <div className="grid grid-cols-7">
              {cells.map((cell, i) => {
                const m = String(month + 1).padStart(2, '0')
                const d = String(cell.day).padStart(2, '0')
                const dateStr = cell.currentMonth ? `${year}-${m}-${d}` : ''
                const dayPosts = cell.currentMonth ? postsForDay(cell.day) : []
                const isToday = dateStr === todayStr
                const isSelected = dateStr === selected

                return (
                  <div
                    key={i}
                    onClick={() => cell.currentMonth && setSelected(isSelected ? null : dateStr)}
                    className={`min-h-[72px] p-1.5 border-b border-r border-gray-100 transition-colors ${
                      cell.currentMonth
                        ? `cursor-pointer ${isSelected ? 'bg-gold/10' : 'hover:bg-cream/60'}`
                        : 'bg-gray-50/50'
                    }`}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full font-lato text-xs mb-1 ${
                      isToday
                        ? 'bg-darkbrown text-cream font-semibold'
                        : cell.currentMonth
                          ? 'text-darkbrown'
                          : 'text-gray-300'
                    }`}>
                      {cell.day}
                    </div>

                    {/* Post dots */}
                    <div className="flex flex-wrap gap-0.5">
                      {dayPosts.slice(0, 4).map((p, j) => (
                        <span
                          key={j}
                          className={`w-1.5 h-1.5 rounded-full ${TYPE_META[p.type].dot}`}
                          title={`${p.time} — ${TYPE_META[p.type].label}`}
                        />
                      ))}
                      {dayPosts.length > 4 && (
                        <span className="font-lato text-[9px] text-mocha/50 leading-none self-end">+{dayPosts.length - 4}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Day detail panel */}
        <div className="lg:w-72">
          {selected ? (
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-cream-dark/50" style={{ backgroundColor: '#FAF0E6' }}>
                <div>
                  <p className="font-lato text-[10px] tracking-widest uppercase text-gold">
                    {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                  </p>
                  <p className="font-playfair text-base text-darkbrown">
                    {new Date(selected + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/marketing?date=${selected}`}
                    className="flex items-center gap-1 px-2 py-1 bg-darkbrown text-cream font-lato text-[10px] tracking-widest uppercase rounded-sm hover:bg-mocha transition-colors"
                  >
                    <Plus size={10} />
                    Add
                  </Link>
                  <button onClick={() => setSelected(null)} className="text-mocha/40 hover:text-mocha transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {selectedPosts.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="font-lato text-sm text-mocha/40">No posts scheduled</p>
                    <Link
                      href={`/admin/marketing?date=${selected}`}
                      className="inline-block mt-3 font-lato text-xs text-gold hover:underline"
                    >
                      + Schedule a post
                    </Link>
                  </div>
                ) : (
                  selectedPosts.map(post => (
                    <div key={post.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-sm font-lato text-[10px] tracking-widest uppercase ${TYPE_META[post.type].bg} ${TYPE_META[post.type].color}`}>
                            {TYPE_META[post.type].label}
                          </span>
                          <span className="flex items-center gap-1 font-lato text-xs text-mocha/50">
                            <Clock size={10} />
                            {post.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Link
                            href={`/admin/marketing?edit=${post.id}`}
                            className="p-1 text-mocha/30 hover:text-gold transition-colors"
                            title="Edit"
                          >
                            <Pencil size={13} />
                          </Link>
                          <button
                            onClick={() => deletePost(post.id)}
                            disabled={deleting === post.id}
                            className="p-1 text-mocha/30 hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>

                      {post.description && (
                        <p className="font-lato text-xs text-mocha line-clamp-2 mb-2">{post.description}</p>
                      )}

                      {/* File preview */}
                      {post.fileUrl && (
                        <div className="mt-2">
                          {post.fileType?.startsWith('image/') ? (
                            <div className="relative rounded-sm overflow-hidden aspect-square bg-gray-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={post.fileUrl}
                                alt={post.fileName || 'Post media'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-gray-50 rounded-sm px-3 py-2">
                              <FileVideo size={14} className="text-mocha/50 flex-shrink-0" />
                              <span className="font-lato text-xs text-mocha/70 truncate flex-1">{post.fileName}</span>
                              <span className="font-lato text-[10px] text-mocha/40">{formatFileSize(post.fileSize)}</span>
                            </div>
                          )}
                          <a
                            href={post.fileUrl}
                            download={post.fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 mt-1.5 font-lato text-[10px] text-gold hover:underline"
                          >
                            <Download size={10} />
                            Download original
                          </a>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-sm shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-3">
                <CalendarDays size={20} className="text-mocha/40" />
              </div>
              <p className="font-lato text-sm text-mocha/50 mb-1">Select a day</p>
              <p className="font-lato text-xs text-mocha/30">Click any date to see scheduled posts</p>
            </div>
          )}

          {/* Monthly summary */}
          <div className="mt-4 bg-white rounded-sm shadow-sm p-4">
            <p className="font-lato text-[10px] tracking-widest uppercase text-gold mb-3">
              {MONTHS[month]} Summary
            </p>
            {(Object.keys(TYPE_META) as Post['type'][]).map(t => {
              const m = String(month + 1).padStart(2, '0')
              const count = posts.filter(p => p.date.startsWith(`${year}-${m}`) && p.type === t).length
              return (
                <div key={t} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${TYPE_META[t].dot}`} />
                    <span className="font-lato text-xs text-mocha">{TYPE_META[t].label}</span>
                  </div>
                  <span className="font-lato text-xs font-semibold text-darkbrown">{count}</span>
                </div>
              )
            })}
            <div className="flex items-center justify-between pt-2 mt-1">
              <span className="font-lato text-xs font-semibold text-mocha">Total</span>
              <span className="font-lato text-xs font-semibold text-darkbrown">
                {posts.filter(p => p.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

