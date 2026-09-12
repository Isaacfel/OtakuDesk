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
import { COLLECTIONS, SETS } from '@/data/collections'
import { track } from '@/lib/analytics'
import { GlowOrb, Mascot, SparkleField, SpeedStreaks } from '@/components/motifs'
import { PickCard, Sticker } from './PickCard'
import { glowVars, GLOW, GLOW_HOVER } from './PickThumb'

/**
 * The browse surface for /desk — a lit shelf at night.
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
 *
 * Two browse aids sit on top of the facets and are LOCAL state only (not in
 * the URL, no backend):
 *
 *   - The mood selector, a shortcut over existing tags. Each mood names the
 *     tags it stands for, so it reads as a lens rather than a verdict, and a
 *     mood with no tagged picks says so instead of padding the grid.
 *   - "Show me a setup", which reveals one of the curated SETS as a reading
 *     order. Sets are not bundles: no bundle price, each pick links out on its
 *     own page through its own seller.
 *
 * The room's light is the visual system: inputs glow screen-blue on focus,
 * the active mood glows in its own colour, the setup is a dark spread with
 * a red lamp behind it, and the desk spirit turns up when a shelf is empty.
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

/* --- Moods ------------------------------------------------------------------
   A mood is a named bag of EXISTING tags. Nothing is inferred from the copy or
   the price; a pick is in a mood only if it carries one of the listed tags, and
   the list is printed next to the selector so the reader can see the rule.
   `light` is purely the colour the chip glows when it is on. */

type Mood = 'calm' | 'colourful' | 'cyber' | 'cozy' | 'minimal' | 'collector'
type Light = '--shu' | '--blue' | '--lilac' | '--green' | '--orange' | '--paper'

const MOODS: { value: Mood; label: string; tags: string[]; light: Light }[] = [
  { value: 'calm', label: 'Calm', tags: ['subtle', 'ergonomics', 'renter friendly'], light: '--blue' },
  { value: 'colourful', label: 'Colourful', tags: ['original design', 'wall art'], light: '--lilac' },
  { value: 'cyber', label: 'Cyber', tags: ['gaming', 'lighting'], light: '--shu' },
  { value: 'cozy', label: 'Cozy', tags: ['lighting', 'room decor', 'everyday', 'outerwear'], light: '--orange' },
  { value: 'minimal', label: 'Minimal', tags: ['subtle', 'small space', 'ergonomics'], light: '--paper' },
  { value: 'collector', label: 'Collector', tags: ['collector', 'display', 'pins', 'protection'], light: '--green' },
]

function matchesMood(pick: CatalogPick, mood: Mood | ''): boolean {
  if (!mood) return true
  const def = MOODS.find((m) => m.value === mood)
  if (!def) return true
  return pick.tags.some((t) => def.tags.includes(t))
}

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

/* Shared control styling: a hard-edged field that lights up screen-blue when
   it has focus, the way a monitor does in a dark room. */
const FIELD =
  'w-full border border-line bg-surface text-sm text-paper placeholder:text-muted transition-[border-color,box-shadow] focus:border-blue focus:outline-none focus:bloom-blue'

export function DeskBrowser({ picks }: { picks: CatalogPick[] }) {
  // Initial state comes from a shared URL, read once. `useSearchParams` in a
  // statically rendered page defers this component to the client inside the
  // page's Suspense boundary, so there is no server/client mismatch.
  const searchParams = useSearchParams()
  const [initial] = useState(() => parseUrlState(searchParams))
  const [query, setQuery] = useState(initial.query)
  const [filters, setFilters] = useState<Filters>(initial.filters)
  const [sort, setSort] = useState<SortKey>(initial.sort)
  const [mood, setMood] = useState<Mood | ''>('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [setupOpen, setSetupOpen] = useState(false)
  const [setupIndex, setSetupIndex] = useState(0)
  const panelId = useId()
  const searchId = useId()
  const sortId = useId()
  const statusId = useId()
  const setupId = useId()
  const moodId = useId()

  // Mirror state back into the URL so the current view can be shared.
  useEffect(() => {
    writeUrlState(query, filters, sort)
  }, [query, filters, sort])

  const trimmed = query.trim()

  const results = useMemo(
    () =>
      sortPicks(
        picks.filter(
          (p) => matchesQuery(p, trimmed) && matchesFilters(p, filters) && matchesMood(p, mood),
        ),
        sort,
      ),
    [picks, trimmed, filters, sort, mood],
  )

  // Facet counts: how many picks would match if this facet were set to a given
  // value, holding the query, the mood and every OTHER facet constant.
  const countFor = (facet: keyof Filters, predicate: (p: CatalogPick) => boolean) =>
    picks.filter(
      (p) =>
        matchesQuery(p, trimmed) &&
        matchesFilters(p, filters, facet) &&
        matchesMood(p, mood) &&
        predicate(p),
    ).length

  // Mood counts are over the WHOLE catalog, so a mood's number is a fact about
  // our tagging and not a moving target as filters change.
  const moodCount = (m: Mood) => picks.filter((p) => matchesMood(p, m)).length

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

  function applyMood(value: Mood | '') {
    setMood(value)
    track({ name: 'filter_apply', facet: 'mood', value: value || 'all' })
  }

  function clearAll() {
    setFilters(EMPTY_FILTERS)
    setQuery('')
    setMood('')
    track({ name: 'filter_apply', facet: 'all', value: 'clear' })
  }

  // Curated sets, resolved against the catalog we were handed. A set whose
  // picks have been retired down to one is not a setup and is skipped.
  const byId = useMemo(() => new Map(picks.map((p) => [p.id, p])), [picks])
  const setups = useMemo(
    () =>
      SETS.map((s) => ({
        ...s,
        picks: s.pickIds
          .map((id) => byId.get(id))
          .filter((p): p is CatalogPick => p !== undefined)
          .slice(0, 5),
      })).filter((s) => s.picks.length >= 2),
    [byId],
  )
  const setup = setups.length > 0 ? setups[setupIndex % setups.length] : null

  function revealSetup(index: number) {
    setSetupIndex(index)
    setSetupOpen(true)
    const s = setups[index % setups.length]
    if (s) track({ name: 'filter_apply', facet: 'setup', value: s.slug })
  }

  const activeCount =
    Object.values(filters).filter(Boolean).length + (trimmed ? 1 : 0) + (mood ? 1 : 0)

  const activeChips: { label: string; onRemove: () => void }[] = []
  if (trimmed) activeChips.push({ label: `“${trimmed}”`, onRemove: () => setQuery('') })
  if (mood)
    activeChips.push({
      label: `Mood: ${MOODS.find((m) => m.value === mood)?.label ?? mood}`,
      onRemove: () => applyMood(''),
    })
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

  const activeMood = MOODS.find((m) => m.value === mood)
  // True when the mood alone — before any other filter — matches nothing. The
  // honest message is then "we have not tagged anything for this", not "try
  // dropping a filter".
  const moodIsEmpty = Boolean(mood) && picks.every((p) => !matchesMood(p, mood))

  return (
    <div className="lg:grid lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-x-12">
      {/* ---- Toolbar: sticky and compact on mobile, a plain row on desktop ---- */}
      <div className="sticky top-0 z-20 -mx-5 border-b border-line bg-ink/92 px-5 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-ink/80 lg:static lg:col-start-2 lg:row-start-1 lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="flex items-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            aria-controls={panelId}
            className={`flex shrink-0 items-center gap-1.5 border px-3 py-2.5 text-sm font-semibold transition-colors lg:hidden ${
              panelOpen ? 'border-paper bg-paper text-ink' : 'border-line bg-surface text-paper'
            }`}
          >
            <span aria-hidden="true" className="tnum">
              {panelOpen ? '−' : '+'}
            </span>
            Filters
            {activeCount > 0 && (
              <span className="tnum bg-shu px-1.5 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
          </button>

          <div className="min-w-0 flex-1">
            <label htmlFor={searchId} className="label-xs mb-1.5 hidden text-muted lg:block">
              Search the desk
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="desk, lighting, convention, giftable…"
              autoComplete="off"
              aria-label="Search the desk"
              aria-describedby={statusId}
              className={`${FIELD} px-3 py-2.5`}
            />
          </div>

          <div className="w-28 shrink-0 sm:w-44 lg:w-56">
            <label htmlFor={sortId} className="label-xs mb-1.5 hidden text-muted lg:block">
              Sort by
            </label>
            <select
              id={sortId}
              value={sort}
              onChange={(e) => applySort(e.target.value as SortKey)}
              aria-label="Sort by"
              className={`${FIELD} px-2 py-2.5 sm:px-3`}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ---- Filter column ------------------------------------------------ */}
      <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-6 lg:self-start">
        <div
          id={panelId}
          className={`${panelOpen ? 'block' : 'hidden'} mt-3 flex flex-col gap-6 border border-line bg-surface p-4 lg:mt-0 lg:block lg:border-0 lg:bg-transparent lg:p-0`}
        >
          <div className="flex items-baseline justify-between">
            <h2 className="label-xs flex items-center gap-2 text-muted">
              <span
                aria-hidden="true"
                className="pulse-glow h-1.5 w-1.5 rounded-full bg-shu shadow-[0_0_10px_var(--shu)]"
              />
              Refine the shelf
            </h2>
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

          <FacetGroup legend="Price" hint="Items without a current price are left out of a price band.">
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
      <div className="mt-6 min-w-0 lg:col-start-2 lg:row-start-2 lg:mt-6">
        {/* Browse aids: mood lens + curated setup. */}
        <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <fieldset className="min-w-0 flex-1" aria-describedby={moodId}>
            <legend className="label-xs mb-2 text-muted">Setup mood</legend>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => {
                const on = mood === m.value
                const n = moodCount(m.value)
                return (
                  <button
                    key={m.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => applyMood(on ? '' : m.value)}
                    style={glowVars(m.light)}
                    className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold transition-[color,border-color,box-shadow] ${
                      on
                        ? `border-paper bg-paper text-ink ${GLOW}`
                        : 'border-line bg-surface text-paper-2 hover:border-paper-2 hover:text-paper'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: `var(${m.light})`,
                        boxShadow: on ? `0 0 8px var(${m.light})` : undefined,
                      }}
                    />
                    {m.label}
                    <span className={`tnum text-[10px] ${on ? 'text-ink/70' : 'text-muted'}`}>
                      {n}
                    </span>
                  </button>
                )
              })}
            </div>
            <p id={moodId} className="mt-2 text-[11px] leading-snug text-muted">
              {activeMood ? (
                <>
                  <span className="text-paper-2">{activeMood.label}</span> is a shortcut over our
                  tags: {activeMood.tags.join(', ')}.
                </>
              ) : (
                <>A mood is a shortcut over our tags, not a judgement about the product.</>
              )}
            </p>
          </fieldset>

          {setups.length > 0 && (
            <div className="shrink-0" style={glowVars('--shu')}>
              <button
                type="button"
                onClick={() => (setupOpen ? setSetupOpen(false) : revealSetup(setupIndex))}
                aria-expanded={setupOpen}
                aria-controls={setupId}
                className={`inline-flex items-center gap-2.5 border border-paper bg-paper py-2 pr-4 pl-2.5 text-sm font-semibold text-ink transition-[box-shadow,transform] hover:-translate-y-0.5 ${GLOW_HOVER}`}
              >
                <Mascot
                  pose="point"
                  size={26}
                  animate={false}
                  title={null}
                  fill="var(--ink)"
                  accent="var(--shu)"
                  className="text-paper"
                />
                {setupOpen ? 'Hide the setup' : 'Show me a setup'}
              </button>
            </div>
          )}
        </div>

        {/* The curated setup — a dark spread with a lamp behind it. */}
        {setupOpen && setup && (
          <section
            id={setupId}
            aria-labelledby={`${setupId}-heading`}
            className="panel-in relative mt-6 overflow-hidden border border-line bg-panel-2 text-panel-type"
          >
            <GlowOrb
              tone="shu"
              size={520}
              intensity="mid"
              blend="screen"
              pulse
              className="-top-64 -right-40"
            />
            <GlowOrb tone="blue" size={380} intensity="low" blend="screen" className="-bottom-52 -left-32" />
            <SpeedStreaks
              direction="diagonal"
              from="right"
              density="low"
              tone="ink"
              seed={setup.slug}
              className="opacity-30"
            />
            <div className="relative p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-[58ch]">
                  <p className="label-xs flex flex-wrap items-center gap-2 text-panel-muted">
                    <span className="text-shu-electric">A setup, in reading order</span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="tnum">
                      {String((setupIndex % setups.length) + 1).padStart(2, '0')} /{' '}
                      {String(setups.length).padStart(2, '0')}
                    </span>
                  </p>
                  <h2
                    id={`${setupId}-heading`}
                    className="mt-2 font-display text-2xl text-panel-type sm:text-3xl"
                  >
                    {setup.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-panel-type/80">
                    {setup.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {setups.length > 1 && (
                    <button
                      type="button"
                      onClick={() => revealSetup((setupIndex + 1) % setups.length)}
                      className="border border-panel-type px-3 py-2 text-sm font-semibold text-panel-type transition-colors hover:bg-panel-type hover:text-panel-2"
                    >
                      Show another
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSetupOpen(false)}
                    className="border border-panel-line px-3 py-2 text-sm text-panel-muted transition-colors hover:border-panel-type hover:text-panel-type"
                  >
                    Close
                  </button>
                </div>
              </div>

              <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {setup.picks.map((p, i) => (
                  <li key={p.id} className="relative min-w-0 pt-3">
                    <span
                      aria-hidden="true"
                      className="tnum absolute top-0 left-3 z-30 bg-shu-electric px-2 py-0.5 text-xs font-bold text-panel-2 shadow-[0_0_14px_var(--shu)]"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="sr-only">Step {i + 1}.</span>
                    <PickCard pick={p} ratio="standard" />
                  </li>
                ))}
              </ol>

              <p className="mt-5 max-w-[62ch] text-xs leading-relaxed text-panel-muted">
                Not a bundle. Each pick has its own seller and its own page; there is no
                combined price because no discount is ours to give.
              </p>
            </div>
          </section>
        )}

        {/* Status + active chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-b border-line-soft pb-4">
          <p id={statusId} role="status" className="tnum text-sm text-paper-2">
            {results.length === picks.length ? (
              <>
                {picks.length} on the Desk
              </>
            ) : (
              <>
                <span className="text-paper">{results.length}</span> of {picks.length}{' '}
                on the Desk
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
                    className="flex items-center gap-1.5 border border-line bg-surface px-2 py-1 text-xs text-paper-2 transition-colors hover:border-shu hover:text-paper"
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
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3">
            {results.map((pick, i) => (
              <li key={pick.id} className="min-w-0">
                <PickCard pick={pick} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6">
            {/* An empty shelf, with the desk spirit peeking over its edge. The
                mascot's own desk-edge line sits exactly on the panel's top
                border: at 132px its edge is 72.6px down, hence the offset. */}
            <div className="relative mt-16 border border-line bg-surface" style={glowVars('--lilac')}>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 ${GLOW}`}
              />
              <SparkleField seed="empty-shelf" count={5} tone="lilac" minSize={8} maxSize={16} />
              <div className="absolute -top-[72px] left-5 sm:left-8">
                <Mascot
                  pose="peek"
                  size={132}
                  fill="var(--paper)"
                  className="text-ink"
                  title="The desk spirit peeking over the edge of an empty shelf"
                />
              </div>

              <div className="relative p-6 pt-14 sm:p-8 sm:pt-16">
                <p className="label-xs text-lilac">Empty shelf</p>
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-paper sm:text-3xl">
                  {moodIsEmpty
                    ? `Nothing is tagged for a ${activeMood?.label.toLowerCase()} setup yet.`
                    : 'Nothing on this shelf matches that yet.'}
                </h2>
                <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-paper-2">
                  {moodIsEmpty ? (
                    <>
                      Moods are built from the tags we have actually applied ({activeMood?.tags.join(', ')}),
                      and no pick carries one of those right now. We would rather show an empty
                      shelf than a pick that does not belong.
                    </>
                  ) : (
                    <>
                      The catalog is small on purpose — every pick is verified by hand, so gaps
                      are real gaps rather than a search that missed. Try a broader word, drop
                      a filter, or start from one of the picks below.
                    </>
                  )}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="inline-flex items-center gap-2 bg-shu px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-shu-bright"
                  >
                    Clear search and filters
                  </button>
                  {activeChips.length > 1 && (
                    <button
                      type="button"
                      onClick={activeChips[activeChips.length - 1].onRemove}
                      className="border border-line px-4 py-2.5 text-sm text-paper-2 transition-colors hover:border-paper hover:text-paper"
                    >
                      Drop the last filter only
                    </button>
                  )}
                </div>
              </div>
            </div>

            <h3 className="mt-10 mb-4 flex items-center gap-3">
              <Sticker tone="red">Start here instead</Sticker>
              <span className="text-xs text-muted">Featured picks, or the newest if nothing is featured.</span>
            </h3>
            <ul className="grid gap-6 sm:grid-cols-2 sm:gap-7 xl:grid-cols-3">
              {suggestions.map((pick) => (
                <li key={pick.id} className="min-w-0">
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
      <div className="clear-left flex flex-col gap-1">{children}</div>
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
      className={`-mx-2 flex cursor-pointer items-center justify-between gap-3 border-l-2 px-2 py-0.5 text-sm transition-colors ${
        disabled
          ? 'cursor-not-allowed border-transparent text-muted/60'
          : checked
            ? 'border-shu bg-shu-dim/60 text-paper'
            : 'border-transparent text-paper-2 hover:border-line hover:text-paper'
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
      <span className={`tnum text-xs ${checked ? 'text-shu-bright' : 'text-muted'}`}>{count}</span>
    </label>
  )
}
