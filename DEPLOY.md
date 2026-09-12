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

## Before pointing the real domain at it

The catalog is still sample data, and that has a consequence beyond
appearances: **affiliate programs review your live site when you apply.** A
reviewer landing on twelve products marked SAMPLE is a rejection, and
reapplying after one is harder than applying cleanly the first time.

`app/robots.ts` therefore blocks all crawling while `CATALOG_IS_SAMPLE` is
true, and clears itself the moment one real verified pick is published. That
protects the domain's first impression in search, but it does not stop a human
reviewer from looking.

So the sequence that works:

1. Deploy to the generated `*.workers.dev` URL and check it there.
2. Do the Phase 0 research — get real picks verified and published.
3. Attach `otakudesk.com` once there is a site worth reviewing.

Attaching the domain earlier is not harmful, only premature. The deploy
pipeline being ready is the useful part; using it on the real domain is a
decision with a right moment, and this is not quite it.
