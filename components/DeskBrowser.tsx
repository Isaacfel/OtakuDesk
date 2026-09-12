'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Category, CatalogPick, LicenseStatus, SellerType } from '@/data/types'
import {
  CATEGORIES,
  LICENSE_LABEL,
  SELLER_LABEL,
  isPriceFresh,
} from '@/data/types'
import { COLLECTIONS } from '@/data/collections'
import { track } from '@/lib/analytics'
import { PickCard } from './PickCard'

/**
 * The browse surface for /desk.
 *
 * Everything happens client-side over the static PICKS array — with a catalog
 * that is hand-verified one row at a time, there is no size at which a search
 * backend earns its keep. Filter state mirrors into the URL query string so a
 * filtered view can be shared, but the page itself stays static.
 *
 * Facet counts are computed from the data, so they are honest by construction.
 * There is nothing here that could invent a rating, a stock level, or a
 * countdown; the only numbers on the page are prices with dates and counts of
 * real rows.
 */

type PriceBand = 'under-25' | '25-50' | '50-100' | '100-plus'
type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc'

const PRICE_BANDS: { value: PriceBand; label: string; min: number; max: number }[] = [
  { value: 'under-25', label: 'Under $25', min: 0, max: 25 },
  { value: '25-50', label: '$25 to $50', min: 25, max: 50 },
  { value: '50-100', label: '$50 to $100', min: 50, max: 100 },
  { value: '100-plus', label: '$100 and up', min: 100, max: Infinity },
]

const LICENSE_OPTIONS: LicenseStatus[] = [
  'officially_licensed',
  'original_design',
  'unverified',
]

const SELLER_OPTIONS: SellerType[] = [
  'licensed_retailer',
  'brand_direct',
  'marketplace',
  'independent_artist',
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

type Filters = {
  category: Category | ''
  licence: LicenseStatus | ''
  seller: SellerType | ''
  price: PriceBand | ''
  collection: string
}

const EMPTY_FILTERS: Filters = {
  category: '',
  licence: '',
  seller: '',
  price: '',
  collection: '',
}

/**
 * The price a pick may be sorted or filtered by. A price we would not display
 * (missing, or past its freshness window) is not one we should silently rank
 * by either — it is treated as unknown and sorts last.
 */
function usablePrice(pick: CatalogPick): number | null {
  return pick.price !== null && isPriceFresh(pick.priceCheckedAt) ? pick.price : null
}

function inBand(pick: CatalogPick, band: PriceBand): boolean {
  const price = usablePrice(pick)
  if (price === null) return false
  const def = PRICE_BANDS.find((b) => b.value === band)!
  return price >= def.min && price < def.max
}

function matchesQuery(pick: CatalogPick, q: string): boolean {
  if (!q) return true
  const hay = [pick.title, pick.description, pick.category, ...pick.tags]
    .join(' ')
    .toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term))
}

function matchesFilters(pick: CatalogPick, f: Filters, ignore?: keyof Filters): boolean {
  if (ignore !== 'category' && f.category && pick.category !== f.category) return false
  if (ignore !== 'licence' && f.licence && pick.licenseStatus !== f.licence) return false
  if (ignore !== 'seller' && f.seller && pick.sellerType !== f.seller) return false
  if (ignore !== 'price' && f.price && !inBand(pick, f.price)) return false
  if (ignore !== 'collection' && f.collection && !pick.collections.includes(f.collection))
    return false
  return true
}

function sortPicks(picks: CatalogPick[], sort: SortKey): CatalogPick[] {
  const byNewest = (a: CatalogPick, b: CatalogPick) =>
    b.addedAt.localeCompare(a.addedAt) || a.title.localeCompare(b.title)

  const byPrice = (dir: 1 | -1) => (a: CatalogPick, b: CatalogPick) => {
    const pa = usablePrice(a)
    const pb = usablePrice(b)
    // Unknown prices sort last in both directions; they are never treated as zero.
    if (pa === null && pb === null) return a.title.localeCompare(b.title)
    if (pa === null) return 1
    if (pb === null) return -1
    return (pa - pb) * dir || a.title.localeCompare(b.title)
  }

  const sorted = [...picks]
  switch (sort) {
    case 'featured':
      return sorted.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || byNewest(a, b),
      )
    case 'newest':
      return sorted.sort(byNewest)
    case 'price-asc':
      return sorted.sort(byPrice(1))
    case 'price-desc':
      return sorted.sort(byPrice(-1))
  }
}

const isCategory = (v: string): v is Category => (CATEGORIES as string[]).includes(v)
const isLicence = (v: string): v is LicenseStatus => (LICENSE_OPTIONS as string[]).includes(v)
const isSeller = (v: string): v is SellerType => (SELLER_OPTIONS as string[]).includes(v)
const isBand = (v: string): v is PriceBand => PRICE_BANDS.some((b) => b.value === v)
const isSort = (v: string): v is SortKey => SORT_OPTIONS.some((s) => s.value === v)

function parseUrlState(sp: URLSearchParams): {
  query: string
  filters: Filters
  sort: SortKey
} {
  const category = sp.get('category') ?? ''
  const licence = sp.get('licence') ?? ''
  const seller = sp.get('seller') ?? ''
  const price = sp.get('price') ?? ''
  const collection = sp.get('collection') ?? ''
  const sort = sp.get('sort') ?? ''
  return {
    query: sp.get('q') ?? '',
    filters: {
      category: isCategory(category) ? category : '',
      licence: isLicence(licence) ? licence : '',
      seller: isSeller(seller) ? seller : '',
      price: isBand(price) ? price : '',
      collection: COLLECTIONS.some((c) => c.slug === collection) ? collection : '',
    },
    sort: isSort(sort) ? sort : 'featured',
  }
}

function writeUrlState(query: string, filters: Filters, sort: SortKey) {
  if (typeof window === 'undefined') return
  const sp = new URLSearchParams()
  if (query) sp.set('q', query)
  if (filters.category) sp.set('category', filters.category)
  if (filters.licence) sp.set('licence', filters.licence)
  if (filters.seller) sp.set('seller', filters.seller)
  if (filters.price) sp.set('price', filters.price)
  if (filters.collection) sp.set('collection', filters.collection)
  if (sort !== 'featured') sp.set('sort', sort)
  const qs = sp.toString()
  const next = `${window.location.pathname}${qs ? `?${qs}` : ''}`
  if (next !== `${window.location.pathname}${window.location.search}`) {
    window.history.replaceState(null, '', next)
  }
}

export function DeskBrowser({ picks }: { picks: CatalogPick[] }) {
  // Initial state comes from a shared URL, read once. `useSearchParams` in a
  // statically rendered page defers this component to the client inside the
  // page's Suspense boundary, so there is no server/client mismatch.
  const searchParams = useSearchParams()
  const [initial] = useState(() => parseUrlState(searchParams))
  const [query, setQuery] = useState(initial.query)
  const [filters, setFilters] = useState<Filters>(initial.filters)
  const [sort, setSort] = useState<SortKey>(initial.sort)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelId = useId()
  const searchId = useId()
  const sortId = useId()
  const statusId = useId()

  // Mirror state back into the URL so the current view can be shared.
  useEffect(() => {
    writeUrlState(query, filters, sort)
  }, [query, filters, sort])

  const trimmed = query.trim()

  const results = useMemo(
    () =>
      sortPicks(
        picks.filter((p) => matchesQuery(p, trimmed) && matchesFilters(p, filters)),
        sort,
      ),
    [picks, trimmed, filters, sort],
  )

  // Facet counts: how many picks would match if this facet were set to a given
  // value, holding the query and every OTHER facet constant.
  const countFor = (facet: keyof Filters, predicate: (p: CatalogPick) => boolean) =>
    picks.filter(
      (p) => matchesQuery(p, trimmed) && matchesFilters(p, filters, facet) && predicate(p),
    ).length

  // Search analytics, debounced so a typed word logs once rather than per key.
  useEffect(() => {
    if (!trimmed) return
    const t = setTimeout(() => {
      track({ name: 'search', query: trimmed, resultCount: results.length })
    }, 500)
    return () => clearTimeout(t)
  }, [trimmed, results.length])

  function applyFilter<K extends keyof Filters>(facet: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [facet]: value }))
    track({ name: 'filter_apply', facet, value: value || 'all' })
  }

  function applySort(value: SortKey) {
    setSort(value)
    track({ name: 'filter_apply', facet: 'sort', value })
  }

  function clearAll() {
    setFilters(EMPTY_FILTERS)
    setQuery('')
    track({ name: 'filter_apply', facet: 'all', value: 'clear' })
  }

  const activeCount =
    Object.values(filters).filter(Boolean).length + (trimmed ? 1 : 0)

  const activeChips: { label: string; onRemove: () => void }[] = []
  if (trimmed) activeChips.push({ label: `“${trimmed}”`, onRemove: () => setQuery('') })
  if (filters.category)
    activeChips.push({ label: filters.category, onRemove: () => applyFilter('category', '') })
  if (filters.licence)
    activeChips.push({
      label: LICENSE_LABEL[filters.licence],
      onRemove: () => applyFilter('licence', ''),
    })
  if (filters.seller)
    activeChips.push({
      label: SELLER_LABEL[filters.seller],
      onRemove: () => applyFilter('seller', ''),
    })
  if (filters.price)
    activeChips.push({
      label: PRICE_BANDS.find((b) => b.value === filters.price)!.label,
      onRemove: () => applyFilter('price', ''),
    })
  if (filters.collection)
    activeChips.push({
      label: COLLECTIONS.find((c) => c.slug === filters.collection)?.name ?? filters.collection,
      onRemove: () => applyFilter('collection', ''),
    })

  // For the empty state: recommend featured picks, falling back to whatever is
  // newest. Never a dead end.
  const suggestions = useMemo(() => {
    const featured = sortPicks(picks.filter((p) => p.featured), 'featured')
    return (featured.length >= 3 ? featured : sortPicks(picks, 'newest')).slice(0, 3)
  }, [picks])

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
      {/* ---- Filter column ------------------------------------------------ */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between border border-line bg-surface px-4 py-3 text-sm font-medium text-paper lg:hidden"
        >
          <span>
            Filters
            {activeCount > 0 && (
              <span className="tnum ml-2 rounded-xs bg-shu-dim px-1.5 py-0.5 text-xs text-shu-bright">
                {activeCount}
              </span>
            )}
          </span>
          <span aria-hidden="true" className="text-muted">
            {panelOpen ? '−' : '+'}
          </span>
        </button>

        <div
          id={panelId}
          className={`${panelOpen ? 'block' : 'hidden'} mt-3 flex flex-col gap-6 border border-line bg-surface p-4 lg:mt-0 lg:block lg:border-0 lg:bg-transparent lg:p-0`}
        >
          <div className="flex items-baseline justify-between">
            <h2 className="label-xs text-muted">Refine</h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-paper-2 underline underline-offset-2 hover:text-paper"
              >
                Clear all
              </button>
            )}
          </div>

          <FacetGroup legend="Category">
            <FacetRadio
              name="category"
              value=""
              checked={filters.category === ''}
              label="All categories"
              count={countFor('category', () => true)}
              onChange={() => applyFilter('category', '')}
            />
            {CATEGORIES.map((c) => (
              <FacetRadio
                key={c}
                name="category"
                value={c}
                checked={filters.category === c}
                label={c}
                count={countFor('category', (p) => p.category === c)}
                onChange={() => applyFilter('category', c)}
              />
            ))}
          </FacetGroup>

          <FacetGroup legend="Licence">
            <FacetRadio
              name="licence"
              value=""
              checked={filters.licence === ''}
              label="Any licence status"
              count={countFor('licence', () => true)}
              onChange={() => applyFilter('licence', '')}
            />
            {LICENSE_OPTIONS.map((l) => (
              <FacetRadio
                key={l}
                name="licence"
                value={l}
                checked={filters.licence === l}
                label={LICENSE_LABEL[l]}
                count={countFor('licence', (p) => p.licenseStatus === l)}
                onChange={() => applyFilter('licence', l)}
              />
            ))}
          </FacetGroup>

          <FacetGroup legend="Seller">
            <FacetRadio
              name="seller"
              value=""
              checked={filters.seller === ''}
              label="Any seller type"
              count={countFor('seller', () => true)}
              onChange={() => applyFilter('seller', '')}
            />
            {SELLER_OPTIONS.map((s) => (
              <FacetRadio
                key={s}
                name="seller"
                value={s}
                checked={filters.seller === s}
                label={SELLER_LABEL[s]}
                count={countFor('seller', (p) => p.sellerType === s)}
                onChange={() => applyFilter('seller', s)}
              />
            ))}
          </FacetGroup>

          <FacetGroup legend="Price" hint="Picks without a current price are left out of a price band.">
            <FacetRadio
              name="price"
              value=""
              checked={filters.price === ''}
              label="Any price"
              count={countFor('price', () => true)}
              onChange={() => applyFilter('price', '')}
            />
            {PRICE_BANDS.map((b) => (
              <FacetRadio
                key={b.value}
                name="price"
                value={b.value}
                checked={filters.price === b.value}
                label={b.label}
                count={countFor('price', (p) => inBand(p, b.value))}
                onChange={() => applyFilter('price', b.value)}
              />
            ))}
          </FacetGroup>

          <FacetGroup legend="Collection">
            <FacetRadio
              name="collection"
              value=""
              checked={filters.collection === ''}
              label="All collections"
              count={countFor('collection', () => true)}
              onChange={() => applyFilter('collection', '')}
            />
            {COLLECTIONS.map((c) => (
              <FacetRadio
                key={c.slug}
                name="collection"
                value={c.slug}
                checked={filters.collection === c.slug}
                label={c.name}
                count={countFor('collection', (p) => p.collections.includes(c.slug))}
                onChange={() => applyFilter('collection', c.slug)}
              />
            ))}
          </FacetGroup>
        </div>
      </div>

      {/* ---- Results column ---------------------------------------------- */}
      <div className="min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <label htmlFor={searchId} className="label-xs mb-1.5 block text-muted">
              Search the desk
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="desk, lighting, convention, giftable…"
              autoComplete="off"
              aria-describedby={statusId}
              className="w-full border border-line bg-surface px-3 py-2.5 text-sm text-paper placeholder:text-muted focus:border-shu focus:outline-none"
            />
          </div>
          <div className="sm:w-56">
            <label htmlFor={sortId} className="label-xs mb-1.5 block text-muted">
              Sort by
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => applySort(e.target.value as SortKey)}
              className="w-full border border-line bg-surface px-3 py-2.5 text-sm text-paper focus:border-shu focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-line-soft pb-4">
          <p id={statusId} role="status" className="tnum text-sm text-paper-2">
            {results.length === picks.length ? (
              <>
                {picks.length} {picks.length === 1 ? 'pick' : 'picks'}
              </>
            ) : (
              <>
                <span className="text-paper">{results.length}</span> of {picks.length}{' '}
                picks
              </>
            )}
          </p>
          {activeChips.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Active filters">
              {activeChips.map((chip) => (
                <li key={chip.label}>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="flex items-center gap-1.5 rounded-xs border border-line bg-surface px-2 py-1 text-xs text-paper-2 hover:border-shu hover:text-paper"
                  >
                    {chip.label}
                    <span aria-hidden="true" className="text-muted">
                      ×
                    </span>
                    <span className="sr-only">Remove filter</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {results.length > 0 ? (
          <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((pick, i) => (
              <li key={pick.id}>
                <PickCard pick={pick} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6">
            <div className="border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-paper">
                Nothing matches that yet.
              </h2>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-paper-2">
                The catalog is small on purpose — every pick is verified by hand, so
                gaps are real gaps rather than a search that missed. Try a broader
                search, drop a filter, or start from one of the picks below.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 inline-block bg-shu px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-shu-bright"
              >
                Clear search and filters
              </button>
            </div>

            <h3 className="label-xs mt-10 mb-4 text-muted">Start here instead</h3>
            <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {suggestions.map((pick) => (
                <li key={pick.id}>
                  <PickCard pick={pick} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

/* --- Facet primitives ------------------------------------------------------ */

function FacetGroup({
  legend,
  hint,
  children,
}: {
  legend: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <fieldset className="border-t border-line-soft pt-4">
      <legend className="label-xs float-left mb-3 text-muted">{legend}</legend>
      <div className="clear-left flex flex-col gap-1.5">{children}</div>
      {hint && <p className="mt-2 text-[11px] leading-snug text-muted">{hint}</p>}
    </fieldset>
  )
}

function FacetRadio({
  name,
  value,
  checked,
  label,
  count,
  onChange,
}: {
  name: string
  value: string
  checked: boolean
  label: string
  count: number
  onChange: () => void
}) {
  // A zero-count option stays visible so the facet's shape is legible, but is
  // disabled unless it is the one currently selected (so it can be unselected).
  const disabled = count === 0 && !checked
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 text-sm ${
        disabled ? 'cursor-not-allowed text-muted/60' : checked ? 'text-paper' : 'text-paper-2 hover:text-paper'
      }`}
    >
      <span className="flex items-center gap-2">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          className="h-3.5 w-3.5 shrink-0 accent-shu"
        />
        <span>{label}</span>
      </span>
      <span className="tnum text-xs text-muted">{count}</span>
    </label>
  )
}
