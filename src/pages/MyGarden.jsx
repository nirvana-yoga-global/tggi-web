import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
      {/* Photo */}
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

      {/* Info */}
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
  const [phone,    setPhone]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [searched, setSearched] = useState(false)
  const [plants,   setPlants]   = useState([])
  const [updates,  setUpdates]  = useState({})
  const [error,    setError]    = useState('')

  async function handleLookup(e) {
    e.preventDefault()
    const trimmed = phone.trim()
    if (!trimmed) return

    if (!supabase) {
      setError('Supabase not configured — check your .env file.')
      return
    }

    setLoading(true)
    setError('')
    setSearched(false)

    const { data: regs, error: regErr } = await supabase
      .from('tggi_registrations')
      .select('id, created_at, full_name, plant_name, category, location, first_photo_url, status, is_flagged')
      .eq('phone', trimmed)
      .order('created_at', { ascending: true })

    if (regErr) {
      setError(`Error: ${regErr.message}`)
      setLoading(false)
      return
    }

    if (!regs || regs.length === 0) {
      setPlants([])
      setUpdates({})
      setSearched(true)
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
    setSearched(true)
    setLoading(false)
  }

  const firstName = plants[0]?.full_name?.split(' ')[0] ?? ''

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
            Welcome Back
          </h1>
          <p className="font-sans text-forest/65 text-lg leading-relaxed">
            Enter your WhatsApp number to access your garden.
          </p>
        </div>

        {/* Phone lookup form */}
        <form onSubmit={handleLookup} className="mb-8" noValidate>
          <label className="block font-sans font-semibold text-forest text-lg mb-2">
            Phone Number
          </label>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value); setSearched(false) }}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              className="
                flex-1 min-h-[56px] px-4 py-3 rounded-xl
                border-2 border-forest/20 bg-white
                font-sans text-forest text-xl
                focus:outline-none focus:border-forest
                transition-colors placeholder:text-forest/30
              "
            />
            <button
              type="submit"
              disabled={loading || !phone.trim()}
              className="
                flex-shrink-0 min-h-[56px] px-7 rounded-xl
                bg-terracotta text-white
                font-sans font-bold text-lg
                hover:bg-terracotta-dark
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-150
              "
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Find'}
            </button>
          </div>
        </form>

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

        {/* No results */}
        {searched && !loading && plants.length === 0 && (
          <div className="text-center py-12">
            <p className="font-serif text-forest/60 leading-relaxed mb-3" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
              No plants found with this number.
            </p>
            <p className="font-sans text-forest/50 text-base mb-8">
              Would you like to register your first plant?
            </p>
            <Link
              to="/register"
              className="
                inline-flex items-center justify-center min-h-[52px]
                px-9 rounded-full
                bg-terracotta text-white
                font-sans font-bold text-lg
                hover:bg-terracotta-dark transition-colors duration-150
              "
            >
              Register Your Plant
            </Link>
          </div>
        )}

        {/* Results */}
        {searched && !loading && plants.length > 0 && (
          <div>
            <h2
              className="font-serif font-semibold text-forest leading-snug mb-8"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)' }}
            >
              Welcome back, {firstName}!
            </h2>

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
                to="/register"
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
