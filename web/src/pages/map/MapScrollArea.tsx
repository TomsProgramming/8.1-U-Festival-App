import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { Pin } from '../../components/pin/Pin';
import { MapIllustration, MAP_H, MAP_W } from './MapIllustration';
import type { MapPin } from './mapPins';

export interface ScrollAreaHandle {
  zoom: (factor: number) => void;
  recenter: () => void;
}

interface Props {
  pins: MapPin[];
  selected: MapPin | null;
  setSelected: (p: MapPin | null) => void;
  fullscreen: boolean;
  handleRef: React.MutableRefObject<ScrollAreaHandle | null>;
}

export function MapScrollArea({ pins, selected, setSelected, fullscreen, handleRef }: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 326, h: 440 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ sx: 0, sy: 0, px: 0, py: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    handleRef.current = {
      zoom: (factor: number) => setZoom((z) => Math.max(0.6, Math.min(2.5, z * factor))),
      recenter: () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      },
    };
  }, [handleRef]);

  const onDown = (e: MouseEvent | TouchEvent) => {
    const point = 'touches' in e ? e.touches[0] : (e as MouseEvent);
    setDragging(true);
    dragRef.current = { sx: point.clientX, sy: point.clientY, px: pan.x, py: pan.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      const point = 'touches' in e ? e.touches[0] : (e as globalThis.MouseEvent);
      setPan({
        x: dragRef.current.px + (point.clientX - dragRef.current.sx),
        y: dragRef.current.py + (point.clientY - dragRef.current.sy),
      });
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  const initScale = containerSize.w / MAP_W;
  const effScale = initScale * zoom;
  const renderW = MAP_W * effScale;
  const renderH = MAP_H * effScale;
  // Center the map vertically inside the viewport, regardless of container height.
  const baseTop = (containerSize.h - renderH) / 2;

  return (
    <div
      ref={containerRef}
      className="mapscroll"
      onMouseDown={onDown}
      onTouchStart={onDown}
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="mapscroll__inner"
        style={{
          left: `calc(50% - ${renderW / 2}px + ${pan.x}px)`,
          top: `${baseTop + (fullscreen ? 40 : -20) + pan.y}px`,
          width: renderW,
          height: renderH,
          transition: dragging ? 'none' : 'left 0.25s, top 0.25s, width 0.25s, height 0.25s',
        }}
      >
        <MapIllustration />
        {pins.map((p) => {
          const isActive = selected?.id === p.id;
          const size = p.kind === 'stage' ? 44 : 30;
          return (
            <div
              key={p.id}
              className="mapscroll__pin"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setSelected(p);
              }}
              style={{
                left: `${(p.x / MAP_W) * 100}%`,
                top: `${(p.y / MAP_H) * 100}%`,
                zIndex: isActive ? 10 : p.kind === 'stage' ? 6 : 3,
              }}
            >
              <Pin kind={p.kind} num={p.num} size={size} active={isActive} />
              {(p.kind === 'stage' || isActive) && (
                <div className="mapscroll__pin-label">{p.label}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
