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
  const stepsRef   = useScrollReveal()

  return (
    <section className="bg-[#f5f1e8] py-20 sm:py-28 lg:py-32">
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Heading ── */}
        <div ref={headingRef} className="reveal text-center mb-16 sm:mb-20">
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

        {/* ── Steps ── */}
        <div ref={stepsRef} className="reveal relative">

          {/*
            Desktop horizontal connector — full-width at z-0 so the z-10 circles
            sit on top of it, making it look like a joined path between steps.
          */}
          <div
            className="hidden lg:block absolute left-0 right-0 h-px bg-forest/20"
            style={{ top: '28px' }}   /* half of the 56px circle height */
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 lg:gap-8">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="
                  relative
                  flex lg:flex-col
                  items-start lg:items-center
                  gap-5 lg:gap-0
                  pb-12 last:pb-0 lg:pb-0
                  lg:text-center
                "
              >
                {/* Mobile vertical connector (all except last step) */}
                {index < STEPS.length - 1 && (
                  <div
                    className="lg:hidden absolute w-px bg-forest/15"
                    style={{ left: '27px', top: '56px', bottom: 0 }}
                    aria-hidden="true"
                  />
                )}

                {/* ── Number badge ── */}
                <div
                  className="
                    relative z-10 flex-shrink-0
                    w-14 h-14 rounded-full
                    bg-terracotta
                    flex items-center justify-center
                    shadow-md
                  "
                  aria-hidden="true"
                >
                  <span className="font-serif font-semibold text-white text-xl leading-none">
                    {step.id}
                  </span>
                </div>

                {/* ── Text ── */}
                <div className="flex-1 lg:mt-7 lg:px-1">
                  <h3
                    className="font-serif font-semibold text-forest mb-2 leading-snug"
                    style={{ fontSize: 'clamp(1.15rem, 2vw, 1.4rem)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-sans text-forest/70 text-base leading-relaxed">
                    {step.description}
                  </p>

                  {/* Badge pills — Recognition step only */}
                  {step.badges && (
                    <div className="flex flex-wrap gap-2 mt-4 lg:justify-center">
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

              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
