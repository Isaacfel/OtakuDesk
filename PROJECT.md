# Otakudesk — build brief

**Positioning (use this line; it governs tone, scope, and content):**

> A trusted anime room and desk shopping guide that earns commissions by
> helping fans make better product decisions.

Not a store. Not a catalog. A guide that happens to be paid on referral.

**Niche order:** anime room, desk, and setup products first; convention and
travel accessories second. Figures and collectibles are out of scope for v1 —
dominated by incumbents, ruthlessly price-compared, and the hardest category
in which to keep a licence-verification promise.

---

## Licensing — the accurate framing

An earlier draft said the affiliate model made the licensing problem "mostly
evaporate." That overstated it and is corrected here.

**What affiliate removes:** manufacturing liability. We are not printing,
producing, or selling anything, so we cannot infringe on the product itself.

**What survives, unchanged and equally load-bearing:**

1. **Image permission.** Every image must trace to a granted right — merchant
   feed, press kit, or our own camera. Enforced by `PickImage.source`.
2. **No implied studio or franchise affiliation.** Not in copy, titles, meta
   descriptions, social handles, or collection names.
3. **No character art in Otakudesk's own branding.** Logo, hero, dividers,
   favicon, social avatars — original work only.
4. **Per-pick licence verification.** `licenseStatus: 'unverified'` blocks the
   outbound path in both the UI and the `/go` route. This is not advisory.

These are the same work aimed at a different surface, not residual footnotes.

---

## v1 scope — build exactly this

**Ship:**

| Route | Notes |
|---|---|
| `/` | Home. Positioning, trust, featured picks, journal preview, email. |
| `/vault` | All picks: search, filter, sort. Client-side over static data. |
| `/picks/[slug]` | Pick detail. The most important page on the site. |
| `/journal`, `/journal/[slug]` | MDX. The traffic engine. |
| `/about` | Who curates, how picks are chosen, how we are paid. |
| `/go/[slug]` | Outbound redirect. `noindex`. |
| `/disclosure`, `/privacy`, `/terms` | Required. |

**Deferred out of v1** (data already exists, routes ship later without rework):

- `/collections` and `/collections/[slug]` — `COLLECTIONS` stays in the data
  layer and is used as a filter facet on `/vault`.
- `/new-drops` — `addedAt` is already on every pick; sort by it on `/vault`.
- `/saved` — no wishlist in v1.
- Curated sets (`SETS`) — data kept, no route.

This removes roughly a third of the interface work and costs nothing later.

### The gift quiz — gated on catalog depth

The quiz is the highest-value feature in the brief and also the easiest to
discredit. Below roughly 60 picks it returns the same three answers regardless
of input, which damages the trust claim more than omitting it would.

**Implementation rule:** build the quiz scoped to desk setup only, and gate its
entry points (home CTA, nav) behind a live check — it appears only when the
`Desk & Room` category has **≥ 15 non-sample, purchasable picks**. Put that
check in one exported helper so there is no way to link to it prematurely.

---

## Non-negotiable implementation rules

1. **Nothing renders `pick.purchaseUrl`.** Components link to `/go/[goSlug]`
   via `goHref()`. Only `app/go/[slug]/route.ts` resolves a real destination.
2. **Disclosure ships inside `OutboundButton`.** A full sentence — "We earn a
   commission if you buy through this link, at no extra cost to you" — not a
   bare "affiliate link" tag. There must be no code path that produces an
   outbound link without it.
3. **`isPurchasable()` is the only authority** on whether a pick may link out.
   The UI and the redirect both call it, so they cannot disagree.
4. **A price with no fresh `priceCheckedAt` is not displayed.** Suppressing is
   always safe; guessing is not.
5. **Every outbound `<a>` carries `rel="sponsored nofollow noopener"`.**
6. **Sample picks are never presented as buyable.** `linkStatus: 'sample'`
   renders an explicit placeholder state.
7. **Redirects are 302, never 301.** A cached permanent redirect loses the
   click count and the ability to retarget the link.

---

## Merchant program terms drift

Commission rates, image-use terms, and email rules change *after* you have
built around them — that is the dangerous version, not the initial check.

Every merchant carries `termsVerifiedAt`. Re-verify quarterly. Because each
network's tagging strategy lives in one place (`lib/affiliate.ts`), a mid-life
program change is a config edit rather than a rewrite. Keep it that way.

Known constraints to re-check each quarter:

- **Amazon:** Product Advertising API gated behind 3 qualifying sales in 180
  days. Affiliate links prohibited in email. Stale price display prohibited.
- **All programs:** confirm image-use rights before using feed imagery.

---

## Hosting

Vercel's Hobby tier prohibits commercial use and an affiliate site is
commercial — **Pro at $20/month**, not the free tier. Cloudflare Pages
(free tier, commercial use permitted) plus Workers for the `/go` route is the
legitimate zero-cost alternative if that $20 matters. Build static either way.

---

## What the sample catalog is and is not

The twelve seed picks are **scaffolding so the UI has something real to
render**. They are explicitly non-buyable. They are *not* a head start on
Phase 0 research, which remains the gating work: apply to programs, then
hand-research and verify real picks one at a time — find the product, verify
seller and licence, capture the price with today's date, confirm image rights,
then flip `linkStatus` to `'ok'`.

Do not bulk-import a catalog. Every row is a claim the site makes.
