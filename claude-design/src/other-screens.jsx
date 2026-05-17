// Info screen — festival info, reachability, FAQ, contact

function InfoScreen({ t, lang }) {
  const faqs = lang === 'nl' ? [
    { q: 'Ik gebruik medicatie. Wat nu?', a: 'Neem je medicatie mee in de originele verpakking en zorg dat er niet meer dan nodig voor 1 dag op het terrein is. Bij twijfel: vraag onze EHBO-post om mee te helpen.' },
    { q: 'Mag ik het festivalterrein tussentijds verlaten?', a: 'Helaas niet. Om de veiligheid te waarborgen kun je alleen met een vip-pas heen en weer. We zorgen voor genoeg toiletten, eten en drinken binnen.' },
    { q: 'Zijn er lockers?', a: 'Ja, bij de ingang vind je kleine, middel en grote lockers. Je kunt ze de hele dag openen en sluiten met je wristband.' },
    { q: 'Kan ik pinnen aan de bar?', a: 'Zeker. Het hele terrein is cashless — wij accepteren alleen pin en contactless.' },
    { q: 'Hoe laat begint het festival?', a: 'Zaterdag 5 september om 12:00 uur. Programma loopt tot 03:00 uur.' },
  ] : [
    { q: 'I need to take medication. What now?', a: 'Bring it in its original packaging and keep no more than one day\'s supply on site. If in doubt, speak to our first-aid team.' },
    { q: 'Can I leave the festival grounds mid-day?', a: 'Unfortunately not. For safety reasons only VIP passes allow re-entry. We\'ll make sure there\'s plenty of toilets, food and drinks inside.' },
    { q: 'Are there lockers?', a: 'Yes — small, medium and large lockers are available at the entrance. Open & close them all day with your wristband.' },
    { q: 'Can I pay with card?', a: 'Absolutely. The entire site is cashless — card and contactless only.' },
    { q: 'What time does it start?', a: 'Saturday 5 September at 12:00. Programme runs until 03:00.' },
  ];

  const reach = lang==='nl' ? [
    { icon: '🚲', title: 'Fiets', desc: 'Er is een grote gratis fietsenstalling waar je je fiets de hele dag kunt stallen.' },
    { icon: '🚗', title: 'Auto', desc: 'In kaart zijn parkeerplekken aangeduid. Parkeren kan op P+R Papendorp, volg vanaf daar de borden.' },
    { icon: '🚆', title: 'OV', desc: 'Kom je met het openbaar vervoer naar Utrecht? Plan dan je trip via 9292.' },
    { icon: '🚌', title: 'Shuttlebus', desc: 'Vanaf Utrecht Centraal kun je een gratis shuttlebus nemen richting het festivalterrein.' },
    { icon: '🚕', title: 'Taxi + Kiss & Ride', desc: 'Navigeer naar Strijkviertel en volg de borden "Kiss & Ride" of de Taxi-borden.' },
  ] : [
    { icon: '🚲', title: 'Bike', desc: 'Big free bike parking where you can leave your bike all day.' },
    { icon: '🚗', title: 'Car', desc: 'Parking is marked on the map. Park at P+R Papendorp and follow the signs.' },
    { icon: '🚆', title: 'Public transport', desc: 'Coming by train? Plan your journey with 9292.' },
    { icon: '🚌', title: 'Shuttle bus', desc: 'Free shuttle bus from Utrecht Central to the festival site.' },
    { icon: '🚕', title: 'Taxi + Kiss & Ride', desc: 'Navigate to Strijkviertel and follow the Kiss & Ride or Taxi signs.' },
  ];

  return (
    <div style={{ paddingBottom: 110, background: 'var(--bg)', minHeight: '100%' }}>
      <div style={{ padding: '60px 20px 16px' }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 36, fontWeight: 800,
          color: 'var(--text)', letterSpacing: -1,
        }}>{t.info}</div>
      </div>

      {/* Contact card */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          borderRadius: 20, padding: 20,
          background: 'linear-gradient(135deg, #E5352B 0%, #B5281F 100%)',
          color: '#fff', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 11,
            letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7,
          }}>{t.contact}</div>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 30, fontWeight: 800,
            lineHeight: 1, marginTop: 6, letterSpacing: -1,
          }}>❤U Festival<br/>2026</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <InfoRow k={lang==='nl'?'Adres':'Address'} v="Strijkviertelweg, Utrecht" dark/>
            <InfoRow k={lang==='nl'?'Datum':'Date'} v={lang==='nl'?'5–6 september 2026':'5–6 September 2026'} dark/>
            <InfoRow k={lang==='nl'?'Tijd':'Time'} v="12:00 – 03:00" dark/>
          </div>
          <div style={{
            position: 'absolute', right: -30, top: -30, fontSize: 200,
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontWeight: 800, opacity: 0.08,
          }}>❤</div>
        </div>
      </div>

      {/* Reachability */}
      <Section title={t.reach}>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {reach.map((r, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 16px',
              background: 'var(--surface)', borderRadius: 14,
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 26, flexShrink: 0, lineHeight: 1 }}>{r.icon}</div>
              <div>
                <div style={{
                  fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--text)',
                }}>{r.title}</div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 12, color: 'var(--text-mute)',
                  marginTop: 3, lineHeight: 1.4,
                }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Lockers + feature bullets */}
      <Section title={t.lockers_h}>
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: 'var(--surface)', borderRadius: 14, padding: 16,
            border: '1px solid var(--border)',
            fontFamily: 'Inter', fontSize: 13, color: 'var(--text-dim)',
            lineHeight: 1.5,
          }}>
            {lang==='nl'
              ? 'Op het festivalterrein zijn lockers aanwezig waar je je spullen veilig kunt opbergen. Klein €4 · Middel €6 · Groot €8.'
              : 'Lockers are available on site to safely store your belongings. Small €4 · Medium €6 · Large €8.'}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section title={t.faq}>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a}/>)}
        </div>
      </Section>
    </div>
  );
}

function InfoRow({ k, v, dark }) {
  return (
    <div style={{
      display: 'flex', gap: 10, fontFamily: 'Inter', fontSize: 13,
      paddingTop: 4,
    }}>
      <div style={{
        width: 70, color: dark ? 'var(--text-dim)' : 'var(--text-mute)',
        fontWeight: 600,
      }}>{k}</div>
      <div style={{ color: 'var(--text)', fontWeight: 600 }}>{v}</div>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14,
      border: '1px solid var(--border)',
      overflow: 'hidden',
    }}>
      <div onClick={() => setOpen(!open)} style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center',
        cursor: 'pointer', gap: 12,
      }}>
        <div style={{
          flex: 1, fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 600,
          color: 'var(--text)',
        }}>{q}</div>
        <div style={{
          transform: open ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s',
        }}>{Icons.chevron('var(--text-mute)', 14)}</div>
      </div>
      {open && (
        <div style={{
          padding: '0 16px 14px', fontFamily: 'Inter', fontSize: 13,
          color: 'var(--text-dim)', lineHeight: 1.5,
        }}>{a}</div>
      )}
    </div>
  );
}

// Favorites screen
function FavoritesScreen({ t, lang, favorites, toggleFav, showActDetail }) {
  const favActs = favorites.map(id => ACTS.find(a => a.id === id)).filter(Boolean);
  // find scheduled times for each
  const scheduleFor = (id) => {
    const res = [];
    for (const day of ['saturday', 'sunday']) {
      for (const s of SCHEDULE[day]) if (s.actId === id) {
        res.push({ ...s, day, stage: STAGES.find(st => st.id === s.stageId) });
      }
    }
    return res;
  };
  const fmt = (h) => {
    const hh = ((Math.floor(h)) % 24 + 24) % 24;
    const mm = (h % 1) * 60;
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  };

  return (
    <div style={{ paddingBottom: 110, background: 'var(--bg)', minHeight: '100%' }}>
      <div style={{ padding: '60px 20px 16px' }}>
        <div style={{
          fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 36, fontWeight: 800,
          color: 'var(--text)', letterSpacing: -1,
        }}>{t.favs}</div>
        <div style={{
          fontFamily: 'Inter', fontSize: 13, color: 'var(--text-mute)', marginTop: 2,
        }}>
          {favActs.length === 0
            ? (lang==='nl' ? 'Tik harten in de line-up om acts te volgen.' : 'Tap hearts in the line-up to follow acts.')
            : (lang==='nl' ? `${favActs.length} acts · meldingen 15/10/5 min voor aanvang` : `${favActs.length} acts · notifications 15/10/5 min before`)}
        </div>
      </div>

      {favActs.length === 0 ? (
        <div style={{
          margin: '20px 20px', padding: '40px 20px',
          borderRadius: 18, background: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(255,255,255,0.1)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>❤</div>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 16, fontWeight: 700,
            color: 'var(--text-dim)',
          }}>{lang==='nl' ? 'Nog geen favorieten' : 'No favorites yet'}</div>
          <div style={{
            fontFamily: 'Inter', fontSize: 13, color: 'var(--text-faint)',
            marginTop: 6, maxWidth: 240, margin: '6px auto 0', lineHeight: 1.4,
          }}>{t.noFavs}</div>
        </div>
      ) : (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {favActs.map(a => {
            const shows = scheduleFor(a.id);
            return (
              <div key={a.id} onClick={() => showActDetail(a.id)} style={{
                display: 'flex', gap: 12, padding: 12,
                background: 'var(--surface)', borderRadius: 16,
                border: '1px solid var(--border)',
                cursor: 'pointer',
              }}>
                <img src={a.img} style={{
                  width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0,
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 16, fontWeight: 800, color: 'var(--text)',
                  }}>{a.name}</div>
                  <div style={{
                    fontFamily: 'Inter', fontSize: 11, color: 'var(--text-mute)', marginTop: 1,
                  }}>{a.genre}</div>
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {shows.map((s, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 11, color: 'var(--text-dim)',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%', background: s.stage.color,
                        }}/>
                        <span style={{ fontWeight: 700 }}>{s.day==='saturday' ? (lang==='nl'?'za':'Sat') : (lang==='nl'?'zo':'Sun')}</span>
                        <span>{fmt(s.start)}–{fmt(s.end)}</span>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <span>{s.stage.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div onClick={(e) => { e.stopPropagation(); toggleFav(a.id); }} style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: 'rgba(229,53,43,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  alignSelf: 'flex-start',
                }}>{Icons.heart(true, 16)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Act detail modal
function ActDetail({ actId, close, t, lang, favorites, toggleFav }) {
  const a = ACTS.find(x => x.id === actId);
  if (!a) return null;
  const fav = favorites.includes(a.id);
  const shows = [];
  for (const day of ['saturday', 'sunday']) {
    for (const s of SCHEDULE[day]) if (s.actId === a.id) {
      shows.push({ ...s, day, stage: STAGES.find(st => st.id === s.stageId) });
    }
  }
  const fmt = (h) => {
    const hh = ((Math.floor(h)) % 24 + 24) % 24;
    const mm = (h % 1) * 60;
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'var(--bg)', overflowY: 'auto',
      animation: 'slideUp 0.3s ease-out',
    }}>
      {/* Hero */}
      <div style={{
        height: 380, background: `url('${a.img}') center/cover`, position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 30%, rgba(10,10,12,1) 100%)',
        }}/>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 58, left: 20, right: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div onClick={close} style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.close('#fff', 16)}</div>
          <div onClick={() => toggleFav(a.id)} style={{
            width: 40, height: 40, borderRadius: 999,
            background: fav ? '#E5352B' : 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons.heart(fav, 18)}</div>
        </div>
        <div style={{
          position: 'absolute', bottom: 24, left: 20, right: 20,
        }}>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 11, fontWeight: 600,
            color: '#E5352B', letterSpacing: 2, textTransform: 'uppercase',
          }}>{a.genre}</div>
          <div style={{
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 38, fontWeight: 800,
            color: '#fff', lineHeight: 0.95, letterSpacing: -1, marginTop: 6,
          }}>{a.name}</div>
          <div style={{
            fontFamily: 'Inter', fontSize: 13, color: 'var(--text-dim)', marginTop: 6,
          }}>{a.tag}</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 20px 100px' }}>
        {/* Show times */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20,
        }}>
          {shows.map((s, i) => (
            <div key={i} style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderLeft: `4px solid ${s.stage.color}`,
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div>
                <div style={{
                  fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 22, fontWeight: 800, color: 'var(--text)',
                  lineHeight: 1,
                }}>{fmt(s.start)}</div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 10, color: 'var(--text-faint)', marginTop: 3,
                }}>{s.day==='saturday' ? (lang==='nl'?'ZATERDAG':'SATURDAY') : (lang==='nl'?'ZONDAG':'SUNDAY')}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--text)',
                }}>{s.stage.name}</div>
                <div style={{
                  fontFamily: 'Inter', fontSize: 12, color: 'var(--text-mute)', marginTop: 2,
                }}>{fmt(s.start)} – {fmt(s.end)} · {((s.end-s.start)*60).toFixed(0)} {t.min}</div>
              </div>
              {fav && Icons.bell('#E5352B', 18)}
            </div>
          ))}
        </div>

        {/* Bio */}
        <div style={{
          fontFamily: 'Inter', fontSize: 15, color: 'var(--text-dim)',
          lineHeight: 1.55,
        }}>{a[lang==='nl' ? 'bioNL' : 'bioEN']}</div>

        {/* CTA */}
        <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
          <div onClick={() => toggleFav(a.id)} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: fav ? '#1E1E22' : '#E5352B',
            color: '#fff', textAlign: 'center',
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: fav ? '1px solid rgba(255,255,255,0.1)' : 'none',
          }}>
            {Icons.heart(fav, 16)}
            {fav
              ? (lang==='nl' ? 'Gevolgd' : 'Following')
              : (lang==='nl' ? 'Volg + meldingen' : 'Follow + notify')}
          </div>
          <div style={{
            padding: '14px 18px', borderRadius: 12,
            background: '#1E1E22', color: '#fff',
            fontFamily: "Space Grotesk, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid var(--border)',
          }}>▶ {t.watchClip}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InfoScreen, FavoritesScreen, ActDetail });
