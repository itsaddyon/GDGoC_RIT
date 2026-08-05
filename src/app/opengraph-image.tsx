import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'GDG on Campus RIT Roorkee';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow effects using precise shapes since satori doesn't support complex gradients perfectly */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: '#4285F4', opacity: 0.15, filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: '#34A853', opacity: 0.15, filter: 'blur(100px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '20%', right: '-20%', width: '50%', height: '50%', background: '#EA4335', opacity: 0.15, filter: 'blur(120px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-20%', width: '60%', height: '60%', background: '#FBBC04', opacity: 0.15, filter: 'blur(120px)', borderRadius: '50%' }} />

        {/* GDG Logo Mark SVG */}
        <svg width="200" height="120" viewBox="0 0 100 60" style={{ marginBottom: '40px' }}>
          <g>
            <rect x="2" y="6" width="42" height="20" rx="10" fill="#4285F4" transform="rotate(-32 23 16)" />
            <rect x="2" y="34" width="42" height="20" rx="10" fill="#EA4335" transform="rotate(32 23 44)" />
          </g>
          <g>
            <rect x="56" y="6" width="42" height="20" rx="10" fill="#34A853" transform="rotate(32 77 16)" />
            <rect x="56" y="34" width="42" height="20" rx="10" fill="#FBBC04" transform="rotate(-32 77 44)" />
          </g>
        </svg>

        {/* Text Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.1 }}>
            GDG on Campus
          </div>
          <div style={{ fontSize: 48, fontWeight: 500, margin: 0, marginTop: 10, color: '#a1a1aa', letterSpacing: '-0.01em', textAlign: 'center' }}>
            RIT Roorkee
          </div>
          
          <div style={{ fontSize: 24, fontWeight: 400, marginTop: 40, color: '#71717a', textAlign: 'center' }}>
            Build with the community. Ship with confidence.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
