// App shell — tab bar, state, toast, modal routing

function AppShell() {
  const [tab, setTab] = React.useState('home');
  const [favorites, setFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('ufest_favs') || '["armin","kensington"]'); } catch { return []; }
  });
  const [lang, setLang] = React.useState(() => localStorage.getItem('ufest_lang') || 'nl');
  const [theme, setTheme] = React.useState(() => localStorage.getItem('ufest_theme') || 'dark');
  const [actDetail, setActDetail] = React.useState(null);
  const [toast, setToast] = React.useState(null);
  const [langOpen, setLangOpen] = React.useState(false);

  React.useEffect(() => localStorage.setItem('ufest_favs', JSON.stringify(favorites)), [favorites]);
  React.useEffect(() => localStorage.setItem('ufest_lang', lang), [lang]);
  React.useEffect(() => {
    localStorage.setItem('ufest_theme', theme);
    window.dispatchEvent(new Event('ufest-theme-change'));
  }, [theme]);

  const t = I18N[lang];

  const toggleFav = (id) => {
    setFavorites(prev => {
      const isNew = !prev.includes(id);
      const next = isNew ? [...prev, id] : prev.filter(x => x !== id);
      const a = ACTS.find(x => x.id === id);
      if (a) {
        setToast(isNew
          ? { title: t.favAdded, sub: `${a.name} · ${t.notifOn}`, icon: 'heart' }
          : { title: lang==='nl' ? 'Verwijderd uit favorieten' : 'Removed from favorites', sub: a.name, icon: 'heart-off' });
        setTimeout(() => setToast(null), 3200);
      }
      return next;
    });
  };

  const showActDetail = (id) => setActDetail(id);

  const navigate = (id) => setTab(id);

  return (
    <div data-theme={theme} className="ufest-shell" style={{
      width: '100%', height: '100%', position: 'relative',
      background: 'var(--bg)', overflow: 'hidden',
      color: 'var(--text)',
      transition: 'background 0.3s, color 0.3s',
    }}>
      {/* Screen */}
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto',
      }} key={tab}>
        {tab === 'home' && <HomeScreen t={t} lang={lang} navigate={navigate}
          favorites={favorites} toggleFav={toggleFav} showActDetail={showActDetail}/>}
        {tab === 'lineup' && <LineupScreen t={t} lang={lang}
          favorites={favorites} toggleFav={toggleFav} showActDetail={showActDetail}/>}
        {tab === 'map' && <MapScreen t={t} lang={lang} navigate={navigate}/>}
        {tab === 'info' && <InfoScreen t={t} lang={lang}/>}
        {tab === 'favs' && <FavoritesScreen t={t} lang={lang}
          favorites={favorites} toggleFav={toggleFav} showActDetail={showActDetail}/>}
      </div>

      {/* FAB cluster — theme + language, bottom-right above tab bar */}
      <div style={{
        position: 'absolute', bottom: 100, right: 14, zIndex: 95,
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
        fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}>
        {/* Theme toggle FAB */}
        <div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{
          width: 38, height: 38, borderRadius: 999,
          background: 'var(--fab-bg)', backdropFilter: 'blur(18px)',
          border: '1px solid var(--fab-border)',
          boxShadow: 'var(--shadow-fab)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}>
          {/* Moon (shown in dark mode) */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.32s cubic-bezier(.2,.8,.2,1), transform 0.4s cubic-bezier(.2,.8,.2,1)',
            opacity: theme === 'dark' ? 1 : 0,
            transform: theme === 'dark' ? 'rotate(0deg) scale(1)' : 'rotate(-60deg) scale(0.5)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 14.5A9 9 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="#FFC93C" stroke="#FFC93C" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Sun (shown in light mode) */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'opacity 0.32s cubic-bezier(.2,.8,.2,1), transform 0.4s cubic-bezier(.2,.8,.2,1)',
            opacity: theme === 'light' ? 1 : 0,
            transform: theme === 'light' ? 'rotate(0deg) scale(1)' : 'rotate(60deg) scale(0.5)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="4" fill="#E5352B"/>
              <g stroke="#E5352B" strokeWidth="2.2" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="5"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
                <line x1="2" y1="12" x2="5" y2="12"/>
                <line x1="19" y1="12" x2="22" y2="12"/>
                <line x1="4.9" y1="4.9" x2="7" y2="7"/>
                <line x1="17" y1="17" x2="19.1" y2="19.1"/>
                <line x1="4.9" y1="19.1" x2="7" y2="17"/>
                <line x1="17" y1="7" x2="19.1" y2="4.9"/>
              </g>
            </svg>
          </div>
        </div>

        {/* Language switcher — collapsible globe */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--fab-bg)', backdropFilter: 'blur(18px)',
          border: '1px solid var(--fab-border)',
          borderRadius: 999,
          boxShadow: 'var(--shadow-fab)',
          padding: 3, overflow: 'hidden',
          transition: 'all 0.28s cubic-bezier(.2,.8,.2,1)',
          width: langOpen ? 152 : 38,
          height: 38,
        }}>
          {/* Globe icon toggle */}
          <div onClick={() => setLangOpen(!langOpen)} style={{
            width: 32, height: 32, borderRadius: 999, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            background: langOpen ? 'var(--chip)' : 'transparent',
          }}>
            {langOpen
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" data-themed="stroke"><path d="M6 6l12 12M6 18L18 6" stroke="rgba(255,255,255,0.85)" strokeWidth="2.4" strokeLinecap="round"/></svg>
              : (
                <div style={{ position: 'relative', width: 20, height: 20 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-themed="stroke">
                    <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2"/>
                    <ellipse cx="12" cy="12" rx="4" ry="9" stroke="#fff" strokeWidth="1.6"/>
                    <line x1="3" y1="12" x2="21" y2="12" stroke="#fff" strokeWidth="1.6"/>
                  </svg>
                  <div style={{
                    position: 'absolute', bottom: -2, right: -3,
                    fontSize: 7.5, fontWeight: 800, letterSpacing: 0.3,
                    background: '#E5352B', color: '#fff',
                    padding: '1px 3px', borderRadius: 3,
                    border: '1.5px solid var(--lang-badge-border)',
                    lineHeight: 1,
                  }}>{lang.toUpperCase()}</div>
                </div>
              )
            }
          </div>
          {/* Expanded segmented control */}
          <div style={{
            display: 'flex', gap: 2, marginLeft: 2,
            opacity: langOpen ? 1 : 0,
            pointerEvents: langOpen ? 'auto' : 'none',
            transition: 'opacity 0.18s',
            whiteSpace: 'nowrap',
          }}>
            {['nl','en'].map(code => {
              const active = lang === code;
              return (
                <div key={code} onClick={() => { setLang(code); setLangOpen(false); }} style={{
                  padding: '6px 10px', borderRadius: 999,
                  background: active ? '#E5352B' : 'transparent',
                  color: active ? '#fff' : 'var(--text-mute)',
                  cursor: 'pointer', transition: 'all 0.18s',
                  boxShadow: active ? '0 2px 8px rgba(229,53,43,0.4)' : 'none',
                  fontSize: 10.5, fontWeight: 800, letterSpacing: 0.8,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <span style={{
                    width: 12, height: 8, borderRadius: 1.5, overflow: 'hidden',
                    display: 'inline-block', flexShrink: 0,
                    background: code==='nl'
                      ? 'linear-gradient(180deg, #AE1C28 33%, #fff 33% 66%, #21468B 66%)'
                      : '#012169',
                    border: '1px solid var(--border-strong)',
                  }}>
                    {code==='en' && (
                      <div style={{
                        width: '100%', height: '100%',
                        background: 'linear-gradient(45deg, transparent 44%, #fff 44% 56%, transparent 56%), linear-gradient(-45deg, transparent 44%, #fff 44% 56%, transparent 56%), linear-gradient(90deg, transparent 44%, #fff 44% 56%, transparent 56%), linear-gradient(0deg, transparent 44%, #fff 44% 56%, transparent 56%), #012169',
                      }}/>
                    )}
                  </span>
                  {code.toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 58, left: '50%', transform: 'translateX(-50%)',
          zIndex: 120, width: 'calc(100% - 32px)',
          background: 'var(--surface-2)', backdropFilter: 'blur(14px)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'toastIn 0.25s ease-out',
          boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(229,53,43,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.heart(toast.icon==='heart', 16)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--text)',
            }}>{toast.title}</div>
            <div style={{
              fontFamily: 'Inter', fontSize: 11, color: 'var(--text-dim)',
              marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{toast.sub}</div>
          </div>
        </div>
      )}

      {/* Act detail modal */}
      {actDetail && (
        <ActDetail actId={actDetail} close={() => setActDetail(null)}
          t={t} lang={lang} favorites={favorites} toggleFav={toggleFav}/>
      )}

      {/* Tab bar */}
      <TabBar tab={tab} setTab={setTab} t={t} favCount={favorites.length}/>
    </div>
  );
}

function TabBar({ tab, setTab, t, favCount }) {
  const tabs = [
    { id: 'home', label: t.home, icon: Icons.home },
    { id: 'lineup', label: t.lineup, icon: Icons.lineup },
    { id: 'map', label: t.map, icon: Icons.map },
    { id: 'favs', label: t.favs, icon: (c) => Icons.favs(c, tab==='favs') },
    { id: 'info', label: t.info, icon: Icons.info },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 90,
      padding: '10px 10px 30px',
      background: 'var(--tabbar-grad)',
    }}>
      <div style={{
        background: 'var(--tabbar-bg)', backdropFilter: 'blur(18px)',
        border: '1px solid var(--border)',
        borderRadius: 24, padding: '8px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      }}>
        {tabs.map(x => {
          const active = tab === x.id;
          const color = active ? '#E5352B' : 'var(--tab-inactive)';
          return (
            <div key={x.id} onClick={() => setTab(x.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, padding: '6px 4px',
              borderRadius: 16, cursor: 'pointer', position: 'relative',
              background: active ? 'var(--tab-active-bg)' : 'transparent',
            }}>
              {active && (
                <div style={{
                  position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                  width: 20, height: 3, borderRadius: 999, background: '#E5352B',
                }}/>
              )}
              {x.icon(active ? '#E5352B' : color)}
              <div style={{
                fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 9.5, fontWeight: 700,
                color: active ? 'var(--text)' : 'var(--tab-inactive)',
                letterSpacing: 0.2,
              }}>{x.label}</div>
              {x.id === 'favs' && favCount > 0 && (
                <div style={{
                  position: 'absolute', top: 2, right: 12,
                  width: 14, height: 14, borderRadius: 999,
                  background: '#E5352B', color: '#fff',
                  fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 9, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{favCount}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { AppShell, TabBar });
