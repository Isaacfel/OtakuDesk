import Link from 'next/link'
import type { CSSProperties } from 'react'
import { isQuizReady } from '@/data/picks'
import { EnergyBurst, GlowOrb, Mascot, SparkleField } from './motifs'

/**
 * The masthead — stepping into a late-night anime room.
 *
 * The scene is an ORIGINAL illustration drawn in SVG below: a window with the
 * blinds half down and the night coming through, a shelf lit warm from
 * underneath, a monitor blooming cool blue over a desk mat, a lamp pooling
 * orange on the desk, headphones on a stand, a mug going cold — and the
 * site's own desk spirit peeking over the desk edge. There is no character
 * from anywhere else, no logo, no screenshot and no franchise reference.
 *
 * The scene is not framed. Its edges dissolve into the page with a mask so the
 * page reads as the room rather than as a page with a picture on it.
 *
 * The gift-quiz CTA is gated on `isQuizReady()`. There is no other way to
 * reach the quiz from here, so it cannot be linked prematurely.
 */

/* Motif utilities are drawn in `--paper`. The hero stays a night room in both
   themes, so the light stock is pinned to the constant panel type colour. */
const ON_DARK = { '--paper': 'var(--panel-type)' } as CSSProperties

export function Hero() {
  const quizReady = isQuizReady()

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-panel-2 text-panel-type"
      style={ON_DARK}
    >
      {/* The room's ambient light: lamp left, screen right, night air below. */}
      <div aria-hidden="true" className="room-light pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="paper-grain grain-drift pointer-events-none absolute inset-0 opacity-60"
      />
      <GlowOrb tone="blue" size="min(70vw, 720px)" intensity="mid" blend="screen" className="-top-1/4 right-[-10%]" />
      <GlowOrb tone="orange" size="min(50vw, 480px)" intensity="low" blend="screen" className="top-1/3 -left-1/4" />

      <div className="relative mx-auto max-w-6xl px-5 pt-5 pb-14 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-24">
        <p className="label-xs flex items-center gap-3 text-panel-muted">
          <span aria-hidden="true" className="inline-block h-px w-8 bg-shu-electric" />
          Vol. 01 &middot; The anime room &amp; desk guide
        </p>

        <div className="mt-4 grid gap-4 lg:mt-8 lg:grid-cols-12 lg:items-center lg:gap-6">
          {/* ---- The scene. First in DOM on mobile so the page opens on the room. */}
          <div className="relative order-first -mx-5 lg:order-last lg:col-span-7 lg:mx-0 lg:-mr-[8vw] xl:-mr-[10vw]">
            <div
              className="relative [mask-image:linear-gradient(to_bottom,transparent,#000_10%,#000_84%,transparent)] lg:[mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent),linear-gradient(to_bottom,transparent,#000_14%,#000_82%,transparent)] lg:[mask-composite:intersect]"
            >
              <DeskScene />
              <SparkleField seed="hero-dust" count={9} tone="lilac" minSize={6} maxSize={14} className="opacity-70" />
            </div>
            <p className="label-xs absolute bottom-3 left-5 text-panel-muted/80 lg:left-4">
              Original scene &middot; drawn for this page
            </p>
          </div>

          {/* ---- The type. */}
          <div className="relative lg:col-span-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-10 -inset-y-16 opacity-90 [mask-image:radial-gradient(circle_at_24%_38%,#000_0,transparent_62%)]"
            >
              <EnergyBurst tone="electric" intensity="high" originX={22} originY={38} seed="hero-arc" />
            </div>

            <div className="relative">
              <p className="label-xs text-shu-electric">Gear for the setup, not the stall</p>

              <h1
                id="hero-heading"
                className="mt-4 text-5xl leading-[0.9] text-panel-type sm:text-6xl lg:text-7xl xl:text-cover"
              >
                Gear for your next{' '}
                <span className="text-glow-red text-shu-electric">arc.</span>
              </h1>

              <p className="mt-6 max-w-[44ch] text-base leading-relaxed text-panel-type/80 sm:text-lg">
                Curated desk, room, and convention finds for fans who care what
                they bring into their space. Lights low, standards high.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="/desk"
                  className="bloom-red inline-flex items-center gap-2 bg-shu-electric px-6 py-3 text-base font-semibold text-panel-2 transition-transform hover:-translate-y-0.5 focus-visible:outline-panel-type"
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

              <p className="label-xs relative mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-panel-muted">
                <span>Seller named</span>
                <span aria-hidden="true" className="text-shu-electric">·</span>
                <span>License stated</span>
                <span aria-hidden="true" className="text-shu-electric">·</span>
                <span>Price dated</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------
   The desk scene, at night. Constant colours: a night room does not change
   with the theme. Everything is geometry — no raster, no traced reference,
   nothing that depicts a real product or anyone's character.
   ---------------------------------------------------------------------- */

const INK = '#17151a'
const PAPER = '#f3ebdd'
const RED = '#ff3b4d'
const ORANGE = '#ff9d42'
const BLUE = '#4d7cfe'
const LILAC = '#b7a4ff'

function DeskScene() {
  return (
    <svg
      viewBox="0 0 960 540"
      role="img"
      aria-label="An original illustration of a late-night anime room: a window with the blinds half down and lilac night light coming through, a shelf lit warm from underneath holding volumes and a display case, a monitor glowing cool blue over a printed desk mat, a desk lamp pooling orange light, headphones on a stand, a mug of tea, and a small paper-slip desk spirit peeking over the edge of the desk beside the monitor."
      className="block h-auto w-full"
    >
      <defs>
        <linearGradient id="hs-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d1925" />
          <stop offset="1" stopColor="#120f16" />
        </linearGradient>
        <linearGradient id="hs-desk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c3143" />
          <stop offset="1" stopColor="#1e1923" />
        </linearGradient>
        <linearGradient id="hs-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="0.5" stopColor="#4a3fb8" />
          <stop offset="1" stopColor="#1a1630" />
        </linearGradient>
        <linearGradient id="hs-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2350" />
          <stop offset="1" stopColor="#4a3f8a" />
        </linearGradient>
        <linearGradient id="hs-sun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ORANGE} />
          <stop offset="1" stopColor={RED} />
        </linearGradient>
        <radialGradient id="hs-cool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={BLUE} stopOpacity="0.62" />
          <stop offset="0.6" stopColor={BLUE} stopOpacity="0.16" />
          <stop offset="1" stopColor={BLUE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hs-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={ORANGE} stopOpacity="0.6" />
          <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hs-lilac" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={LILAC} stopOpacity="0.32" />
          <stop offset="1" stopColor={LILAC} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ORANGE} stopOpacity="0.28" />
          <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hs-floor-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#100e13" stopOpacity="0" />
          <stop offset="1" stopColor="#100e13" stopOpacity="0.9" />
        </linearGradient>
        <pattern id="hs-halftone" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.1" fill={PAPER} opacity="0.09" />
        </pattern>
        <pattern id="hs-grid" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M18 0H0v18" fill="none" stroke={PAPER} strokeOpacity="0.16" strokeWidth="1" />
        </pattern>
        <clipPath id="hs-screen-clip">
          <rect x="346" y="166" width="268" height="158" rx="3" />
        </clipPath>
        <clipPath id="hs-window-clip">
          <rect x="70" y="44" width="184" height="176" />
        </clipPath>
      </defs>

      {/* Room */}
      <rect width="960" height="540" fill="url(#hs-wall)" />
      <rect width="960" height="540" fill="url(#hs-halftone)" />

      {/* Light in the room: lilac from the window, warm off the shelf, cool off the screen */}
      <ellipse cx="160" cy="250" rx="220" ry="200" fill="url(#hs-lilac)" />
      <ellipse cx="460" cy="120" rx="260" ry="90" fill="url(#hs-warm)" />
      <ellipse cx="480" cy="250" rx="330" ry="220" fill="url(#hs-cool)" />

      {/* Window, blinds half down, the night coming through */}
      <g>
        <rect x="62" y="36" width="200" height="192" fill={INK} />
        <g clipPath="url(#hs-window-clip)">
          <rect x="70" y="44" width="184" height="176" fill="url(#hs-night)" />
          {/* Moon: a disc with a second disc of night cut across it. */}
          <circle cx="206" cy="150" r="22" fill={PAPER} fillOpacity="0.92" />
          <circle cx="216" cy="142" r="20" fill="#3a3070" />
          <circle cx="102" cy="118" r="1.8" fill={PAPER} opacity="0.9" />
          <circle cx="140" cy="176" r="1.4" fill={PAPER} opacity="0.7" />
          <circle cx="172" cy="98" r="1.2" fill={PAPER} opacity="0.6" />
          <circle cx="118" cy="200" r="1.6" fill={PAPER} opacity="0.8" />
          {/* Blinds, drawn to just past halfway. */}
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x="70" y={44 + i * 14} width="184" height="10" fill="#15121b" />
          ))}
          <rect x="70" y="140" width="184" height="6" fill="#15121b" />
          <path d="M240 44v104" stroke={PAPER} strokeOpacity="0.35" strokeWidth="1" />
        </g>
        <rect x="70" y="44" width="184" height="176" fill="none" stroke={PAPER} strokeOpacity="0.5" strokeWidth="2" />
        <path d="M162 44v176" stroke={INK} strokeWidth="4" />
        {/* Sill and its spill of light onto the wall */}
        <rect x="56" y="228" width="212" height="8" fill="#0f0d12" />
        <path d="M70 236h184l60 164H10z" fill={LILAC} opacity="0.07" />
      </g>

      {/* Shelf over the monitor, lit from underneath */}
      <g>
        <rect x="318" y="88" width="300" height="10" fill="#0f0d12" />
        <rect x="326" y="98" width="284" height="3" fill={ORANGE} opacity="0.95" />
        <path d="M326 101h284l50 60H276z" fill={ORANGE} opacity="0.12" />
        {/* A short run of volumes, spines out */}
        <rect x="334" y="44" width="14" height="44" fill="#d31e33" />
        <rect x="350" y="52" width="12" height="36" fill={BLUE} />
        <rect x="364" y="40" width="12" height="48" fill={PAPER} fillOpacity="0.8" />
        <rect x="378" y="50" width="10" height="38" fill={LILAC} />
        <rect x="390" y="46" width="14" height="42" fill="#d31e33" opacity="0.8" />
        {/* Acrylic display case with a shape inside — a shape, not a character */}
        <rect x="436" y="26" width="60" height="62" fill={PAPER} fillOpacity="0.06" stroke={PAPER} strokeOpacity="0.55" strokeWidth="2" />
        <path d="M442 32l48 50" stroke={PAPER} strokeOpacity="0.16" strokeWidth="6" />
        <rect x="454" y="50" width="24" height="38" fill="#0f0d12" />
        <path d="M466 40c-6 0-9 4-9 9 0 3 1 5 3 7-4 2-6 5-6 9v23h24V65c0-4-2-7-6-9 2-2 3-4 3-7 0-5-3-9-9-9z" fill="#0f0d12" stroke={ORANGE} strokeOpacity="0.55" strokeWidth="1.5" />
        {/* A small potted plant, because rooms have them */}
        <rect x="546" y="70" width="26" height="18" fill="#2c2733" stroke={PAPER} strokeOpacity="0.4" strokeWidth="1.5" />
        <path d="M559 70c-10-6-14-16-8-26 6 8 8 14 8 26zM559 70c10-6 14-16 8-26-6 8-8 14-8 26zM559 70V44" stroke="#8fd15a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Wall print, right: an abstract sun over a skyline. Original. */}
      <g>
        <rect x="716" y="96" width="150" height="190" fill={INK} stroke={PAPER} strokeOpacity="0.65" strokeWidth="3" />
        <rect x="728" y="108" width="126" height="166" fill="#241f2a" />
        <circle cx="791" cy="172" r="30" fill="url(#hs-sun)" />
        <path d="M728 192h126M728 200h126M728 208h126" stroke="#241f2a" strokeWidth="3" />
        <path d="M728 274v-44h14v-22h12v30h10v-40h16v18h12v-10h18v30h10v-20h14v22h20v36z" fill={INK} />
        <path d="M734 256h6M756 248h6M802 244h6M824 260h6" stroke={ORANGE} strokeWidth="2" opacity="0.85" />
      </g>

      {/* Desk */}
      <path d="M0 400h960v140H0z" fill="url(#hs-desk)" />
      <rect x="0" y="400" width="960" height="140" fill="url(#hs-halftone)" opacity="0.5" />
      {/* Lamp pool and screen spill on the desk surface */}
      <ellipse cx="270" cy="470" rx="200" ry="52" fill={ORANGE} opacity="0.13" />
      <ellipse cx="500" cy="450" rx="220" ry="40" fill={BLUE} opacity="0.12" />

      {/* Desk mat with a panel-gutter print */}
      <g>
        <rect x="250" y="424" width="440" height="92" rx="6" fill="#1c1922" stroke={PAPER} strokeOpacity="0.4" strokeWidth="2" />
        <path d="M390 424v92M530 424v92M250 474h140M530 474h160" stroke={PAPER} strokeOpacity="0.22" strokeWidth="3" />
        <path d="M264 436l36 24M542 490l40 22" stroke={RED} strokeOpacity="0.75" strokeWidth="2" />
        <ellipse cx="480" cy="440" rx="150" ry="14" fill={BLUE} opacity="0.16" />
      </g>

      {/* LED strip glow on the wall behind the monitor */}
      <rect x="318" y="140" width="324" height="220" rx="12" fill={BLUE} opacity="0.1" />
      <rect x="326" y="148" width="308" height="204" rx="8" fill={LILAC} opacity="0.08" />

      {/* Monitor on a stand */}
      <g>
        <rect x="410" y="378" width="140" height="10" rx="2" fill="#0f0d12" stroke={PAPER} strokeOpacity="0.35" strokeWidth="1.5" />
        <rect x="462" y="344" width="36" height="36" fill="#0f0d12" />
        <rect x="332" y="150" width="296" height="196" rx="6" fill="#0f0d12" stroke="#4a4248" strokeWidth="3" />
        <rect x="346" y="166" width="268" height="158" rx="3" fill="url(#hs-screen)" />
        <g clipPath="url(#hs-screen-clip)">
          <rect x="346" y="166" width="268" height="158" fill="url(#hs-grid)" />
          <rect x="366" y="188" width="110" height="66" fill={INK} fillOpacity="0.5" stroke={PAPER} strokeOpacity="0.7" strokeWidth="2" />
          <rect x="488" y="188" width="106" height="28" fill={INK} fillOpacity="0.5" stroke={PAPER} strokeOpacity="0.7" strokeWidth="2" />
          <rect x="488" y="226" width="106" height="28" fill={RED} fillOpacity="0.9" />
          <path d="M366 270h228M366 284h170M366 298h196" stroke={PAPER} strokeOpacity="0.55" strokeWidth="3" />
          {/* A diagonal panel cut across the screen — the desktop is a manga page too */}
          <path d="M346 324L614 166" stroke={PAPER} strokeOpacity="0.14" strokeWidth="2" />
        </g>
        {/* Screen bloom over the bezel */}
        <rect x="346" y="166" width="268" height="158" rx="3" fill="none" stroke={BLUE} strokeOpacity="0.55" strokeWidth="6" />
        <circle cx="480" cy="336" r="2.5" fill="#8fb0ff" />
      </g>

      {/* The desk spirit, peeking over the desk edge beside the monitor. Its
          own desk-edge line sits exactly on the desk top, so the two read as
          one edge. */}
      <g transform="translate(646 290)">
        <Mascot
          pose="peek"
          size={200}
          title={null}
          fill={PAPER}
          accent={RED}
          animate={false}
          className="text-[#17151a]"
        />
      </g>
      {/* Desk front edge: a dark rule the spirit's hands rest on. */}
      <path d="M0 400h960" stroke="#0f0d12" strokeWidth="5" />
      <path d="M0 397h960" stroke={PAPER} strokeOpacity="0.28" strokeWidth="1" />

      {/* Keyboard and mouse */}
      <g>
        <rect x="380" y="444" width="210" height="34" rx="4" fill="#2c2733" stroke={PAPER} strokeOpacity="0.5" strokeWidth="2" />
        <path d="M392 454h186M392 462h186M392 470h186" stroke={PAPER} strokeOpacity="0.25" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M380 480h210" stroke="#8fb0ff" strokeOpacity="0.9" strokeWidth="2.5" />
        <rect x="622" y="440" width="30" height="46" rx="14" fill="#2c2733" stroke={PAPER} strokeOpacity="0.5" strokeWidth="2" />
        <path d="M637 444v14" stroke={PAPER} strokeOpacity="0.5" strokeWidth="2" />
      </g>

      {/* Headphones on a stand */}
      <g>
        <path d="M880 400V286" stroke="#0f0d12" strokeWidth="6" />
        <rect x="852" y="394" width="56" height="8" rx="2" fill="#0f0d12" />
        <path d="M840 330c0-24 18-42 40-42s40 18 40 42" fill="none" stroke={PAPER} strokeOpacity="0.85" strokeWidth="6" strokeLinecap="round" />
        <rect x="830" y="326" width="20" height="34" rx="6" fill="#0f0d12" stroke={PAPER} strokeOpacity="0.7" strokeWidth="2" />
        <rect x="910" y="326" width="20" height="34" rx="6" fill="#0f0d12" stroke={PAPER} strokeOpacity="0.7" strokeWidth="2" />
        <path d="M840 360l-10 30M920 360l10 30" stroke={PAPER} strokeOpacity="0.3" strokeWidth="2" />
        <circle cx="840" cy="343" r="2" fill={RED} />
      </g>

      {/* Desk lamp, left: the warm side of the room */}
      <g>
        <path d="M150 264l150 132H124z" fill="url(#hs-cone)" />
        <path d="M140 398v-90l50-44" fill="none" stroke="#0f0d12" strokeWidth="6" strokeLinecap="round" />
        <path d="M180 258l34 10-10 22-34-10z" fill="#0f0d12" stroke={ORANGE} strokeOpacity="0.7" strokeWidth="1.5" />
        <path d="M204 290l-8-8" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        <circle cx="196" cy="284" r="14" fill={ORANGE} opacity="0.35" />
        <rect x="114" y="394" width="52" height="8" rx="2" fill="#0f0d12" />
      </g>

      {/* A mug, because it is late */}
      <g>
        <rect x="206" y="444" width="34" height="38" rx="3" fill={PAPER} fillOpacity="0.88" />
        <path d="M240 452h10a6 6 0 0 1 0 12h-10" fill="none" stroke={PAPER} strokeOpacity="0.88" strokeWidth="3" />
        <path d="M216 436c0-6 6-6 6-12M228 436c0-6 6-6 6-12" stroke={PAPER} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
        <rect x="212" y="452" width="22" height="6" fill={RED} opacity="0.85" />
      </g>

      {/* A trailing cable and the floor falling into shadow */}
      <path d="M552 388c30 14 60 8 90 30s60 40 100 50" fill="none" stroke="#0f0d12" strokeWidth="3" strokeLinecap="round" />
      <rect x="0" y="470" width="960" height="70" fill="url(#hs-floor-fade)" />
    </svg>
  )
}
