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

export default function Login() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm]             = useState({ email: '', password: '' })
  const [errors, setErrors]         = useState({})
  const [loading, setLoading]       = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (user) navigate('/my-garden', { replace: true })
  }, [user, navigate])

  function setField(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
    if (submitError) setSubmitError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required.'
    if (!form.password)     errs.password = 'Password is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (!supabase) { setSubmitError('Supabase is not configured.'); return }

    setLoading(true)
    setSubmitError('')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    })

    if (error) {
      const msg = error.message.toLowerCase()
      setSubmitError(
        msg.includes('invalid') || msg.includes('credentials')
          ? 'Incorrect email or password. Please try again.'
          : error.message
      )
      setLoading(false)
      return
    }

    navigate('/my-garden', { replace: true })
  }

  return (
    <div className="min-h-screen bg-cream pt-20">
      <div className="max-w-md mx-auto px-6 py-14 sm:py-20">

        <div className="mb-10">
          <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-3">
            Welcome Back
          </p>
          <h1
            className="font-serif font-semibold text-forest leading-[1.05] mb-4"
            style={{ fontSize: 'clamp(2.2rem, 7vw, 3.2rem)' }}
          >
            Sign In
          </h1>
          <p className="font-sans text-forest/70 text-lg leading-relaxed">
            Access your garden and continue your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

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
              autoFocus
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
              autoComplete="current-password"
            />
            {errors.password && (
              <p role="alert" className="font-sans text-terracotta text-base mt-2">⚠ {errors.password}</p>
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
              bg-forest text-cream
              font-sans font-bold tracking-wide text-lg
              hover:bg-forest-dark
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors duration-200
              flex items-center justify-center gap-3
            "
          >
            {loading ? <><Spinner /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="font-sans text-forest/60 text-base text-center mt-8">
          New to TGGI?{' '}
          <Link
            to="/register"
            className="text-forest font-semibold underline underline-offset-2 hover:text-terracotta transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
