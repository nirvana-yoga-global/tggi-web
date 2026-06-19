import { useEffect, useRef, useState } from 'react'

/*
 * Leaves use position:fixed so they float in the viewport for the full hero
 * scroll instead of scrolling off the top (the absolute-position problem).
 * IntersectionObserver fades them out once the hero section leaves view.
 *
 * Three nested divs per leaf:
 *   1. Outer  — fixed position + scroll-driven translateY
 *   2. Middle — static base rotation (kept separate so it doesn't fight the animation)
 *   3. Inner  — CSS sway animation (rotate ±5°, stem-pivot transform-origin)
 */
const LEAVES = [
  {
    id: 1,
    viewBox: '0 0 52 80',
    path: 'M26 1 C46 12 52 42 36 66 C28 78 6 76 2 58 C-4 38 8 10 26 1 Z',
    width: 115,
    pos: { top: '8%', left: '5%' },
    baseRotate: -20,
    speed: 0.22,
    opacity: 0.42,
    fill: '#c8e6cc',        // sage green — clearly visible on dark bg
    swayDuration: 6,
    swayDelay: 0,
  },
  {
    id: 2,
    viewBox: '0 0 48 72',
    path: 'M24 0 C44 10 50 38 32 62 C22 76 2 70 0 52 C-2 30 8 8 24 0 Z',
    width: 88,
    pos: { top: '24%', right: '6%' },
    baseRotate: 32,
    speed: 0.35,
    opacity: 0.36,
    fill: '#f0ece2',        // warm cream
    swayDuration: 8,
    swayDelay: -2.5,
  },
  {
    id: 3,
    viewBox: '0 0 44 68',
    path: 'M22 0 C40 8 46 36 30 58 C20 70 0 64 0 46 C0 24 8 6 22 0 Z',
    width: 72,
    pos: { top: '44%', left: '3%' },
    baseRotate: 10,
    speed: 0.12,
    opacity: 0.38,
    fill: '#b2d8b8',        // slightly richer sage
    swayDuration: 7,
    swayDelay: -1.5,
  },
]

export default function Hero() {
  const heroRef  = useRef(null)
  const [scrollY,    setScrollY]    = useState(0)
  const [isMobile,   setIsMobile]   = useState(true)
  const [heroInView, setHeroInView] = useState(true)

  /* desktop/mobile breakpoint */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  /* hide leaves when hero exits viewport */
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* scroll → translateY for parallax drift */
  useEffect(() => {
    if (isMobile) return
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      aria-label="Hero — One Soul. One Tree."
    >
      {/* ── Background image ── */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80')",
        }}
        aria-hidden="true"
      />

      {/* ── Gradient overlay (bottom-to-top dark) ── */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to top, rgba(10,24,15,0.93) 0%, rgba(10,24,15,0.60) 40%, rgba(10,24,15,0.12) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Parallax leaves (desktop only, fixed-position so they persist through scroll) ── */}
      {!isMobile && LEAVES.map((leaf) => (
        <div
          key={leaf.id}
          aria-hidden="true"
          style={{
            position: 'fixed',
            ...leaf.pos,
            /* scroll drift — faster leaves appear closer to camera */
            transform: `translateY(${scrollY * leaf.speed}px) rotate(${leaf.baseRotate}deg)`,
            /* fade out when hero leaves viewport */
            opacity: heroInView ? leaf.opacity : 0,
            transition: 'opacity 1.2s ease',
            zIndex: 15,
            pointerEvents: 'none',
            willChange: 'transform',
          }}
        >
          {/* inner wrapper carries the sway animation independently of the scroll transform */}
          <div
            style={{
              animation: `leaf-sway ${leaf.swayDuration}s ease-in-out ${leaf.swayDelay}s infinite`,
              transformOrigin: '50% 85%',  /* pivot near stem for natural sway */
            }}
          >
            <svg
              width={leaf.width}
              viewBox={leaf.viewBox}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={leaf.path} fill={leaf.fill} />
            </svg>
          </div>
        </div>
      ))}

      {/* ── Push content to lower portion ── */}
      <div className="flex-1" aria-hidden="true" />

      {/* ── Main content ── */}
      <div className="relative z-30 flex flex-col items-center px-6 pb-10 sm:pb-14 text-center">

        <h1
          className="font-serif font-semibold leading-[1.05] text-cream mb-5"
          style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)' }}
        >
          One Soul. One Tree.
        </h1>

        <p
          className="font-sans text-cream/90 leading-relaxed max-w-sm sm:max-w-xl md:max-w-2xl mb-9"
          style={{ fontSize: 'clamp(1rem, 2.2vw, 1.25rem)' }}
        >
          A movement to reconnect humanity with nature — one sapling, one soul,
          one act of care at a time.
        </p>

        {/* Buttons — stacked on mobile, row on sm+ */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full max-w-xs sm:max-w-none">
          <a
            href="#story"
            className="
              flex items-center justify-center w-full sm:w-auto
              min-h-[52px] px-9 py-3 rounded-full
              border-2 border-cream/65 text-cream
              font-sans font-semibold tracking-wide text-base sm:text-lg
              hover:bg-cream/10 active:bg-cream/20
              transition-colors duration-200
            "
          >
            Our Story
          </a>
          <a
            href="/register"
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
          </a>
        </div>

        {/* Stat circle */}
        <div
          className="
            flex flex-col items-center justify-center
            w-40 h-40 sm:w-44 sm:h-44 rounded-full
            bg-forest border-2 border-cream/20 shadow-xl
          "
          aria-label="200,000 plus saplings distributed"
        >
          <span
            className="font-serif font-semibold text-cream leading-none"
            style={{ fontSize: 'clamp(1.6rem, 5vw, 2.2rem)' }}
          >
            200,000+
          </span>
          <span className="font-sans text-xs sm:text-sm text-cream/75 mt-1.5 px-4 leading-snug">
            Saplings Distributed
          </span>
        </div>

      </div>
    </section>
  )
}
