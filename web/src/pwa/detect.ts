// Lightweight UA-based platform detection — only used to pick the right set
// of install instructions to show. Falls back gracefully on unknown browsers.

export type Platform =
  | 'ios-safari'
  | 'ios-chrome'
  | 'ios-other'
  | 'android-chrome'
  | 'android-firefox'
  | 'android-samsung'
  | 'android-other'
  | 'desktop-chromium'
  | 'desktop-firefox'
  | 'desktop-safari'
  | 'desktop-other';

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const mq = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  const minimalUi = window.matchMedia?.('(display-mode: minimal-ui)').matches;
  const fullscreen = window.matchMedia?.('(display-mode: fullscreen)').matches;
  return Boolean(mq || iosStandalone || minimalUi || fullscreen);
}

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false;
  // iPadOS 13+ reports as Mac — detect by touch.
  const iPadOS = navigator.platform === 'MacIntel' && (navigator as Navigator & { maxTouchPoints: number }).maxTouchPoints > 1;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || iPadOS;
}

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop-other';
  const ua = navigator.userAgent;

  const iPadOS =
    navigator.platform === 'MacIntel' &&
    (navigator as Navigator & { maxTouchPoints: number }).maxTouchPoints > 1;
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || iPadOS;

  if (isIOS) {
    if (/CriOS/i.test(ua)) return 'ios-chrome';
    if (/Safari/i.test(ua) && !/FxiOS|EdgiOS|OPiOS/i.test(ua)) return 'ios-safari';
    return 'ios-other';
  }

  if (/Android/i.test(ua)) {
    if (/SamsungBrowser/i.test(ua)) return 'android-samsung';
    if (/Firefox/i.test(ua)) return 'android-firefox';
    if (/Chrome|CriOS|EdgA/i.test(ua)) return 'android-chrome';
    return 'android-other';
  }

  if (/Firefox/i.test(ua)) return 'desktop-firefox';
  if (/Safari/i.test(ua) && !/Chrome|Chromium/i.test(ua)) return 'desktop-safari';
  if (/Edg|Chrome|Chromium/i.test(ua)) return 'desktop-chromium';
  return 'desktop-other';
}
