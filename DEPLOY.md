# Deploying Otakudesk to Cloudflare

The domain `otakudesk.com` is registered in Cloudflare, so Cloudflare is also
the cheapest legitimate place to host this: the free tier permits commercial
use, where Vercel's Hobby tier does not (an affiliate site is commercial, and
Vercel Pro is $20/month).

The site is static except for one route. `/go/[slug]` must run server-side —
it is the outbound link layer, and it has to tag the URL, record the click, and
redirect. That rules out a pure static export and means the Workers runtime.

## One-time setup

Steps 1 and 2 need a browser and your Cloudflare account, so they are yours.

1. **Authenticate** — opens a browser, needs your login:

   ```
   npx wrangler login
   ```

2. **Confirm the account is the one holding the domain**:

   ```
   npx wrangler whoami
   ```

   The email should be the one from the Cloudflare dashboard where
   `otakudesk.com` is registered.

3. **Install the Cloudflare adapter** (deferred until the in-flight work lands,
   because it edits `package.json` and `next.config.ts`):

   ```
   npm i -D @opennextjs/cloudflare
   ```

4. **Build and deploy**:

   ```
   npx opennextjs-cloudflare build
   npx wrangler deploy
   ```

5. **Attach the domain.** In the Cloudflare dashboard, under the Worker →
   Settings → Domains & Routes, add `otakudesk.com` and `www.otakudesk.com`.
   DNS is already in the same account, so no nameserver change is needed and
   the certificate is issued automatically.

## Environment variables

Set these as Worker secrets once the affiliate programs are approved. They are
absent by design until then — `lib/affiliate.ts` throws rather than emit an
untagged link, which fails loudly instead of losing revenue quietly.

```
npx wrangler secret put AMAZON_TAG
npx wrangler secret put AWIN_AFF_ID
```

Never commit these. `.env*` is gitignored.

## The live domain

`otakudesk.com` and `www.otakudesk.com` are attached as custom domains, declared
in `wrangler.jsonc` rather than clicked in the dashboard so the routing is in
version control. Both are served by the Worker; DNS and the TLS certificate are
managed automatically because the domain sits in the same Cloudflare account.

Note that attaching custom domains disabled the `*.workers.dev` URL, because
`workers_dev` is not set in the config. Add `"workers_dev": true` if you want a
staging URL back alongside the live one.

## While the catalog is sample data

`app/robots.ts` blocks all crawling until one real verified pick is published,
then clears itself. That keeps the domain out of search results while every
product is still placeholder data.

It does not stop a human. Affiliate programs review your live site when you
apply, so a reviewer who visits before there is real content will see twelve
products marked SAMPLE. Prefer to have real picks published before applying to
Displate, Awin, or Crunchyroll.

## Deploying (after the one-time setup)

```
npm run cf:deploy
```

That runs `opennextjs-cloudflare build && opennextjs-cloudflare deploy`. Use the
adapter's own `deploy`, **not** a bare `wrangler deploy`: only the adapter runs
`populateCache`, which writes the prerendered pages into
`.open-next/assets/cdn-cgi/_next_cache/<buildId>/`. A bare `wrangler deploy`
uploads 41 files instead of 85, the Worker finds no prerendered output, and
every route with `dynamicParams = false` returns 404 with `NoFallbackError`
while the rest of the site looks perfectly fine.

That failure mode is production-only: `next build`, `next start` and even
`wrangler dev` on a freshly populated bundle all pass. The only way to catch it
is to hit the deployed URL, so after every deploy check one journal article,
not just the home page.

## Newsletter

Two pieces share one KV namespace (`SUBSCRIBERS`, bound in both wrangler
configs): the site's subscribe/confirm/unsubscribe routes, and a separate
cron Worker in `newsletter/` that emails the week's new products every
Friday at 15:00 UTC. `npm run cf:deploy` deploys both.

Emails send through Resend. One-time setup:

1. Create an account at resend.com and add the domain `otakudesk.com`. Add
   the DNS records it shows (DKIM, SPF, DMARC) in the Cloudflare dashboard.
2. Create an API key and set it on both Workers:

   ```
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put RESEND_API_KEY -c newsletter/wrangler.jsonc
   ```

3. Put a postal mailing address in `NEWSLETTER.postalAddress` in
   `lib/newsletter.ts`. Anti-spam law requires one in every marketing email;
   the cron Worker refuses to send while it is empty.

Rules baked in: double opt-in (nothing sends until the confirmation link is
clicked), a one-click unsubscribe link and `List-Unsubscribe` header on
every issue, and links to product pages only, never to a merchant, because
Amazon forbids affiliate links in email. Missing configuration is logged as
`newsletter_misconfigured` and nothing sends.

To exercise the cron handler locally: `npm run newsletter:dev`, then open
`http://localhost:8787/__scheduled`.

## Weekly price refresh

The site hides any price older than 45 days, so prices must be re-read
regularly. A third Worker, `prices/` (`otakudesk-prices`), runs on Mondays in small
steps: its cron fires every two minutes from 13:00 to 14:58 UTC, each firing
reads one listing and records the result in the `PRICES` KV namespace, and
the firing that completes the list applies new prices to `data/picks.ts` as it
is on `main`, pushes a branch, and opens a pull request with a report. One
listing per firing keeps CPU per invocation far under the free plan's limit.
Nothing merges on its own. It ignores
struck-through list prices and per-unit prices, recognises Amazon's bot
pages, and leaves judgement calls (listing unavailable or gone, a price that
moved more than 3x) to a person.

It runs on Cloudflare because Amazon's bot check blocks GitHub's hosted
runners but not Cloudflare's network. One-time setup:

1. Create a fine-grained GitHub token for this repository only, with
   Contents and Pull requests set to read and write, no expiry or one year.
2. Set it on the Worker:

   ```
   npx wrangler secret put GITHUB_TOKEN -c prices/wrangler.jsonc
   ```

3. Set a run token so the job can be driven by hand (any long random string):

   ```
   npx wrangler secret put RUN_TOKEN -c prices/wrangler.jsonc
   ```

`npm run cf:deploy` deploys this Worker with the other two.

**Running it by hand.** The Worker's only HTTP surface is
`POST https://otakudesk-prices.otakudesk.workers.dev/__step` with an
`x-run-token` header equal to the RUN_TOKEN secret. Each call advances the
week's run by one listing and returns where it stands; the call that completes
the list opens the pull request. Progress is kept in KV under `run:<date>`, so
a run can be resumed and a second run on the same day is a no-op. Add `?mock=1`
for a rehearsal: real fetches, then the first price is nudged by one cent so
the branch-and-pull-request path runs for real; the PR is titled
`Refresh prices (mock-<date>)` and is closed by hand. Verified this way on
2026-09-15: 23 of 23 listings priced and the Worker opened the PR itself.

Local rehearsal without GitHub: `npm run prices:dev`, then request
`http://localhost:8787/__scheduled` once per listing (`DRY_RUN=1`; the final
request logs the report). The same check by hand, from this machine:
`npm run prices:refresh`, or `npm run prices:refresh -- --write` to also edit
the catalog.
