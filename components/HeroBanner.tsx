import Link from 'next/link'
import type { CatalogPick } from '@/data/types'

/**
 * Home banner: the headline beside a shelf of real product photos.
 *
 * The photos are the catalog's own listing images, so the banner shows what
 * is actually for sale and adds no artwork we do not have rights to.
 */
export function HeroBanner({ picks }: { picks: CatalogPick[] }) {
  const shelf = picks.filter((p) => p.images[0]?.src).slice(0, 8)

  return (
    <section className="border-b border-line bg-bg-soft">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:py-12">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl lg:text-5xl">
            Anime merch we&rsquo;ve checked.
          </h1>
          <p className="mt-3 text-base text-fg-muted sm:text-lg">Every link goes to the real seller.</p>
          <Link
            href="/desk"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Shop all products
          </Link>
        </div>

        <ul className="grid grid-cols-4 gap-2 sm:gap-3">
          {shelf.map((pick) => (
            <li key={pick.id}>
              <Link
                href={`/desk/${pick.slug}`}
                aria-label={pick.title}
                className="block overflow-hidden rounded-md border border-line bg-bg transition-colors hover:border-line-strong"
              >
                {/* Listing image; see ProductCard for why this is a plain img. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pick.images[0].src}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="aspect-square w-full object-contain p-2 mix-blend-multiply"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
