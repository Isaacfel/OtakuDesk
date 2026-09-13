import type { Metadata } from 'next'
import { Header, Footer } from '@/components/Shell'
import { JournalGrid } from '@/components/JournalCard'
import { loadAllPosts } from './_posts'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'How to spot a bootleg, what a licence actually means, and how to set up an anime desk with restraint.',
}

export default async function JournalIndex() {
  const posts = await loadAllPosts()

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        <h1 className="mb-4 text-2xl font-bold text-fg">Journal</h1>
        <JournalGrid posts={posts} />
      </main>
      <Footer />
    </>
  )
}
