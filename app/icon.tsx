import { ImageResponse } from 'next/og'

/**
 * Favicon: the desk mascot from components/Logo.tsx on a white tile.
 * Duplicated rather than imported because this renders through Satori at
 * build time, which wants plain SVG elements with literal colours.
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
        <svg
          width="58"
          height="46"
          viewBox="2 2 124 98"
          fill="none"
          stroke="#141416"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <rect x="16" y="44" width="12" height="52" rx="4" fill="#ffffff" />
          <rect x="92" y="44" width="12" height="52" rx="4" fill="#ffffff" />
          <rect x="24" y="44" width="72" height="34" rx="8" fill="#ffffff" />
          <circle cx="44.6" cy="58" r="5.5" fill="#141416" stroke="none" />
          <circle cx="75.4" cy="58" r="5.5" fill="#141416" stroke="none" />
          <path d="M52.3 65.7q7.7 6.6 15.4 0" strokeWidth="5" />
          <ellipse cx="35.8" cy="65.7" rx="5.1" ry="3.1" fill="#ffb3c0" stroke="none" />
          <ellipse cx="84.2" cy="65.7" rx="5.1" ry="3.1" fill="#ffb3c0" stroke="none" />
          <rect x="6" y="28" width="108" height="16" rx="6" fill="#dc1a2b" />
          <path d="M112 12h4a5.5 5.5 0 0 1 0 11h-4" />
          <rect x="96" y="6" width="16" height="22" rx="3" fill="#dc1a2b" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
