import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

const isProd = process.env.NODE_ENV === 'production'

/**
 * Content-Security-Policy.
 *
 * Why no nonces: nonces require every page to render per request, and the
 * whole point of this site's architecture is that /picks/[slug] and the
 * journal are prerendered and served from a CDN (see BouncedNotice.tsx for the
 * same trade-off made deliberately). Without nonces, Next's own inline
 * bootstrap scripts (`self.__next_f.push`) and React's inline `style=`
 * attributes need 'unsafe-inline'. That is the honest price of static
 * rendering; the remaining directives still close off remote script
 * injection, plugins, base-tag hijacking, framing, and form exfiltration.
 *
 * Origins, and why each one is here:
 *   fonts.googleapis.com / fonts.gstatic.com — next/font/google self-hosts at
 *     build time so these are not strictly needed today; allowed so a later
 *     <link> or CSS @import to Google Fonts does not fail silently.
 *   plausible.io — lib/analytics.ts is written against window.plausible. If
 *     the script is added and CSP blocks it, outbound_click counts vanish
 *     silently, which is the worst possible failure for an affiliate site.
 *   img-src https: — merchant-feed product images are remote by nature and
 *     images carry no script risk; blob:/data: cover Next's own uses.
 *
 * Development only: 'unsafe-eval' (React devtools stack reconstruction) and
 * ws:/wss: (HMR). Neither ships in the production header.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://plausible.io${isProd ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' https://plausible.io${isProd ? '' : ' ws: wss:'}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ['upgrade-insecure-requests'] : []),
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value:
      'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  // HSTS is production-only so a local http://localhost session is never
  // pinned to https by a browser that has visited the dev server.
  ...(isProd
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
      ]
    : []),
]

const nextConfig: NextConfig = {
  /**
   * Pin the workspace root to this project.
   *
   * A stray package-lock.json sits in the user's home directory, so Next
   * inferred the root from there and traced files against it. That matters
   * beyond the warning: file tracing decides what gets bundled, and the
   * Cloudflare Worker build (see DEPLOY.md) ships whatever tracing collects.
   * Left alone it risks a bloated or incorrect bundle on deploy.
   */
  outputFileTracingRoot: __dirname,

  // Let .mdx files be imported as modules (journal articles live in content/).
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // No reason to advertise the framework version to scanners.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // The redirect handler needs the referring page to reach the network
        // for attribution. Later rules win, so this overrides the site-wide
        // Referrer-Policy for /go only; everything else above still applies.
        source: '/go/:path*',
        headers: [{ key: 'Referrer-Policy', value: 'no-referrer-when-downgrade' }],
      },
    ]
  },
}

const withMDX = createMDX({
  // Turbopack is the default bundler in Next 16. remark/rehype plugins must be
  // given as string names or [name, options] tuples, never imported functions,
  // because they are passed across to Rust. The journal needs none today.
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
