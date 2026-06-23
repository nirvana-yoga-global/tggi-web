import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  'Tree',
  'Medicinal Plant',
  'Flowering Plant',
  'Vegetable / Kitchen Garden Plant',
  'Indoor / Ornamental Plant',
  'Herb',
]

/* Per-card scroll reveal — each card observes itself */
function RevealCard({ children, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="reveal break-inside-avoid mb-5"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* Individual plant card — works for both registrations and featured photos */
function PlantCard({ plant }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm bg-white border border-forest/8 cursor-default select-none">

      {/* Photo */}
      {plant.photo_url && !imgError ? (
        <img
          src={plant.photo_url}
          alt={plant.plant_name}
          className="w-full object-cover"
          style={{ display: 'block' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 200, backgroundColor: '#1f3d2b' }}
          aria-hidden="true"
        >
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
            <path d="M20 4 C32 12 36 32 26 42 C19 50 4 46 2 34 C-2 20 8 6 20 4 Z" fill="rgba(201,169,110,0.35)" />
            <line x1="20" y1="4" x2="20" y2="48" stroke="rgba(201,169,110,0.5)" strokeWidth="1.2" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="px-4 pt-3.5 pb-4">
        {/* Category badge */}
        <span
          className="inline-block font-sans text-xs font-bold uppercase tracking-wider text-white rounded-full px-3 py-1 mb-2"
          style={{ backgroundColor: '#c4623d' }}
        >
          {plant.category}
        </span>

        {/* Plant name */}
        <h3
          className="font-serif font-semibold text-forest leading-snug mb-1"
          style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)' }}
        >
          {plant.plant_name}
        </h3>

        {/* Source name — link for registrations, plain text for featured */}
        {plant.type === 'registration' && plant.phone ? (
          <Link
            to={`/person/${encodeURIComponent(plant.phone)}`}
            className="block font-sans text-forest/70 text-base leading-snug hover:text-terracotta transition-colors duration-150 hover:underline underline-offset-2"
            onClick={e => e.stopPropagation()}
          >
            {plant.display_name}
          </Link>
        ) : (
          <p className="font-sans text-forest/50 text-base leading-snug italic">
            {plant.display_name}
          </p>
        )}

        {/* Location */}
        {plant.location && (
          <p className="font-sans text-forest/45 text-sm mt-1 leading-snug flex items-center gap-1">
            <svg width="11" height="13" viewBox="0 0 12 14" fill="none" aria-hidden="true">
              <path d="M6 1C3.79 1 2 2.79 2 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <circle cx="6" cy="5" r="1.2" fill="currentColor" />
            </svg>
            {plant.location}
          </p>
        )}
      </div>
    </div>
  )
}

/* Loading spinner */
function Spinner() {
  return (
    <div className="flex justify-center py-24" aria-label="Loading plants">
      <svg
        className="animate-spin h-10 w-10 text-forest/40"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

export default function Gallery() {
  const [plants,        setPlants]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [fetchError,    setFetchError]    = useState('')
  const [activeFilter,  setActiveFilter]  = useState('All')

  useEffect(() => {
    async function fetchAll() {
      if (!supabase) {
        setFetchError('Supabase client not initialised — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
        setLoading(false)
        return
      }

      const [
        { data: regs,     error: regErr  },
        { data: featured, error: featErr },
      ] = await Promise.all([
        supabase
          .from('tggi_registrations')
          .select('id, full_name, plant_name, category, location, first_photo_url, phone')
          .eq('is_approved', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('tggi_featured_photos')
          .select('id, plant_name, category, photo_url, location, source_name')
          .order('created_at', { ascending: false }),
      ])

      console.log('[Gallery] registrations:', regs, regErr, '| featured:', featured, featErr)

      if (regErr) { setFetchError(`Supabase error: ${regErr.message}`); setLoading(false); return }

      const normalised = [
        ...(regs ?? []).map(r => ({
          id:           `reg-${r.id}`,
          type:         'registration',
          photo_url:    r.first_photo_url,
          plant_name:   r.plant_name,
          category:     r.category,
          location:     r.location,
          display_name: r.full_name,
          phone:        r.phone,
        })),
        ...(featured ?? []).map(f => ({
          id:           `feat-${f.id}`,
          type:         'featured',
          photo_url:    f.photo_url,
          plant_name:   f.plant_name,
          category:     f.category,
          location:     f.location,
          display_name: f.source_name ?? 'Nirvana Yoga Global',
          phone:        null,
        })),
      ]

      setPlants(normalised)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const filtered = activeFilter === 'All'
    ? plants
    : plants.filter(p => p.category === activeFilter)

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Page header ── */}
      <div
        className="pt-28 pb-10 sm:pt-36 sm:pb-14 px-6 text-center"
        style={{ borderBottom: '1px solid rgba(31,61,43,0.08)' }}
      >
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-8 sm:w-12 h-px bg-terracotta/50" aria-hidden="true" />
          <p
            className="font-sans font-bold uppercase tracking-[0.22em] text-terracotta"
            style={{ fontSize: '0.65rem' }}
          >
            Our Community
          </p>
          <div className="w-8 sm:w-12 h-px bg-terracotta/50" aria-hidden="true" />
        </div>

        {/* Main heading */}
        <h1
          className="font-serif font-semibold text-forest leading-[1.05] mb-5"
          style={{ fontSize: 'clamp(2.4rem, 7vw, 5rem)' }}
        >
          Plants Growing<br className="sm:hidden" /> Around the World
        </h1>

        {/* Subtext */}
        <p
          className="font-sans text-forest/65 leading-relaxed max-w-lg mx-auto"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}
        >
          Every photo is a promise kept — a living act of care from someone, somewhere.
        </p>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-30 bg-cream/95 backdrop-blur-sm border-b border-forest/8">
        <div
          className="flex gap-2 px-5 py-3.5 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="group"
          aria-label="Filter by category"
        >
          {['All', ...CATEGORIES].map(cat => {
            const active = activeFilter === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="flex-shrink-0 font-sans font-semibold text-sm rounded-full px-4 py-2 transition-colors duration-150 min-h-[40px]"
                style={{
                  backgroundColor: active ? '#c4623d' : 'transparent',
                  color:           active ? '#fff'    : 'rgba(31,61,43,0.65)',
                  border:          active ? '2px solid #c4623d' : '2px solid rgba(31,61,43,0.18)',
                }}
                aria-pressed={active}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Gallery body ── */}
      <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14">

        {loading && <Spinner />}

        {!loading && fetchError && (
          <div
            className="mx-auto max-w-lg mt-4 mb-10 px-5 py-4 rounded-xl border font-sans text-base leading-relaxed"
            style={{ backgroundColor: 'rgba(196,98,61,0.07)', borderColor: 'rgba(196,98,61,0.3)', color: '#c4623d' }}
            role="alert"
          >
            ⚠ {fetchError}
          </div>
        )}

        {!loading && !fetchError && filtered.length === 0 && (
          <div className="flex flex-col items-center text-center py-24 gap-5">
            {/* Leaf illustration */}
            <svg width="60" height="75" viewBox="0 0 60 75" fill="none" aria-hidden="true">
              <path
                d="M30 5 C50 18 55 48 38 62 C28 72 6 68 3 50 C-2 28 10 8 30 5 Z"
                stroke="#1f3d2b" strokeWidth="1.5" fill="rgba(31,61,43,0.06)"
              />
              <line x1="30" y1="5" x2="30" y2="70" stroke="#1f3d2b" strokeWidth="1" strokeOpacity="0.3" />
            </svg>
            <p
              className="font-serif text-forest/55 leading-relaxed max-w-sm"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}
            >
              {plants.length === 0
                ? 'No plants registered yet — be the first to join the movement.'
                : `No plants in the "${activeFilter}" category yet.`}
            </p>
          </div>
        )}

        {!loading && !fetchError && filtered.length > 0 && (
          /* CSS masonry via columns */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {filtered.map((plant, i) => (
              <RevealCard key={plant.id} delay={Math.min(i % 6, 3) * 60}>
                <PlantCard plant={plant} />
              </RevealCard>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
