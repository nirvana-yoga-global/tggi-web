import { useScrollReveal } from '../hooks/useScrollReveal'

const STATS = [
  {
    id: 1,
    value: '200,000+',
    label: 'Saplings Distributed',
  },
  {
    id: 2,
    value: '20',
    label: 'Years of Service',
  },
  {
    id: 3,
    value: '500+',
    label: 'Active Green Guardians',
  },
]

export default function ImpactStats() {
  const ref = useScrollReveal()

  return (
    <section className="bg-forest py-20 sm:py-28">
      <div
        ref={ref}
        className="reveal max-w-5xl mx-auto px-6
          flex flex-col sm:flex-row
          items-center sm:items-start
          justify-center sm:justify-around
          gap-14 sm:gap-8
          text-center
        "
      >
        {STATS.map((stat, index) => (
          <div
            key={stat.id}
            className="flex flex-col items-center"
            style={{ transitionDelay: `${index * 0.15}s` }}
          >
            {/* Large number */}
            <span
              className="font-serif font-semibold text-cream leading-none mb-3"
              style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}
            >
              {stat.value}
            </span>

            {/* Divider */}
            <div className="w-8 h-px bg-terracotta mb-3" aria-hidden="true" />

            {/* Label */}
            <span
              className="font-sans text-cream/65 uppercase tracking-[0.14em] leading-snug max-w-[140px]"
              style={{ fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
