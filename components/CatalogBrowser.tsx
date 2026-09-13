'use client'

import { useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { CatalogPick, Category } from '@/data/types'
import { CATEGORIES, isPriceFresh, isPurchasable } from '@/data/types'
import { ProductGrid } from './ProductCard'

/**
 * The catalog: category tabs, a sort control, and the grid.
 *
 * State lives in the URL (`category`, `sort`, `q`) so a filtered view can be
 * shared and the header's search form can land here with `?q=`. Receives
 * `CatalogPick`s only — no `purchaseUrl` ever reaches the client bundle.
 */

type Sort = 'featured' | 'newest' | 'price-asc' | 'price-desc'

const SORTS: Array<{ value: Sort; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const isCategory = (v: string): v is Category => (CATEGORIES as string[]).includes(v)
const isSort = (v: string): v is Sort => SORTS.some((s) => s.value === v)

function livePrice(p: CatalogPick): number | null {
  return isPurchasable(p) && p.price !== null && isPriceFresh(p.priceCheckedAt) ? p.price : null
}

function byNewest(a: CatalogPick, b: CatalogPick) {
  return b.addedAt.localeCompare(a.addedAt) || a.title.localeCompare(b.title)
}

function sortPicks(picks: CatalogPick[], sort: Sort): CatalogPick[] {
  const out = [...picks]
  switch (sort) {
    case 'newest':
      return out.sort(byNewest)
    case 'price-asc':
    case 'price-desc': {
      const dir = sort === 'price-asc' ? 1 : -1
      return out.sort((a, b) => {
        const pa = livePrice(a)
        const pb = livePrice(b)
        if (pa === null && pb === null) return byNewest(a, b)
        if (pa === null) return 1
        if (pb === null) return -1
        return (pa - pb) * dir || byNewest(a, b)
      })
    }
    default:
      return out.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || byNewest(a, b),
      )
  }
}

export function CatalogBrowser({
  picks,
  categories,
}: {
  picks: CatalogPick[]
  categories: Array<{ value: Category; label: string }>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const rawCategory = sp.get('category') ?? ''
  const category: Category | '' = isCategory(rawCategory) ? rawCategory : ''
  const rawSort = sp.get('sort') ?? ''
  const sort: Sort = isSort(rawSort) ? rawSort : 'featured'
  const query = (sp.get('q') ?? '').trim()

  // Sort changes are cheap; track a pending value so the select feels instant
  // while the URL catches up.
  const [pendingSort, setPendingSort] = useState<Sort | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function update(params: Record<string, string>) {
    const next = new URLSearchParams(sp.toString())
    for (const [k, v] of Object.entries(params)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    const qs = next.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  function changeSort(value: Sort) {
    setPendingSort(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setPendingSort(null), 300)
    update({ sort: value === 'featured' ? '' : value })
  }

  const shown = useMemo(() => {
    const q = query.toLowerCase()
    const filtered = picks.filter((p) => {
      if (category && p.category !== category) return false
      if (!q) return true
      return [p.title, p.description, p.category, ...p.tags].join(' ').toLowerCase().includes(q)
    })
    return sortPicks(filtered, sort)
  }, [picks, category, query, sort])

  const tabClass = (active: boolean) =>
    `whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
      active
        ? 'border-accent font-semibold text-fg'
        : 'border-transparent text-fg-muted hover:text-fg'
    }`

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line">
        <div role="tablist" aria-label="Category" className="-mb-px flex overflow-x-auto">
          <button
            type="button"
            role="tab"
            aria-selected={category === ''}
            className={tabClass(category === '')}
            onClick={() => update({ category: '' })}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              role="tab"
              aria-selected={category === c.value}
              className={tabClass(category === c.value)}
              onClick={() => update({ category: c.value })}
            >
              {c.label}
            </button>
          ))}
        </div>

        <label className="mb-2 flex items-center gap-2 text-sm text-fg-muted">
          <span>Sort</span>
          <select
            value={pendingSort ?? sort}
            onChange={(e) => changeSort(e.target.value as Sort)}
            className="rounded-md border border-line bg-bg px-2 py-1.5 text-sm text-fg"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-fg-muted">
        <p className="tnum">
          {query ? (
            <>
              {shown.length} {shown.length === 1 ? 'result' : 'results'} for &ldquo;{query}&rdquo;{' '}
              <button
                type="button"
                onClick={() => update({ q: '' })}
                className="ml-1 underline underline-offset-2 hover:text-fg"
              >
                Clear
              </button>
            </>
          ) : (
            <>
              {shown.length} {shown.length === 1 ? 'item' : 'items'}
            </>
          )}
        </p>
      </div>

      <div className="mt-4">
        {shown.length > 0 ? (
          <ProductGrid picks={shown} />
        ) : (
          <p className="py-16 text-center text-sm text-fg-muted">No products match.</p>
        )}
      </div>
    </div>
  )
}
