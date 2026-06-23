import { Leaf } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const PLANTS = [
  { id: 1, name: 'Tulsi',         category: 'Herb',      location: 'Kerala, India',     imgH: 200, bg: '#c4d4c0' },
  { id: 2, name: 'Mango Sapling', category: 'Tree',      location: 'Tamil Nadu, India', imgH: 260, bg: '#b4c8b0' },
  { id: 3, name: 'Marigold',      category: 'Flowering', location: 'Romania',           imgH: 175, bg: '#ddd8b8' },
  { id: 4, name: 'Spinach',       category: 'Vegetable', location: 'Dubai, UAE',        imgH: 230, bg: '#a8c4a4' },
  { id: 5, name: 'Money Plant',   category: 'Indoor',    location: 'Singapore',         imgH: 195, bg: '#bccbb8' },
  { id: 6, name: 'Neem',          category: 'Medicinal', location: 'Karnataka, India',  imgH: 245, bg: '#9cb89c' },
]

export default function GalleryPreview() {
  const headingRef = useScrollReveal()
  const c0 = useScrollReveal()
  const c1 = useScrollReveal()
  const c2 = useScrollReveal()
  const c3 = useScrollReveal()
  const c4 = useScrollReveal()
  const c5 = useScrollReveal()
  const cardRefs = [c0, c1, c2, c3, c4, c5]
  const btnRef = useScrollReveal()

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

        {/* ── Masonry grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {PLANTS.map((plant, i) => (
            <div
              key={plant.id}
              ref={cardRefs[i]}
              className="reveal"
              style={{ transitionDelay: `${i * 0.09}s` }}
            >
              <div className="
                bg-white rounded-2xl overflow-hidden
                border border-forest/8
                shadow-sm hover:shadow-md
                transition-shadow duration-300
              ">
                {/* Placeholder image */}
                <div
                  className="w-full flex items-center justify-center"
                  style={{ height: plant.imgH, backgroundColor: plant.bg }}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 60 80"
                    width="40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ opacity: 0.25 }}
                  >
                    <path
                      d="M30 2 C50 10 56 38 40 60 C30 74 6 72 2 52 C-2 30 12 8 30 2 Z"
                      fill="#1f3d2b"
                    />
                    <line x1="30" y1="2" x2="30" y2="74" stroke="#1f3d2b" strokeWidth="1" />
                  </svg>
                </div>

                {/* Card body */}
                <div className="px-5 py-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Leaf
                      size={12}
                      strokeWidth={2}
                      className="text-terracotta flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-xs font-bold text-terracotta uppercase tracking-[0.14em]">
                      {plant.category}
                    </span>
                  </div>
                  <h3
                    className="font-serif font-semibold text-forest leading-snug mb-1"
                    style={{ fontSize: 'clamp(1.1rem, 2vw, 1.3rem)' }}
                  >
                    {plant.name}
                  </h3>
                  <p className="font-sans text-forest/50 text-sm">
                    {plant.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

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
