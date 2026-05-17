// Dunne API-laag met offline-cache.
// Elke GET probeert eerst het netwerk; bij falen wordt de laatste gelukte
// response uit localStorage geserveerd. De service worker doet hetzelfde
// op fetch-niveau, maar deze laag zorgt dat data ook bij een koude
// (uninstalled) start gewoon zichtbaar is.

import {
  BUNDLED_ACTS,
  BUNDLED_SCHEDULE,
  BUNDLED_STAGES,
  type Act,
  type DayId,
  type ScheduleItem,
  type Stage,
} from './festival';
import type { Lang } from './i18n';

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) || 'http://localhost:4000';

const CACHE_PREFIX = 'ufest_cache_';

function cacheGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function cacheSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // quota / privacy modus — niet kritisch
  }
}

async function get<T>(path: string, cacheKey: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = (await r.json()) as T;
    cacheSet(cacheKey, data);
    return data;
  } catch {
    return cacheGet<T>(cacheKey) ?? fallback;
  }
}

export const api = {
  base: BASE,

  stages: () => get<Stage[]>('/api/stages', 'stages', BUNDLED_STAGES),
  acts: () => get<Act[]>('/api/acts', 'acts', BUNDLED_ACTS),
  schedule: () =>
    get<Record<DayId, ScheduleItem[]>>('/api/schedule', 'schedule', BUNDLED_SCHEDULE),

  faqs: (lang: Lang) =>
    get<Array<{ q: string; a: string }>>(`/api/faqs?lang=${lang}`, `faqs_${lang}`, []),
  reach: (lang: Lang) =>
    get<Array<{ icon: string; title: string; desc: string }>>(
      `/api/reach?lang=${lang}`,
      `reach_${lang}`,
      []
    ),
  info: (lang: Lang) =>
    get<Record<string, string>>(`/api/info?lang=${lang}`, `info_${lang}`, {}),

  // Devices + favorites — best effort, faalt stil als de server offline is.
  registerDevice: async (id: string, lang: Lang, theme: 'dark' | 'light') => {
    try {
      await fetch(`${BASE}/api/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, lang, theme }),
      });
    } catch { /* offline — ok */ }
  },

  getFavorites: async (deviceId: string): Promise<string[] | null> => {
    try {
      const r = await fetch(`${BASE}/api/favorites/${deviceId}`);
      if (!r.ok) return null;
      return (await r.json()) as string[];
    } catch { return null; }
  },

  addFavorite: async (deviceId: string, actId: string) => {
    try {
      await fetch(`${BASE}/api/favorites/${deviceId}/${actId}`, { method: 'POST' });
    } catch { /* offline */ }
  },

  removeFavorite: async (deviceId: string, actId: string) => {
    try {
      await fetch(`${BASE}/api/favorites/${deviceId}/${actId}`, { method: 'DELETE' });
    } catch { /* offline */ }
  },

  // Push
  vapidKey: async (): Promise<string | null> => {
    try {
      const r = await fetch(`${BASE}/api/push/vapid-public-key`);
      if (!r.ok) return null;
      const { key } = (await r.json()) as { key: string };
      return key || null;
    } catch { return null; }
  },

  subscribePush: async (deviceId: string, subscription: PushSubscription) => {
    const r = await fetch(`${BASE}/api/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, subscription: subscription.toJSON() }),
    });
    return r.ok;
  },

  unsubscribePush: async (endpoint: string) => {
    try {
      await fetch(`${BASE}/api/push/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });
    } catch { /* offline */ }
  },

  sendTestPush: async (deviceId: string) => {
    try {
      const r = await fetch(`${BASE}/api/push/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId }),
      });
      return r.ok;
    } catch { return false; }
  },
};
