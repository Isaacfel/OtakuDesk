import type { Metadata, Viewport } from 'next'
import { Archivo_Black, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Heavy geometric face for the wordmark only.
const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-archivo-black',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://otakudesk.com'),
  title: {
    default: 'Otakudesk — anime merch, checked',
    template: '%s | Otakudesk',
  },
  description:
    'Anime figures, manga, and desk gear with the licence status, the seller, and a dated price on every item. Every link goes to the real seller.',
  openGraph: {
    siteName: 'Otakudesk',
    type: 'website',
  },
  // The /go redirects are excluded from indexing in robots.ts as well; this is
  // the site-level default for everything else.
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${archivoBlack.variable}`}>
      <body className="min-h-screen bg-bg text-fg antialiased">{children}</body>
    </html>
  )
}
