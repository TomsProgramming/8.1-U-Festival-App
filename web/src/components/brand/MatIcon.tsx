import type { CSSProperties } from 'react';

interface MatIconProps {
  name: string;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}

// Material Symbols Rounded — variable font, axes set via inline style so each
// usage can independently control FILL / weight / size without leaking globals.
export function MatIcon({
  name,
  filled = false,
  weight = 400,
  size = 20,
  color,
  className = '',
  style,
}: MatIconProps) {
  const fontVariation = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`;
  return (
    <span
      className={`m-icon${filled ? ' is-filled' : ''} ${className}`.trim()}
      style={{
        fontSize: size,
        color,
        fontVariationSettings: fontVariation,
        ...style,
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
