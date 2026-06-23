import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 sm:px-10"
      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.10) 80%, transparent 100%)' }}
      aria-label="Site navigation"
    >
      {/* Logo + wordmark */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/tggi logo 1.png"
          alt="TGGI leaf logo"
          style={{ height: 40, width: 'auto' }}
        />
        <span
          className="font-serif font-semibold"
          style={{ color: '#c9a96e', fontSize: '1.4rem', lineHeight: 1 }}
        >
          TGGI
        </span>
      </Link>

      {/* CTAs */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* My Garden — text-only on mobile, outlined pill on desktop */}
        <Link
          to="/my-garden"
          className="
            flex items-center justify-center min-h-[44px]
            font-sans font-semibold tracking-wide
            transition-colors duration-200
            text-cream/85 hover:text-cream text-sm
            sm:px-5 sm:py-2.5 sm:rounded-full sm:border-2 sm:border-cream/45
            sm:hover:border-cream sm:text-sm sm:bg-transparent
          "
        >
          My Garden
        </Link>

        {/* Register */}
        <Link
          to="/register"
          className="
            flex items-center justify-center
            px-5 py-2.5 rounded-full
            bg-terracotta text-white
            font-sans font-bold tracking-wide
            text-sm sm:text-base
            hover:bg-terracotta-dark
            transition-colors duration-200
            shadow-md
          "
        >
          <span className="sm:hidden">Register</span>
          <span className="hidden sm:inline">Register Your Plant</span>
        </Link>
      </div>
    </nav>
  )
}
