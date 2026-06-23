import { useScrollReveal } from '../hooks/useScrollReveal'

const STEPS = [
  {
    id: 1,
    title: 'Plant',
    description:
      'Plant any sapling, herb, or vegetable at home, school, or office — indoors or outdoors.',
  },
  {
    id: 2,
    title: 'Register',
    description:
      'Create your TGGI profile and upload your first photo to officially record your plant.',
  },
  {
    id: 3,
    title: 'Nurture',
    description:
      'Care for your plant through the seasons and share monthly photo updates with the community.',
  },
  {
    id: 4,
    title: 'Recognition',
    description:
      'Earn your badge based on what you grew and how long you nurtured it.',
    badges: ['TGGI Green Guardian', 'Nurturer', 'Kitchen Garden Contributor'],
  },
]

export default function Lifecycle() {
  const headingRef = useScrollReveal()
  const gridRef    = useScrollReveal()

  return (
    <section className="bg-[#f5f1e8] py-20 sm:py-28 lg:py-32">
      <div className="max-w-4xl mx-auto px-6">

        {/* ── Heading ── */}
        <div ref={headingRef} className="reveal text-center mb-12 sm:mb-16">
          <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-4">
            How It Works
          </p>
          <h2
            className="font-serif font-semibold text-forest leading-[1.08]"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
          >
            From Seed to Guardian
          </h2>
        </div>

        {/* ── 2×2 card grid — single column on mobile ── */}
        <div
          ref={gridRef}
          className="reveal grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
        >
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="bg-[#e6dfc9] rounded-2xl p-7 sm:p-8 flex flex-col"
            >
              {/* Number badge — top-left */}
              <div
                className="
                  w-10 h-10 rounded-full
                  flex items-center justify-center
                  mb-5 self-start
                  border border-terracotta/40
                "
                style={{ backgroundColor: 'rgba(196,98,61,0.10)' }}
                aria-hidden="true"
              >
                <span className="font-serif font-semibold text-terracotta text-lg leading-none">
                  {step.id}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-serif font-semibold text-forest mb-3 leading-snug"
                style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)' }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-forest/70 text-base leading-relaxed">
                {step.description}
              </p>

              {/* Badge pills — Recognition step only */}
              {step.badges && (
                <div className="flex flex-wrap gap-2 mt-5">
                  {step.badges.map((badge) => (
                    <span
                      key={badge}
                      className="
                        font-sans text-xs font-semibold
                        px-3 py-1.5 rounded-full
                        border border-terracotta/40
                        text-terracotta bg-terracotta/6
                      "
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
