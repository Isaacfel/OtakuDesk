import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header, Footer } from '@/components/Shell'
import { ProductGrid } from '@/components/ProductCard'
import { Prose } from '@/mdx-components'
import { getPickBySlug } from '@/data/picks'
import { toCatalogPick } from '@/data/types'
import { JOURNAL_SLUGS, isJournalSlug, loadPost, formatPostDate } from '../_posts'

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
 * A journal article. Articles never link to a merchant; products they mention
 * link to their own page, where the buy button lives.
 */
export default async function JournalArticle({ params }: Props) {
  const { slug } = await params
  if (!isJournalSlug(slug)) notFound()

  const { default: Post, metadata } = await loadPost(slug)

  const picks = (metadata.picks ?? [])
    .map(getPickBySlug)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(toCatalogPick)

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
        <article className="mx-auto max-w-[68ch]">
          <header>
            <p className="text-sm text-fg-muted">
              <Link href="/journal" className="hover:text-fg">
                Journal
              </Link>{' '}
              <span aria-hidden="true">&middot;</span>{' '}
              <time dateTime={metadata.date} className="tnum">
                {formatPostDate(metadata.date)}
              </time>
            </p>
            <h1 className="mt-3 text-3xl leading-tight text-fg sm:text-4xl">{metadata.title}</h1>
            <p className="mt-3 text-lg leading-relaxed text-fg-muted">{metadata.description}</p>
            <hr className="mt-8 border-line" />
          </header>

          <Prose className="mt-8">
            <Post />
          </Prose>
        </article>

        {picks.length > 0 && (
          <section className="mt-16" aria-labelledby="picks-mentioned">
            <h2 id="picks-mentioned" className="mb-4 text-xl font-bold text-fg">
              Mentioned in this article
            </h2>
            <ProductGrid picks={picks} />
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
