import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function LeafPlaceholder() {
  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ height: 180, backgroundColor: '#1f3d2b' }}
      aria-hidden="true"
    >
      <svg width="38" height="48" viewBox="0 0 40 50" fill="none">
        <path d="M20 4 C32 12 36 32 26 42 C19 50 4 46 2 34 C-2 20 8 6 20 4 Z" fill="rgba(201,169,110,0.35)" />
        <line x1="20" y1="4" x2="20" y2="48" stroke="rgba(201,169,110,0.5)" strokeWidth="1.2" />
      </svg>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-16" aria-label="Loading">
      <svg className="animate-spin h-10 w-10 text-forest/35" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

function PlantCard({ plant, updates }) {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const latestPhoto = updates.length > 0
    ? updates[updates.length - 1].photo_url
    : plant.first_photo_url
  const updateCount = updates.length

  return (
    <div
      className="rounded-2xl overflow-hidden bg-white border border-forest/8 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={() => navigate(`/plant/${plant.id}?mine=true`)}
    >
      {latestPhoto && !imgError ? (
        <img
          src={latestPhoto}
          alt={plant.plant_name}
          className="w-full object-cover"
          style={{ maxHeight: 220, display: 'block' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <LeafPlaceholder />
      )}

      <div className="px-4 pt-3.5 pb-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className="inline-block font-sans text-xs font-bold uppercase tracking-wider text-white rounded-full px-3 py-1"
            style={{ backgroundColor: '#c4623d' }}
          >
            {plant.category}
          </span>
          {plant.is_flagged && (
            <span
              className="inline-block font-sans text-xs font-semibold rounded-full px-3 py-1"
              style={{ backgroundColor: 'rgba(201,169,110,0.18)', color: '#7a5c1e', border: '1px solid rgba(201,169,110,0.4)' }}
            >
              Pending Review
            </span>
          )}
        </div>

        <h3
          className="font-serif font-semibold text-forest leading-snug mb-1"
          style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)' }}
        >
          {plant.plant_name}
        </h3>

        <p className="font-sans text-forest/50 text-sm mb-0.5">
          Registered {formatDate(plant.created_at)}
        </p>
        <p className="font-sans text-forest/45 text-sm mb-4">
          {updateCount === 0
            ? 'No updates yet'
            : `${updateCount} update${updateCount !== 1 ? 's' : ''} logged`}
        </p>

        <button
          onClick={e => {
            e.stopPropagation()
            navigate(`/plant/${plant.id}?update=true`)
          }}
          className="
            w-full min-h-[48px] rounded-full
            bg-terracotta text-white
            font-sans font-bold text-base tracking-wide
            hover:bg-terracotta-dark transition-colors duration-150
            breathe
          "
        >
          Add Monthly Update
        </button>
      </div>
    </div>
  )
}

export default function MyGarden() {
  const { user, profile } = useAuth()
  const [loading,  setLoading]  = useState(true)
  const [plants,   setPlants]   = useState([])
  const [updates,  setUpdates]  = useState({})
  const [error,    setError]    = useState('')

  const firstName = profile?.full_name?.split(' ')[0]
    ?? user?.user_metadata?.full_name?.split(' ')[0]
    ?? ''

  useEffect(() => {
    if (!user || !supabase) { setLoading(false); return }
    loadPlants()
  }, [user])

  async function loadPlants() {
    setLoading(true)
    setError('')

    const query = profile?.nyg_id
      ? supabase.from('tggi_registrations').select('id, created_at, full_name, plant_name, category, location, first_photo_url, status, is_flagged').eq('nyg_id', profile.nyg_id)
      : supabase.from('tggi_registrations').select('id, created_at, full_name, plant_name, category, location, first_photo_url, status, is_flagged').eq('email', user.email)

    const { data: regs, error: regErr } = await query.order('created_at', { ascending: true })

    if (regErr) {
      setError(`Error loading plants: ${regErr.message}`)
      setLoading(false)
      return
    }

    if (!regs || regs.length === 0) {
      setPlants([])
      setUpdates({})
      setLoading(false)
      return
    }

    const ids = regs.map(r => r.id)
    const { data: upds } = await supabase
      .from('tggi_updates')
      .select('id, created_at, registration_id, photo_url, note, month_number')
      .in('registration_id', ids)
      .order('created_at', { ascending: true })

    const updatesMap = {}
    ids.forEach(id => { updatesMap[id] = [] })
    ;(upds ?? []).forEach(u => {
      if (updatesMap[u.registration_id]) updatesMap[u.registration_id].push(u)
    })

    setPlants(regs)
    setUpdates(updatesMap)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-5 pt-28 sm:pt-36 pb-20">

        {/* Page heading */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-terracotta/50" aria-hidden="true" />
            <p className="font-sans font-bold uppercase tracking-[0.22em] text-terracotta" style={{ fontSize: '0.65rem' }}>
              Your Living Journal
            </p>
            <div className="w-8 h-px bg-terracotta/50" aria-hidden="true" />
          </div>
          <h1
            className="font-serif font-semibold text-forest leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)' }}
          >
            {firstName ? `Welcome, ${firstName}` : 'My Garden'}
          </h1>
          {profile?.nyg_id && (
            <p className="font-sans text-forest/45 text-sm">
              NYG ID: <span className="font-mono font-semibold text-forest/60">{profile.nyg_id}</span>
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 px-5 py-4 rounded-xl border font-sans text-base"
            style={{ backgroundColor: 'rgba(196,98,61,0.07)', borderColor: 'rgba(196,98,61,0.3)', color: '#c4623d' }}
            role="alert"
          >
            ⚠ {error}
          </div>
        )}

        {loading && <Spinner />}

        {/* No plants */}
        {!loading && plants.length === 0 && (
          <div className="text-center py-12">
            <p className="font-serif text-forest/60 leading-relaxed mb-3" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
              Your garden is waiting to grow.
            </p>
            <p className="font-sans text-forest/50 text-base mb-8">
              Register your first plant to begin your journey.
            </p>
            <Link
              to="/register-plant"
              className="
                inline-flex items-center justify-center min-h-[52px]
                px-9 rounded-full
                bg-terracotta text-white
                font-sans font-bold text-lg
                hover:bg-terracotta-dark transition-colors duration-150
              "
            >
              Register Your First Plant
            </Link>
          </div>
        )}

        {/* Plant grid */}
        {!loading && plants.length > 0 && (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {plants.map(plant => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  updates={updates[plant.id] ?? []}
                />
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/register-plant"
                className="
                  inline-flex items-center justify-center min-h-[52px]
                  px-9 rounded-full
                  border-2 border-forest text-forest
                  font-sans font-bold text-lg
                  hover:bg-forest hover:text-cream
                  transition-colors duration-150
                "
              >
                Register Another Plant
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
