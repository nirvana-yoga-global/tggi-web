import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero — One Soul. One Tree."
      style={{ backgroundColor: '#1f3d2b' }}
    >
      {/* ── Background forest photo ── */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')",
        }}
        aria-hidden="true"
      />

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(10,24,15,0.93) 0%, rgba(10,24,15,0.60) 40%, rgba(10,24,15,0.12) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-20 flex flex-col items-center px-6 pt-24 pb-16 sm:pb-20 text-center">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 sm:w-12 h-px" style={{ backgroundColor: '#c9a96e' }} aria-hidden="true" />
          <p
            className="font-sans font-semibold uppercase tracking-[0.22em] leading-none"
            style={{ color: '#c9a96e', fontSize: '0.65rem' }}
          >
            Thapovanam Grow Green Initiative
          </p>
          <div className="w-8 sm:w-12 h-px" style={{ backgroundColor: '#c9a96e' }} aria-hidden="true" />
        </div>

        {/* Headline */}
        <h1
          className="font-serif font-semibold leading-[1.0] text-cream mb-7"
          style={{ fontSize: 'clamp(4.5rem, 13vw, 9.5rem)' }}
        >
          One Soul.<br />One Tree.
        </h1>

        {/* Subheadline */}
        <p
          className="font-sans text-cream/80 leading-relaxed max-w-sm sm:max-w-xl mb-10"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)' }}
        >
          A movement to reconnect humanity with nature — one sapling, one soul,
          one act of care at a time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full max-w-xs sm:max-w-none">
          <a
            href="#story"
            onClick={e => { if (window.location.pathname !== '/') { e.preventDefault(); window.location.href='/#story'; } }}
            className="
              flex items-center justify-center w-full sm:w-auto
              min-h-[52px] px-9 py-3 rounded-full
              border-2 border-cream/55 text-cream
              font-sans font-semibold tracking-wide text-base sm:text-lg
              hover:bg-cream/10 active:bg-cream/20
              transition-colors duration-200
            "
          >
            Our Story
          </a>
          <Link
            to="/register"
            className="
              flex items-center justify-center w-full sm:w-auto
              min-h-[52px] px-9 py-3 rounded-full
              bg-terracotta text-white
              font-sans font-bold tracking-wide text-base sm:text-lg
              hover:bg-terracotta-dark active:bg-terracotta-dark
              shadow-lg transition-colors duration-200
            "
          >
            Register Your Plant
          </Link>
        </div>

        {/* Stat circle — thin gold border ring, no fill */}
        <div
          className="flex flex-col items-center justify-center w-40 h-40 sm:w-44 sm:h-44 rounded-full"
          style={{ border: '1.5px solid #c9a96e' }}
          aria-label="200,000 plus saplings distributed"
        >
          <span
            className="font-serif font-semibold text-cream leading-none"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}
          >
            200,000+
          </span>
          <span className="font-sans text-xs sm:text-sm text-cream/70 mt-1.5 px-4 leading-snug">
            Saplings Distributed
          </span>
        </div>

      </div>
    </section>
  )
}
