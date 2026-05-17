import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatIcon } from '../brand/MatIcon';
import type { Lang } from '../../data/i18n';
import './fab.scss';

const FlagNL = (
  <svg className="fab-lang__flag-svg" viewBox="0 0 9 6" aria-hidden="true">
    <rect width="9" height="2" fill="#AE1C28" />
    <rect y="2" width="9" height="2" fill="#fff" />
    <rect y="4" width="9" height="2" fill="#21468B" />
  </svg>
);

const FlagUK = (
  <svg className="fab-lang__flag-svg" viewBox="0 0 60 30" preserveAspectRatio="none" aria-hidden="true">
    <clipPath id="uk-clip">
      <rect width="60" height="30" />
    </clipPath>
    <g clipPath="url(#uk-clip)">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="7" />
      <path d="M0,0 L60,30" stroke="#C8102E" strokeWidth="3" />
      <path d="M60,0 L0,30" stroke="#C8102E" strokeWidth="3" />
      <path d="M30,0 V30" stroke="#fff" strokeWidth="10" />
      <path d="M0,15 H60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 V30" stroke="#C8102E" strokeWidth="6" />
      <path d="M0,15 H60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

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
          <MatIcon name="dark_mode" size={18} filled color="var(--info)" />
        </span>
        <span className={`fab__icon fab__icon--sun ${theme === 'light' ? 'is-active' : ''}`}>
          <MatIcon name="light_mode" size={20} filled color="var(--accent)" />
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
            <MatIcon name="close" size={18} weight={500} color="var(--text)" />
          ) : (
            <span className="fab-lang__globe-wrap">
              <MatIcon name="language" size={20} color="var(--text)" />
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
                <span className="fab-lang__flag">
                  {code === 'nl' ? FlagNL : FlagUK}
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
