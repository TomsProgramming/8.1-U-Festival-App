// Brand: logo + icon system for ❤️U Festival

function Logo({ size = 48, invert = false }) {
  // Heart on top of U — white background, black U, red heart
  const bg = invert ? '#000' : '#fff';
  const fg = invert ? '#fff' : '#000';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" fill={bg} rx="6"/>
      {/* Heart */}
      <path d="M50 32 C 46 24, 32 24, 32 36 C 32 48, 50 56, 50 56 C 50 56, 68 48, 68 36 C 68 24, 54 24, 50 32 Z" fill="#E5352B"/>
      {/* U */}
      <path d="M32 50 L32 72 C 32 84, 40 88, 50 88 C 60 88, 68 84, 68 72 L68 50" stroke={fg} strokeWidth="8" fill="none" strokeLinecap="square"/>
    </svg>
  );
}

function SmallLogo({ size = 24 }) {
  // Heart-only — used in tight spots
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path d="M50 82 C 30 70, 14 56, 14 38 C 14 24, 24 16, 36 16 C 42 16, 46 19, 50 24 C 54 19, 58 16, 64 16 C 76 16, 86 24, 86 38 C 86 56, 70 70, 50 82 Z" fill="#E5352B"/>
    </svg>
  );
}

// Tab bar icons
const Icons = {
  home: (c) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  lineup: (c) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="4" rx="1" stroke={c} strokeWidth="2"/>
      <rect x="3" y="11" width="12" height="4" rx="1" stroke={c} strokeWidth="2"/>
      <rect x="3" y="17" width="16" height="4" rx="1" stroke={c} strokeWidth="2"/>
    </svg>
  ),
  map: (c) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M9 4v16M15 6v16" stroke={c} strokeWidth="2"/>
    </svg>
  ),
  info: (c) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
      <path d="M12 11v6M12 7.5v.5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  favs: (c, filled) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? c : 'none'}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  heart: (filled, size = 20) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#E5352B' : 'none'}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z" stroke={filled ? '#E5352B' : '#fff'} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  bell: (c, size = 18) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8zM10 21a2 2 0 004 0" stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  ),
  chevron: (c, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 3l5 5-5 5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  close: (c, size = 20) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 4l12 12M16 4L4 16" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  pin: (size = 14) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 13s-5-4-5-8a5 5 0 0110 0c0 4-5 8-5 8z" fill="#E5352B" stroke="#fff" strokeWidth="1"/>
      <circle cx="7" cy="5" r="1.5" fill="#fff"/>
    </svg>
  ),
  globe: (c, size = 16) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.5"/>
      <path d="M1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13" stroke={c} strokeWidth="1.5"/>
    </svg>
  ),
};

// Map legend icon renderer (round red badge w/ white glyph)
function LegendIcon({ kind, size = 32 }) {
  const bgMap = {
    entrance: '#E5352B', toilet: '#E5352B', food: '#E5352B',
    info: '#1AB463', firstaid: '#E5352B', lockers: '#E5352B',
    water: '#E5352B', smoke: '#E5352B', stage: '#E5352B',
  };
  const bg = bgMap[kind] || '#E5352B';
  const glyphs = {
    entrance: (
      <text x="16" y="20" fill="#fff" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="Space Grotesk, -apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, Roboto, Helvetica, Arial, sans-serif">ENTREE</text>
    ),
    toilet: (
      <g>
        <text x="16" y="20" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="Space Grotesk, -apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, Roboto, Helvetica, Arial, sans-serif">WC</text>
      </g>
    ),
    food: (
      <g>
        <path d="M12 10v8M12 10c-1 0-2 1-2 2v2M20 10v8M18 10c-1 0-2 1-2 2v3h2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      </g>
    ),
    info: (
      <text x="16" y="21" fill="#fff" fontSize="14" fontWeight="700" textAnchor="middle" fontFamily="Space Grotesk, -apple-system, BlinkMacSystemFont, SF Pro Display, Segoe UI, Roboto, Helvetica, Arial, sans-serif">i</text>
    ),
    firstaid: (
      <path d="M13 16h6M16 13v6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
    ),
    lockers: (
      <g>
        <rect x="11" y="10" width="10" height="12" rx="1" stroke="#fff" strokeWidth="1.5" fill="none"/>
        <circle cx="18" cy="16" r="1" fill="#fff"/>
      </g>
    ),
    water: (
      <path d="M16 10 C 20 15, 21 18, 16 22 C 11 18, 12 15, 16 10z" fill="#fff"/>
    ),
    smoke: (
      <g>
        <rect x="10" y="15" width="11" height="3" fill="#fff"/>
        <path d="M15 10 c 0 2, -2 2, -2 4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>
    ),
    stage: null,
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width={size} height={size} viewBox="0 0 32 32">{glyphs[kind]}</svg>
    </div>
  );
}

Object.assign(window, { Logo, SmallLogo, Icons, LegendIcon });
