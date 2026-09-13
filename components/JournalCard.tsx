import Link from 'next/link'
import { formatPostDate, type PostMeta } from '@/app/journal/_posts'

export function JournalCard({ post }: { post: PostMeta & { slug: string } }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="group flex h-full flex-col rounded-md border border-line bg-bg p-4 transition-colors hover:border-line-strong"
    >
      <time dateTime={post.date} className="tnum text-xs text-fg-muted">
        {formatPostDate(post.date)}
      </time>
      <h3 className="mt-2 font-semibold leading-snug text-fg transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-fg-muted">{post.description}</p>
    </Link>
  )
}

export function JournalGrid({ posts }: { posts: Array<PostMeta & { slug: string }> }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {posts.map((post) => (
        <li key={post.slug}>
          <JournalCard post={post} />
        </li>
      ))}
    </ul>
  )
}
