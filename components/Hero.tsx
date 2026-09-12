import Link from 'next/link'
import type { CSSProperties } from 'react'
import { isQuizReady } from '@/data/picks'
import { EditorialBadge, RegistrationMark, SpeedBurst } from './motifs'

/**
 * The masthead — a full-bleed dark spread, the way a volume opens.
 *
 * The scene is an ORIGINAL illustration drawn in SVG below: a monitor on a
 * riser, a desk mat, a shelf with a generic collectible silhouette, a wall
 * print of an abstract skyline, headphones on a stand. There is no character,
 * logo, screenshot or franchise reference anywhere in it — the anime feeling
 * comes from print technique (halftone, panel gutters, a sticker badge) and
 * from the lighting, which is warm on the shelf and cool off the screen.
 *
 * The gift-quiz CTA is gated on `isQuizReady()`. There is no other way to
 * reach the quiz from here, so it cannot be linked prematurely.
 */

/* Motif utilities are drawn in `--paper` (the ink). On a dark panel the ink
   has to be the light stock instead, so the variable is flipped locally. */
const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

export function Hero() {
  const quizReady = isQuizReady()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-panel-2 text-panel-type"
      style={ON_DARK}
    >
      {/* Drifting paper grain. Decorative; reduced-motion collapses it to a still. */}
      <div
        aria-hidden="true"
        className="paper-grain grain-drift pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden="true"
        className="halftone-lg pointer-events-none absolute inset-y-0 right-0 w-1/2 opacity-40 [mask-image:linear-gradient(90deg,transparent,#000_40%)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
        {/* Top rule with registration marks, like the trim edge of a sheet. */}
        <div className="flex items-center justify-between text-panel-muted">
          <RegistrationMark className="h-4 w-4" />
          <p className="label-xs text-panel-muted">
            Vol. 01 &middot; The anime room &amp; desk guide
          </p>
          <RegistrationMark className="h-4 w-4" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-stretch lg:gap-8">
          {/* ---- The scene panel. First in DOM on mobile so the page opens on a picture. */}
          <div className="relative order-first lg:order-last">
            <div className="relative border-2 border-panel-type bg-panel offset-print">
              <DeskScene />
              <EditorialBadge
                tone="red"
                className="absolute -top-3 left-4"
              >
                Original scene
              </EditorialBadge>
              <p className="label-xs absolute right-3 bottom-3 bg-panel-2/80 px-2 py-1 text-panel-muted">
                Fig. 01 &middot; drawn, not licensed
              </p>
            </div>
          </div>

          {/* ---- The type panel. */}
          <div className="relative flex flex-col justify-between border-2 border-panel-line bg-panel/60 p-6 sm:p-8 lg:p-10">
            <SpeedBurst className="opacity-40 [mask-image:radial-gradient(circle_at_20%_30%,#000_0,transparent_60%)]" />

            <div className="relative">
              <p className="label-xs text-shu-electric">Gear for the setup, not the stall</p>

              <h1
                id="hero-heading"
                className="mt-4 text-5xl text-panel-type sm:text-6xl lg:text-cover"
              >
                Gear for your next arc.
              </h1>

              <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-panel-type/80 sm:text-lg">
                Curated desk, room, and convention finds for fans who care what
                they bring into their space.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/desk"
                  className="inline-flex items-center gap-2 bg-shu-electric px-6 py-3 text-base font-semibold text-panel-2 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:[box-shadow:4px_4px_0_0_var(--panel-type)]"
                >
                  Enter the Desk
                  <span aria-hidden="true">→</span>
                </Link>

                {quizReady && (
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 border-2 border-panel-type px-6 py-3 text-base font-semibold text-panel-type transition-colors hover:bg-panel-type hover:text-panel-2"
                  >
                    Take the desk quiz
                  </Link>
                )}
              </div>
            </div>

            <p className="label-xs relative mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-panel-muted">
              <span>Seller named</span>
              <span aria-hidden="true" className="text-shu-electric">
                ·
              </span>
              <span>License stated</span>
              <span aria-hidden="true" className="text-shu-electric">
                ·
              </span>
              <span>Price dated</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------
   The desk scene. Constant colours: the dark panel does not change with the
   theme, so neither does the drawing. Everything is geometry — there is no
   raster, no traced reference, and nothing that depicts a real product.
   ---------------------------------------------------------------------- */

function DeskScene() {
  return (
    <svg
      viewBox="0 0 800 520"
      role="img"
      aria-label="An original illustration of a late-night desk: a monitor on a steel riser glowing cool blue over a printed desk mat, a shelf lit warm from below holding a small collectible silhouette and a display case, a framed abstract skyline print on the wall, and headphones resting on a stand."
      className="block h-auto w-full"
    >
      <defs>
        <linearGradient id="hs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2532" />
          <stop offset="1" stopColor="#1a1720" />
        </linearGradient>
        <linearGradient id="hs-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b3242" />
          <stop offset="1" stopColor="#241f2a" />
        </linearGradient>
        <linearGradient id="hs-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f5ad6" />
          <stop offset="0.55" stopColor="#4b3fa8" />
          <stop offset="1" stopColor="#17151a" />
        </linearGradient>
        <linearGradient id="hs-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff9d42" />
          <stop offset="1" stopColor="#ff3b4d" />
        </linearGradient>
        <radialGradient id="hs-cool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#7f9dff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7f9dff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hs-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ff9d42" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff9d42" stopOpacity="0" />
        </radialGradient>
        <pattern id="hs-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.1" fill="#f3ebdd" opacity="0.11" />
        </pattern>
        <pattern id="hs-grid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0H0v18" fill="none" stroke="#f3ebdd" strokeOpacity="0.16" strokeWidth="1" />
        </pattern>
        <clipPath id="hs-screen-clip">
          <rect x="312" y="164" width="238" height="140" rx="3" />
        </clipPath>
      </defs>

      {/* Room */}
      <rect width="800" height="520" fill="url(#hs-wall)" />
      <rect width="800" height="520" fill="url(#hs-halftone)" />

      {/* Light: warm off the shelf, cool off the screen */}
      <ellipse cx="170" cy="200" rx="240" ry="150" fill="url(#hs-warm)" />
      <ellipse cx="440" cy="250" rx="300" ry="190" fill="url(#hs-cool)" />

      {/* Wall print: an abstract skyline. Matte, magnet-mounted, original. */}
      <g>
        <rect x="586" y="72" width="150" height="190" fill="#17151a" stroke="#f3ebdd" strokeOpacity="0.7" strokeWidth="3" />
        <rect x="598" y="84" width="126" height="166" fill="#241f2a" />
        <circle cx="661" cy="150" r="30" fill="url(#hs-sun)" />
        <path d="M598 170h126M598 178h126M598 186h126" stroke="#17151a" strokeWidth="3" />
        <path
          d="M598 250V206h14v-22h12v30h10v-40h16v18h12v-10h18v30h10v-20h14v22h20v36z"
          fill="#17151a"
        />
        <path d="M604 232h6M626 224h6M672 220h6M694 236h6" stroke="#ff9d42" strokeWidth="2" opacity="0.8" />
      </g>

      {/* Shelf with a light bar underneath */}
      <g>
        <rect x="48" y="196" width="250" height="10" fill="#0f0d12" />
        <rect x="56" y="206" width="234" height="4" fill="#ff9d42" opacity="0.9" />
        <path d="M56 210h234l40 60H16z" fill="#ff9d42" opacity="0.12" />
        {/* Generic collectible silhouette on a plinth: a shape, not a character */}
        <rect x="80" y="186" width="44" height="10" fill="#2c2733" />
        <path d="M102 116c-13 0-20 9-20 20 0 8 4 13 8 16-10 4-16 12-16 22v12h56v-12c0-10-6-18-16-22 4-3 8-8 8-16 0-11-7-20-20-20z" fill="#0f0d12" />
        <path d="M102 116c-13 0-20 9-20 20 0 8 4 13 8 16-10 4-16 12-16 22v12h56v-12c0-10-6-18-16-22 4-3 8-8 8-16 0-11-7-20-20-20z" fill="none" stroke="#ff9d42" strokeOpacity="0.5" strokeWidth="1.5" />
        {/* Acrylic display case */}
        <rect x="160" y="128" width="62" height="68" fill="#f3ebdd" fillOpacity="0.06" stroke="#f3ebdd" strokeOpacity="0.55" strokeWidth="2" />
        <path d="M166 134l50 56" stroke="#f3ebdd" strokeOpacity="0.18" strokeWidth="6" />
        <rect x="176" y="150" width="30" height="46" fill="#0f0d12" />
        {/* A short stack of volumes */}
        <rect x="238" y="152" width="14" height="44" fill="#d31e33" />
        <rect x="254" y="160" width="12" height="36" fill="#2f5ad6" />
        <rect x="268" y="146" width="12" height="50" fill="#f3ebdd" fillOpacity="0.8" />
      </g>

      {/* Desk */}
      <path d="M0 372h800v148H0z" fill="url(#hs-desk)" />
      <path d="M0 372h800" stroke="#f3ebdd" strokeOpacity="0.35" strokeWidth="2" />
      <rect x="0" y="372" width="800" height="148" fill="url(#hs-halftone)" opacity="0.5" />

      {/* Desk mat with a panel-gutter print */}
      <g>
        <rect x="190" y="392" width="440" height="96" rx="6" fill="#1c1922" stroke="#f3ebdd" strokeOpacity="0.45" strokeWidth="2" />
        <path d="M330 392v96M470 392v96M190 442h140M470 442h160" stroke="#f3ebdd" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M204 404l36 24M480 458l40 22" stroke="#ff3b4d" strokeOpacity="0.7" strokeWidth="2" />
      </g>

      {/* Monitor on a steel riser */}
      <g>
        <rect x="330" y="342" width="200" height="12" fill="#0f0d12" stroke="#f3ebdd" strokeOpacity="0.4" strokeWidth="1.5" />
        <path d="M336 354v18M524 354v18" stroke="#0f0d12" strokeWidth="6" />
        <rect x="410" y="318" width="42" height="24" fill="#0f0d12" />
        <rect x="300" y="150" width="262" height="168" rx="6" fill="#0f0d12" stroke="#4a4248" strokeWidth="3" />
        <rect x="312" y="164" width="238" height="140" rx="3" fill="url(#hs-screen)" />
        <g clipPath="url(#hs-screen-clip)">
          <rect x="312" y="164" width="238" height="140" fill="url(#hs-grid)" />
          <rect x="332" y="186" width="96" height="60" fill="#17151a" fillOpacity="0.55" stroke="#f3ebdd" strokeOpacity="0.7" strokeWidth="2" />
          <rect x="440" y="186" width="90" height="26" fill="#17151a" fillOpacity="0.55" stroke="#f3ebdd" strokeOpacity="0.7" strokeWidth="2" />
          <rect x="440" y="220" width="90" height="26" fill="#ff3b4d" fillOpacity="0.85" />
          <path d="M332 262h198M332 274h150M332 286h172" stroke="#f3ebdd" strokeOpacity="0.55" strokeWidth="3" />
        </g>
        <circle cx="431" cy="311" r="2.5" fill="#7f9dff" />
      </g>

      {/* Keyboard and mouse */}
      <g>
        <rect x="340" y="414" width="180" height="34" rx="4" fill="#2c2733" stroke="#f3ebdd" strokeOpacity="0.5" strokeWidth="2" />
        <path d="M352 424h156M352 432h156M352 440h156" stroke="#f3ebdd" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M340 448h180" stroke="#7f9dff" strokeOpacity="0.8" strokeWidth="2" />
        <rect x="548" y="410" width="30" height="46" rx="14" fill="#2c2733" stroke="#f3ebdd" strokeOpacity="0.5" strokeWidth="2" />
        <path d="M563 414v14" stroke="#f3ebdd" strokeOpacity="0.5" strokeWidth="2" />
      </g>

      {/* Headphones on a stand */}
      <g>
        <path d="M700 372v-118" stroke="#0f0d12" strokeWidth="6" />
        <rect x="672" y="366" width="56" height="8" rx="2" fill="#0f0d12" />
        <path d="M660 300c0-24 18-42 40-42s40 18 40 42" fill="none" stroke="#f3ebdd" strokeOpacity="0.85" strokeWidth="6" strokeLinecap="round" />
        <rect x="650" y="296" width="20" height="34" rx="6" fill="#0f0d12" stroke="#f3ebdd" strokeOpacity="0.7" strokeWidth="2" />
        <rect x="730" y="296" width="20" height="34" rx="6" fill="#0f0d12" stroke="#f3ebdd" strokeOpacity="0.7" strokeWidth="2" />
        <path d="M660 330l-10 30M740 330l10 30" stroke="#f3ebdd" strokeOpacity="0.3" strokeWidth="2" />
      </g>

      {/* Desk lamp, left, adding to the warm side */}
      <g>
        <path d="M110 372v-70l50-40" fill="none" stroke="#0f0d12" strokeWidth="6" strokeLinecap="round" />
        <path d="M150 256l30 10-10 20-30-10z" fill="#0f0d12" stroke="#ff9d42" strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M172 284l70 88H100z" fill="#ff9d42" opacity="0.1" />
        <rect x="86" y="368" width="48" height="8" rx="2" fill="#0f0d12" />
      </g>

      {/* A small mug, because it is late */}
      <g>
        <rect x="258" y="416" width="34" height="38" rx="3" fill="#f3ebdd" fillOpacity="0.85" />
        <path d="M292 424h10a6 6 0 0 1 0 12h-10" fill="none" stroke="#f3ebdd" strokeOpacity="0.85" strokeWidth="3" />
        <path d="M268 408c0-6 6-6 6-12M280 408c0-6 6-6 6-12" stroke="#f3ebdd" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Panel gutter cutting the spread, like a manga page */}
      <path d="M0 372h800" stroke="#f3ebdd" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 6" />
    </svg>
  )
}
