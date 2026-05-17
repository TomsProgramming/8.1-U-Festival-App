import type { JSX } from 'react';
import './pin.scss';

export type PinKind =
  | 'stage'
  | 'entrance'
  | 'food'
  | 'bar'
  | 'icecream'
  | 'toilet'
  | 'firstaid'
  | 'merch'
  | 'locker';

interface PinProps {
  kind: PinKind;
  num?: number;
  size?: number;
  active?: boolean;
}

const palette: Record<PinKind, { bg: string; fg: string; ring: string }> = {
  stage: { bg: '#E5352B', fg: '#fff', ring: '#fff' },
  entrance: { bg: '#0A0A0C', fg: '#fff', ring: '#FFC93C' },
  food: { bg: '#F59E0B', fg: '#fff', ring: '#fff' },
  bar: { bg: '#7C3AED', fg: '#fff', ring: '#fff' },
  icecream: { bg: '#EC4899', fg: '#fff', ring: '#fff' },
  toilet: { bg: '#2563EB', fg: '#fff', ring: '#fff' },
  firstaid: { bg: '#DC2626', fg: '#fff', ring: '#fff' },
  merch: { bg: '#059669', fg: '#fff', ring: '#fff' },
  locker: { bg: '#6B7280', fg: '#fff', ring: '#fff' },
};

function PinGlyph({ kind, num, color, size }: { kind: PinKind; num?: number; color: string; size: number }): JSX.Element | null {
  const stroke = color;
  const s = size;
  if (kind === 'stage') {
    return <div className="pin__num" style={{ fontSize: s * 0.9, color }}>{num}</div>;
  }
  if (kind === 'entrance') {
    return <div className="pin__label" style={{ fontSize: s * 0.35, color }}>ENTREE</div>;
  }
  if (kind === 'toilet') {
    return <div className="pin__label" style={{ fontSize: s * 0.6, color }}>WC</div>;
  }
  if (kind === 'food') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M8 2v8a2 2 0 0 1-2 2v10" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M6 2v6M10 2v6" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M17 2c-2 0-3 2-3 5s1 5 3 5v10" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'bar') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M5 5h14l-7 8-7-8z" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M12 13v6M8 20h8" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'icecream') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M7 10a5 5 0 0 1 10 0" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
        <path d="M7 10l5 11 5-11" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M8.5 13h7M10 16h4" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'firstaid') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path d="M12 6v12M6 12h12" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === 'merch') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <path
          d="M8 6l-4 2 2 4h3v10h6V12h3l2-4-4-2c0 2-2 3-4 3s-4-1-4-3z"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
  if (kind === 'locker') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
        <rect x="5" y="10" width="14" height="10" rx="1.5" stroke={stroke} strokeWidth="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={stroke} strokeWidth="2" />
        <circle cx="12" cy="15" r="1.4" fill={stroke} />
      </svg>
    );
  }
  return null;
}

export function Pin({ kind, num, size = 32, active = false }: PinProps) {
  const p = palette[kind];
  const s = active ? size * 1.25 : size;
  const ringWidth = active ? 3 : 2;
  return (
    <div
      className="pin"
      style={{
        width: s,
        height: s,
        background: p.bg,
        boxShadow: active
          ? `0 0 0 ${ringWidth}px ${p.ring}, 0 6px 14px rgba(0,0,0,0.45)`
          : `0 0 0 ${ringWidth}px ${p.ring}, 0 3px 8px rgba(0,0,0,0.35)`,
      }}
    >
      <PinGlyph kind={kind} num={num} color={p.fg} size={Math.round(s * 0.6)} />
    </div>
  );
}
