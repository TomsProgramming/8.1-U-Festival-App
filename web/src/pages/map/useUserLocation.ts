import { useEffect, useRef, useState } from 'react';
import { isInsideMap, latLngToSvg, MAP_GEO_BOUNDS, type SvgPoint } from './geo';
import { MAP_H, MAP_W } from './MapIllustration';

export type LocationStatus =
  | 'idle'
  | 'requesting'
  | 'real'
  | 'simulated'
  | 'denied'
  | 'unavailable'
  | 'outside'
  | 'error';

export type WalkState = 'off' | 'walking' | 'paused';

export type WalkSpeed = 'slow' | 'normal' | 'fast';

interface State {
  position: SvgPoint | null;
  status: LocationStatus;
  accuracy: number | null;
  walk: WalkState;
  walkSpeed: WalkSpeed;
  gpsTest: boolean;
}

// Natuurlijk rondje over het terrein: entree → oosten → noord-podia → west → terug.
export const DEFAULT_WALK_ROUTE: SvgPoint[] = [
  { x: 400, y: 1000 }, // Entree
  { x: 615, y: 920 },  // Main Bar
  { x: 685, y: 780 },  // Oost / IJskar
  { x: 625, y: 380 },  // The Club
  { x: 555, y: 300 },  // Beach Bar
  { x: 455, y: 610 },  // The Lake
  { x: 210, y: 320 },  // Ponton
  { x: 145, y: 800 },  // Hangar
  { x: 250, y: 870 },  // Hangar Bites
  { x: 400, y: 870 },  // Plaza
];

// SVG-units per seconde. 1 unit ≈ 0.85 m, dus normaal ≈ 34 u/s ≈ 29 m/s (versneld
// tov echte wandeltempo — anders duurt een rondje minuten op je kaartje).
const SPEED_VALUES: Record<WalkSpeed, number> = {
  slow: 18,
  normal: 40,
  fast: 90,
};

const SIM_KEY = 'ufest_map_sim_pos';

function readSim(): SvgPoint | null {
  try {
    const raw = sessionStorage.getItem(SIM_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as SvgPoint;
    if (typeof p.x === 'number' && typeof p.y === 'number') return p;
  } catch {
    // ignore
  }
  return null;
}

function distance(a: SvgPoint, b: SvgPoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function useUserLocation() {
  const [state, setState] = useState<State>(() => {
    const sim = readSim();
    if (sim) return { position: sim, status: 'simulated', accuracy: null, walk: 'off', walkSpeed: 'normal', gpsTest: false };
    return { position: null, status: 'idle', accuracy: null, walk: 'off', walkSpeed: 'normal', gpsTest: false };
  });

  const watchIdRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const walkRef = useRef({
    route: DEFAULT_WALK_ROUTE,
    speed: SPEED_VALUES.normal,
    idx: 0,
    progress: 0,
    lastTs: 0,
    paused: false,
  });

  // Anker voor de "loop echt buiten"-modus.
  // svgAnchor = waar de pin start op de festivalkaart;
  // origin = de eerste IRL GPS-coördinaat, alle latere readings worden hiervan
  //   afgetrokken en als delta opgeteld bij svgAnchor.
  const gpsRef = useRef<{ svgAnchor: SvgPoint; origin: { lat: number; lng: number } | null }>({
    svgAnchor: { x: 0, y: 0 },
    origin: null,
  });

  const stopWatch = () => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = null;
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = null;
  };

  useEffect(() => () => {
    stopWatch();
    stopTimer();
  }, []);

  // setInterval ipv requestAnimationFrame: blijft ook lopen in achtergrondtab.
  // 33 ms ≈ 30 Hz — soepel genoeg voor een wandelende pin, en goedkoop.
  const tick = () => {
    const w = walkRef.current;
    const now = performance.now();
    if (w.paused) {
      w.lastTs = now;
      return;
    }
    if (!w.lastTs) w.lastTs = now;
    const dt = (now - w.lastTs) / 1000;
    w.lastTs = now;

    let remaining = w.speed * dt;
    while (remaining > 0 && w.route.length >= 2) {
      const a = w.route[w.idx];
      const b = w.route[(w.idx + 1) % w.route.length];
      const segLen = distance(a, b);
      const left = segLen - w.progress;
      if (remaining < left) {
        w.progress += remaining;
        remaining = 0;
      } else {
        remaining -= left;
        w.idx = (w.idx + 1) % w.route.length;
        w.progress = 0;
      }
    }

    const a = w.route[w.idx];
    const b = w.route[(w.idx + 1) % w.route.length];
    const segLen = distance(a, b);
    const t = segLen > 0 ? w.progress / segLen : 0;
    const pos: SvgPoint = {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
    setState((s) => ({ ...s, position: pos }));
  };

  const requestReal = () => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, position: null, status: 'unavailable', accuracy: null }));
      return;
    }
    stopTimer();
    setState((s) => ({ ...s, status: 'requesting', walk: 'off', gpsTest: false }));
    stopWatch();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const svg = latLngToSvg(pos.coords.latitude, pos.coords.longitude);
        if (!isInsideMap(svg, 250)) {
          stopWatch();
          setState((s) => ({ ...s, position: null, status: 'outside', accuracy: pos.coords.accuracy }));
        } else {
          setState((s) => ({ ...s, position: svg, status: 'real', accuracy: pos.coords.accuracy }));
        }
      },
      (err) => {
        stopWatch();
        if (err.code === err.PERMISSION_DENIED) {
          setState((s) => ({ ...s, position: null, status: 'denied', accuracy: null }));
        } else {
          setState((s) => ({ ...s, position: null, status: 'error', accuracy: null }));
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  };

  const setSimulated = (p: SvgPoint) => {
    stopWatch();
    stopTimer();
    walkRef.current.lastTs = 0;
    try {
      sessionStorage.setItem(SIM_KEY, JSON.stringify(p));
    } catch {
      // ignore
    }
    setState((s) => ({ ...s, position: p, status: 'simulated', accuracy: null, walk: 'off', gpsTest: false }));
  };

  const startWalk = (route?: SvgPoint[]) => {
    stopWatch();
    stopTimer();
    const w = walkRef.current;
    w.route = route ?? DEFAULT_WALK_ROUTE;
    w.idx = 0;
    w.progress = 0;
    w.lastTs = 0;
    w.paused = false;
    // Snap meteen naar startpunt zodat de pin niet vanaf een oude plek begint.
    const start = w.route[0];
    try {
      sessionStorage.setItem(SIM_KEY, JSON.stringify(start));
    } catch {
      // ignore
    }
    setState((s) => ({ ...s, position: start, status: 'simulated', walk: 'walking', gpsTest: false }));
    timerRef.current = window.setInterval(tick, 33);
  };

  const pauseWalk = () => {
    walkRef.current.paused = true;
    setState((s) => ({ ...s, walk: 'paused' }));
  };

  const resumeWalk = () => {
    walkRef.current.paused = false;
    walkRef.current.lastTs = 0;
    setState((s) => ({ ...s, walk: 'walking' }));
  };

  const stopWalk = () => {
    stopTimer();
    walkRef.current.lastTs = 0;
    setState((s) => ({ ...s, walk: 'off' }));
  };

  const setWalkSpeed = (speed: WalkSpeed) => {
    walkRef.current.speed = SPEED_VALUES[speed];
    setState((s) => ({ ...s, walkSpeed: speed }));
  };

  // "Loop écht buiten met je telefoon": svgAnchor is waar de pin start
  // op de festivalkaart, de eerste GPS-reading wordt het IRL-nulpunt.
  const startGpsTest = (svgAnchor: SvgPoint) => {
    if (!('geolocation' in navigator)) {
      setState((s) => ({ ...s, status: 'unavailable' }));
      return;
    }
    stopWatch();
    stopTimer();
    walkRef.current.lastTs = 0;
    walkRef.current.paused = false;
    gpsRef.current = { svgAnchor, origin: null };
    try {
      sessionStorage.setItem(SIM_KEY, JSON.stringify(svgAnchor));
    } catch {
      // ignore
    }
    setState((s) => ({
      ...s,
      position: svgAnchor,
      status: 'simulated',
      accuracy: null,
      walk: 'off',
      gpsTest: true,
    }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const ll = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const g = gpsRef.current;
        if (!g.origin) {
          g.origin = ll;
          setState((s) => ({ ...s, accuracy: pos.coords.accuracy }));
          return;
        }
        const { north, south, east, west } = MAP_GEO_BOUNDS;
        const dLng = ll.lng - g.origin.lng;
        const dLat = ll.lat - g.origin.lat;
        const dX = (dLng / (east - west)) * MAP_W;
        const dY = (-dLat / (north - south)) * MAP_H;
        const newPos: SvgPoint = {
          x: Math.max(0, Math.min(MAP_W, g.svgAnchor.x + dX)),
          y: Math.max(0, Math.min(MAP_H, g.svgAnchor.y + dY)),
        };
        setState((s) => ({ ...s, position: newPos, accuracy: pos.coords.accuracy }));
      },
      (err) => {
        stopWatch();
        if (err.code === err.PERMISSION_DENIED) {
          setState((s) => ({ ...s, status: 'denied', gpsTest: false }));
        } else {
          setState((s) => ({ ...s, status: 'error', gpsTest: false }));
        }
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 }
    );
  };

  // Reset het IRL-nulpunt op de huidige pin-positie. Volgende GPS-reading
  // wordt opnieuw als origin gepakt; de pin blijft staan waar 'ie nu is.
  const reanchorGpsTest = () => {
    setState((s) => {
      if (s.position) {
        gpsRef.current = { svgAnchor: s.position, origin: null };
      }
      return s;
    });
  };

  const stopGpsTest = () => {
    stopWatch();
    gpsRef.current.origin = null;
    setState((s) => ({ ...s, gpsTest: false }));
  };

  const clear = () => {
    stopWatch();
    stopTimer();
    walkRef.current.lastTs = 0;
    try {
      sessionStorage.removeItem(SIM_KEY);
    } catch {
      // ignore
    }
    gpsRef.current = { svgAnchor: { x: 0, y: 0 }, origin: null };
    setState({ position: null, status: 'idle', accuracy: null, walk: 'off', walkSpeed: 'normal', gpsTest: false });
  };

  return {
    position: state.position,
    status: state.status,
    accuracy: state.accuracy,
    walk: state.walk,
    walkSpeed: state.walkSpeed,
    gpsTest: state.gpsTest,
    requestReal,
    setSimulated,
    startWalk,
    pauseWalk,
    resumeWalk,
    stopWalk,
    setWalkSpeed,
    startGpsTest,
    reanchorGpsTest,
    stopGpsTest,
    clear,
  };
}
