import { TreePine, Droplet, Recycle, Lightbulb } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const PILLARS = [
  {
    id: 1,
    Icon: TreePine,
    label: 'Plant Trees',
    description: 'Grow native, medicinal, and rare saplings that restore biodiversity.',
  },
  {
    id: 2,
    Icon: Droplet,
    label: 'Save Water',
    description: 'Harvest rainwater, reduce runoff, and protect our rivers and wells.',
  },
  {
    id: 3,
    Icon: Recycle,
    label: 'Reduce Waste',
    description: 'Compost, reuse, and refuse single-use materials every single day.',
  },
  {
    id: 4,
    Icon: Lightbulb,
    label: 'Save Energy',
    description: 'Choose natural light, switch off what is idle, live with less.',
  },
]

export default function Pillars() {
  const headingRef = useScrollReveal()
  const gridRef    = useScrollReveal()

  return (
    <section className="bg-cream py-20 sm:py-28 lg:py-32">

      {/* thin top accent line */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="w-12 h-0.5 bg-terracotta mx-auto mb-10" aria-hidden="true" />
      </div>

      {/* heading */}
      <div ref={headingRef} className="reveal text-center mb-14 sm:mb-20 px-6">
        <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-4">
          What We Stand For
        </p>
        <h2
          className="font-serif font-semibold text-forest mx-auto leading-[1.08]"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
        >
          Our Commitment
        </h2>
      </div>

      {/* 2×2 on mobile → 4-col on lg */}
      <div
        ref={gridRef}
        className="reveal max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7"
      >
        {PILLARS.map(({ id, Icon, label, description }) => (
          <div
            key={id}
            className="
              flex flex-col items-center text-center
              bg-white rounded-2xl
              px-5 py-8 sm:py-10
              border border-forest/8
              shadow-sm hover:shadow-md
              transition-shadow duration-300
            "
          >
            {/* icon container */}
            <div
              className="
                flex items-center justify-center
                w-16 h-16 sm:w-20 sm:h-20
                rounded-full bg-forest/8
                mb-5 sm:mb-6
              "
              aria-hidden="true"
            >
              <Icon
                size={36}
                strokeWidth={1.5}
                className="text-forest"
                aria-hidden="true"
              />
            </div>

            {/* label */}
            <h3
              className="font-serif font-semibold text-forest mb-2 leading-snug"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}
            >
              {label}
            </h3>

            {/* description */}
            <p className="font-sans text-forest/65 text-sm sm:text-base leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>

    </section>
  )
}
