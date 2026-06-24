import { useState, useEffect, useRef } from 'react'
import { Leaf } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { supabase } from '../lib/supabase'

function RevealItem({ children, delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.unobserve(el) } },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function PreviewCard({ item }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-forest/8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Photo */}
      {item.photo_url && !imgError ? (
        <img
          src={item.photo_url}
          alt={item.plant_name}
          className="w-full object-cover"
          style={{ maxHeight: 260, display: 'block' }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className="w-full flex items-center justify-center"
          style={{ height: 200, backgroundColor: '#b4c8b0' }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 60 80" width="40" fill="none" style={{ opacity: 0.25 }}>
            <path d="M30 2 C50 10 56 38 40 60 C30 74 6 72 2 52 C-2 30 12 8 30 2 Z" fill="#1f3d2b" />
            <line x1="30" y1="2" x2="30" y2="74" stroke="#1f3d2b" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* Card body */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Leaf size={12} strokeWidth={2} className="text-terracotta flex-shrink-0" aria-hidden="true" />
          <span className="font-sans text-xs font-bold text-terracotta uppercase tracking-[0.14em]">
            {item.category}
          </span>
        </div>
        <h3
          className="font-serif font-semibold text-forest leading-snug mb-1"
          style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)' }}
        >
          {item.plant_name}
        </h3>
        {item.location && (
          <p className="font-sans text-forest/50 text-sm">{item.location}</p>
        )}
        {item.display_name && (
          <p className="font-sans text-forest/40 text-sm italic mt-0.5">{item.display_name}</p>
        )}
      </div>
    </div>
  )
}

export default function GalleryPreview() {
  const headingRef = useScrollReveal()
  const btnRef     = useScrollReveal()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!supabase) return
    async function fetchPreview() {
      const [{ data: regs }, { data: featured }] = await Promise.all([
        supabase
          .from('tggi_registrations')
          .select('id, plant_name, category, location, first_photo_url')
          .eq('is_flagged', false)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('tggi_featured_photos')
          .select('id, plant_name, category, photo_url, location, source_name')
          .order('created_at', { ascending: false })
          .limit(6),
      ])

      const combined = [
        ...(regs ?? []).map(r => ({
          id:           `reg-${r.id}`,
          photo_url:    r.first_photo_url,
          plant_name:   r.plant_name,
          category:     r.category,
          location:     r.location,
          display_name: null,
        })),
        ...(featured ?? []).map(f => ({
          id:           `feat-${f.id}`,
          photo_url:    f.photo_url,
          plant_name:   f.plant_name,
          category:     f.category,
          location:     f.location,
          display_name: f.source_name ?? 'Nirvana Yoga Global',
        })),
      ].slice(0, 6)

      setItems(combined)
    }
    fetchPreview()
  }, [])

  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-32">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Heading ── */}
        <div ref={headingRef} className="reveal text-center mb-14 sm:mb-20">
          <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-4">
            Our Community
          </p>
          <h2
            className="font-serif font-semibold text-forest leading-[1.08] mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            Plants Growing Around the World
          </h2>
          <p
            className="font-sans text-forest/65 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.15rem)' }}
          >
            Every photo is a promise kept — a living act of care from someone, somewhere.
          </p>
        </div>

        {/* ── Grid ── */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
            {items.map((item, i) => (
              <RevealItem key={item.id} delay={i * 90}>
                <PreviewCard item={item} />
              </RevealItem>
            ))}
          </div>
        )}

        {/* ── CTA button ── */}
        <div
          ref={btnRef}
          className="reveal text-center mt-12 sm:mt-16"
          style={{ transitionDelay: '0.3s' }}
        >
          <a
            href="/gallery"
            className="
              inline-flex items-center gap-2
              px-9 py-3.5 rounded-full
              border-2 border-forest text-forest
              font-sans font-semibold tracking-wide text-base
              hover:bg-forest hover:text-cream
              transition-colors duration-200
            "
          >
            View All Plants →
          </a>
        </div>

      </div>
    </section>
  )
}
