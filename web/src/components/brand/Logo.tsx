interface LogoProps {
  size?: number;
  invert?: boolean;
}

// Brand logo. Two-tone per the guideline: a black + white version, with the
// vermilion heart on top. `invert` toggles the light variant.
export function Logo({ size = 48, invert = false }: LogoProps) {
  const bg = invert ? '#000000' : '#FFFFFF';
  const fg = invert ? '#FFFFFF' : '#000000';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <rect width="100" height="100" fill={bg} rx="6" />
      <path
        d="M50 32 C 46 24, 32 24, 32 36 C 32 48, 50 56, 50 56 C 50 56, 68 48, 68 36 C 68 24, 54 24, 50 32 Z"
        fill="#F03228"
      />
      <path
        d="M32 50 L32 72 C 32 84, 40 88, 50 88 C 60 88, 68 84, 68 72 L68 50"
        stroke={fg}
        strokeWidth="8"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function SmallLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M50 82 C 30 70, 14 56, 14 38 C 14 24, 24 16, 36 16 C 42 16, 46 19, 50 24 C 54 19, 58 16, 64 16 C 76 16, 86 24, 86 38 C 86 56, 70 70, 50 82 Z"
        fill="#F03228"
      />
    </svg>
  );
}
