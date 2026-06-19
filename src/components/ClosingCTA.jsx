import { useScrollReveal } from '../hooks/useScrollReveal'

export default function ClosingCTA() {
  const headingRef = useScrollReveal()
  const bodyRef    = useScrollReveal()
  const ctaRef     = useScrollReveal()

  return (
    <section className="bg-cream py-24 sm:py-32 lg:py-40">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* ── Heading ── */}
        <div ref={headingRef} className="reveal mb-8">
          <h2
            className="font-serif font-semibold text-forest leading-[1.1]"
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
            className="font-sans text-forest/75 leading-[1.85] mx-auto"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
          >
            Today's children grow up surrounded by screens — connected to everything
            except the living world beneath their feet. They can swipe, stream, and
            scroll, yet many have never felt the quiet joy of pressing a seed into
            soil and watching it rise toward the light.
          </p>

          <p
            className="font-sans text-forest/75 leading-[1.85] mx-auto mt-6"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}
          >
            TGGI is an invitation — to bring our children back to nature, to
            responsibility, and to compassion. One small plant, tended with care,
            teaches patience, humility, and wonder in ways no classroom can.
            The Earth is waiting. So is the child within each of us.
          </p>
        </div>

        {/* ── Breathing glow CTA button ── */}
        <div
          ref={ctaRef}
          className="reveal"
          style={{ transitionDelay: '0.4s' }}
        >
          <a
            href="/register"
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
          </a>
        </div>

      </div>
    </section>
  )
}
