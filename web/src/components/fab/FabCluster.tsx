import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Lang } from '../../data/i18n';
import './fab.scss';

export function FabCluster() {
  const { theme, setTheme, lang, setLang } = useApp();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="fab-cluster">
      <button
        type="button"
        className="fab fab--toggle"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <span className={`fab__icon ${theme === 'dark' ? 'is-active' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 14.5A9 9 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"
              fill="#FFC93C"
              stroke="#FFC93C"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className={`fab__icon fab__icon--sun ${theme === 'light' ? 'is-active' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4" fill="#E5352B" />
            <g stroke="#E5352B" strokeWidth="2.2" strokeLinecap="round">
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
              <line x1="4.9" y1="4.9" x2="7" y2="7" />
              <line x1="17" y1="17" x2="19.1" y2="19.1" />
              <line x1="4.9" y1="19.1" x2="7" y2="17" />
              <line x1="17" y1="7" x2="19.1" y2="4.9" />
            </g>
          </svg>
        </span>
      </button>

      <div className={`fab-lang ${langOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          className={`fab-lang__globe ${langOpen ? 'is-open' : ''}`}
          onClick={() => setLangOpen(!langOpen)}
          aria-label="Language"
        >
          {langOpen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" data-themed="stroke">
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="rgba(255,255,255,0.85)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <span className="fab-lang__globe-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-themed="stroke">
                <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
                <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#fff" strokeWidth="1.6" />
                <line x1="3" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="1.6" />
              </svg>
              <span className="fab-lang__badge">{lang.toUpperCase()}</span>
            </span>
          )}
        </button>
        <div className={`fab-lang__options ${langOpen ? 'is-open' : ''}`}>
          {(['nl', 'en'] as Lang[]).map((code) => {
            const active = lang === code;
            return (
              <button
                key={code}
                type="button"
                className={`fab-lang__pill ${active ? 'is-active' : ''}`}
                onClick={() => {
                  setLang(code);
                  setLangOpen(false);
                }}
              >
                <span className={`fab-lang__flag fab-lang__flag--${code}`}>
                  {code === 'en' && <span className="fab-lang__flag-uk" />}
                </span>
                {code.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
