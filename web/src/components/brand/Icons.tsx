import type { JSX } from 'react';

export const Icons = {
  home: (c: string): JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-7h-6v7H4a1 1 0 01-1-1v-9z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  lineup: (c: string): JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="4" rx="1" stroke={c} strokeWidth="2" />
      <rect x="3" y="11" width="12" height="4" rx="1" stroke={c} strokeWidth="2" />
      <rect x="3" y="17" width="16" height="4" rx="1" stroke={c} strokeWidth="2" />
    </svg>
  ),
  map: (c: string): JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 4v16M15 6v16" stroke={c} strokeWidth="2" />
    </svg>
  ),
  info: (c: string): JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
      <path d="M12 11v6M12 7.5v.5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  favs: (c: string, filled: boolean): JSX.Element => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? c : 'none'}>
      <path
        d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  heart: (filled: boolean, size = 20): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#E5352B' : 'none'}>
      <path
        d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"
        stroke={filled ? '#E5352B' : '#fff'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bell: (c: string, size = 18): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8zM10 21a2 2 0 004 0"
        stroke={c}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  chevron: (c: string, size = 16): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 3l5 5-5 5" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  close: (c: string, size = 20): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M4 4l12 12M16 4L4 16" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  pin: (size = 14): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M7 13s-5-4-5-8a5 5 0 0110 0c0 4-5 8-5 8z" fill="#E5352B" stroke="#fff" strokeWidth="1" />
      <circle cx="7" cy="5" r="1.5" fill="#fff" />
    </svg>
  ),
  globe: (c: string, size = 16): JSX.Element => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={c} strokeWidth="1.5" />
      <path d="M1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13" stroke={c} strokeWidth="1.5" />
    </svg>
  ),
};
