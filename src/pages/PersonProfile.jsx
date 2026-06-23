import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Badge definitions ── */
const BADGE_RULES = [
  {
    key: 'guardian',
    label: 'TGGI Green Guardian',
    categories: ['Tree', 'Medicinal Plant'],
    bg: '#1f3d2b',
    color: '#c9a96e',
  },
  {
    key: 'nurturer',
    label: 'Nurturer',
    categories: ['Flowering Plant', 'Indoor / Ornamental Plant'],
    bg: '#c4623d',
    color: '#fff',
  },
  {
    key: 'kitchen',
    label: 'Kitchen Garden Contributor',
    categories: ['Vegetable / Kitchen Garden Plant', 'Herb'],
    bg: '#2d5a3d',
    color: '#faf7f0',
  },
]

function earnedBadges(plants) {
  return BADGE_RULES.filter(badge =>
    plants.some(p => badge.categories.includes(p.category))
  )
}

function formatMemberSince(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

/* ── Per-card scroll reveal ── */
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

/* ── Plant card (with status) ── */
function PlantCard({ plant }) {
  const [imgError, setImgError] = useState(false)

  return (
    <Link
      to={`/plant/${plant.id}`}
      className="block rounded-2xl overflow-hidden shadow-sm bg-white border border-forest/8 hover:shadow-md transition-shadow duration-200"
    >
      {/* Photo */}
      {plant.first_photo_url && !imgError ? (
        <img
          src={plant.first_photo_url}
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
            <path
              d="M20 4 C32 12 36 32 26 42 C19 50 4 46 2 34 C-2 20 8 6 20 4 Z"
              fill="rgba(201,169,110,0.35)"
            />
            <line x1="20" y1="4" x2="20" y2="48" stroke="rgba(201,169,110,0.5)" strokeWidth="1.2" />
          </svg>
        </div>
      )}

      {/* Info */}
      <div className="px-4 pt-3.5 pb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {/* Category badge */}
          <span
            className="inline-block font-sans text-xs font-bold uppercase tracking-wider text-white rounded-full px-3 py-1"
            style={{ backgroundColor: '#c4623d' }}
          >
            {plant.category}
          </span>
          {/* Status badge */}
          {plant.status && (
            <span
              className="inline-block font-sans text-xs font-semibold uppercase tracking-wider rounded-full px-3 py-1"
              style={{
                backgroundColor: plant.status === 'active' ? 'rgba(31,61,43,0.1)' : 'rgba(201,169,110,0.15)',
                color: plant.status === 'active' ? '#1f3d2b' : '#9a7c3f',
              }}
            >
              {plant.status}
            </span>
          )}
        </div>

        <h3
          className="font-serif font-semibold text-forest leading-snug"
          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)' }}
        >
          {plant.plant_name}
        </h3>
      </div>
    </Link>
  )
}

/* ── Spinner ── */
function Spinner() {
  return (
    <div className="flex justify-center py-24" aria-label="Loading">
      <svg className="animate-spin h-10 w-10 text-forest/40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

/* ── Leaf avatar ── */
function Avatar() {
  return (
    <div
      className="flex items-center justify-center rounded-full flex-shrink-0"
      style={{ width: 100, height: 100, backgroundColor: '#1f3d2b' }}
      aria-hidden="true"
    >
      <svg width="46" height="58" viewBox="0 0 46 58" fill="none">
        <path
          d="M23 4 C38 14 42 38 30 50 C22 58 5 54 3 40 C-1 24 8 6 23 4 Z"
          fill="rgba(201,169,110,0.40)"
        />
        <line x1="23" y1="4" x2="23" y2="55" stroke="rgba(201,169,110,0.65)" strokeWidth="1.4" />
        <line x1="23" y1="22" x2="12" y2="32" stroke="rgba(201,169,110,0.45)" strokeWidth="0.9" />
        <line x1="23" y1="22" x2="34" y2="32" stroke="rgba(201,169,110,0.45)" strokeWidth="0.9" />
        <line x1="23" y1="36" x2="14" y2="45" stroke="rgba(201,169,110,0.35)" strokeWidth="0.9" />
        <line x1="23" y1="36" x2="32" y2="45" stroke="rgba(201,169,110,0.35)" strokeWidth="0.9" />
      </svg>
    </div>
  )
}

/* ── Main page ── */
export default function PersonProfile() {
  const { id } = useParams()
  const phone = decodeURIComponent(id)

  const [plants,     setPlants]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    async function fetchPersonPlants() {
      if (!supabase) {
        setFetchError('Supabase client not initialised.')
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('tggi_registrations')
        .select('id, created_at, full_name, plant_name, category, location, first_photo_url, status')
        .eq('phone', phone)
        .order('created_at', { ascending: true })

      console.log('[PersonProfile] Supabase response — data:', data, '| error:', error)

      if (error) {
        setFetchError(`Supabase error: ${error.message}`)
      } else {
        setPlants(data ?? [])
      }
      setLoading(false)
    }
    fetchPersonPlants()
  }, [phone])

  /* Derived data */
  const person      = plants[0] ?? null
  const memberSince = person ? formatMemberSince(plants.reduce(
    (min, p) => p.created_at < min ? p.created_at : min,
    plants[0].created_at
  )) : null
  const badges      = earnedBadges(plants)

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Back nav ── */}
      <div className="pt-24 sm:pt-28 px-5 sm:px-8 max-w-6xl mx-auto">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 font-sans text-forest/60 text-base hover:text-forest transition-colors duration-150 min-h-[44px]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 L5 8 L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Gallery
        </Link>
      </div>

      {loading && <Spinner />}

      {!loading && fetchError && (
        <div
          className="mx-auto max-w-lg mt-8 px-5 py-4 rounded-xl border font-sans text-base"
          style={{ backgroundColor: 'rgba(196,98,61,0.07)', borderColor: 'rgba(196,98,61,0.3)', color: '#c4623d' }}
          role="alert"
        >
          ⚠ {fetchError}
        </div>
      )}

      {!loading && !fetchError && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* ── Profile header ── */}
          {person ? (
            <div
              className="flex flex-col items-center text-center py-10 sm:py-14"
              style={{ borderBottom: '1px solid rgba(31,61,43,0.08)' }}
            >
              <Avatar />

              {/* Name */}
              <h1
                className="font-serif font-semibold text-forest leading-[1.05] mt-6 mb-2"
                style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)' }}
              >
                {person.full_name}
              </h1>

              {/* Location */}
              {person.location && (
                <p className="font-sans text-forest/55 text-lg flex items-center gap-1.5 mb-1">
                  <svg width="12" height="15" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <path d="M6 1C3.79 1 2 2.79 2 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.3" fill="none" />
                    <circle cx="6" cy="5" r="1.2" fill="currentColor" />
                  </svg>
                  {person.location}
                </p>
              )}

              {/* Member since */}
              <p className="font-sans text-forest/40 text-sm mb-6">
                Member since {memberSince}
              </p>

              {/* Badges */}
              {badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                  {badges.map(badge => (
                    <span
                      key={badge.key}
                      className="font-sans text-sm font-bold uppercase tracking-wider rounded-full px-4 py-2"
                      style={{ backgroundColor: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* No person found */
            <div className="flex flex-col items-center text-center py-20 gap-4">
              <Avatar />
              <p className="font-serif text-forest/50" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.4rem)' }}>
                This garden is waiting to grow.
              </p>
              <Link
                to="/gallery"
                className="font-sans text-forest/60 text-base hover:text-forest underline underline-offset-4 transition-colors duration-150"
              >
                Back to Gallery
              </Link>
            </div>
          )}

          {/* ── Their Garden ── */}
          {plants.length > 0 && (
            <div className="py-10 sm:py-14">
              {/* Section heading */}
              <div className="mb-8">
                <p
                  className="font-sans font-bold uppercase tracking-[0.18em] text-terracotta mb-3"
                  style={{ fontSize: '0.65rem' }}
                >
                  {plants.length} {plants.length === 1 ? 'Plant' : 'Plants'}
                </p>
                <h2
                  className="font-serif font-semibold text-forest leading-[1.05]"
                  style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}
                >
                  Their Garden
                </h2>
              </div>

              {/* Masonry grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
                {plants.map((plant, i) => (
                  <RevealCard key={plant.id} delay={Math.min(i % 6, 3) * 60}>
                    <PlantCard plant={plant} />
                  </RevealCard>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
