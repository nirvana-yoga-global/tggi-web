import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

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

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [errors, setErrors]           = useState({})
  const [loading, setLoading]         = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmSent, setConfirmSent] = useState(false)
  const [sentEmail, setSentEmail]     = useState('')

  useEffect(() => {
    if (user) navigate('/my-garden', { replace: true })
  }, [user, navigate])

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
    if (submitError) setSubmitError('')
  }

  function validate() {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required.'
    if (!form.email.trim()) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.password) e.password = 'Password is required.'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters.'
    if (!form.confirm_password) e.confirm_password = 'Please confirm your password.'
    else if (form.password !== form.confirm_password) e.confirm_password = 'Passwords do not match.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (!supabase) { setSubmitError('Supabase is not configured.'); return }

    setLoading(true)
    setSubmitError('')

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { full_name: form.full_name.trim() } },
    })

    if (error) {
      const msg = error.message.toLowerCase()
      if (msg.includes('already registered') || msg.includes('user already')) {
        setErrors(e => ({ ...e, email: 'This email is already registered. Please sign in instead.' }))
      } else {
        setSubmitError(error.message)
      }
      setLoading(false)
      return
    }

    if (!data.session) {
      setSentEmail(form.email.trim())
      setConfirmSent(true)
      setLoading(false)
      return
    }

    // Email confirmation disabled — profile created by AuthContext on auth state change
    navigate('/my-garden', { replace: true })
  }

  if (confirmSent) {
    return (
      <div className="min-h-screen bg-cream pt-20">
        <div className="max-w-md mx-auto px-6 py-14 sm:py-20 text-center">
          <div className="mb-8" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto">
              <circle cx="32" cy="32" r="30" stroke="#1f3d2b" strokeWidth="2.5" />
              <path d="M20 32 L28 40 L44 24" stroke="#1f3d2b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2
            className="font-serif font-semibold text-forest mb-4"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)' }}
          >
            Check your inbox
          </h2>
          <p className="font-sans text-forest/70 text-lg leading-relaxed mb-8">
            We've sent a confirmation link to{' '}
            <strong className="text-forest">{sentEmail}</strong>.
            Click the link to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="
              inline-flex items-center justify-center min-h-[52px]
              px-9 rounded-full
              bg-forest text-cream
              font-sans font-bold text-lg
              hover:bg-forest-dark transition-colors duration-150
            "
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-md mx-auto px-6 py-12 sm:py-16">

        <div className="mb-10">
          <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-3">
            One Soul. One Tree.
          </p>
          <h1
            className="font-serif font-semibold text-forest leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 3.2rem)' }}
          >
            Create Your Account
          </h1>
          <p className="font-sans text-forest/70 text-lg leading-relaxed">
            Join the movement — plant something, photograph it, and share your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          <div>
            <label className="block font-sans font-semibold text-forest text-lg mb-1.5">
              Full Name <span className="text-terracotta" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => setField('full_name', e.target.value)}
              className={errors.full_name ? inputErrorClass : inputClass}
              autoComplete="name"
              autoFocus
            />
            {errors.full_name && (
              <p role="alert" className="font-sans text-terracotta text-base mt-2">⚠ {errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block font-sans font-semibold text-forest text-lg mb-1.5">
              Email Address <span className="text-terracotta" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setField('email', e.target.value)}
              className={errors.email ? inputErrorClass : inputClass}
              autoComplete="email"
            />
            {errors.email && (
              <p role="alert" className="font-sans text-terracotta text-base mt-2">⚠ {errors.email}</p>
            )}
          </div>

          <div>
            <label className="block font-sans font-semibold text-forest text-lg mb-1.5">
              Password <span className="text-terracotta" aria-hidden="true">*</span>
            </label>
            <input
              type="password"
              value={form.password}
              onChange={e => setField('password', e.target.value)}
              className={errors.password ? inputErrorClass : inputClass}
              autoComplete="new-password"
            />
            {errors.password
              ? <p role="alert" className="font-sans text-terracotta text-base mt-2">⚠ {errors.password}</p>
              : <p className="font-sans text-forest/45 text-sm mt-1.5">Minimum 8 characters.</p>
            }
          </div>

          <div>
            <label className="block font-sans font-semibold text-forest text-lg mb-1.5">
              Confirm Password <span className="text-terracotta" aria-hidden="true">*</span>
            </label>
            <input
              type="password"
              value={form.confirm_password}
              onChange={e => setField('confirm_password', e.target.value)}
              className={errors.confirm_password ? inputErrorClass : inputClass}
              autoComplete="new-password"
            />
            {errors.confirm_password && (
              <p role="alert" className="font-sans text-terracotta text-base mt-2">⚠ {errors.confirm_password}</p>
            )}
          </div>

          {submitError && (
            <div
              role="alert"
              className="px-5 py-4 rounded-xl border"
              style={{ backgroundColor: 'rgba(196,98,61,0.07)', borderColor: 'rgba(196,98,61,0.3)' }}
            >
              <p className="font-sans text-terracotta text-base">⚠ {submitError}</p>
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
            {loading ? <><Spinner /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="font-sans text-forest/60 text-base text-center mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-forest font-semibold underline underline-offset-2 hover:text-terracotta transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
