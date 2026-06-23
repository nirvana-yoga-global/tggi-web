import { useScrollReveal } from '../hooks/useScrollReveal'

const NAV_LINKS = [
  { label: 'Home',              href: '/'         },
  { label: 'Register',          href: '/register'  },
  { label: 'Community Gallery', href: '/gallery'   },
]

const HASHTAGS = ['#OneSoulOneTree', '#GrowGreenMovement', '#TGGI2026']

export default function Footer() {
  const ref = useScrollReveal()

  return (
    <footer className="bg-forest text-cream">
      <div
        ref={ref}
        className="reveal max-w-5xl mx-auto px-6 py-16 sm:py-20
          flex flex-col items-center text-center gap-10"
      >

        {/* ── Tagline — large gold italic serif centrepiece ── */}
        <div>
          <p
            className="font-serif italic font-semibold leading-tight"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
              color: '#c9a96e',
            }}
          >
            One Earth. One Future.
          </p>
          <div className="w-10 h-px mx-auto mt-6" style={{ backgroundColor: '#c9a96e' }} aria-hidden="true" />
        </div>

        {/* ── Nav links ── */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 list-none p-0 m-0">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="
                    font-sans text-lg font-semibold text-cream/85
                    hover:text-cream underline-offset-4 hover:underline
                    transition-colors duration-200
                    min-h-[44px] flex items-center
                  "
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Hashtags ── */}
        <div className="flex flex-wrap justify-center gap-3">
          {HASHTAGS.map((tag) => (
            <span
              key={tag}
              className="
                font-sans text-sm font-semibold text-cream/60
                px-4 py-2 rounded-full
                border border-cream/15
              "
            >
              {tag}
            </span>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-cream/10" aria-hidden="true" />

        {/* ── Powered by ── */}
        <p className="font-sans text-cream/45 text-sm tracking-wide">
          Powered by{' '}
          <a
            href="https://nirvanayogaglobal.com"
            className="text-cream/60 hover:text-cream underline-offset-4 hover:underline transition-colors duration-200"
          >
            Nirvana Yoga Global
          </a>
        </p>

      </div>
    </footer>
  )
}
