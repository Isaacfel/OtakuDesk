import type { MDXComponents } from 'mdx/types'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import Link from 'next/link'

/**
 * Global MDX component map.
 *
 * Required at the project root by @next/mdx (App Router). In Next 16
 * `useMDXComponents()` takes no argument. Without this file MDX fails silently.
 *
 * Typography is handled by the `Prose` wrapper below rather than by the
 * Tailwind typography plugin, so globals.css is untouched and the same
 * class string styles both MDX articles and the hand-written legal pages.
 */

/* ---------------------------------------------------------------------------
   Prose — long-form typography built from the design tokens.
   Descendant selectors keep the MDX output as plain semantic HTML.
   ------------------------------------------------------------------------- */

const PROSE_CLASSES = [
  'text-[1.0625rem] leading-[1.7] text-paper-2',
  '[&>*:first-child]:mt-0',
  // Headings. Base h2/h3 rules in globals.css already set display face + weight.
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:leading-tight [&_h2]:text-paper',
  '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:leading-snug [&_h3]:text-paper',
  // Body.
  '[&_p]:my-5',
  '[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6',
  '[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li]:my-2 [&_li]:pl-1 marker:text-shu',
  '[&_strong]:font-semibold [&_strong]:text-paper',
  '[&_em]:italic',
  '[&_blockquote]:my-7 [&_blockquote]:border-l-2 [&_blockquote]:border-shu [&_blockquote]:pl-5 [&_blockquote]:text-paper',
  '[&_hr]:my-10 [&_hr]:border-line-soft',
  '[&_code]:font-mono [&_code]:text-[0.9em] [&_code]:rounded-xs [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-paper',
  // Links. Internal links render through next/link (see `A` below).
  '[&_a]:text-shu [&_a]:underline [&_a]:decoration-shu/40 [&_a]:underline-offset-[3px] [&_a:hover]:text-shu-bright [&_a:hover]:decoration-shu-bright',
  // Tables sit in their own scroll container so the body never scrolls sideways.
  '[&_table]:my-6 [&_table]:w-full [&_table]:text-sm [&_table]:text-left',
  '[&_th]:label-xs [&_th]:border-b [&_th]:border-line [&_th]:py-2 [&_th]:pr-4 [&_th]:text-muted',
  '[&_td]:border-b [&_td]:border-line-soft [&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top',
].join(' ')

export function Prose({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`${PROSE_CLASSES} ${className}`}>{children}</div>
}

/* ---------------------------------------------------------------------------
   Element overrides
   ------------------------------------------------------------------------- */

/**
 * Anchor. Internal hrefs use next/link. External hrefs are permitted for
 * reference links only and get a defensive rel — but note that merchant links
 * must NEVER be written in article copy. The only sanctioned outbound path is
 * <OutboundButton />, which carries the disclosure by construction.
 */
function A({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const internal = href.startsWith('/') || href.startsWith('#')
  if (internal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} rel="nofollow noopener" target="_blank" {...rest}>
      {children}
    </a>
  )
}

/** Tables get a horizontal scroll container so narrow screens never overflow. */
function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  )
}

/**
 * Callout — an aside for the one paragraph an article most needs read.
 * Available in every .mdx file without an import.
 */
export function Callout({
  label,
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <aside className="my-8 rounded-sm border border-line bg-surface p-5 text-paper-2 [&_p]:my-0! [&_p+p]:mt-3!">
      {label && <p className="label-xs mb-2! text-shu">{label}</p>}
      {children}
    </aside>
  )
}

const components: MDXComponents = {
  a: A,
  table: Table,
  Callout,
}

export function useMDXComponents(): MDXComponents {
  return components
}
