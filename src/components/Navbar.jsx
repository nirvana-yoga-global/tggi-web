import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/', { replace: true })
  }

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

      {/* CTAs — change based on auth state */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <>
            {/* My Garden */}
            <Link
              to="/my-garden"
              className="
                flex items-center justify-center min-h-[44px]
                font-sans font-semibold tracking-wide
                transition-colors duration-200
                text-cream/85 hover:text-cream text-sm
                sm:px-5 sm:py-2.5 sm:rounded-full sm:border-2 sm:border-cream/45
                sm:hover:border-cream sm:bg-transparent
              "
            >
              My Garden
            </Link>

            {/* Register a Plant */}
            <Link
              to="/register-plant"
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
              <span className="sm:hidden">Add Plant</span>
              <span className="hidden sm:inline">Register a Plant</span>
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                hidden sm:flex items-center justify-center min-h-[44px]
                px-4 py-2 rounded-full
                font-sans font-semibold text-sm tracking-wide
                text-cream/70 hover:text-cream
                border-2 border-cream/20 hover:border-cream/50
                transition-colors duration-200
              "
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Login */}
            <Link
              to="/login"
              className="
                flex items-center justify-center min-h-[44px]
                font-sans font-semibold tracking-wide
                transition-colors duration-200
                text-cream/85 hover:text-cream text-sm
                sm:px-5 sm:py-2.5 sm:rounded-full sm:border-2 sm:border-cream/45
                sm:hover:border-cream sm:bg-transparent
              "
            >
              Login
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
              <span className="hidden sm:inline">Join the Movement</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
