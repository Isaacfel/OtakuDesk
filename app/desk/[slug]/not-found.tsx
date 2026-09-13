import Link from 'next/link'
import { Header, Footer } from '@/components/Shell'

export default function PickNotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24">
        <p className="label-xs text-fg-muted">404</p>
        <h1 className="mt-3 text-2xl font-bold text-fg sm:text-3xl">
          This product isn&rsquo;t here.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-fg-muted">
          It may have been removed, or the link may be mistyped.
        </p>
        <Link
          href="/desk"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          All products
        </Link>
      </main>
      <Footer />
    </>
  )
}
