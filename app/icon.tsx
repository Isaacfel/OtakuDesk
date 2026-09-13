import { ImageResponse } from 'next/og'

/** Favicon: a red tile with the wordmark's initial. Generated at build time. */

export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#dc1a2b',
          color: '#ffffff',
          borderRadius: 12,
          fontSize: 40,
          fontWeight: 800,
          fontFamily: 'sans-serif',
        }}
      >
        O
      </div>
    ),
    { ...size },
  )
}
