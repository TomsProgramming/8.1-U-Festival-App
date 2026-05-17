// Home screen — hero, stages, up next, quick info

function HomeScreen({ t, lang, navigate, favorites, toggleFav, showActDetail }) {
  // Compute "up next" from schedule — pretend time is Sat 20:15
  const upcoming = SCHEDULE.saturday
    .filter(s => s.start >= 20 && s.start <= 24)
    .slice(0, 3)
    .map(s => ({ ...s, act: ACTS.find(a => a.id === s.actId), stage: STAGES.find(st => st.id === s.stageId) }));

  return (
    <div style={{ paddingBottom: 110 }}>
      {/* Hero */}
      <div style={{
        position: 'relative', height: 440,
        background: `url('assets/ponton.png') center/cover no-repeat`,
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.1) 40%, rgba(10,10,12,0.95) 100%)',
        }}/>
        {/* Top bar overlay */}
        <div style={{
          position: 'absolute', top: 64, left: 20, right: 20, zIndex: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Logo size={42} invert={false}/>
          <div style={{
            width: 42, height: 42, borderRadius: 999,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.22)',
          }}>
            {Icons.bell('#fff', 20)}
          </div>
        </div>
        {/* Big title */}
        <div style={{
          position: 'absolute', bottom: 24, left: 20, right: 20, zIndex: 2,
        }}>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 600,
            color: '#E5352B', letterSpacing: 2, textTransform: 'uppercase',
          }}>{t.welcome}</div>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 52, fontWeight: 800,
            color: '#fff', lineHeight: 0.95, letterSpacing: -1.5, marginTop: 6,
          }}>
            ❤U<br/>FESTIVAL<br/><span style={{ color: '#E5352B' }}>2026</span>
          </div>
          <div style={{
            marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap',
          }}>
            <Chip label={t.date}/>
            <Chip label={t.location}/>
          </div>
        </div>
      </div>

      {/* Up next */}
      <Section title={t.upNext} action="Line-up →" onAction={() => navigate('lineup')}>
        <div style={{
          display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 8px',
          scrollbarWidth: 'none',
        }}>
          {upcoming.map((u, i) => (
            <UpNextCard key={i} s={u} t={t} lang={lang}
              fav={favorites.includes(u.act.id)} toggleFav={() => toggleFav(u.act.id)}
              onClick={() => showActDetail(u.act.id)}/>
          ))}
        </div>
      </Section>

      {/* Stages */}
      <Section title={t.stagesHeader}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 20px' }}>
          {STAGES.map(s => (
            <StageRow key={s.id} stage={s} lang={lang} onClick={() => navigate('map')}/>
          ))}
        </div>
      </Section>

      {/* Favorites preview */}
      <Section title={t.favHeader} action={favorites.length ? `${favorites.length} →` : null} onAction={() => navigate('favs')}>
        <div style={{ padding: '0 20px' }}>
          {favorites.length === 0 ? (
            <div style={{
              padding: '20px', borderRadius: 18,
              background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.12)',
              color: 'var(--text-mute)', fontSize: 14, textAlign: 'center',
              fontFamily: 'Inter',
            }}>{t.noFavs}</div>
          ) : (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
              {favorites.map(id => {
                const a = ACTS.find(x => x.id === id); if (!a) return null;
                return (
                  <div key={id} onClick={() => showActDetail(id)} style={{
                    width: 120, flexShrink: 0, cursor: 'pointer',
                  }}>
                    <img src={a.img} style={{
                      width: 120, height: 120, borderRadius: 14, objectFit: 'cover', display: 'block',
                    }}/>
                    <div style={{
                      fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 700,
                      color: '#fff', marginTop: 6, lineHeight: 1.1,
                    }}>{a.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      {/* Golden GLU teaser */}
      <div style={{ padding: '0 20px', marginTop: 28 }}>
        <div style={{
          borderRadius: 20, padding: 20,
          background: 'linear-gradient(135deg, #FFC93C 0%, #E5A52B 100%)',
          color: '#0A0A0C', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontWeight: 800, fontSize: 11,
            letterSpacing: 2, textTransform: 'uppercase', opacity: 0.6,
          }}>{t.golden}</div>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 26, fontWeight: 800,
            lineHeight: 1.05, marginTop: 4, letterSpacing: -0.5,
          }}>{lang==='nl' ? 'Word Golden-GLU lid.' : 'Become a Golden-GLU member.'}</div>
          <div style={{
            fontFamily: 'Inter', fontSize: 13, marginTop: 6, opacity: 0.8, maxWidth: 240,
          }}>{lang==='nl'
            ? 'VIP-ingangen, eerste rij toiletten en 15% korting aan de bar.'
            : 'VIP entry, front-row toilets and 15% off at the bar.'}
          </div>
          <div style={{
            position: 'absolute', right: -20, top: -20, width: 140, height: 140,
            borderRadius: '50%', background: 'rgba(10,10,12,0.08)',
          }}/>
          <div style={{
            position: 'absolute', right: 18, bottom: 18,
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 32, fontWeight: 800,
          }}>★</div>
        </div>
      </div>
    </div>
  );
}

function Chip({ label }) {
  return (
    <div style={{
      padding: '6px 12px', borderRadius: 999,
      background: 'var(--border-strong)', backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.2)',
      fontFamily: 'Inter', fontSize: 12, fontWeight: 500,
      color: '#fff', letterSpacing: 0.2,
    }}>{label}</div>
  );
}

function Section({ title, action, onAction, children }) {
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '0 20px', marginBottom: 12,
      }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 20, fontWeight: 800,
          color: 'var(--text)', letterSpacing: -0.3, whiteSpace: 'nowrap',
        }}>{title}</div>
        {action && (
          <div onClick={onAction} style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 600,
            color: '#E5352B', cursor: 'pointer',
          }}>{action}</div>
        )}
      </div>
      {children}
    </div>
  );
}

function UpNextCard({ s, t, lang, fav, toggleFav, onClick }) {
  const hh = Math.floor(s.start), mm = (s.start % 1) * 60;
  const time = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  return (
    <div style={{
      width: 240, flexShrink: 0, borderRadius: 18,
      background: 'var(--surface)', overflow: 'hidden',
      position: 'relative', cursor: 'pointer',
    }} onClick={onClick}>
      <div style={{
        height: 140, background: `url('${s.act.img}') center/cover`, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(23,23,26,0.95) 100%)',
        }}/>
        <div style={{
          position: 'absolute', top: 10, left: 10,
          padding: '4px 8px', borderRadius: 6,
          background: s.stage.color, color: s.stage.id==='hangar' ? '#000' : '#fff',
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
          textTransform: 'uppercase',
        }}>{s.stage.name}</div>
        <div onClick={(e) => { e.stopPropagation(); toggleFav(); }} style={{
          position: 'absolute', top: 10, right: 10,
          width: 32, height: 32, borderRadius: 999,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{Icons.heart(fav, 16)}</div>
      </div>
      <div style={{ padding: '10px 14px 14px' }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 16, fontWeight: 800,
          color: 'var(--text)', lineHeight: 1.1,
        }}>{s.act.name}</div>
        <div style={{
          fontFamily: 'Inter', fontSize: 12, color: 'var(--text-mute)', marginTop: 3,
        }}>{s.act.genre} • {time}</div>
      </div>
    </div>
  );
}

function StageRow({ stage, lang, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: 'relative', borderRadius: 18, overflow: 'hidden',
      height: 120, cursor: 'pointer',
      background: `url('${stage.img}') center/cover`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(10,10,12,0.85) 0%, rgba(10,10,12,0.35) 60%, rgba(10,10,12,0.1) 100%)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0, padding: '16px 18px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: stage.color, color: stage.id==='hangar' ? '#000' : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 800,
          }}>{STAGES.findIndex(s => s.id===stage.id)+1}</div>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 22, fontWeight: 800,
            color: 'var(--text)', letterSpacing: -0.3,
          }}>{stage.name}</div>
        </div>
        <div style={{
          fontFamily: 'Inter', fontSize: 12, color: 'var(--text-dim)',
          maxWidth: 260, lineHeight: 1.3,
        }}>{stage[lang==='nl' ? 'descNL' : 'descEN']}</div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, Chip, Section });
