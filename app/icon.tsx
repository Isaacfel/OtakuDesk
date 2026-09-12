import { ImageResponse } from 'next/og'
import { MascotMark } from '@/components/motifs'

/**
 * The favicon, generated from the mascot mark so the tab shows the same
 * original emblem as the wordmark. Ink on the dark panel colour, which reads
 * in both light and dark browser chrome. Statically generated at build time.
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
          background: '#17151a',
          color: '#f3ebdd',
          borderRadius: 8,
        }}
      >
        <div style={{ display: 'flex', width: 48, height: 48 }}>
          <MascotMark title="Otakudesk" />
        </div>
      </div>
    ),
    { ...size },
  )
}
