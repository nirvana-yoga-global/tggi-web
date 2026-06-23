import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ClosingCTA() {
  const headingRef = useScrollReveal()
  const bodyRef    = useScrollReveal()
  const ctaRef     = useScrollReveal()

  return (
    <section
      className="relative py-24 sm:py-32 lg:py-40 overflow-hidden"
      style={{ backgroundColor: '#1f3d2b' }}
    >
      {/* ── Watermark leaf ── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ right: '-6%', bottom: '-4%', zIndex: 1 }}
        aria-hidden="true"
      >
        <svg width="480" viewBox="0 0 280 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M140 10 C215 40 245 145 205 230 C175 295 85 315 40 265 C-15 205 12 82 140 10 Z"
            fill="#2d5a3d"
            opacity="0.5"
          />
          <line x1="140" y1="10" x2="140" y2="310" stroke="#2d5a3d" strokeWidth="1.5" opacity="0.35" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* ── Gold accent ── */}
        <p className="text-3xl mb-8" style={{ color: '#c9a96e' }} aria-hidden="true">✦</p>

        {/* ── Heading ── */}
        <div ref={headingRef} className="reveal mb-8">
          <h2
            className="font-serif font-semibold text-cream leading-[1.1]"
            style={{ fontSize: 'clamp(1.9rem, 5vw, 3.5rem)' }}
          >
            Let Us Teach Our Children to Reconnect with the Earth
          </h2>
        </div>

        {/* ── Body text ── */}
        <div
          ref={bodyRef}
          className="reveal mb-12 sm:mb-14"
          style={{ transitionDelay: '0.2s' }}
        >
          <p
            className="font-sans leading-[1.85] mx-auto"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(250,247,240,0.80)' }}
          >
            Our children are growing up surrounded by screens, yet quietly disconnected
            from the living world around them — from soil, from seasons, from the patient
            miracle of something growing. This is an invitation to bring them back — to
            nature, to responsibility, to compassion. It begins with a single plant, and
            a single soul willing to care for it.
          </p>
        </div>

        {/* ── Breathing glow CTA button ── */}
        <div
          ref={ctaRef}
          className="reveal"
          style={{ transitionDelay: '0.4s' }}
        >
          <Link
            to="/register"
            className="
              breathe
              inline-flex items-center justify-center
              min-h-[56px] px-10 py-4
              rounded-full
              bg-terracotta text-white
              font-sans font-bold tracking-wide
              text-lg
              hover:bg-terracotta-dark
              transition-colors duration-200
            "
          >
            Register Your Plant
          </Link>
        </div>

      </div>
    </section>
  )
}
