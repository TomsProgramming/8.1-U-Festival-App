import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatIcon } from '../brand/MatIcon';
import {
  consumeInstallPrompt,
  getInstallPrompt,
  subscribeInstallability,
  wasInstalled,
} from '../../pwa/register';
import { detectPlatform, isMobile, isStandalone, type Platform } from '../../pwa/detect';
import './pwa-install.scss';

const DISMISSED_KEY = 'ufest_pwa_dismissed_at';
// Re-show after 3 days if the user dismissed without installing.
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 3;

export function PwaInstall() {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(() => Boolean(getInstallPrompt()));
  const [installed, setInstalled] = useState(false);
  const platform = useMemo<Platform>(detectPlatform, []);
  const mobile = useMemo(isMobile, []);

  // Subscribe to install-availability changes (beforeinstallprompt / appinstalled).
  useEffect(() => {
    return subscribeInstallability(() => {
      setHasPrompt(Boolean(getInstallPrompt()));
      if (wasInstalled()) {
        setInstalled(true);
        setOpen(false);
      }
    });
  }, []);

  // Decide whether to surface the floating bubble on first paint.
  useEffect(() => {
    if (isStandalone()) return; // already a PWA — never bother the user
    const dismissedAt = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_MS) return;
    // Auto-open only on mobile — on desktop we show the small bubble instead.
    if (mobile) {
      const tmo = window.setTimeout(() => setOpen(true), 1400);
      return () => window.clearTimeout(tmo);
    }
  }, [mobile]);

  if (isStandalone()) return null;

  const close = () => {
    setOpen(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  const triggerNativePrompt = async () => {
    const evt = consumeInstallPrompt();
    if (!evt) return;
    try {
      await evt.prompt();
      const choice = await evt.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
    } catch {
      // Ignore — user can still follow the manual steps.
    }
  };

  return (
    <>
      {/* Floating launcher — same vocabulary as the FAB cluster. */}
      <button
        type="button"
        className="pwa-bubble"
        onClick={() => setOpen(true)}
        aria-label={t.pwaInstall}
      >
        <span className="pwa-bubble__icon">
          <MatIcon name="install_mobile" size={20} weight={500} color="var(--accent)" />
        </span>
        <span className="pwa-bubble__label">{t.pwaInstall}</span>
      </button>

      {open && (
        <div className="pwa-sheet" role="dialog" aria-modal="true" aria-labelledby="pwa-sheet-title">
          <button
            type="button"
            className="pwa-sheet__backdrop"
            onClick={close}
            aria-label="close"
          />
          <div className="pwa-sheet__card">
            <button
              type="button"
              className="pwa-sheet__close"
              onClick={close}
              aria-label="close"
            >
              <MatIcon name="close" size={20} weight={500} color="var(--text)" />
            </button>

            <div className="pwa-sheet__icon">
              <PwaBrandIcon />
            </div>

            <h2 id="pwa-sheet-title" className="pwa-sheet__title">
              {installed ? t.pwaInstalled : t.pwaTitle}
            </h2>
            <p className="pwa-sheet__tagline">{t.pwaTagline}</p>

            <div className="pwa-sheet__why">
              <div className="pwa-sheet__why-title">{t.pwaWhyTitle}</div>
              <ul className="pwa-sheet__why-list">
                <li>
                  <MatIcon name="bolt" size={16} filled color="var(--accent)" />
                  <span>{t.pwaWhy1}</span>
                </li>
                <li>
                  <MatIcon name="signal_cellular_alt" size={16} filled color="var(--accent)" />
                  <span>{t.pwaWhy2}</span>
                </li>
                <li>
                  <MatIcon name="fullscreen" size={16} filled color="var(--accent)" />
                  <span>{t.pwaWhy3}</span>
                </li>
              </ul>
            </div>

            <InstallInstructions platform={platform} />

            <div className="pwa-sheet__cta">
              {hasPrompt && (
                <button type="button" className="pwa-sheet__primary" onClick={triggerNativePrompt}>
                  <MatIcon name="install_mobile" size={18} filled color="#fff" />
                  <span>{t.pwaInstall}</span>
                </button>
              )}
              <button
                type="button"
                className={`pwa-sheet__secondary${hasPrompt ? '' : ' is-solo'}`}
                onClick={close}
              >
                {t.pwaNotNow}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function InstallInstructions({ platform }: { platform: Platform }) {
  const { t } = useApp();

  const intro = (() => {
    switch (platform) {
      case 'ios-chrome':
      case 'ios-other':
        return t.pwaOpenInSafari;
      case 'android-firefox':
      case 'android-other':
        return t.pwaOpenInChrome;
      case 'desktop-chromium':
      case 'desktop-firefox':
      case 'desktop-safari':
      case 'desktop-other':
        return t.pwaDesktopHint;
      default:
        return null;
    }
  })();

  const steps: Array<{ icon: string; text: string }> = (() => {
    switch (platform) {
      case 'ios-safari':
      case 'ios-chrome':
      case 'ios-other':
        return [
          { icon: 'ios_share', text: t.pwaIosStep1 },
          { icon: 'add_box', text: t.pwaIosStep2 },
          { icon: 'check_circle', text: t.pwaIosStep3 },
        ];
      case 'android-samsung':
        return [
          { icon: 'menu', text: t.pwaSamsungStep1 },
          { icon: 'add_to_home_screen', text: t.pwaSamsungStep2 },
          { icon: 'check_circle', text: t.pwaSamsungStep3 },
        ];
      case 'android-firefox':
        return [
          { icon: 'more_vert', text: t.pwaFirefoxStep1 },
          { icon: 'add_to_home_screen', text: t.pwaFirefoxStep2 },
          { icon: 'check_circle', text: t.pwaFirefoxStep3 },
        ];
      case 'android-chrome':
      case 'android-other':
      default:
        return [
          { icon: 'more_vert', text: t.pwaAndroidStep1 },
          { icon: 'add_to_home_screen', text: t.pwaAndroidStep2 },
          { icon: 'check_circle', text: t.pwaAndroidStep3 },
        ];
    }
  })();

  return (
    <div className="pwa-sheet__steps">
      <div className="pwa-sheet__steps-title">{t.pwaStepsTitle}</div>
      {intro && <p className="pwa-sheet__intro">{intro}</p>}
      <ol className="pwa-sheet__step-list">
        {steps.map((s, i) => (
          <li key={i} className="pwa-sheet__step">
            <span className="pwa-sheet__step-num">{i + 1}</span>
            <span className="pwa-sheet__step-icon">
              <MatIcon name={s.icon} size={18} weight={500} color="var(--heading)" />
            </span>
            <span className="pwa-sheet__step-text">{s.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function PwaBrandIcon() {
  // Echoes the manifest icon — same brand mark, scaled for the sheet header.
  return (
    <svg width="56" height="56" viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" rx="20" fill="#0A0A0C" />
      <path
        d="M50 32 C 46 24, 32 24, 32 36 C 32 48, 50 56, 50 56 C 50 56, 68 48, 68 36 C 68 24, 54 24, 50 32 Z"
        fill="#F03228"
      />
      <path
        d="M32 50 L32 72 C 32 84, 40 88, 50 88 C 60 88, 68 84, 68 72 L68 50"
        stroke="#FFFFFF"
        strokeWidth="8"
        fill="none"
        strokeLinecap="square"
      />
    </svg>
  );
}
