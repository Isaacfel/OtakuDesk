import { ImageResponse } from 'next/og'

/**
 * Favicon: the desk-as-O glyph from components/Logo.tsx, white on the accent
 * red. Duplicated rather than imported because this renders through Satori at
 * build time, which wants plain SVG elements with inline attributes.
 */

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
          borderRadius: 12,
        }}
      >
        <svg width="40" height="45" viewBox="0 0 30 34" fill="#ffffff" fillRule="evenodd">
          <path d="M6 0h18a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6zm0 5.5a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 6 16.5h18a1.5 1.5 0 0 0 1.5-1.5V7A1.5 1.5 0 0 0 24 5.5z" />
          <rect x="13" y="22" width="4" height="3.5" />
          <rect x="0" y="25.5" width="30" height="4" rx="1" />
          <path d="M4 29.5h4.5L6.5 34H2z" />
          <path d="M21.5 29.5H26l2 4.5h-4.5z" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
