import type { Metadata, Viewport } from 'next'
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'

/* Display / body / data. Deliberately not Inter or Space Grotesk — the brand
   argument is that this does not look like every other generated storefront,
   and the typeface is the first thing that either proves or disproves it. */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

const instrument = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

// IBM Plex Mono is not a variable font; weights must be listed.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://otakuvault.example'),
  title: {
    default: 'OtakuVault — anime room and desk shopping guide',
    template: '%s | OtakuVault',
  },
  description:
    'A trusted anime room and desk shopping guide. We name the seller and the licence on every pick, and we earn a commission when you buy.',
  openGraph: {
    siteName: 'OtakuVault',
    type: 'website',
  },
  // The /go redirects are excluded from indexing in robots.ts as well; this is
  // the site-level default for everything else.
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f2ec' },
    { media: '(prefers-color-scheme: dark)', color: '#121011' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body className="min-h-screen bg-ink text-paper antialiased">
        {children}
      </body>
    </html>
  )
}
