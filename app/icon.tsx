import { ImageResponse } from 'next/og'

/**
 * Favicon: the desk glyph from components/Logo.tsx, white on the accent red.
 * Duplicated rather than imported because this renders through Satori at
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
        <svg width="48" height="36" viewBox="0 0 40 30" fill="#ffffff">
          <rect x="10" y="1" width="20" height="13" rx="1.5" />
          <rect x="18.5" y="14" width="3" height="3" />
          <rect x="1" y="17" width="38" height="4.5" rx="1" />
          <path d="M6 21.5h4.5L8 30H3.5z" />
          <path d="M29.5 21.5H34l2.5 8.5H32z" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
