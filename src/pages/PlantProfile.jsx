import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

/* ── Badge goal by category ── */
function goalLabel(category) {
  if (['Tree', 'Medicinal Plant'].includes(category))
    return 'Working toward TGGI Green Guardian — nurture for 1 year'
  if (['Flowering Plant', 'Indoor / Ornamental Plant'].includes(category))
    return 'Working toward Nurturer — nurture for 3–6 months'
  if (['Vegetable / Kitchen Garden Plant', 'Herb'].includes(category))
    return 'Working toward Kitchen Garden Contributor — nurture until harvest'
  return null
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function calcMonthNumber(createdAt, existingUpdatesCount) {
  return existingUpdatesCount + 1
}

/* ── Per-entry scroll reveal ── */
function RevealEntry({ children, delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.unobserve(el) } },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-24" aria-label="Loading">
      <svg className="animate-spin h-10 w-10 text-forest/35" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  )
}

/* ── Timeline entry ── */
function TimelineEntry({ label, date, photoUrl, note, isFirst, delay }) {
  const [imgError, setImgError] = useState(false)

  return (
    <RevealEntry delay={delay}>
      <div className="flex gap-4 sm:gap-6 pb-10">
        {/* Line + dot */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
          <div
            className="rounded-full flex-shrink-0"
            style={{
              width: 14, height: 14, marginTop: 4,
              backgroundColor: isFirst ? '#c4623d' : '#1f3d2b',
              border: '2.5px solid #faf7f0',
              boxShadow: '0 0 0 2px ' + (isFirst ? '#c4623d' : '#1f3d2b'),
            }}
            aria-hidden="true"
          />
          <div className="flex-1 w-px mt-2" style={{ backgroundColor: 'rgba(31,61,43,0.15)' }} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-2">
          <p className="font-sans font-bold uppercase tracking-wider text-terracotta mb-1" style={{ fontSize: '0.65rem' }}>
            {label}
          </p>
          <p className="font-sans text-forest/45 text-sm mb-3">{formatDate(date)}</p>

          {/* Photo */}
          {photoUrl && !imgError ? (
            <img
              src={photoUrl}
              alt={label}
              className="w-full rounded-2xl object-cover mb-3"
              style={{ maxHeight: 320, display: 'block' }}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div
              className="w-full rounded-2xl flex items-center justify-center mb-3"
              style={{ height: 200, backgroundColor: '#1f3d2b' }}
              aria-hidden="true"
            >
              <svg width="38" height="48" viewBox="0 0 40 50" fill="none">
                <path d="M20 4 C32 12 36 32 26 42 C19 50 4 46 2 34 C-2 20 8 6 20 4 Z" fill="rgba(201,169,110,0.35)" />
                <line x1="20" y1="4" x2="20" y2="48" stroke="rgba(201,169,110,0.5)" strokeWidth="1.2" />
              </svg>
            </div>
          )}

          {/* Note */}
          {note && (
            <p className="font-sans text-forest/65 text-base italic leading-relaxed">
              "{note}"
            </p>
          )}
        </div>
      </div>
    </RevealEntry>
  )
}

/* ── Update form ── */
function UpdateForm({ plant, existingUpdatesCount, onSuccess }) {
  const [photo,       setPhoto]       = useState(null)
  const [note,        setNote]        = useState('')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)
  const monthNumber = calcMonthNumber(plant.created_at, existingUpdatesCount)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!photo) { setError('Please choose a photo.'); return }
    if (!supabase) { setError('Supabase not configured.'); return }

    setLoading(true)
    setError('')

    try {
      const ext  = photo.name.split('.').pop().toLowerCase()
      const path = `updates/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('tggi-photos')
        .upload(path, photo, { cacheControl: '3600', upsert: false })

      if (uploadErr) throw new Error(`Photo upload failed: ${uploadErr.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from('tggi-photos')
        .getPublicUrl(path)

      const { error: insertErr } = await supabase
        .from('tggi_updates')
        .insert({
          registration_id: plant.id,
          photo_url:       publicUrl,
          note:            note.trim() || null,
          month_number:    monthNumber,
        })

      if (insertErr) throw new Error(`Could not save update: ${insertErr.message}`)

      setSuccess(true)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div
        className="mb-10 px-6 py-8 rounded-2xl text-center"
        style={{ backgroundColor: 'rgba(31,61,43,0.06)', border: '1.5px solid rgba(31,61,43,0.12)' }}
      >
        <p className="font-serif font-semibold text-forest" style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}>
          Beautiful. Your {plant.plant_name} is growing. 🌱
        </p>
      </div>
    )
  }

  return (
    <div
      className="mb-10 px-5 sm:px-7 py-7 rounded-2xl"
      style={{ backgroundColor: 'rgba(31,61,43,0.05)', border: '1.5px solid rgba(31,61,43,0.10)' }}
    >
      <p className="font-sans font-bold uppercase tracking-[0.18em] text-terracotta mb-1" style={{ fontSize: '0.65rem' }}>
        Month {monthNumber} Update
      </p>
      <h2
        className="font-serif font-semibold text-forest mb-6"
        style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)' }}
      >
        Add Monthly Update
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {/* Photo upload */}
        <div className="mb-5">
          <label className="block font-sans font-semibold text-forest text-lg mb-2">
            Photo <span className="text-terracotta" aria-hidden="true">*</span>
          </label>
          <label
            className="flex items-center gap-3 cursor-pointer w-full min-h-[52px] px-4 py-3 rounded-xl border-2 border-dashed bg-white transition-colors duration-150"
            style={{ borderColor: photo ? '#1f3d2b' : 'rgba(31,61,43,0.25)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-forest/45 flex-shrink-0" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className={`font-sans text-lg truncate ${photo ? 'text-forest' : 'text-forest/40'}`}>
              {photo ? photo.name : 'Choose a photo…'}
            </span>
            <input type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) setPhoto(f) }} />
          </label>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="block font-sans font-semibold text-forest text-lg mb-2">
            How is your plant doing?
            <span className="font-normal text-forest/45 text-base ml-2">(Optional)</span>
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="Any observations, new leaves, flowers…"
            className="w-full px-4 py-3 rounded-xl border-2 border-forest/20 bg-white font-sans text-forest text-lg leading-relaxed focus:outline-none focus:border-forest transition-colors placeholder:text-forest/30 resize-none"
          />
        </div>

        {error && (
          <p className="font-sans text-terracotta text-base mb-4" role="alert">⚠ {error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[52px] rounded-full bg-terracotta text-white font-sans font-bold text-lg tracking-wide hover:bg-terracotta-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-3 breathe"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sharing…
            </>
          ) : 'Share My Update'}
        </button>
      </form>
    </div>
  )
}

/* ── Main page ── */
export default function PlantProfile() {
  const { id }               = useParams()
  const [searchParams]       = useSearchParams()
  const navigate             = useNavigate()
  const showUpdateForm       = searchParams.get('update') === 'true'
  const isOwner              = showUpdateForm || searchParams.get('mine') === 'true'

  const [plant,      setPlant]      = useState(null)
  const [updates,    setUpdates]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [fetchError, setFetchError] = useState('')

  async function fetchData() {
    if (!supabase) { setFetchError('Supabase not configured.'); setLoading(false); return }

    const [{ data: reg, error: regErr }, { data: upds, error: updsErr }] = await Promise.all([
      supabase
        .from('tggi_registrations')
        .select('id, created_at, full_name, plant_name, category, location, first_photo_url, status')
        .eq('id', id)
        .single(),
      supabase
        .from('tggi_updates')
        .select('id, created_at, photo_url, note, month_number')
        .eq('registration_id', id)
        .order('created_at', { ascending: true }),
    ])

    if (regErr || !reg) {
      setFetchError(regErr?.message ?? 'Plant not found.')
    } else {
      setPlant(reg)
      setUpdates(upds ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [id])

  function handleUpdateSuccess() {
    fetchData()
  }

  const goal = plant ? goalLabel(plant.category) : null

  /* Build timeline entries */
  const timeline = plant ? [
    { key: 'day1', label: 'Day 1 — First Photo', date: plant.created_at, photoUrl: plant.first_photo_url, note: null, isFirst: true },
    ...updates.map((u, i) => ({
      key:      u.id,
      label:    `Month ${u.month_number ?? i + 1}`,
      date:     u.created_at,
      photoUrl: u.photo_url,
      note:     u.note,
      isFirst:  false,
    })),
  ] : []

  return (
    <div className="min-h-screen bg-cream">

      {/* ── Back nav ── */}
      <div className="pt-24 sm:pt-28 px-5 sm:px-8 max-w-3xl mx-auto">
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

      {!loading && !fetchError && plant && (
        <div className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">

          {/* ── Update form (if ?update=true) ── */}
          {showUpdateForm && (
            <div className="mt-8">
              <UpdateForm
                plant={plant}
                existingUpdatesCount={updates.length}
                onSuccess={handleUpdateSuccess}
              />
            </div>
          )}

          {/* ── Plant header ── */}
          <div className="mt-8 mb-10">
            {/* Hero photo */}
            {plant.first_photo_url && (
              <img
                src={plant.first_photo_url}
                alt={plant.plant_name}
                className="w-full rounded-2xl object-cover mb-7"
                style={{ maxHeight: 400, display: 'block' }}
                loading="eager"
              />
            )}

            {/* Category badge */}
            <span
              className="inline-block font-sans text-sm font-bold uppercase tracking-wider text-white rounded-full px-4 py-1.5 mb-4"
              style={{ backgroundColor: '#c4623d' }}
            >
              {plant.category}
            </span>

            {/* Plant name */}
            <h1
              className="font-serif font-semibold text-forest leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)' }}
            >
              {plant.plant_name}
            </h1>

            {/* Meta */}
            <div className="flex flex-col gap-1.5">
              <p className="font-sans text-forest/65 text-base">
                Registered by <strong className="text-forest font-semibold">{plant.full_name}</strong>
              </p>
              {plant.location && (
                <p className="font-sans text-forest/50 text-base flex items-center gap-1.5">
                  <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                    <path d="M6 1C3.79 1 2 2.79 2 5c0 3 4 8 4 8s4-5 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.3" fill="none" />
                    <circle cx="6" cy="5" r="1.2" fill="currentColor" />
                  </svg>
                  {plant.location}
                </p>
              )}
              <p className="font-sans text-forest/45 text-sm">
                Since {formatDate(plant.created_at)}
              </p>
            </div>
          </div>

          {/* ── Recognition goal ── */}
          {goal && (
            <div
              className="mb-10 px-5 py-4 rounded-xl flex items-start gap-3"
              style={{ backgroundColor: 'rgba(201,169,110,0.12)', border: '1.5px solid rgba(201,169,110,0.3)' }}
            >
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
                <path d="M10 2 C16 6 18 16 12 21 C8 24 2 22 1 16 C-1 10 4 3 10 2 Z" fill="rgba(201,169,110,0.5)" />
                <line x1="10" y1="2" x2="10" y2="23" stroke="rgba(201,169,110,0.8)" strokeWidth="1" />
              </svg>
              <p className="font-sans text-forest/75 text-base leading-relaxed">
                {goal}
              </p>
            </div>
          )}

          {/* ── Growth Timeline ── */}
          <div className="mb-10">
            <h2
              className="font-serif font-semibold text-forest leading-snug mb-8"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 2.5rem)' }}
            >
              Growth Journey
            </h2>

            {timeline.length > 0 ? (
              <div>
                {timeline.map((entry, i) => (
                  <TimelineEntry
                    key={entry.key}
                    label={entry.label}
                    date={entry.date}
                    photoUrl={entry.photoUrl}
                    note={entry.note}
                    isFirst={entry.isFirst}
                    delay={Math.min(i, 3) * 80}
                  />
                ))}
              </div>
            ) : (
              <p className="font-sans text-forest/45 text-lg">No photos yet.</p>
            )}
          </div>

          {/* ── Add Monthly Update button (owner view, form not open) ── */}
          {isOwner && !showUpdateForm && (
            <button
              onClick={() => navigate(`/plant/${plant.id}?update=true`)}
              className="w-full min-h-[56px] rounded-full bg-terracotta text-white font-sans font-bold text-xl tracking-wide hover:bg-terracotta-dark transition-colors duration-200 breathe"
            >
              Add Monthly Update
            </button>
          )}

        </div>
      )}

    </div>
  )
}
