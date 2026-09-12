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
