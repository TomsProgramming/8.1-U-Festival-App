// Wrapper rond de Web Push API. Vraagt permission, abonneert via de SW
// en stuurt de subscription naar de server.

import { api } from '../data/api';

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const buf = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function pushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission {
  return pushSupported() ? Notification.permission : 'denied';
}

// Vraagt permission als die nog niet beslist is, en regelt de subscription.
export async function enablePush(deviceId: string): Promise<{ ok: boolean; reason?: string }> {
  if (!pushSupported()) return { ok: false, reason: 'unsupported' };

  let perm = Notification.permission;
  if (perm === 'default') perm = await Notification.requestPermission();
  if (perm !== 'granted') return { ok: false, reason: 'denied' };

  const reg = await navigator.serviceWorker.ready;

  // VAPID-sleutel: liever uit env, anders ophalen via API.
  const envKey = (import.meta.env.VITE_VAPID_PUBLIC as string | undefined) || '';
  const key = envKey || (await api.vapidKey());
  if (!key) return { ok: false, reason: 'no-vapid' };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    try {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key),
      });
    } catch (e) {
      console.warn('[push] subscribe failed', e);
      return { ok: false, reason: 'subscribe-failed' };
    }
  }

  const ok = await api.subscribePush(deviceId, sub);
  return { ok, reason: ok ? undefined : 'server-rejected' };
}

export async function disablePush(): Promise<void> {
  if (!pushSupported()) return;
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await api.unsubscribePush(sub.endpoint);
    await sub.unsubscribe();
  }
}

export async function isPushActive(): Promise<boolean> {
  if (!pushSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    return !!sub;
  } catch {
    return false;
  }
}
