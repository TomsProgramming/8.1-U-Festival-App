export const MAP_W = 800;
export const MAP_H = 1100;

export function MapIllustration() {
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id="grass-tex" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <rect width="14" height="14" fill="#5A8F4A" />
          <path d="M2 8 l1 -4 M6 11 l1.2 -3.5 M10 6 l1 -4" stroke="#4A7A3D" strokeWidth="0.8" strokeLinecap="round" />
        </pattern>
        <pattern id="grass-dark" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-22)">
          <rect width="14" height="14" fill="#3E6B33" />
          <path d="M2 8 l1 -4 M6 11 l1.2 -3.5 M10 6 l1 -4" stroke="#305124" strokeWidth="0.8" strokeLinecap="round" />
        </pattern>
        <pattern id="sand-tex" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#E8D498" />
          <circle cx="3" cy="3" r="0.4" fill="#CFB56E" />
          <circle cx="7" cy="5" r="0.4" fill="#F1DFA9" />
          <circle cx="5" cy="8" r="0.4" fill="#CFB56E" />
        </pattern>
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6FC3DE" />
          <stop offset="50%" stopColor="#3E9BC1" />
          <stop offset="100%" stopColor="#2A7FA3" />
        </linearGradient>
        <pattern id="water-ripple" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q 10 6, 20 10 T 40 10" stroke="rgba(255,255,255,0.22)" strokeWidth="1" fill="none" />
          <path d="M0 25 Q 10 21, 20 25 T 40 25" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
        </pattern>
      </defs>

      <rect width={MAP_W} height={MAP_H} fill="url(#grass-tex)" />

      <path
        d={`M 0 0 L ${MAP_W} 0 L ${MAP_W} 90 Q 620 115, 400 90 Q 180 65, 0 110 Z`}
        fill="url(#grass-dark)"
      />
      <path
        d={`M 0 ${MAP_H} L ${MAP_W} ${MAP_H} L ${MAP_W} ${MAP_H - 60} Q 620 ${MAP_H - 80}, 400 ${MAP_H - 62} Q 180 ${MAP_H - 40}, 0 ${MAP_H - 72} Z`}
        fill="url(#grass-dark)"
      />
      <path
        d={`M 0 0 L 0 ${MAP_H} L 60 ${MAP_H} Q 40 800, 72 600 Q 90 400, 55 0 Z`}
        fill="url(#grass-dark)"
      />
      <path
        d={`M ${MAP_W} 0 L ${MAP_W} ${MAP_H} L ${MAP_W - 65} ${MAP_H} Q ${MAP_W - 45} 800, ${MAP_W - 78} 600 Q ${MAP_W - 95} 400, ${MAP_W - 58} 0 Z`}
        fill="url(#grass-dark)"
      />

      <path
        d="M 145 455 Q 120 520, 150 590 Q 180 680, 265 720 Q 360 760, 470 740 Q 590 718, 665 660 Q 720 612, 700 540 Q 680 475, 610 450 Q 520 420, 430 435 Q 330 448, 260 438 Q 190 432, 145 455 Z"
        fill="url(#water-grad)"
      />
      <path
        d="M 145 455 Q 120 520, 150 590 Q 180 680, 265 720 Q 360 760, 470 740 Q 590 718, 665 660 Q 720 612, 700 540 Q 680 475, 610 450 Q 520 420, 430 435 Q 330 448, 260 438 Q 190 432, 145 455 Z"
        fill="url(#water-ripple)"
        opacity="0.5"
      />

      <path
        d="M 160 680 Q 220 740, 320 755 Q 420 770, 520 760 Q 610 750, 680 695 Q 640 740, 540 760 Q 420 782, 300 770 Q 200 755, 160 680 Z"
        fill="url(#sand-tex)"
      />

      <g stroke="#D4BC7A" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.85">
        <path d="M 400 1030 L 400 900 Q 398 850, 365 820" />
        <path d="M 400 960 Q 500 950, 580 920" />
        <path d="M 400 960 Q 280 945, 210 900 Q 175 870, 160 820" />
        <path d="M 365 820 Q 360 770, 400 720" />
        <path d="M 160 820 Q 145 700, 155 600 Q 150 520, 180 420 Q 215 360, 275 320" />
        <path d="M 580 920 Q 625 820, 660 700 Q 690 620, 700 520 Q 695 440, 655 380 Q 615 340, 555 320" />
        <path d="M 275 320 Q 360 290, 445 295 Q 510 300, 555 320" />
      </g>
      <g stroke="#F2E3B4" strokeWidth="4" strokeLinecap="round" fill="none" strokeDasharray="2 10">
        <path d="M 400 1030 L 400 900 Q 398 850, 365 820" />
        <path d="M 400 960 Q 500 950, 580 920" />
        <path d="M 400 960 Q 280 945, 210 900 Q 175 870, 160 820" />
        <path d="M 160 820 Q 145 700, 155 600 Q 150 520, 180 420 Q 215 360, 275 320" />
        <path d="M 580 920 Q 625 820, 660 700 Q 690 620, 700 520 Q 695 440, 655 380 Q 615 340, 555 320" />
      </g>

      <ellipse cx="400" cy="870" rx="95" ry="55" fill="#C9B07A" opacity="0.5" />

      {/* Ponton stage */}
      <g transform="translate(210 295)">
        <ellipse cx="0" cy="10" rx="75" ry="14" fill="rgba(0,0,0,0.25)" />
        <rect x="-62" y="-30" width="124" height="40" rx="6" fill="#8B2218" />
        <rect x="-62" y="-30" width="124" height="14" rx="3" fill="#E5352B" />
        <path d="M -55 -30 L -35 -68 L 35 -68 L 55 -30 Z" fill="#B02820" />
        <path d="M -35 -68 L 35 -68 L 0 -90 Z" fill="#E5352B" />
        <rect x="-56" y="-22" width="112" height="3" fill="#5A1410" />
      </g>

      {/* Lake stage */}
      <g transform="translate(455 585)">
        <ellipse cx="0" cy="22" rx="85" ry="10" fill="rgba(0,30,50,0.35)" />
        <rect x="-70" y="-6" width="140" height="24" rx="4" fill="#6B3F1E" />
        <rect x="-70" y="-6" width="140" height="6" fill="#8B5A2B" />
        <rect x="-55" y="-32" width="110" height="28" rx="4" fill="#E5352B" />
        <rect x="-55" y="-32" width="110" height="8" fill="#FFC93C" />
        <rect x="-60" y="20" width="15" height="8" fill="#4A2A11" />
        <rect x="45" y="20" width="15" height="8" fill="#4A2A11" />
      </g>

      {/* Club */}
      <g transform="translate(625 350)">
        <ellipse cx="0" cy="38" rx="58" ry="12" fill="rgba(0,0,0,0.25)" />
        <rect x="-50" y="-20" width="100" height="54" rx="4" fill="#C97824" />
        <rect x="-50" y="-20" width="100" height="12" fill="#8B4D15" />
        <rect x="-44" y="-8" width="18" height="20" fill="#3E1F08" />
        <rect x="-22" y="-8" width="18" height="20" fill="#3E1F08" />
        <rect x="4" y="-8" width="18" height="20" fill="#3E1F08" />
        <rect x="26" y="-8" width="18" height="20" fill="#3E1F08" />
        <g transform="translate(-70 -10)">
          <rect x="-2" y="0" width="4" height="22" fill="#5A3A1A" />
          <path
            d="M 0 0 Q -16 -6, -22 -16 M 0 0 Q 16 -6, 22 -16 M 0 0 Q -8 -12, -4 -26 M 0 0 Q 8 -12, 4 -26"
            stroke="#2B5E3E"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <g transform="translate(70 -5)">
          <rect x="-2" y="0" width="4" height="22" fill="#5A3A1A" />
          <path
            d="M 0 0 Q -16 -6, -22 -16 M 0 0 Q 16 -6, 22 -16 M 0 0 Q -8 -12, -4 -26 M 0 0 Q 8 -12, 4 -26"
            stroke="#2B5E3E"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Hangar */}
      <g transform="translate(145 800)">
        <ellipse cx="0" cy="48" rx="72" ry="14" fill="rgba(0,0,0,0.3)" />
        <path d="M -70 45 Q -70 -28, 0 -28 Q 70 -28, 70 45 Z" fill="#CED2D5" />
        <path d="M -70 45 Q -70 -28, 0 -28 Q 70 -28, 70 45" stroke="#8D9499" strokeWidth="1.5" fill="none" />
        <path d="M -60 30 Q -60 -18, 0 -18 Q 60 -18, 60 30" stroke="rgba(0,0,0,0.15)" strokeWidth="1" fill="none" />
        <path d="M -40 20 Q -40 -5, 0 -5 Q 40 -5, 40 20" stroke="rgba(0,0,0,0.1)" strokeWidth="1" fill="none" />
        <line x1="0" y1="-28" x2="0" y2="45" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        <rect x="-14" y="25" width="28" height="20" rx="2" fill="#2F2E32" />
        <rect x="-12" y="26" width="10" height="19" fill="#0A0A0C" />
      </g>

      {[
        [45, 180], [95, 130], [80, 450], [60, 530], [95, 660],
        [285, 85], [350, 50], [420, 70], [500, 55], [590, 80], [680, 60],
        [740, 150], [745, 250], [755, 380], [745, 760], [740, 900],
        [35, 870], [40, 1020], [140, 1030], [260, 1020], [580, 1020], [680, 990],
        [210, 200], [320, 125], [540, 160], [655, 220], [710, 450],
      ].map((p, i) => (
        <g key={i} transform={`translate(${p[0]},${p[1]})`}>
          <ellipse cx="1" cy="3" rx="10" ry="4" fill="rgba(0,0,0,0.2)" />
          <circle r="10" fill="#1E4A2A" />
          <circle r="7" fill="#2E6B3B" />
          <circle r="3" cx="-2" cy="-2" fill="#4A8F4E" />
        </g>
      ))}

      <g>
        <rect x="440" y="717" width="30" height="60" fill="#6B3F1E" opacity="0.8" />
        <line x1="443" y1="720" x2="443" y2="775" stroke="#4A2A11" strokeWidth="1" />
        <line x1="455" y1="720" x2="455" y2="775" stroke="#4A2A11" strokeWidth="1" />
        <line x1="467" y1="720" x2="467" y2="775" stroke="#4A2A11" strokeWidth="1" />
      </g>

      <g transform="translate(640 960)" opacity="0.75">
        {[[0, 0], [28, -5], [56, -2], [14, 20], [42, 22]].map((tt, i) => (
          <g key={i} transform={`translate(${tt[0]},${tt[1]})`}>
            <polygon points="-10,10 10,10 0,-8" fill="#E8AE59" />
            <line x1="0" y1="-8" x2="0" y2="10" stroke="#8B5A20" strokeWidth="1" />
          </g>
        ))}
      </g>

      <g fill="rgba(255,255,255,0.9)" fontFamily="Space Grotesk, -apple-system, sans-serif" fontWeight="800">
        <text x="420" y="605" fontSize="28" textAnchor="middle" opacity="0.55" letterSpacing="4">
          STRIJKVIERTELPLAS
        </text>
        <text x="400" y="872" fontSize="14" textAnchor="middle" opacity="0.65" letterSpacing="3">
          PLAZA
        </text>
      </g>

      <g transform="translate(720, 95)">
        <circle r="28" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        <path d="M 0 -18 L 6 0 L 0 18 L -6 0 Z" fill="#E5352B" />
        <path d="M 0 -18 L 6 0 L 0 0 Z" fill="#fff" />
        <text x="0" y="-20" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="800" fontSize="10" fill="#fff">
          N
        </text>
      </g>

      <g transform="translate(50 1045)">
        <line x1="0" y1="0" x2="120" y2="0" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#fff" strokeWidth="3" opacity="0.8" />
        <line x1="60" y1="-3" x2="60" y2="3" stroke="#fff" strokeWidth="2" opacity="0.8" />
        <line x1="120" y1="-5" x2="120" y2="5" stroke="#fff" strokeWidth="3" opacity="0.8" />
        <text x="0" y="20" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="12" fill="#fff" opacity="0.9">0</text>
        <text x="60" y="20" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="12" fill="#fff" opacity="0.9">50m</text>
        <text x="120" y="20" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="12" fill="#fff" opacity="0.9">100m</text>
      </g>
    </svg>
  );
}
