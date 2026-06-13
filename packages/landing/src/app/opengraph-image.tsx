import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_TAGLINE } from '../lib/site';

export const alt = `${SITE_NAME} - ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: '#0a0a0a',
        backgroundImage:
          'radial-gradient(circle at 18% 12%, rgba(250,204,21,0.30), transparent 48%), radial-gradient(circle at 92% 88%, rgba(234,179,8,0.20), transparent 50%)',
        color: '#fafafa',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, color: '#a1a1aa' }}>
        <span style={{ color: '#fafafa' }}>Agent</span>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#facc15" style={{ margin: '0 3px' }}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span style={{ color: '#fafafa' }}>Age</span>
        <span style={{ marginLeft: 16 }}>Memory</span>
      </div>
      <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, marginTop: 40 }}>
        One memory. Every AI.
      </div>
      <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, color: '#facc15' }}>
        Owned by you.
      </div>
      <div style={{ fontSize: 32, color: '#a1a1aa', marginTop: 40, maxWidth: 900 }}>
        The shared memory layer for every AI - files-first, cross-vendor, yours to keep.
      </div>
    </div>,
    {
      ...size,
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    }
  );
}
