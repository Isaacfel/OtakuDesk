import { MERCHANTS } from '@/data/merchants'
import { CATALOG_IS_SAMPLE } from '@/data/picks'

/**
 * Site-level affiliate disclosure.
 *
 * Placed at the TOP of any page that carries outbound links — the FTC standard
 * is that disclosure be unavoidable and precede the reader's decision, which a
 * footer line does not satisfy. This is in addition to, never instead of, the
 * sentence the OutboundButton renders beside each individual link.
 */
export function DisclosureBanner() {
  const usesAmazon = MERCHANTS.some(
    (m) => m.network === 'amazon' && m.termsVerifiedAt,
  )

  return (
    <div className="border-b border-line-soft bg-surface">
      <p className="mx-auto max-w-6xl px-5 py-2.5 text-xs leading-relaxed text-muted">
        OtakuVault earns a commission when you buy through our links, at no
        extra cost to you. It does not change which products we pick or what we
        say about them.{' '}
        {usesAmazon && (
          <span>As an Amazon Associate we earn from qualifying purchases. </span>
        )}
        <a
          href="/disclosure"
          className="text-paper-2 underline underline-offset-2 hover:text-paper"
        >
          Full disclosure
        </a>
      </p>
    </div>
  )
}

/**
 * The honesty banner for the pre-launch state.
 *
 * While the catalog is seed data, saying so loudly is the only defensible
 * option — the spec's own rule is that placeholder products are never
 * presented as available for purchase. This disappears by itself as soon as
 * a single real, verified pick is published.
 */
export function SampleCatalogNotice() {
  if (!CATALOG_IS_SAMPLE) return null

  return (
    <div className="border-b border-caution/30 bg-caution-soft">
      <p className="mx-auto max-w-6xl px-5 py-2.5 text-xs leading-relaxed text-caution">
        <strong className="font-semibold">Sample catalog.</strong> Every product
        shown is placeholder data used while this site is being built. Nothing
        here is for sale, no prices are live, and no purchase links are
        configured.
      </p>
    </div>
  )
}
