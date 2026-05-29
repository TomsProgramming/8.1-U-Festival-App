import { useState } from 'react';

export default function BilingualTabs({ children }) {
  const [lang, setLang] = useState('nl');
  return (
    <div className="bilingual-tabs">
      <div className="bilingual-tabs__buttons">
        {['nl', 'en'].map(l => (
          <button
            key={l}
            type="button"
            className={`bilingual-tabs__btn${lang === l ? ' active' : ''}`}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      {children(lang)}
    </div>
  );
}
