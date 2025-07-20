import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'Robovers - 휴머노이드 로봇 정보 플랫폼'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function OGImage() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #3b82f6, #1e40af)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 180, marginBottom: 20 }}>🤖</div>
        <div style={{ fontSize: 60, fontWeight: 'bold' }}>Robovers</div>
        <div style={{ fontSize: 30, marginTop: 10, opacity: 0.8 }}>
          휴머노이드 로봇 정보 플랫폼
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}