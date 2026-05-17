// Festival map — illustrative top-down plattegrond with markers

const MAP_W = 800;
const MAP_H = 1100;

// Map pin data — coords in 0-800 x 0-1100 viewport
const MAP_PINS = [
  // Stages — numbered 1-4
  { id: 'ponton',   kind: 'stage', num: 1, x: 210, y: 295, label: 'Ponton',   stageId: 'ponton' },
  { id: 'lake',     kind: 'stage', num: 2, x: 455, y: 585, label: 'The Lake', stageId: 'lake' },
  { id: 'club',     kind: 'stage', num: 3, x: 625, y: 350, label: 'The Club', stageId: 'club' },
  { id: 'hangar',   kind: 'stage', num: 4, x: 145, y: 800, label: 'Hangar',   stageId: 'hangar' },

  // Entrance
  { id: 'ent1', kind: 'entrance', x: 400, y: 1035, label: 'Hoofdingang' },

  // Food
  { id: 'f1', kind: 'food', x: 305, y: 225, label: 'Foodcourt Noord' },
  { id: 'f2', kind: 'food', x: 565, y: 440, label: 'Street Food' },
  { id: 'f3', kind: 'food', x: 250, y: 870, label: 'Hangar Bites' },
  { id: 'f4', kind: 'food', x: 525, y: 895, label: 'Foodmarkt Zuid' },

  // Bar
  { id: 'b1', kind: 'bar', x: 180, y: 380, label: 'Ponton Bar' },
  { id: 'b2', kind: 'bar', x: 555, y: 300, label: 'Beach Bar' },
  { id: 'b3', kind: 'bar', x: 405, y: 665, label: 'Lake Lounge' },
  { id: 'b4', kind: 'bar', x: 225, y: 730, label: 'Hangar Bar' },
  { id: 'b5', kind: 'bar', x: 615, y: 920, label: 'Main Bar' },

  // Ice cream
  { id: 'ic1', kind: 'icecream', x: 380, y: 495, label: 'IJskar' },
  { id: 'ic2', kind: 'icecream', x: 685, y: 780, label: 'IJskar' },

  // Toilets
  { id: 't1', kind: 'toilet', x: 115, y: 255, label: 'Toilet' },
  { id: 't2', kind: 'toilet', x: 670, y: 440, label: 'Toilet' },
  { id: 't3', kind: 'toilet', x: 340, y: 760, label: 'Toilet' },
  { id: 't4', kind: 'toilet', x: 600, y: 1000, label: 'Toilet' },
  { id: 't5', kind: 'toilet', x: 65, y: 870, label: 'Toilet' },

  // First aid
  { id: 'fa1', kind: 'firstaid', x: 435, y: 975, label: 'EHBO-post' },
  { id: 'fa2', kind: 'firstaid', x: 495, y: 395, label: 'EHBO-post' },

  // Merch
  { id: 'm1', kind: 'merch', x: 330, y: 970, label: 'Merchandise' },

  // Locker
  { id: 'lk1', kind: 'locker', x: 490, y: 1015, label: 'Lockers' },
];

// Inline marker component — renders circular pin with icon
function Pin({ kind, num, size = 32, active = false }) {
  // Color palette per kind
  const palette = {
    stage:     { bg: '#E5352B', fg: '#fff', ring: '#fff' },
    entrance:  { bg: '#0A0A0C', fg: '#fff', ring: '#FFC93C' },
    food:      { bg: '#F59E0B', fg: '#fff', ring: '#fff' },
    bar:       { bg: '#7C3AED', fg: '#fff', ring: '#fff' },
    icecream:  { bg: '#EC4899', fg: '#fff', ring: '#fff' },
    toilet:    { bg: '#2563EB', fg: '#fff', ring: '#fff' },
    firstaid:  { bg: '#DC2626', fg: '#fff', ring: '#fff' },
    merch:     { bg: '#059669', fg: '#fff', ring: '#fff' },
    locker:    { bg: '#6B7280', fg: '#fff', ring: '#fff' },
  };
  const p = palette[kind] || palette.food;
  const s = active ? size * 1.25 : size;
  const ringWidth = active ? 3 : 2;

  return (
    <div style={{
      width: s, height: s, borderRadius: '50%',
      background: p.bg,
      boxShadow: active
        ? `0 0 0 ${ringWidth}px ${p.ring}, 0 6px 14px rgba(0,0,0,0.45)`
        : `0 0 0 ${ringWidth}px ${p.ring}, 0 3px 8px rgba(0,0,0,0.35)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.18s cubic-bezier(.2,.8,.2,1)',
      transform: active ? 'scale(1)' : 'scale(1)',
    }}>
      <PinIcon kind={kind} num={num} color={p.fg} size={Math.round(s*0.6)}/>
    </div>
  );
}

function PinIcon({ kind, num, color = '#fff', size = 20 }) {
  const stroke = color;
  const s = size;
  if (kind === 'stage') {
    return (
      <div style={{
        fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: s * 0.9, fontWeight: 900, color, lineHeight: 1,
      }}>{num}</div>
    );
  }
  if (kind === 'entrance') {
    return (
      <div style={{
        fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: s * 0.35, fontWeight: 800, color, lineHeight: 1, letterSpacing: 0.5,
      }}>ENTREE</div>
    );
  }
  if (kind === 'toilet') {
    return (
      <div style={{
        fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        fontSize: s * 0.6, fontWeight: 800, color, lineHeight: 1,
      }}>WC</div>
    );
  }
  if (kind === 'food') {
    // Fork + spoon
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M8 2v8a2 2 0 0 1-2 2v10" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M6 2v6M10 2v6" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M17 2c-2 0-3 2-3 5s1 5 3 5v10" stroke={stroke} strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'bar') {
    // Martini glass
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M5 5h14l-7 8-7-8z" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M12 13v6M8 20h8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'icecream') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M7 10a5 5 0 0 1 10 0" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M7 10l5 11 5-11" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round"/>
        <path d="M8.5 13h7M10 16h4" stroke={stroke} strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'firstaid') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 6v12M6 12h12" stroke={stroke} strokeWidth="3" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'merch') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M8 6l-4 2 2 4h3v10h6V12h3l2-4-4-2c0 2-2 3-4 3s-4-1-4-3z"
          stroke={stroke} strokeWidth="2" strokeLinejoin="round" fill="none"/>
      </svg>
    );
  }
  if (kind === 'locker') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="10" width="14" height="10" rx="1.5" stroke={stroke} strokeWidth="2"/>
        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={stroke} strokeWidth="2"/>
        <circle cx="12" cy="15" r="1.4" fill={stroke}/>
      </svg>
    );
  }
  return null;
}

// SVG illustration — painterly top-down map
function MapIllustration() {
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width="100%" height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}>
      <defs>
        <pattern id="grass-tex" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="14" height="14" fill="#5A8F4A"/>
          <path d="M2 8 l1 -4 M6 11 l1.2 -3.5 M10 6 l1 -4" stroke="#4A7A3D" strokeWidth="0.8" strokeLinecap="round"/>
        </pattern>
        <pattern id="grass-dark" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-22)">
          <rect width="14" height="14" fill="#3E6B33"/>
          <path d="M2 8 l1 -4 M6 11 l1.2 -3.5 M10 6 l1 -4" stroke="#305124" strokeWidth="0.8" strokeLinecap="round"/>
        </pattern>
        <pattern id="sand-tex" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#E8D498"/>
          <circle cx="3" cy="3" r="0.4" fill="#CFB56E"/>
          <circle cx="7" cy="5" r="0.4" fill="#F1DFA9"/>
          <circle cx="5" cy="8" r="0.4" fill="#CFB56E"/>
        </pattern>
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6FC3DE"/>
          <stop offset="50%" stopColor="#3E9BC1"/>
          <stop offset="100%" stopColor="#2A7FA3"/>
        </linearGradient>
        <pattern id="water-ripple" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q 10 6, 20 10 T 40 10" stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="none"/>
          <path d="M0 25 Q 10 21, 20 25 T 40 25" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none"/>
        </pattern>
        <filter id="soft-shadow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
      </defs>

      {/* GRASS BASE */}
      <rect width={MAP_W} height={MAP_H} fill="url(#grass-tex)"/>

      {/* Darker forest band around edges */}
      <path d={`M 0 0 L ${MAP_W} 0 L ${MAP_W} 90 Q 620 115, 400 90 Q 180 65, 0 110 Z`}
        fill="url(#grass-dark)"/>
      <path d={`M 0 ${MAP_H} L ${MAP_W} ${MAP_H} L ${MAP_W} ${MAP_H-60} Q 620 ${MAP_H-80}, 400 ${MAP_H-62} Q 180 ${MAP_H-40}, 0 ${MAP_H-72} Z`}
        fill="url(#grass-dark)"/>
      <path d={`M 0 0 L 0 ${MAP_H} L 60 ${MAP_H} Q 40 800, 72 600 Q 90 400, 55 0 Z`}
        fill="url(#grass-dark)"/>
      <path d={`M ${MAP_W} 0 L ${MAP_W} ${MAP_H} L ${MAP_W-65} ${MAP_H} Q ${MAP_W-45} 800, ${MAP_W-78} 600 Q ${MAP_W-95} 400, ${MAP_W-58} 0 Z`}
        fill="url(#grass-dark)"/>

      {/* LAKE — Strijkviertel plas, organic blob */}
      <path d="M 145 455
               Q 120 520, 150 590
               Q 180 680, 265 720
               Q 360 760, 470 740
               Q 590 718, 665 660
               Q 720 612, 700 540
               Q 680 475, 610 450
               Q 520 420, 430 435
               Q 330 448, 260 438
               Q 190 432, 145 455 Z"
        fill="url(#water-grad)"/>
      <path d="M 145 455
               Q 120 520, 150 590
               Q 180 680, 265 720
               Q 360 760, 470 740
               Q 590 718, 665 660
               Q 720 612, 700 540
               Q 680 475, 610 450
               Q 520 420, 430 435
               Q 330 448, 260 438
               Q 190 432, 145 455 Z"
        fill="url(#water-ripple)" opacity="0.5"/>

      {/* SAND BEACH around south side of lake */}
      <path d="M 160 680
               Q 220 740, 320 755
               Q 420 770, 520 760
               Q 610 750, 680 695
               Q 640 740, 540 760
               Q 420 782, 300 770
               Q 200 755, 160 680 Z"
        fill="url(#sand-tex)"/>

      {/* PATHS — main concourse */}
      <g stroke="#D4BC7A" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.85">
        {/* From entrance north-bound */}
        <path d="M 400 1030 L 400 900 Q 398 850, 365 820"/>
        {/* East branch */}
        <path d="M 400 960 Q 500 950, 580 920"/>
        {/* West branch */}
        <path d="M 400 960 Q 280 945, 210 900 Q 175 870, 160 820"/>
        {/* From plaza north */}
        <path d="M 365 820 Q 360 770, 400 720"/>
        {/* Around lake west */}
        <path d="M 160 820 Q 145 700, 155 600 Q 150 520, 180 420 Q 215 360, 275 320"/>
        {/* Around lake east */}
        <path d="M 580 920 Q 625 820, 660 700 Q 690 620, 700 520 Q 695 440, 655 380 Q 615 340, 555 320"/>
        {/* North connector */}
        <path d="M 275 320 Q 360 290, 445 295 Q 510 300, 555 320"/>
      </g>
      {/* Path dashes overlay */}
      <g stroke="#F2E3B4" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="2 10">
        <path d="M 400 1030 L 400 900 Q 398 850, 365 820"/>
        <path d="M 400 960 Q 500 950, 580 920"/>
        <path d="M 400 960 Q 280 945, 210 900 Q 175 870, 160 820"/>
        <path d="M 160 820 Q 145 700, 155 600 Q 150 520, 180 420 Q 215 360, 275 320"/>
        <path d="M 580 920 Q 625 820, 660 700 Q 690 620, 700 520 Q 695 440, 655 380 Q 615 340, 555 320"/>
      </g>

      {/* CENTRAL PLAZA (gathering area between stages) */}
      <ellipse cx="400" cy="870" rx="95" ry="55" fill="#C9B07A" opacity="0.5"/>

      {/* STAGE 1 — PONTON (big red platform on north-west) */}
      <g transform="translate(210 295)">
        <ellipse cx="0" cy="10" rx="75" ry="14" fill="rgba(0,0,0,0.25)"/>
        <rect x="-62" y="-30" width="124" height="40" rx="6" fill="#8B2218"/>
        <rect x="-62" y="-30" width="124" height="14" rx="3" fill="#E5352B"/>
        <path d="M -55 -30 L -35 -68 L 35 -68 L 55 -30 Z" fill="#B02820"/>
        <path d="M -35 -68 L 35 -68 L 0 -90 Z" fill="#E5352B"/>
        <rect x="-56" y="-22" width="112" height="3" fill="#5A1410"/>
      </g>

      {/* STAGE 2 — THE LAKE (floating pontoons on water) */}
      <g transform="translate(455 585)">
        <ellipse cx="0" cy="22" rx="85" ry="10" fill="rgba(0,30,50,0.35)"/>
        <rect x="-70" y="-6" width="140" height="24" rx="4" fill="#6B3F1E"/>
        <rect x="-70" y="-6" width="140" height="6" fill="#8B5A2B"/>
        <rect x="-55" y="-32" width="110" height="28" rx="4" fill="#E5352B"/>
        <rect x="-55" y="-32" width="110" height="8" fill="#FFC93C"/>
        <rect x="-60" y="20" width="15" height="8" fill="#4A2A11"/>
        <rect x="45" y="20" width="15" height="8" fill="#4A2A11"/>
      </g>

      {/* STAGE 3 — THE CLUB (small enclosed venue) */}
      <g transform="translate(625 350)">
        <ellipse cx="0" cy="38" rx="58" ry="12" fill="rgba(0,0,0,0.25)"/>
        <rect x="-50" y="-20" width="100" height="54" rx="4" fill="#C97824"/>
        <rect x="-50" y="-20" width="100" height="12" fill="#8B4D15"/>
        <rect x="-44" y="-8" width="18" height="20" fill="#3E1F08"/>
        <rect x="-22" y="-8" width="18" height="20" fill="#3E1F08"/>
        <rect x="4" y="-8" width="18" height="20" fill="#3E1F08"/>
        <rect x="26" y="-8" width="18" height="20" fill="#3E1F08"/>
        {/* palm trees around */}
        <g transform="translate(-70 -10)">
          <rect x="-2" y="0" width="4" height="22" fill="#5A3A1A"/>
          <path d="M 0 0 Q -16 -6, -22 -16 M 0 0 Q 16 -6, 22 -16 M 0 0 Q -8 -12, -4 -26 M 0 0 Q 8 -12, 4 -26" stroke="#2B5E3E" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </g>
        <g transform="translate(70 -5)">
          <rect x="-2" y="0" width="4" height="22" fill="#5A3A1A"/>
          <path d="M 0 0 Q -16 -6, -22 -16 M 0 0 Q 16 -6, 22 -16 M 0 0 Q -8 -12, -4 -26 M 0 0 Q 8 -12, 4 -26" stroke="#2B5E3E" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </g>
      </g>

      {/* STAGE 4 — HANGAR (big dome) */}
      <g transform="translate(145 800)">
        <ellipse cx="0" cy="48" rx="72" ry="14" fill="rgba(0,0,0,0.3)"/>
        <path d="M -70 45 Q -70 -28, 0 -28 Q 70 -28, 70 45 Z" fill="#CED2D5"/>
        <path d="M -70 45 Q -70 -28, 0 -28 Q 70 -28, 70 45" stroke="#8D9499" strokeWidth="1.5" fill="none"/>
        {/* dome panel lines */}
        <path d="M -60 30 Q -60 -18, 0 -18 Q 60 -18, 60 30" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none"/>
        <path d="M -40 20 Q -40 -5, 0 -5 Q 40 -5, 40 20" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none"/>
        <line x1="0" y1="-28" x2="0" y2="45" stroke="rgba(0,0,0,0.12)" strokeWidth="1"/>
        {/* entrance */}
        <rect x="-14" y="25" width="28" height="20" rx="2" fill="#2F2E32"/>
        <rect x="-12" y="26" width="10" height="19" fill="#0A0A0C"/>
      </g>

      {/* TREES scattered */}
      {[
        [45, 180], [95, 130], [80, 450], [60, 530], [95, 660],
        [285, 85], [350, 50], [420, 70], [500, 55], [590, 80], [680, 60],
        [740, 150], [745, 250], [755, 380], [745, 760], [740, 900],
        [35, 870], [40, 1020], [140, 1030], [260, 1020], [580, 1020], [680, 990],
        [210, 200], [320, 125], [540, 160], [655, 220], [710, 450],
      ].map((p, i) => (
        <g key={i} transform={`translate(${p[0]},${p[1]})`}>
          <ellipse cx="1" cy="3" rx="10" ry="4" fill="rgba(0,0,0,0.2)"/>
          <circle r="10" fill="#1E4A2A"/>
          <circle r="7" fill="#2E6B3B"/>
          <circle r="3" cx="-2" cy="-2" fill="#4A8F4E"/>
        </g>
      ))}

      {/* Water dock from Lake stage */}
      <g>
        <rect x="440" y="717" width="30" height="60" fill="#6B3F1E" opacity="0.8"/>
        <line x1="443" y1="720" x2="443" y2="775" stroke="#4A2A11" strokeWidth="1"/>
        <line x1="455" y1="720" x2="455" y2="775" stroke="#4A2A11" strokeWidth="1"/>
        <line x1="467" y1="720" x2="467" y2="775" stroke="#4A2A11" strokeWidth="1"/>
      </g>

      {/* CAMPING ICONS — small tents near south-east */}
      <g transform="translate(640 960)" opacity="0.75">
        {[[0,0],[28,-5],[56,-2],[14,20],[42,22]].map((t,i)=>(
          <g key={i} transform={`translate(${t[0]},${t[1]})`}>
            <polygon points="-10,10 10,10 0,-8" fill="#E8AE59"/>
            <line x1="0" y1="-8" x2="0" y2="10" stroke="#8B5A20" strokeWidth="1"/>
          </g>
        ))}
      </g>

      {/* AREA LABELS */}
      <g fill="rgba(255,255,255,0.9)" fontFamily="Space Grotesk, -apple-system, sans-serif" fontWeight="800">
        <text x="420" y="605" fontSize="28" textAnchor="middle" opacity="0.55" letterSpacing="4">STRIJKVIERTELPLAS</text>
        <text x="400" y="872" fontSize="14" textAnchor="middle" opacity="0.65" letterSpacing="3">PLAZA</text>
      </g>

      {/* COMPASS */}
      <g transform="translate(720, 95)">
        <circle r="28" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <path d="M 0 -18 L 6 0 L 0 18 L -6 0 Z" fill="#E5352B"/>
        <path d="M 0 -18 L 6 0 L 0 0 Z" fill="#fff"/>
        <text x="0" y="-20" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="800" fontSize="10" fill="#fff">N</text>
      </g>

      {/* SCALE BAR */}
      <g transform="translate(50 1045)">
        <line x1="0" y1="0" x2="120" y2="0" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" strokeWidth="3" opacity="0.8"/>
        <line x1="60" y1="-3" x2="60" y2="3" stroke="#fff" strokeWidth="2" opacity="0.8"/>
        <line x1="120" y1="-5" x2="120" y2="5" stroke="#fff" strokeWidth="3" opacity="0.8"/>
        <text x="0" y="20" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="12" fill="#fff" opacity="0.9">0</text>
        <text x="60" y="20" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="12" fill="#fff" opacity="0.9">50m</text>
        <text x="120" y="20" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="12" fill="#fff" opacity="0.9">100m</text>
      </g>
    </svg>
  );
}

// Main Map screen
function MapScreen({ t, lang, navigate }) {
  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = React.useState('all');
  const [fullscreen, setFullscreen] = React.useState(false);
  const viewportRef = React.useRef(null);

  const filterGroups = [
    { id: 'all',      label: lang==='nl' ? 'Alles' : 'All',       kinds: null },
    { id: 'stage',    label: lang==='nl' ? 'Podia' : 'Stages',    kinds: ['stage'] },
    { id: 'fb',       label: lang==='nl' ? 'Eten & drinken' : 'Food & drinks', kinds: ['food','bar','icecream'] },
    { id: 'fac',      label: lang==='nl' ? 'Faciliteiten' : 'Facilities', kinds: ['toilet','locker','merch'] },
    { id: 'safety',   label: lang==='nl' ? 'Hulp' : 'Safety',      kinds: ['firstaid','entrance'] },
  ];
  const activeGroup = filterGroups.find(g => g.id === filter);
  const visiblePins = activeGroup.kinds
    ? MAP_PINS.filter(p => activeGroup.kinds.includes(p.kind))
    : MAP_PINS;

  const labelFor = (kind) => ({
    food: t.food, toilet: t.toilet, bar: lang==='nl'?'Bar':'Bar',
    icecream: lang==='nl'?'IJskar':'Ice cream',
    firstaid: t.firstaid, merch: lang==='nl'?'Merchandise':'Merch',
    locker: t.lockers, entrance: t.entrance, stage: lang==='nl'?'Podium':'Stage',
  }[kind] || '');

  const stageDetail = (id) => STAGES.find(s => s.id === id);
  const capacities = { ponton: '15,000', lake: '8,000', club: '3,500', hangar: '6,000' };

  // Map inside phone: fit MAP_W×MAP_H into ~358px wide by ~440px tall (when not fullscreen)
  const containerW = fullscreen ? 358 : 358;
  const containerH = fullscreen ? 620 : 440;

  return (
    <div style={{ paddingBottom: 110, background: 'var(--bg)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '60px 20px 12px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div>
            <div style={{
              fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              fontSize: 36, fontWeight: 800, color: 'var(--text)', letterSpacing: -1,
              lineHeight: 1,
            }}>{t.map}</div>
            <div style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 12, color: 'var(--text-mute)', marginTop: 6,
            }}>{lang==='nl' ? 'Strijkviertel · Utrecht' : 'Strijkviertel · Utrecht'}</div>
          </div>
          <div onClick={() => setFullscreen(!fullscreen)} style={{
            padding: '8px 12px', borderRadius: 10,
            background: 'var(--chip)', border: '1px solid var(--border)',
            color: 'var(--text)', cursor: 'pointer',
            fontFamily: "Space Grotesk, sans-serif", fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              {fullscreen
                ? <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                : <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>}
            </svg>
            {fullscreen ? (lang==='nl'?'Sluit':'Close') : (lang==='nl'?'Vol scherm':'Fullscreen')}
          </div>
        </div>
      </div>

      {/* Filter chips — now horizontal scroll */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 14px', overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {filterGroups.map(f => (
          <div key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '9px 14px', borderRadius: 999, flexShrink: 0,
            background: filter===f.id ? '#E5352B' : 'var(--filter-chip-inactive-bg)',
            color: filter===f.id ? '#fff' : 'var(--filter-chip-inactive-text)',
            fontFamily: "Space Grotesk, -apple-system, sans-serif",
            fontSize: 12, fontWeight: 700, letterSpacing: 0.2,
            cursor: 'pointer',
            border: filter===f.id ? 'none' : '1px solid var(--border)',
            whiteSpace: 'nowrap',
            boxShadow: filter===f.id ? '0 4px 12px rgba(229,53,43,0.4)' : 'none',
          }}>{f.label}</div>
        ))}
      </div>

      {/* Map container */}
      <div style={{
        margin: '0 16px', borderRadius: 20, overflow: 'hidden',
        background: '#5A8F4A',
        height: containerH, position: 'relative',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}>
        <MapScrollArea pins={visiblePins} selected={selected} setSelected={setSelected}
          viewportRef={viewportRef} fullscreen={fullscreen}/>

        {/* Top-right map controls */}
        <div style={{
          position: 'absolute', top: 10, right: 10, display: 'flex',
          flexDirection: 'column', gap: 6, zIndex: 5,
        }}>
          <MapBtn onClick={() => zoomMap(viewportRef, 1.15)}>＋</MapBtn>
          <MapBtn onClick={() => zoomMap(viewportRef, 1/1.15)}>−</MapBtn>
          <MapBtn onClick={() => recenterMap(viewportRef)}>◎</MapBtn>
        </div>

        {/* Pin count bubble */}
        <div style={{
          position: 'absolute', bottom: 10, left: 10, zIndex: 5,
          padding: '6px 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.15)',
          fontFamily: "Space Grotesk, sans-serif", fontSize: 10, fontWeight: 700,
          color: '#fff', letterSpacing: 0.5,
        }}>
          {visiblePins.length} {lang==='nl'?'LOCATIES':'LOCATIONS'}
        </div>
      </div>

      {/* Selected pin detail card */}
      {selected && (
        <div style={{
          margin: '14px 16px 0', borderRadius: 18,
          background: 'var(--surface)', border: '1px solid var(--border)',
          padding: 16, animation: 'slideUp 0.25s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Pin kind={selected.kind} num={selected.num} size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                fontSize: 18, fontWeight: 800, color: 'var(--text)',
                lineHeight: 1.1,
              }}>{selected.label || labelFor(selected.kind)}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'var(--text-mute)', marginTop: 3,
              }}>
                {selected.kind === 'stage'
                  ? `${lang==='nl'?'Capaciteit':'Capacity'} · ${capacities[selected.id] || '—'}`
                  : labelFor(selected.kind)}
              </div>
            </div>
            <div onClick={() => setSelected(null)} style={{
              width: 30, height: 30, borderRadius: 999,
              background: 'var(--chip)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>{Icons.close('var(--text-dim)', 14)}</div>
          </div>
          {selected.kind === 'stage' && (() => {
            const s = stageDetail(selected.stageId);
            if (!s) return null;
            return (
              <div style={{ marginTop: 12 }}>
                <div style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--text-dim)',
                  lineHeight: 1.5,
                }}>{s[lang==='nl' ? 'descNL' : 'descEN']}</div>
                <div onClick={() => navigate('lineup')} style={{
                  marginTop: 14, padding: '11px 16px', borderRadius: 10,
                  background: '#E5352B', color: '#fff',
                  fontFamily: "Space Grotesk, -apple-system, sans-serif",
                  fontSize: 13, fontWeight: 700, textAlign: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(229,53,43,0.35)',
                }}>{lang==='nl' ? 'Bekijk programma →' : 'See programme →'}</div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 12,
        }}>{t.legend}</div>
        <div style={{
          background: 'var(--surface)', borderRadius: 16,
          border: '1px solid var(--border)',
          padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 12, columnGap: 10,
        }}>
          {STAGES.map((s, i) => (
            <LegendRow key={s.id} label={s.name}
              sub={lang==='nl'?'Podium':'Stage'}
              pin={<Pin kind="stage" num={i+1} size={30}/>}/>
          ))}
          <LegendRow label={t.entrance} sub={lang==='nl'?'In- en uitgang':'Entry & exit'} pin={<Pin kind="entrance" size={30}/>}/>
          <LegendRow label={t.food} sub={lang==='nl'?'Eten':'Food'} pin={<Pin kind="food" size={30}/>}/>
          <LegendRow label={lang==='nl'?'Bar':'Bar'} sub={lang==='nl'?'Drinken':'Drinks'} pin={<Pin kind="bar" size={30}/>}/>
          <LegendRow label={lang==='nl'?'IJskar':'Ice cream'} sub={lang==='nl'?'Koud':'Cold'} pin={<Pin kind="icecream" size={30}/>}/>
          <LegendRow label={t.toilet} sub={lang==='nl'?'WC':'Toilets'} pin={<Pin kind="toilet" size={30}/>}/>
          <LegendRow label={t.firstaid} sub={lang==='nl'?'EHBO':'First aid'} pin={<Pin kind="firstaid" size={30}/>}/>
          <LegendRow label={lang==='nl'?'Merchandise':'Merch'} sub={lang==='nl'?'Shop':'Shop'} pin={<Pin kind="merch" size={30}/>}/>
          <LegendRow label={t.lockers} sub={lang==='nl'?'Opslag':'Storage'} pin={<Pin kind="locker" size={30}/>}/>
        </div>
      </div>

      {/* Info footer card */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,53,43,0.15) 0%, rgba(229,53,43,0.05) 100%)',
          border: '1px solid rgba(229,53,43,0.25)',
          borderRadius: 14, padding: 14,
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: '#E5352B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff', flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z" stroke="#fff" strokeWidth="2"/>
              <circle cx="12" cy="10" r="2.5" stroke="#fff" strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "Space Grotesk, sans-serif", fontSize: 13, fontWeight: 800, color: 'var(--text)',
            }}>{lang==='nl'?'Verdwaald?':'Lost?'}</div>
            <div style={{
              fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'var(--text-dim)',
              marginTop: 2, lineHeight: 1.4,
            }}>
              {lang==='nl'
                ? 'Loop naar een EHBO-post of vraag een crewlid. Herken ze aan het rode shirt.'
                : 'Head to a first-aid post or ask a crew member — look for the red shirts.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendRow({ label, sub, pin }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {pin}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, sans-serif",
          fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1,
        }}>{label}</div>
        <div style={{
          fontFamily: 'Inter, sans-serif', fontSize: 10, color: 'var(--text-faint)', marginTop: 2,
        }}>{sub}</div>
      </div>
    </div>
  );
}

function MapBtn({ children, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 30, height: 30, borderRadius: 10,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontFamily: "Space Grotesk, sans-serif",
      fontSize: 16, fontWeight: 800, cursor: 'pointer',
      userSelect: 'none',
    }}>{children}</div>
  );
}

// Pan/zoom scroll area
function MapScrollArea({ pins, selected, setSelected, viewportRef, fullscreen }) {
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);
  const dragRef = React.useRef({ sx: 0, sy: 0, px: 0, py: 0 });

  // Expose control handle
  React.useImperativeHandle(viewportRef, () => ({
    zoom: (factor) => setZoom(z => Math.max(0.6, Math.min(2.5, z * factor))),
    recenter: () => { setZoom(1); setPan({ x: 0, y: 0 }); },
  }), []);

  React.useEffect(() => {
    if (viewportRef) {
      viewportRef.current = {
        zoom: (factor) => setZoom(z => Math.max(0.6, Math.min(2.5, z * factor))),
        recenter: () => { setZoom(1); setPan({ x: 0, y: 0 }); },
      };
    }
  }, [viewportRef]);

  const onDown = (e) => {
    const t = e.touches ? e.touches[0] : e;
    setDragging(true);
    dragRef.current = { sx: t.clientX, sy: t.clientY, px: pan.x, py: pan.y };
  };
  const onMove = (e) => {
    if (!dragging) return;
    const t = e.touches ? e.touches[0] : e;
    setPan({
      x: dragRef.current.px + (t.clientX - dragRef.current.sx),
      y: dragRef.current.py + (t.clientY - dragRef.current.sy),
    });
  };
  const onUp = () => setDragging(false);

  React.useEffect(() => {
    if (!dragging) return;
    const m = (e) => onMove(e);
    const u = () => onUp();
    window.addEventListener('mousemove', m);
    window.addEventListener('mouseup', u);
    window.addEventListener('touchmove', m);
    window.addEventListener('touchend', u);
    return () => {
      window.removeEventListener('mousemove', m);
      window.removeEventListener('mouseup', u);
      window.removeEventListener('touchmove', m);
      window.removeEventListener('touchend', u);
    };
  }, [dragging]);

  // Container dims
  const Wpx = 358 - 32;     // margins
  const initScale = Wpx / MAP_W * 1.0; // fit to width-ish
  const effScale = initScale * zoom;
  const renderW = MAP_W * effScale;
  const renderH = MAP_H * effScale;

  return (
    <div
      onMouseDown={onDown}
      onTouchStart={onDown}
      style={{
        width: '100%', height: '100%', position: 'relative',
        cursor: dragging ? 'grabbing' : 'grab',
        overflow: 'hidden', touchAction: 'none',
      }}
    >
      <div style={{
        position: 'absolute',
        left: `calc(50% - ${renderW/2}px + ${pan.x}px)`,
        top: `calc(${fullscreen ? 40 : -60}px + ${pan.y}px)`,
        width: renderW, height: renderH,
        transition: dragging ? 'none' : 'left 0.25s, top 0.25s, width 0.25s, height 0.25s',
      }}>
        <MapIllustration/>
        {/* Pins layer */}
        {pins.map(p => {
          const isActive = selected?.id === p.id;
          const size = p.kind === 'stage' ? 44 : 30;
          return (
            <div key={p.id}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); setSelected(p); }}
              style={{
                position: 'absolute',
                left: `${(p.x / MAP_W) * 100}%`,
                top: `${(p.y / MAP_H) * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isActive ? 10 : (p.kind === 'stage' ? 6 : 3),
                cursor: 'pointer',
              }}>
              <Pin kind={p.kind} num={p.num} size={size} active={isActive}/>
              {(p.kind === 'stage' || isActive) && (
                <div style={{
                  position: 'absolute',
                  top: '100%', left: '50%', transform: 'translate(-50%, 4px)',
                  padding: '3px 7px', borderRadius: 6,
                  background: 'rgba(0,0,0,0.78)',
                  fontFamily: "Space Grotesk, sans-serif",
                  fontSize: 9.5, fontWeight: 700, color: '#fff',
                  letterSpacing: 0.3, whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}>{p.label}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function zoomMap(ref, factor) {
  if (ref.current && ref.current.zoom) ref.current.zoom(factor);
}
function recenterMap(ref) {
  if (ref.current && ref.current.recenter) ref.current.recenter();
}

Object.assign(window, { MapScreen });
