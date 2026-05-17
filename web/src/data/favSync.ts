// Offline-veilige favorites-sync.
//
// Werking:
//   • Elke add/remove probeert direct de server.
//   • Lukt dat niet (offline, server down, 5xx), dan zet de actie in een
//     queue in localStorage onder `ufest_fav_queue`.
//   • Op een `online`-event én bij iedere app-start wordt de queue
//     geflusht — bij voorkeur via een bulk-PUT (vervangt de hele set
//     server-side, idempotent).
//
// De queue is een append-only log; we de-duperen op (op, slug) bij flush.

import { api } from './api';

type FavOp = 'add' | 'remove';
interface QueuedOp { op: FavOp; slug: string; ts: number; }

const KEY = 'ufest_fav_queue';

function readQueue(): QueuedOp[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QueuedOp[]) : [];
  } catch { return []; }
}
function writeQueue(q: QueuedOp[]): void {
  try { localStorage.setItem(KEY, JSON.stringify(q)); } catch { /* quota */ }
}
function enqueue(op: QueuedOp): void {
  const q = readQueue();
  q.push(op);
  writeQueue(q);
}
export function queueSize(): number { return readQueue().length; }

// Markeer dat een actie tegen de server is uitgevoerd; faalt het, dan
// belandt 'ie in de queue.
async function tryOrQueue(op: FavOp, deviceId: string, slug: string): Promise<boolean> {
  if (!navigator.onLine) {
    enqueue({ op, slug, ts: Date.now() });
    return false;
  }
  try {
    const r = await fetch(`${api.base}/api/favorites/${deviceId}/${encodeURIComponent(slug)}`, {
      method: op === 'add' ? 'POST' : 'DELETE',
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return true;
  } catch {
    enqueue({ op, slug, ts: Date.now() });
    return false;
  }
}

export const favSync = {
  add:    (deviceId: string, slug: string) => tryOrQueue('add', deviceId, slug),
  remove: (deviceId: string, slug: string) => tryOrQueue('remove', deviceId, slug),

  // Spoelt de queue door middel van een bulk-PUT met de huidige lokale set.
  // Levert de huidige lokale set als bron-van-waarheid op een offline-conflict.
  async flush(deviceId: string, currentFavs: string[]): Promise<boolean> {
    if (!navigator.onLine) return false;
    const q = readQueue();
    if (q.length === 0) return true;
    try {
      const r = await fetch(`${api.base}/api/favorites/${deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slugs: currentFavs }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      writeQueue([]);
      return true;
    } catch {
      return false;
    }
  },
};
