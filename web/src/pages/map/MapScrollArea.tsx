import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { Pin } from '../../components/pin/Pin';
import { MapIllustration, MAP_H, MAP_W } from './MapIllustration';
import type { MapPin } from './mapPins';
import type { SvgPoint } from './geo';

export interface ScrollAreaHandle {
  zoom: (factor: number) => void;
  recenter: () => void;
  centerOn: (p: SvgPoint) => void;
}

interface Props {
  pins: MapPin[];
  selected: MapPin | null;
  setSelected: (p: MapPin | null) => void;
  fullscreen: boolean;
  handleRef: React.MutableRefObject<ScrollAreaHandle | null>;
  userPosition: SvgPoint | null;
  userLabel?: string;
  simMode: boolean;
  onSimTap?: (svgPoint: SvgPoint) => void;
}

const TAP_THRESHOLD_PX = 6;
const DOUBLE_TAP_MS = 280;
const DOUBLE_TAP_DIST = 30;
const MIN_ZOOM = 0.6;
const MAX_ZOOM = 3.5;

interface PanDrag {
  active: boolean;
  sx: number;
  sy: number;
  px: number;
  py: number;
  moved: number;
}

interface PinchState {
  active: boolean;
  startDist: number;
  startZoom: number;
  // Anchor: het SVG-punt onder het midden van de twee vingers, blijft daar tijdens pinch.
  svgAnchorX: number;
  svgAnchorY: number;
  // Het midden in container-coords waar de svg-anchor moet blijven.
  midCx: number;
  midCy: number;
}

export function MapScrollArea({
  pins,
  selected,
  setSelected,
  fullscreen,
  handleRef,
  userPosition,
  userLabel,
  simMode,
  onSimTap,
}: Props) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [interacting, setInteracting] = useState(false);
  const [containerSize, setContainerSize] = useState({ w: 326, h: 440 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const dragRef = useRef<PanDrag>({ active: false, sx: 0, sy: 0, px: 0, py: 0, moved: 0 });
  const pinchRef = useRef<PinchState>({ active: false, startDist: 0, startZoom: 1, svgAnchorX: 0, svgAnchorY: 0, midCx: 0, midCy: 0 });
  const lastTapRef = useRef<{ t: number; x: number; y: number }>({ t: 0, x: 0, y: 0 });

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

  const initScale = containerSize.w / MAP_W;
  const effScale = initScale * zoom;
  const renderW = MAP_W * effScale;
  const renderH = MAP_H * effScale;
  const baseTop = (containerSize.h - renderH) / 2;
  const verticalNudge = fullscreen ? 40 : -20;

  useEffect(() => {
    handleRef.current = {
      zoom: (factor: number) => setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z * factor))),
      recenter: () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      },
      centerOn: (p: SvgPoint) => {
        const targetZoom = Math.max(zoom, 1.4);
        const scale = initScale * targetZoom;
        const renderWNext = MAP_W * scale;
        const renderHNext = MAP_H * scale;
        const pinScreenX = (p.x / MAP_W) * renderWNext;
        const pinScreenY = (p.y / MAP_H) * renderHNext;
        setZoom(targetZoom);
        setPan({
          x: renderWNext / 2 - pinScreenX,
          y: renderHNext / 2 - pinScreenY - verticalNudge,
        });
      },
    };
  }, [handleRef, zoom, initScale, containerSize.w, containerSize.h, verticalNudge]);

  // Reken een schermpunt (client coords) terug naar SVG-coords, gegeven huidige zoom/pan.
  const screenToSvg = (clientX: number, clientY: number): SvgPoint | null => {
    const inner = innerRef.current;
    if (!inner) return null;
    const rect = inner.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    return {
      x: ((clientX - rect.left) / rect.width) * MAP_W,
      y: ((clientY - rect.top) / rect.height) * MAP_H,
    };
  };

  // Container-relatieve coords (mid-punt input voor pinch zit relatief tov container, niet inner).
  const clientToContainer = (clientX: number, clientY: number) => {
    const c = containerRef.current;
    if (!c) return { x: clientX, y: clientY };
    const rect = c.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // Bereken pan zo dat het svg-anchorpunt onder het container-midden (midCx, midCy) blijft.
  const computePanForAnchor = (newZoom: number, svgAnchor: SvgPoint, midCx: number, midCy: number) => {
    const scale = initScale * newZoom;
    const renderWNext = MAP_W * scale;
    const renderHNext = MAP_H * scale;
    const baseTopNext = (containerSize.h - renderHNext) / 2;
    // inner.left.new + svgAnchor.x * scale = midCx  → inner.left.new = midCx - svgAnchor.x * scale
    // inner.left.new = containerSize.w/2 - renderWNext/2 + pan.x.new
    const innerLeftNext = midCx - svgAnchor.x * scale;
    const innerTopNext = midCy - svgAnchor.y * scale;
    return {
      x: innerLeftNext - (containerSize.w / 2 - renderWNext / 2),
      y: innerTopNext - (baseTopNext + verticalNudge),
    };
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // Twee vingers → pinch starten. Pan-drag annuleren als die liep.
      dragRef.current.active = false;
      const [t1, t2] = [e.touches[0], e.touches[1]];
      const midClientX = (t1.clientX + t2.clientX) / 2;
      const midClientY = (t1.clientY + t2.clientY) / 2;
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const svgAnchor = screenToSvg(midClientX, midClientY);
      const mid = clientToContainer(midClientX, midClientY);
      pinchRef.current = {
        active: true,
        startDist: dist,
        startZoom: zoom,
        svgAnchorX: svgAnchor ? svgAnchor.x : MAP_W / 2,
        svgAnchorY: svgAnchor ? svgAnchor.y : MAP_H / 2,
        midCx: mid.x,
        midCy: mid.y,
      };
      setInteracting(true);
      return;
    }
    // Eén vinger → pan-drag. Check ook of dit een double-tap is.
    const t = e.touches[0];
    dragRef.current = { active: true, sx: t.clientX, sy: t.clientY, px: pan.x, py: pan.y, moved: 0 };
    setInteracting(true);
  };

  const onMouseDown = (e: MouseEvent) => {
    dragRef.current = { active: true, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y, moved: 0 };
    setInteracting(true);
  };

  useEffect(() => {
    if (!interacting) return;

    const move = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (pinchRef.current.active && 'touches' in e && e.touches.length === 2) {
        const [t1, t2] = [e.touches[0], e.touches[1]];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        if (pinchRef.current.startDist > 0) {
          const factor = dist / pinchRef.current.startDist;
          const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchRef.current.startZoom * factor));
          const svgAnchor = { x: pinchRef.current.svgAnchorX, y: pinchRef.current.svgAnchorY };
          const newPan = computePanForAnchor(newZoom, svgAnchor, pinchRef.current.midCx, pinchRef.current.midCy);
          setZoom(newZoom);
          setPan(newPan);
        }
        return;
      }

      if (!dragRef.current.active) return;
      const point = 'touches' in e ? e.touches[0] : (e as globalThis.MouseEvent);
      if (!point) return;
      const dx = point.clientX - dragRef.current.sx;
      const dy = point.clientY - dragRef.current.sy;
      dragRef.current.moved = Math.max(dragRef.current.moved, Math.hypot(dx, dy));
      setPan({
        x: dragRef.current.px + dx,
        y: dragRef.current.py + dy,
      });
    };

    const up = (e: globalThis.MouseEvent | globalThis.TouchEvent) => {
      // Pinch is afgelopen zodra er minder dan 2 touches over zijn.
      if (pinchRef.current.active) {
        const remaining = 'touches' in e ? e.touches.length : 0;
        if (remaining < 2) {
          pinchRef.current.active = false;
          // Als één vinger nog op het scherm zit, ga over op pan vanaf die positie.
          if ('touches' in e && e.touches.length === 1) {
            const t = e.touches[0];
            dragRef.current = { active: true, sx: t.clientX, sy: t.clientY, px: pan.x, py: pan.y, moved: 0 };
            return;
          }
          setInteracting(false);
          dragRef.current.active = false;
          return;
        }
        return;
      }

      if (!dragRef.current.active) {
        setInteracting(false);
        return;
      }
      dragRef.current.active = false;

      // Tap detectie: weinig beweging → check double-tap, anders eventueel sim-tap.
      if (dragRef.current.moved < TAP_THRESHOLD_PX) {
        const point = 'changedTouches' in e ? e.changedTouches[0] : (e as globalThis.MouseEvent);
        if (point) {
          const now = performance.now();
          const last = lastTapRef.current;
          const isDoubleTap =
            now - last.t < DOUBLE_TAP_MS &&
            Math.hypot(point.clientX - last.x, point.clientY - last.y) < DOUBLE_TAP_DIST;
          if (isDoubleTap) {
            // Double-tap: zoom in (cycle: <1.5 → 1.8, <2.4 → 2.5, anders terug naar 1).
            const target = zoom < 1.5 ? 1.8 : zoom < 2.4 ? 2.5 : 1;
            const svgAnchor = screenToSvg(point.clientX, point.clientY);
            if (svgAnchor) {
              const mid = clientToContainer(point.clientX, point.clientY);
              const newPan = target === 1
                ? { x: 0, y: 0 }
                : computePanForAnchor(target, svgAnchor, mid.x, mid.y);
              setZoom(target);
              setPan(newPan);
            } else {
              setZoom(target);
            }
            lastTapRef.current = { t: 0, x: 0, y: 0 };
          } else {
            lastTapRef.current = { t: now, x: point.clientX, y: point.clientY };
            if (simMode && onSimTap) {
              const inner = innerRef.current;
              if (inner) {
                const rect = inner.getBoundingClientRect();
                const xPct = (point.clientX - rect.left) / rect.width;
                const yPct = (point.clientY - rect.top) / rect.height;
                if (xPct >= 0 && xPct <= 1 && yPct >= 0 && yPct <= 1) {
                  onSimTap({ x: xPct * MAP_W, y: yPct * MAP_H });
                }
              }
            }
          }
        }
      }

      setInteracting(false);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    window.addEventListener('touchcancel', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
      window.removeEventListener('touchcancel', up);
    };
  }, [interacting, simMode, onSimTap, zoom, pan.x, pan.y, initScale, containerSize.w, containerSize.h, verticalNudge]);

  return (
    <div
      ref={containerRef}
      className={`mapscroll ${simMode ? 'mapscroll--sim' : ''}`}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{ cursor: interacting && dragRef.current.active ? 'grabbing' : simMode ? 'crosshair' : 'grab' }}
    >
      <div
        ref={innerRef}
        className="mapscroll__inner"
        style={{
          left: `calc(50% - ${renderW / 2}px + ${pan.x}px)`,
          top: `${baseTop + verticalNudge + pan.y}px`,
          width: renderW,
          height: renderH,
          transition: interacting ? 'none' : 'left 0.25s, top 0.25s, width 0.25s, height 0.25s',
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

        {userPosition && (
          <div
            className="mapscroll__here"
            style={{
              left: `${(userPosition.x / MAP_W) * 100}%`,
              top: `${(userPosition.y / MAP_H) * 100}%`,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <span className="mapscroll__here-pulse" />
            <span className="mapscroll__here-dot" />
            {userLabel && <span className="mapscroll__here-label">{userLabel}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
