import type { Metadata } from 'next'
import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'
import { loadAllPosts, formatPostDate } from './_posts'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Notes on buying anime room, desk, and convention gear well: how to spot a bootleg, what a licence actually means, and how to set up a space with restraint.',
}

/**
 * The journal index.
 *
 * This is the traffic engine, so the list is the page. No hero image, no
 * category chips, no "featured" carousel — a dated list of titles and one-line
 * descriptions, which is what a reader arriving from search actually wants.
 */
export default async function JournalIndex() {
  const posts = await loadAllPosts()

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-5 pt-10 pb-8 sm:pt-14">
        <header className="max-w-[60ch]">
          <p className="label-xs text-muted">Journal</p>
          <h1 className="mt-3 text-3xl leading-[1.1] sm:text-4xl">
            Notes on buying well.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-paper-2">
            How to tell a licensed product from a bootleg, what our labels mean,
            and how to build a desk or a con bag with some restraint. Written to
            be useful whether or not you buy anything through us.
          </p>
          <div className="screentone mt-6 h-3 w-24" aria-hidden="true" />
        </header>

        <ol className="mt-10 divide-y divide-line-soft border-y border-line">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/journal/${post.slug}`}
                className="group grid gap-2 py-7 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <time
                  dateTime={post.date}
                  className="tnum pt-1 text-xs text-muted"
                >
                  {formatPostDate(post.date)}
                </time>
                <div>
                  <h2 className="text-xl leading-tight transition-colors group-hover:text-shu-bright sm:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-paper-2">
                    {post.description}
                  </p>
                  <span className="mt-3 inline-block text-xs text-muted transition-colors group-hover:text-paper-2">
                    Read <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-8 max-w-[60ch] text-sm leading-relaxed text-muted">
          Articles link to picks in{' '}
          <Link href="/vault" className="text-paper-2 underline underline-offset-2 hover:text-paper">
            the Vault
          </Link>
          . Every pick page shows the seller, the licence status, and the date
          the price was checked before you see any buy link.
        </p>
      </main>
      <Footer />
    </>
  )
}
