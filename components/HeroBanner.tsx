/**
 * Home banner: an original red anime-poster illustration. No text, no
 * characters, transparent background so the page shows through. Drawn from
 * scratch so the site holds the rights to everything on its own front page.
 *
 * Composition: a rising sun on the right with radial speed lines, a halftone
 * field fading in from the left, and a thin horizon. Everything is the accent
 * red at varying opacity, so it reads as one image rather than a collage.
 */
export function HeroBanner() {
  // Speed lines radiate from the sun's centre (900, 150). Deterministic so the
  // markup is identical on every build.
  const rays = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * Math.PI * 2
    const inner = 96 + ((i * 37) % 5) * 10
    const outer = 700 + ((i * 53) % 7) * 60
    const x1 = 900 + Math.cos(angle) * inner
    const y1 = 150 + Math.sin(angle) * inner
    const x2 = 900 + Math.cos(angle) * outer
    const y2 = 150 + Math.sin(angle) * outer
    const width = 1.5 + ((i * 29) % 3)
    return { x1, y1, x2, y2, width, opacity: 0.35 + ((i * 17) % 4) * 0.1 }
  })

  return (
    <section aria-label="Otakudesk" className="border-b border-line bg-bg">
      <h1 className="sr-only">Otakudesk</h1>
      <div className="mx-auto max-w-6xl">
        <svg
          viewBox="0 0 1200 300"
          // Crop from the left on narrow screens so the sun stays whole.
          preserveAspectRatio="xMaxYMid slice"
          aria-hidden="true"
          className="block h-44 w-full text-accent sm:h-56 md:h-64 lg:h-72"
        >
          <defs>
            {/* Halftone field: dots that grow toward the sun. */}
            <pattern id="ht-s" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="1.2" fill="currentColor" />
            </pattern>
            <pattern id="ht-m" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="2.2" fill="currentColor" />
            </pattern>
            <pattern id="ht-l" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="3.4" fill="currentColor" />
            </pattern>
            <linearGradient id="fade-l" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
            <mask id="fade">
              <rect width="1200" height="300" fill="url(#fade-l)" />
            </mask>
            <clipPath id="frame">
              <rect width="1200" height="300" />
            </clipPath>
          </defs>

          <g clipPath="url(#frame)">
            {/* Halftone in three densities, fading in from the left. */}
            <g mask="url(#fade)" opacity="0.28">
              <rect x="0" y="0" width="1200" height="300" fill="url(#ht-s)" />
              <rect x="420" y="0" width="780" height="300" fill="url(#ht-m)" />
              <rect x="760" y="0" width="440" height="300" fill="url(#ht-l)" />
            </g>

            {/* Speed lines. */}
            <g stroke="currentColor" strokeLinecap="round">
              {rays.map((r, i) => (
                <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} strokeWidth={r.width} opacity={r.opacity} />
              ))}
            </g>

            {/* Horizon and the sun. */}
            <line x1="0" y1="226" x2="1200" y2="226" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            <circle cx="900" cy="150" r="92" fill="currentColor" />
            <circle cx="900" cy="150" r="104" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.6" />
            <circle cx="900" cy="150" r="122" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

            {/* Three ink strokes across the sun, the brush mark of a title card. */}
            <path d="M780 140c60-12 140-14 240-4" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
            <path d="M800 164c50-8 130-10 200-2" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.7" />
            <path d="M840 186c30-5 80-6 120-1" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
          </g>
        </svg>
      </div>
    </section>
  )
}
