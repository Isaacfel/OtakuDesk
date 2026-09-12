import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/Shell'
import { PickCard } from '@/components/PickCard'
import { Prose } from '@/mdx-components'
import { getPickBySlug } from '@/data/picks'
import {
  JOURNAL_SLUGS,
  isJournalSlug,
  loadPost,
  formatPostDate,
} from '../_posts'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return JOURNAL_SLUGS.map((slug) => ({ slug }))
}

// Anything not in the registry is a 404, not a runtime import attempt.
export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (!isJournalSlug(slug)) return {}
  const { metadata } = await loadPost(slug)
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      type: 'article',
      title: metadata.title,
      description: metadata.description,
      publishedTime: metadata.date,
    },
  }
}

/**
 * A journal article.
 *
 * The article never links to a merchant. Picks it mentions link to their own
 * page, where the seller, the licence label, and the price date are all
 * visible before any outbound button — and the cards at the foot of the
 * article are the same PickCard the catalog uses, so nothing here can render
 * a pick as buyable when it is not.
 */
export default async function JournalArticle({ params }: Props) {
  const { slug } = await params
  if (!isJournalSlug(slug)) notFound()

  const { default: Post, metadata } = await loadPost(slug)

  const picks = (metadata.picks ?? [])
    .map(getPickBySlug)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-5 pt-10 pb-8 sm:pt-14">
        <article className="mx-auto max-w-[68ch]">
          <header>
            <p className="label-xs text-muted">
              <Link href="/journal" className="hover:text-paper-2">
                Journal
              </Link>{' '}
              <span aria-hidden="true">·</span>{' '}
              <time dateTime={metadata.date} className="tnum normal-case tracking-normal">
                {formatPostDate(metadata.date)}
              </time>
            </p>
            <h1 className="mt-4 text-3xl leading-[1.1] sm:text-4xl">
              {metadata.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-paper-2">
              {metadata.description}
            </p>
            <hr className="mt-8 border-line" />
          </header>

          <Prose className="mt-8">
            <Post />
          </Prose>

          <footer className="mt-12 border-t border-line-soft pt-6 text-sm leading-relaxed text-muted">
            <p>
              Picks mentioned above link to their own page on this site, never
              straight to a shop. Where we earn a commission on a purchase, the
              buy button says so in a full sentence beside it.{' '}
              <Link href="/disclosure" className="text-paper-2 underline underline-offset-2 hover:text-paper">
                How this site is paid
              </Link>
              .
            </p>
          </footer>
        </article>

        {picks.length > 0 && (
          <section className="mt-16 border-t border-line pt-8" aria-labelledby="picks-mentioned">
            <h2 id="picks-mentioned" className="label-xs text-muted">
              Picks mentioned
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {picks.map((pick) => (
                <PickCard key={pick.id} pick={pick} />
              ))}
            </div>
          </section>
        )}

        <p className="mt-12">
          <Link href="/journal" className="text-sm text-paper-2 underline underline-offset-2 hover:text-paper">
            <span aria-hidden="true">←</span> All articles
          </Link>
        </p>
      </main>
      <Footer />
    </>
  )
}
