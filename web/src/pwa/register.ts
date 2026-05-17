// Captures the Chromium `beforeinstallprompt` event so the in-app install
// component can fire it on demand. Also exposes a tiny pub-sub so React
// components can re-render when an install prompt becomes (un)available.

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export function capturePwaInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    installed = true;
    emit();
  });
}

export function getInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferred;
}

export function consumeInstallPrompt(): BeforeInstallPromptEvent | null {
  const e = deferred;
  deferred = null;
  emit();
  return e;
}

export function wasInstalled(): boolean {
  return installed;
}

export function subscribeInstallability(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  // Skip in dev — Vite's HMR needs to own /index.html and module requests.
  if (import.meta.env.DEV) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Swallow — SW is a progressive enhancement.
    });
  });
}
