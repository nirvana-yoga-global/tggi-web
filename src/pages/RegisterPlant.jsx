import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const CATEGORIES = [
  'Tree',
  'Medicinal Plant',
  'Flowering Plant',
  'Vegetable / Kitchen Garden Plant',
  'Indoor / Ornamental Plant',
  'Herb',
]

function Field({ label, hint, error, required, children }) {
  return (
    <div className="mb-7">
      <label className="block font-sans font-semibold text-forest text-lg mb-1.5 leading-snug">
        {label}
        {required && <span className="text-terracotta ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="font-sans text-forest/55 text-base mb-2 leading-snug">{hint}</p>}
      {children}
      {error && (
        <p role="alert" className="font-sans text-terracotta text-base mt-2 flex items-start gap-1.5">
          <span aria-hidden="true" className="mt-0.5">⚠</span>
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full min-h-[52px] px-4 py-3 rounded-xl border-2 border-forest/20 bg-white ' +
  'font-sans text-forest text-lg leading-snug ' +
  'focus:outline-none focus:border-forest transition-colors duration-150 ' +
  'placeholder:text-forest/30'

const inputErrorClass =
  'w-full min-h-[52px] px-4 py-3 rounded-xl border-2 border-terracotta bg-white ' +
  'font-sans text-forest text-lg leading-snug ' +
  'focus:outline-none focus:border-terracotta transition-colors duration-150 ' +
  'placeholder:text-forest/30'

const inputReadonlyClass =
  'w-full min-h-[52px] px-4 py-3 rounded-xl border-2 border-forest/10 bg-forest/5 ' +
  'font-sans text-forest/60 text-lg leading-snug focus:outline-none select-none'

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function SuccessScreen({ fullName, plantName, nygId }) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-4">
      <div className="mb-8" aria-hidden="true">
        <svg width="110" height="140" viewBox="0 0 110 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M55 6 C88 20 100 72 78 106 C63 130 12 126 5 92 C-4 54 22 14 55 6 Z"
            stroke="#1f3d2b" strokeWidth="2.5" fill="none" pathLength="1" strokeDasharray="1"
            style={{ strokeDashoffset: 1, animation: 'leaf-outline-draw 2s cubic-bezier(0.4,0,0.2,1) 0.1s forwards' }}
          />
          <line
            x1="55" y1="6" x2="55" y2="126"
            stroke="#1f3d2b" strokeWidth="1.4" pathLength="1" strokeDasharray="1"
            style={{ strokeDashoffset: 1, animation: 'leaf-outline-draw 1.4s cubic-bezier(0.4,0,0.2,1) 1s forwards' }}
          />
          {[['55,40','32,58'],['55,40','78,58'],['55,65','28,80'],['55,65','82,80'],['55,90','36,104'],['55,90','74,104']].map(([from, to], i) => {
            const [x1, y1] = from.split(',')
            const [x2, y2] = to.split(',')
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#1f3d2b" strokeWidth="0.9" strokeOpacity="0"
                style={{ animation: `leaf-vein-fade 0.6s ease-out ${1.6 + i * 0.08}s forwards` }}
              />
            )
          })}
        </svg>
      </div>

      <h2 className="font-serif font-semibold text-forest leading-[1.1] mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)' }}>
        Your plant is now part of the movement.
      </h2>

      {nygId && (
        <p className="font-sans text-forest/60 text-base mb-4">
          NYG ID: <strong className="text-forest font-semibold font-mono">{nygId}</strong>
        </p>
      )}

      <p className="font-sans text-forest/75 leading-relaxed max-w-md mb-10" style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>
        Thank you, <strong className="text-forest font-semibold">{fullName}</strong>.
        Your <em>{plantName}</em> has been registered. We'll be cheering for every leaf.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          to="/my-garden"
          className="
            inline-flex items-center gap-2 px-9 py-4 rounded-full
            bg-terracotta text-white
            font-sans font-bold text-lg tracking-wide
            hover:bg-terracotta-dark
            transition-colors duration-200 min-h-[52px]
          "
        >
          View My Garden →
        </Link>
        <Link
          to="/gallery"
          className="
            inline-flex items-center gap-2 px-9 py-4 rounded-full
            border-2 border-forest text-forest
            font-sans font-semibold text-lg tracking-wide
            hover:bg-forest hover:text-cream
            transition-colors duration-200 min-h-[52px]
          "
        >
          View Community Gallery →
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPlant() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()

  const [form, setForm] = useState({
    full_name:   '',
    phone:       '',
    plant_name:  '',
    category:    '',
    city:        '',
    state:       '',
    country:     'India',
    first_photo: null,
    commitment:  false,
  })
  const [errors,      setErrors]      = useState({})
  const [loading,     setLoading]     = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success,     setSuccess]     = useState(false)
  const [nygId,       setNygId]       = useState('')

  useEffect(() => {
    if (profile) {
      setForm(f => ({
        ...f,
        full_name: profile.full_name ?? f.full_name,
      }))
      setNygId(profile.nyg_id ?? '')
    }
  }, [profile])

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.full_name.trim())  e.full_name  = 'Full name is required.'
    if (!form.phone.trim())      e.phone      = 'Phone number is required.'
    if (!form.plant_name.trim()) e.plant_name = 'Please give your plant a name.'
    if (!form.category)          e.category   = 'Please select a plant category.'
    if (!form.first_photo)       e.first_photo = 'Please upload a photo of your plant.'
    if (!form.commitment)        e.commitment  = 'Please confirm your commitment to proceed.'
    return e
  }

  async function handleSubmit(evt) {
    evt.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      setTimeout(() => {
        document.querySelector('[data-has-error="true"]')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    if (!supabase) {
      setSubmitError('Supabase is not configured.')
      return
    }

    setLoading(true)
    setSubmitError('')

    try {
      const usedNygId = nygId || profile?.nyg_id

      /* Upload photo */
      const file = form.first_photo
      const ext  = file.name.split('.').pop().toLowerCase()
      const path = `first-photos/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('tggi-photos')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadErr) throw new Error(`Photo upload failed: ${uploadErr.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from('tggi-photos')
        .getPublicUrl(path)

      /* Insert registration */
      const { error: insertErr } = await supabase
        .from('tggi_registrations')
        .insert({
          full_name:       form.full_name.trim(),
          phone:           form.phone.trim(),
          email:           user.email,
          email_verified:  true,
          plant_name:      form.plant_name.trim(),
          category:        form.category,
          location:        [form.city, form.state, form.country].map(s => s.trim()).filter(Boolean).join(', ') || null,
          first_photo_url: publicUrl,
          nyg_id:          usedNygId,
          is_flagged:      false,
        })

      if (insertErr) throw new Error(`Registration failed: ${insertErr.message}`)

      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream pt-20">
        <div className="max-w-xl mx-auto px-6 py-16 sm:py-20">
          <SuccessScreen
            fullName={form.full_name.trim()}
            plantName={form.plant_name.trim()}
            nygId={nygId || profile?.nyg_id}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-xl mx-auto px-6 py-12 sm:py-16">

        <div className="mb-10 sm:mb-12">
          <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-3">
            One Soul. One Tree.
          </p>
          <h1
            className="font-serif font-semibold text-forest leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 3.5rem)' }}
          >
            Register Your Plant
          </h1>
          <p className="font-sans text-forest/70 text-lg leading-relaxed">
            Plant something, photograph it, and share your journey with the world.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Email — readonly, from auth */}
          <Field label="Email Address" hint="Your verified account email.">
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              className={inputReadonlyClass}
            />
          </Field>

          {/* Full Name */}
          <Field label="Full Name" required error={errors.full_name}>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setField('full_name', e.target.value)}
              className={errors.full_name ? inputErrorClass : inputClass}
              autoComplete="name"
              data-has-error={!!errors.full_name}
            />
          </Field>

          {/* Phone */}
          <Field
            label="Phone Number"
            hint="Kept private — used to link your plants."
            required
            error={errors.phone}
          >
            <input
              type="tel"
              value={form.phone}
              onChange={e => setField('phone', e.target.value)}
              className={errors.phone ? inputErrorClass : inputClass}
              autoComplete="tel"
              data-has-error={!!errors.phone}
            />
          </Field>

          {/* Plant Nickname */}
          <Field label="What will you call your plant?" required error={errors.plant_name}>
            <input
              type="text"
              value={form.plant_name}
              onChange={e => setField('plant_name', e.target.value)}
              className={errors.plant_name ? inputErrorClass : inputClass}
              placeholder="e.g. Tulsi, Little Mango, Grandma's Basil"
              data-has-error={!!errors.plant_name}
            />
          </Field>

          {/* Category */}
          <Field label="Plant Category" required error={errors.category}>
            <div className="relative">
              <select
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                className={`${errors.category ? inputErrorClass : inputClass} appearance-none pr-10`}
                data-has-error={!!errors.category}
              >
                <option value="" disabled>Select a category…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-forest/50">
                  <path d="M4 6 L8 10 L12 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Field>

          {/* Location — three fields combined into location column on save */}
          <div className="mb-7">
            <p className="font-sans font-semibold text-forest text-lg mb-1.5 leading-snug">
              Location
            </p>
            <p className="font-sans text-forest/55 text-base mb-3 leading-snug">
              Optional — shown publicly on your plant's profile.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={form.city}
                onChange={e => setField('city', e.target.value)}
                placeholder="City"
                className={inputClass}
                autoComplete="address-level2"
              />
              <input
                type="text"
                value={form.state}
                onChange={e => setField('state', e.target.value)}
                placeholder="State"
                className={inputClass}
                autoComplete="address-level1"
              />
              <input
                type="text"
                value={form.country}
                onChange={e => setField('country', e.target.value)}
                placeholder="Country"
                className={inputClass}
                autoComplete="country-name"
              />
            </div>
          </div>

          {/* First Photo */}
          <Field label="Upload your first photo of the plant" required error={errors.first_photo}>
            <label
              className={`
                flex items-center gap-3 cursor-pointer
                w-full min-h-[56px] px-4 py-3
                rounded-xl border-2 border-dashed
                bg-white transition-colors duration-150
                ${errors.first_photo ? 'border-terracotta' : 'border-forest/25 hover:border-forest/55'}
              `}
              data-has-error={!!errors.first_photo}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                className="text-forest/45 flex-shrink-0" aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span className={`font-sans text-lg truncate ${form.first_photo ? 'text-forest' : 'text-forest/40'}`}>
                {form.first_photo ? form.first_photo.name : 'Choose a photo…'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={e => { const f = e.target.files?.[0]; if (f) setField('first_photo', f) }}
              />
            </label>
            {form.first_photo && (
              <p className="font-sans text-forest/50 text-sm mt-1.5">
                {(form.first_photo.size / 1024 / 1024).toFixed(1)} MB
              </p>
            )}
          </Field>

          {/* Commitment */}
          <div className="mb-9">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.commitment}
              onClick={() => setField('commitment', !form.commitment)}
              className="flex items-start gap-3 text-left w-full group"
            >
              <div
                className={`
                  mt-0.5 flex-shrink-0 w-6 h-6 rounded-md border-2
                  flex items-center justify-center transition-colors duration-150
                  ${form.commitment
                    ? 'bg-forest border-forest'
                    : errors.commitment
                      ? 'border-terracotta bg-white'
                      : 'border-forest/35 bg-white group-hover:border-forest/65'}
                `}
                aria-hidden="true"
              >
                {form.commitment && (
                  <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
                    <path d="M1.5 5.5 L5 9 L12.5 1.5" stroke="#faf7f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="font-sans text-forest text-lg leading-relaxed">
                I commit to nurturing this plant and sharing monthly photo updates
                <span className="text-terracotta ml-1" aria-hidden="true">*</span>
              </span>
            </button>
            {errors.commitment && (
              <p role="alert" className="font-sans text-terracotta text-base mt-2 ml-9 flex items-start gap-1.5">
                <span aria-hidden="true">⚠</span>
                {errors.commitment}
              </p>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div
              role="alert"
              className="mb-6 px-5 py-4 rounded-xl border"
              style={{ backgroundColor: 'rgba(196,98,61,0.07)', borderColor: 'rgba(196,98,61,0.3)' }}
            >
              <p className="font-sans text-terracotta text-base leading-relaxed">⚠ {submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full min-h-[56px] px-8 py-4 rounded-full
              bg-terracotta text-white
              font-sans font-bold tracking-wide text-lg
              hover:bg-terracotta-dark
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center justify-center gap-3
            "
          >
            {loading ? <><Spinner /> Registering your plant…</> : 'Register My Plant'}
          </button>

          <p className="font-sans text-forest/45 text-sm text-center mt-5 leading-relaxed">
            Fields marked <span className="text-terracotta">*</span> are required.
          </p>
        </form>
      </div>
    </div>
  )
}
