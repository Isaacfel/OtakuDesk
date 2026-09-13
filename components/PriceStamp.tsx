import { isPriceFresh, PRICE_MAX_AGE_DAYS } from '@/data/types'

/**
 * A price with the date it was checked, or nothing. A price older than
 * PRICE_MAX_AGE_DAYS is suppressed rather than shown stale.
 */
export function PriceStamp({
  price,
  checkedAt,
  size = 'md',
}: {
  price: number | null
  checkedAt: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const fresh = price !== null && isPriceFresh(checkedAt)

  if (!fresh) {
    return (
      <p className="text-sm text-fg-muted">
        Price not current. Check at the seller.
        <span className="sr-only">
          {' '}
          (we only show prices verified within {PRICE_MAX_AGE_DAYS} days)
        </span>
      </p>
    )
  }

  const scale = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <p className="flex flex-wrap items-baseline gap-x-2">
      <span className={`tnum font-bold text-fg ${scale}`}>${price.toFixed(2)}</span>
      <span className="tnum text-xs text-fg-muted">
        checked{' '}
        <time dateTime={checkedAt}>
          {new Date(`${checkedAt}T00:00:00Z`).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC',
          })}
        </time>
      </span>
    </p>
  )
}
