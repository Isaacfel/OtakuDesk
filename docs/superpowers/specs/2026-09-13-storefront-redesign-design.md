# Storefront redesign — design

Date: 2026-09-13. Approved in chat by the site owner.

## Goal

Replace the dark, art-directed presentation with a light storefront in the
style of akibahouse.com: white page, red as the only accent, thin grey
hairlines, product cards that are image, title, and price. Remove nearly all
framing and editorial copy. Keep the data layer, the `/go` redirect, the
affiliate library, and the tests unchanged.

## Non-goals

- No change to how links are tagged, tracked, or gated (`isPurchasable`).
- No new dependencies or component kits.
- No dark theme. Light only.

## Pages and layout

- **Header**: "Otakudesk" wordmark left, search box centre, category links
  right (Figures, Manga, Desk, Wall Art, Apparel, Accessories, Journal). 1px
  grey bottom border. No announcement bar, mascot, or banners.
- **Home**: one red hero strip with the site name and one line of copy, then
  category rows: heading, four product cards, red "View All" pill. Rows: New,
  Figures & Collectibles, Manga & Books, Desk & Room, then Journal (three
  article cards).
- **Catalog `/desk`**: category tabs on top, search and sort on the right,
  responsive grid (4 across on desktop, 2 on phones). No masthead paragraph,
  stat counters, or facet sidebar. Filters live in the URL query as today.
- **Journal, About, Legal**: same content, restyled light, section intros cut.
- **Footer**: nav links, the Amazon Associates sentence, the commission
  disclosure. Nothing else.

## Card and product page

- **Card**: white tile, 1px grey border, square image, title clamped to two
  lines, bold price. The whole card links to the product page. Verifying
  picks show a grey "Verifying" badge in place of the price.
- **Product page**: image left; right column has title, licence badge (green
  "Officially licensed" / grey "Verifying"), seller label, price with the
  checked date in small grey text, one red "Buy on Amazon" button with the
  required disclosure sentence beneath it. A collapsed "Details" section
  holds the three reasons and the caveat. "More like this" row of four cards.
  Verifying picks show one line, "We're still confirming this item's
  licence", in place of the button.

## Data changes

- Delete the 12 sample picks and the `sample` merchant. Remove the
  sample-catalog banner code and every `CATALOG_IS_SAMPLE` branch.
- Add each Amazon listing's main image URL to its pick with a new
  `ImageSource` value `merchant_listing`. Owner's decision, recorded here:
  this is outside the Associates image terms until the Product Advertising
  API is unlocked, and the URLs may break without notice.
- Deleted components: motifs, mascot, Hero, SetupPath, ArcCard, Lookbook,
  TrustPanels, JournalCovers, DeskBrowser, PickThumb, Badges, and the
  ProductDossier* set. New: Header/Footer shell, ProductCard, ProductGrid,
  CategoryRow, CatalogBrowser, product page sections.
- Unchanged: `data/types.ts` contracts (additive only), `lib/affiliate.ts`,
  `app/go/[slug]/route.ts`, `tests/affiliate.test.mts` (extended, not edited).

## Verification

`npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`; then a local
`next start` smoke test of home, catalog, one buyable and one verifying
product page, the `/go` redirect for each, and `robots.txt`; then browser
checks at desktop and phone widths.
