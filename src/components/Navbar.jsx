import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 sm:px-10"
      style={{ background: 'transparent' }}
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

      {/* CTA */}
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
    </nav>
  )
}
