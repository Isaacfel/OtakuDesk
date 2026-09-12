# OtakuVault

A trusted anime room and desk shopping guide that earns commissions by helping
fans make better product decisions.

**This is an affiliate site, not a store.** It never holds stock, sets a price,
takes payment, ships anything, or processes a return. That single constraint
shapes the whole codebase — see [`PROJECT.md`](./PROJECT.md) for the build
brief, the v1 scope boundary, and the seven implementation rules that override
convenience.

> **Status: pre-launch.** The catalog is twelve sample picks, all explicitly
> non-buyable. No affiliate program has been approved yet, no prices are live,
> and no purchase path is configured. Nothing here is for sale.

## Stack

Next.js 16.3.5 (App Router) · React 19.2 · TypeScript · Tailwind v4 · MDX

Static-first. No database — the catalog lives in typed TS files, which builds
statically, searches instantly on the client, and diffs cleanly in git. That
last part matters: it gives a full audit history of every price and licence
claim the site has ever published.

## Architecture worth knowing about

**`app/go/[slug]/route.ts` — the link layer.** Every outbound link on the site
passes through here. Nothing else in the codebase resolves `pick.purchaseUrl`.
This buys one place to change when a program alters its link format, click
counts independent of the network's dashboard, `rel` and tagging guaranteed
rather than remembered, and the ability to kill a dead link site-wide with one
data edit. Redirects are **302, never 301** — a cached permanent redirect loses
the click count and the ability to retarget the link.

**`components/OutboundButton.tsx` — disclosure by construction.** The FTC
disclosure is rendered by the button itself, as a full sentence, adjacent to
the control. There is no code path in the application that produces an outbound
link without one, so compliance does not depend on anyone remembering it in
month three.

**`data/types.ts` — rules enforced by shape.** `price` is nullable and paired
with `priceCheckedAt`, so a component cannot render a price without confronting
its age. `isPurchasable()` is the single authority on whether a pick may link
out, called by both the UI and the redirect, so the two cannot drift apart.
Every image declares its provenance.

## Local development

```bash
npm install
npm run dev
```

Affiliate credentials are read from the environment and are absent by design in
development. `lib/affiliate.ts` throws `AffiliateConfigError` rather than emit
an untagged link — an untagged link looks like it works, converts fine for the
merchant, and pays nothing, silently, for as long as nobody notices.

```
AMAZON_TAG=       # Associates tag, once approved
AWIN_AFF_ID=      # Awin publisher id
```

## Maintenance

```bash
npx tsx scripts/check-links.ts
```

Reports dead merchant URLs and prices past the 45-day display window. It
deliberately does not auto-edit the catalog — a 403 is usually bot protection
rather than a dead product, so a human makes that call.

Merchant program terms carry a `termsVerifiedAt` date and need re-reading
quarterly. Rates, image-use rights, and email rules change *after* you have
built around them; that is the failure mode, not the initial check.

## Before this goes live

Phase 0 is research, not code: apply to affiliate programs, then hand-research
and verify real picks one at a time — find the product, verify the seller and
licence, capture the price with today's date, confirm image rights, then flip
`linkStatus` to `'ok'`. Do not bulk-import a catalog. Every row is a claim the
site makes.

The pre-launch compliance checklist lives in `PROJECT.md`.

## Licensing posture

The affiliate model removes manufacturing liability — we are not producing
anything, so we cannot infringe on the product itself. It removes nothing else.
Image permission, no implied studio or franchise affiliation, no character art
in OtakuVault's own branding, and per-pick licence verification all survive
intact. See `PROJECT.md`.

OtakuVault is an independent shopping guide, not affiliated with, endorsed by,
or sponsored by any anime studio, publisher, or licensor.
