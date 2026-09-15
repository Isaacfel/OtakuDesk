import Link from 'next/link'

/**
 * Home banner: the owner-supplied artwork in /public with a short line of
 * copy over it. The image is stated by the owner to be a public, free-to-use
 * animation still (recorded here and in the commit that added it).
 *
 * Copy sits over a left-side gradient so it reads against the red without
 * covering the picture. Two lines and one button; nothing else.
 */

/**
 * The animation ships as animated WebP (523 KB against the source GIF's
 * 2.8 MB, same frames); the JPEG is its first frame, the fallback for a
 * browser without WebP and the social-preview image.
 */
export const BANNER = { webp: '/banner.webp', poster: '/banner.jpg' } as const

export function HeroBanner() {
  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden border-b border-line bg-bg-soft">
      <picture>
        <source type="image/webp" srcSet={BANNER.webp} />
        <img
          src={BANNER.poster}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      </picture>
      {/* Legibility gradient: dark on the left, clear on the right. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
      />
      <div className="relative mx-auto flex h-56 max-w-6xl flex-col justify-center px-4 sm:h-72 md:h-80">
        <h1 id="hero-heading" className="max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Anime merch, checked.
        </h1>
        <p className="mt-3 max-w-md text-sm text-white/90 sm:text-base">
          Licence status, real seller, dated price. Every item.
        </p>
        <Link
          href="/desk"
          className="mt-6 inline-block w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Shop all products
        </Link>
      </div>
    </section>
  )
}
