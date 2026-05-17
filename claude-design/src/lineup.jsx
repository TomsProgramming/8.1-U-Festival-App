// Line-up blockschema — horizontal timeline per stage, with favorite heart on each block

function LineupScreen({ t, lang, favorites, toggleFav, showActDetail }) {
  const [day, setDay] = React.useState('saturday');
  const hourStart = 13, hourEnd = 26; // until 02:00 next day
  const hours = [];
  for (let h = hourStart; h <= hourEnd; h++) hours.push(h);
  const pxPerHour = 90;
  const stageLabelW = 92;

  const items = SCHEDULE[day];

  const fmt = (h) => {
    const hh = ((Math.floor(h)) % 24 + 24) % 24;
    const mm = (h % 1) * 60;
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  };

  // "Now" indicator — pretend it's 20:15 on Saturday
  const nowH = 20.25;
  const showNow = day === 'saturday';

  return (
    <div style={{ paddingBottom: 110, background: 'var(--bg)', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ padding: '60px 20px 16px' }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 36, fontWeight: 800,
          color: 'var(--text)', letterSpacing: -1,
        }}>{t.lineup}</div>
        <div style={{
          fontFamily: 'Inter', fontSize: 13, color: 'var(--text-mute)', marginTop: 2,
        }}>{lang==='nl' ? 'Veeg om te bladeren · tik op een act' : 'Swipe to browse · tap an act'}</div>
      </div>

      {/* Day toggle */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px', marginBottom: 16,
      }}>
        {['saturday', 'sunday'].map(d => (
          <div key={d} onClick={() => setDay(d)} style={{
            flex: 1, padding: '12px 16px', borderRadius: 999,
            background: day===d ? '#E5352B' : 'var(--chip)',
            color: day===d ? '#fff' : 'var(--text-mute)',
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 700,
            textAlign: 'center', cursor: 'pointer',
            border: day===d ? 'none' : '1px solid var(--border)',
          }}>
            <div>{t[d]}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2, fontWeight: 500 }}>
              {d==='saturday' ? '5 SEP' : '6 SEP'}
            </div>
          </div>
        ))}
      </div>

      {/* Block schema */}
      <div style={{
        margin: '0 16px', borderRadius: 18, overflow: 'hidden',
        background: 'var(--surface)', border: '1px solid var(--border)',
      }}>
        {/* Time header */}
        <div style={{ display: 'flex', position: 'relative' }}>
          <div style={{
            width: stageLabelW, background: 'var(--surface)', flexShrink: 0,
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            height: 44,
          }}/>
          <div style={{ overflowX: 'auto', overflowY: 'hidden', flex: 1 }} className="schedule-scroll">
            <div style={{
              display: 'flex', height: 44, width: (hourEnd-hourStart+1) * pxPerHour,
              borderBottom: '1px solid var(--border)',
            }}>
              {hours.map(h => (
                <div key={h} style={{
                  width: pxPerHour, flexShrink: 0, position: 'relative',
                  borderLeft: '1px solid var(--border)',
                }}>
                  <div style={{
                    position: 'absolute', left: 6, top: 14,
                    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: 600,
                    color: 'var(--text-mute)',
                  }}>{fmt(h)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage rows */}
        {STAGES.map(stage => {
          const rowItems = items.filter(i => i.stageId === stage.id);
          return (
            <div key={stage.id} style={{
              display: 'flex', position: 'relative',
              borderBottom: '1px solid var(--border)',
            }}>
              {/* stage label */}
              <div style={{
                width: stageLabelW, background: 'var(--surface)',
                padding: '16px 10px', flexShrink: 0,
                borderRight: '1px solid var(--border)',
                height: 88,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 6, height: 48, borderRadius: 3, background: stage.color,
                }}/>
                <div>
                  <div style={{
                    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 800,
                    color: 'var(--text)', lineHeight: 1, letterSpacing: -0.3,
                  }}>{stage.name}</div>
                  <div style={{
                    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 9, letterSpacing: 1.2,
                    color: 'var(--text-faint)', marginTop: 3, textTransform: 'uppercase',
                  }}>STAGE 0{STAGES.findIndex(s=>s.id===stage.id)+1}</div>
                </div>
              </div>
              {/* row track */}
              <div style={{ overflowX: 'auto', overflowY: 'hidden', flex: 1 }} className="schedule-scroll">
                <div style={{
                  width: (hourEnd-hourStart+1) * pxPerHour, height: 88,
                  position: 'relative', background: `
                    repeating-linear-gradient(90deg,
                      transparent 0,
                      transparent ${pxPerHour-1}px,
                      var(--grid-line) ${pxPerHour-1}px,
                      var(--grid-line) ${pxPerHour}px)`,
                }}>
                  {/* Now line */}
                  {showNow && (
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0,
                      left: (nowH - hourStart) * pxPerHour,
                      width: 2, background: '#fff', zIndex: 3,
                    }}>
                      <div style={{
                        position: 'absolute', top: -2, left: -4,
                        width: 10, height: 10, borderRadius: '50%', background: '#fff',
                      }}/>
                    </div>
                  )}
                  {rowItems.map((it, i) => {
                    const left = (it.start - hourStart) * pxPerHour;
                    const width = (it.end - it.start) * pxPerHour - 4;
                    const act = ACTS.find(a => a.id === it.actId);
                    const fav = favorites.includes(act.id);
                    const isNow = showNow && it.start <= nowH && it.end > nowH;
                    return (
                      <div key={i} style={{
                        position: 'absolute', top: 8, left, width, height: 72,
                        borderRadius: 10,
                        background: isNow ? stage.color : 'var(--surface-2)',
                        border: isNow ? 'none' : `1px solid var(--border-strong)`,
                        borderLeft: `4px solid ${stage.color}`,
                        overflow: 'hidden', cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        padding: '8px 10px',
                      }} onClick={() => showActDetail(act.id)}>
                        <div style={{
                          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 13, fontWeight: 700,
                          color: isNow && stage.id !== 'hangar' ? '#fff' : (isNow ? '#000' : 'var(--text)'),
                          lineHeight: 1.05,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          paddingRight: 22,
                        }}>{act.name}</div>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
                        }}>
                          <div style={{
                            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: 600,
                            color: isNow ? (stage.id==='hangar' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)') : 'var(--text-mute)',
                          }}>{fmt(it.start)}–{fmt(it.end)}</div>
                          {isNow && (
                            <div style={{
                              padding: '2px 6px', borderRadius: 4,
                              background: stage.id==='hangar' ? '#000' : 'rgba(0,0,0,0.3)',
                              color: stage.id==='hangar' ? '#fff' : '#fff',
                              fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 8, fontWeight: 800,
                              letterSpacing: 1,
                            }}>{t.now.toUpperCase()}</div>
                          )}
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); toggleFav(act.id); }} style={{
                          position: 'absolute', top: 6, right: 6,
                          width: 22, height: 22, borderRadius: '50%',
                          background: 'rgba(0,0,0,0.4)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{Icons.heart(fav, 12)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync scroll of all rows */}
      <style>{`
        .schedule-scroll::-webkit-scrollbar { height: 0; display: none; }
        .schedule-scroll { scrollbar-width: none; }
      `}</style>

      {/* Legend card */}
      <div style={{
        margin: '16px 16px 0', padding: '14px 16px',
        borderRadius: 14, background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {Icons.bell('#E5352B', 16)}
        <div style={{
          fontFamily: 'Inter', fontSize: 12, color: 'var(--text-dim)',
          flex: 1, lineHeight: 1.4,
        }}>
          {lang==='nl'
            ? 'Tik het hart om een act te volgen. Je krijgt een melding 15, 10 en 5 min voor aanvang.'
            : 'Tap the heart to follow an act. You\'ll get a notification 15, 10 and 5 min before.'}
        </div>
      </div>
    </div>
  );
}

// Sync horizontal scroll across all stage rows
(() => {
  if (typeof window === 'undefined') return;
  let syncing = false;
  setTimeout(() => {
    const scrollers = () => document.querySelectorAll('.schedule-scroll');
    document.addEventListener('scroll', (e) => {
      if (!e.target.classList || !e.target.classList.contains('schedule-scroll')) return;
      if (syncing) return;
      syncing = true;
      const x = e.target.scrollLeft;
      scrollers().forEach(s => { if (s !== e.target) s.scrollLeft = x; });
      requestAnimationFrame(() => syncing = false);
    }, true);
  }, 500);
})();

Object.assign(window, { LineupScreen });
