import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Story() {
  const contentRef = useScrollReveal()
  const quoteRef   = useScrollReveal()

  return (
    <section id="story" className="bg-cream py-20 sm:py-28 lg:py-36">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Two-column block ── */}
        {/*   Mobile : image on top, text below (DOM order + order utilities)  */}
        {/*   Desktop: text left, image right                                   */}
        <div
          ref={contentRef}
          className="reveal grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >

          {/* Text — second in DOM → bottom on mobile; order-1 on desktop → left */}
          <div className="order-2 lg:order-1">
            <p className="font-sans text-terracotta text-sm font-bold uppercase tracking-[0.18em] mb-4">
              Our Why
            </p>
            <h2
              className="font-serif font-semibold text-forest leading-[1.08] mb-7"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)' }}
            >
              Twenty Years of Service
            </h2>
            <p className="font-sans text-forest/80 text-lg leading-[1.75] mb-5">
              Under the vision of His Holiness Bodhisatvan Madhavacharyan, a mission
              was born twenty years ago — to protect nature, preserve biodiversity,
              and restore humanity's deep relationship with the Earth.
            </p>
            <p className="font-sans text-forest/80 text-lg leading-[1.75] mb-5">
              Thousands of saplings have been planted across communities, schools,
              and homes, with special care given to medicinal and rare species facing
              extinction. Every tree is a prayer. Every seed, an act of faith.
            </p>
            <p className="font-sans text-forest/80 text-lg leading-[1.75]">
              Today that seed has grown into a movement — and you are invited to
              become a Green Guardian.
            </p>
          </div>

          {/* Image — first in DOM → top on mobile; order-2 on desktop → right */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">

              {/* Outer decorative ring */}
              <div
                className="absolute rounded-full border border-terracotta/25 pointer-events-none"
                style={{ inset: '-12px' }}
                aria-hidden="true"
              />

              {/* Second decorative ring */}
              <div
                className="absolute rounded-full border border-forest/10 pointer-events-none"
                style={{ inset: '-24px' }}
                aria-hidden="true"
              />

              {/* Portrait circle */}
              <div
                className="
                  w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80
                  rounded-full overflow-hidden
                  border-4 border-forest/15
                  shadow-2xl
                  bg-forest
                  flex flex-col items-center justify-center
                "
                role="img"
                aria-label="Portrait of Guruji — photograph to be added"
              >
                {/* Leaf placeholder icon */}
                <svg
                  viewBox="0 0 80 96"
                  className="w-20 h-20 mb-3"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M40 2 C66 14 74 50 54 76 C42 92 10 88 4 66 C-4 40 16 10 40 2 Z"
                    fill="#faf7f0"
                    opacity="0.22"
                  />
                  {/* midrib */}
                  <line x1="40" y1="2" x2="40" y2="88" stroke="#faf7f0" strokeWidth="1" opacity="0.18" />
                </svg>
                <span className="font-sans text-cream/45 text-xs text-center px-8 leading-relaxed">
                  Guruji's photograph<br />coming soon
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* ── Pull-quote ── */}
        <div
          ref={quoteRef}
          className="reveal mt-20 sm:mt-28"
          style={{ transitionDelay: '0.25s' }}
        >
          <figure className="py-10 sm:py-14 border-t border-b border-forest/15 text-center">
            <blockquote>
              <p
                className="font-serif italic text-forest leading-[1.25] max-w-3xl mx-auto"
                style={{ fontSize: 'clamp(1.7rem, 4vw, 3rem)' }}
              >
                &ldquo;God Dwells in Selfless Service&rdquo;
              </p>
            </blockquote>
            <figcaption className="mt-6 font-sans text-forest/55 text-sm tracking-[0.16em] uppercase">
              His Holiness Bodhisatvan Madhavacharyan
            </figcaption>
          </figure>
        </div>

      </div>
    </section>
  )
}
