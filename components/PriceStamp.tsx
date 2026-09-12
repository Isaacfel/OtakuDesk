import { isPriceFresh, PRICE_MAX_AGE_DAYS } from '@/data/types'

/**
 * A price, or nothing, and never a bare number.
 *
 * Merchant prices go stale within days, and several affiliate programs
 * prohibit displaying a stale price outright. So the rule is: no fresh
 * `priceCheckedAt`, no price. Suppressing is always safe; guessing never is.
 *
 * The visible date is not decoration — it is the reader's means of judging how
 * much to trust the number, and it is the difference between a price quote and
 * a price claim.
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
      <p className="text-sm text-muted">
        Price not current —{' '}
        <span className="text-paper-2">check at the seller</span>
        <span className="sr-only">
          {' '}
          (we only show prices verified within {PRICE_MAX_AGE_DAYS} days)
        </span>
      </p>
    )
  }

  const scale =
    size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`tnum font-semibold text-paper ${scale}`}>
        ${price.toFixed(2)}
      </span>
      <span className="tnum text-[11px] text-muted">
        checked{' '}
        <time dateTime={checkedAt}>
          {new Date(checkedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </span>
    </p>
  )
}
