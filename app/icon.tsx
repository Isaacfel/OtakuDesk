import { ImageResponse } from 'next/og'

/**
 * Favicon: the eye mark from components/Logo.tsx, red on a white tile.
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
          background: '#ffffff',
          borderRadius: 12,
        }}
      >
        <svg width="56" height="35" viewBox="0 0 64 40" fill="none">
          <path d="M6 23C15 9 49 9 58 23" stroke="#dc1a2b" strokeWidth="4" strokeLinecap="round" />
          <path d="M57 22l5-6" stroke="#dc1a2b" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M47 11l2-5M40 8.5l1-5" stroke="#dc1a2b" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12 25c8 9 32 9 40 0" stroke="#dc1a2b" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="22" r="7" fill="#dc1a2b" />
          <circle cx="34.5" cy="19.5" r="2" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
