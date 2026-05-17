import type { JSX } from 'react';
import { MatIcon } from './MatIcon';

const ACCENT = '#F03228';

// Icons left as inline-SVG are ones that need very specific shapes / colors
// (e.g. the festival map pin with the brand vermilion fill). UI affordances
// (heart, bell, chevron, close, globe) route through Material Symbols.
export const Icons = {
  heart: (filled: boolean, size = 20): JSX.Element => (
    <MatIcon
      name="favorite"
      filled={filled}
      weight={filled ? 500 : 400}
      size={size}
      color={filled ? ACCENT : 'currentColor'}
    />
  ),

  bell: (c: string, size = 18): JSX.Element => (
    <MatIcon name="notifications" size={size} color={c} weight={500} />
  ),

  chevron: (c: string, size = 16): JSX.Element => (
    <MatIcon name="chevron_right" size={size} color={c} weight={500} />
  ),

  close: (c: string, size = 20): JSX.Element => (
    <MatIcon name="close" size={size} color={c} weight={500} />
  ),

  globe: (c: string, size = 18): JSX.Element => (
    <MatIcon name="language" size={size} color={c} />
  ),

  pin: (size = 14): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 13s-5-4-5-8a5 5 0 0110 0c0 4-5 8-5 8z" fill={ACCENT} stroke="#fff" strokeWidth="1" />
      <circle cx="7" cy="5" r="1.5" fill="#fff" />
    </svg>
  ),
};
