import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icons } from '../../components/brand/Icons';
import { MatIcon } from '../../components/brand/MatIcon';
import { Pin } from '../../components/pin/Pin';
import type { PinKind } from '../../components/pin/Pin';
import { MapScrollArea, type ScrollAreaHandle } from './MapScrollArea';
import { MAP_PINS, type MapPin } from './mapPins';
import { useUserLocation, type WalkSpeed } from './useUserLocation';
import type { SvgPoint } from './geo';
import './map.scss';

interface FilterGroup {
  id: string;
  label: string;
  kinds: PinKind[] | null;
}

interface SimPreset {
  id: string;
  labelNL: string;
  labelEN: string;
  pos: SvgPoint;
}

const CAPACITIES: Record<string, string> = {
  ponton: '15,000',
  lake: '8,000',
  club: '3,500',
  hangar: '6,000',
};

const SIM_PRESETS: SimPreset[] = [
  { id: 'entrance', labelNL: 'Bij de entree', labelEN: 'At entrance', pos: { x: 400, y: 1000 } },
  { id: 'ponton', labelNL: 'Bij Ponton', labelEN: 'At Ponton', pos: { x: 210, y: 320 } },
  { id: 'lake', labelNL: 'Bij The Lake', labelEN: 'At The Lake', pos: { x: 455, y: 610 } },
  { id: 'club', labelNL: 'Bij The Club', labelEN: 'At The Club', pos: { x: 625, y: 380 } },
  { id: 'hangar', labelNL: 'Bij Hangar', labelEN: 'At Hangar', pos: { x: 145, y: 830 } },
  { id: 'plaza', labelNL: 'Op de Plaza', labelEN: 'At the Plaza', pos: { x: 400, y: 870 } },
];

export default function MapPage() {
  const { t, lang, stages, showToast } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MapPin | null>(null);
  const [filter, setFilter] = useState('all');
  const [fullscreen, setFullscreen] = useState(false);
  const handleRef = useRef<ScrollAreaHandle | null>(null);
  const location = useUserLocation();
  const isSim = location.status === 'simulated';
  const [followMe, setFollowMe] = useState(false);

  const filterGroups: FilterGroup[] = [
    { id: 'all', label: lang === 'nl' ? 'Alles' : 'All', kinds: null },
    { id: 'stage', label: lang === 'nl' ? 'Podia' : 'Stages', kinds: ['stage'] },
    { id: 'fb', label: lang === 'nl' ? 'Eten & drinken' : 'Food & drinks', kinds: ['food', 'bar', 'icecream'] },
    { id: 'fac', label: lang === 'nl' ? 'Faciliteiten' : 'Facilities', kinds: ['toilet', 'locker', 'merch'] },
    { id: 'safety', label: lang === 'nl' ? 'Hulp' : 'Safety', kinds: ['firstaid', 'entrance'] },
  ];
  const activeGroup = filterGroups.find((g) => g.id === filter)!;
  const visiblePins = activeGroup.kinds ? MAP_PINS.filter((p) => activeGroup.kinds!.includes(p.kind)) : MAP_PINS;

  const labelFor = (kind: PinKind): string =>
    ({
      food: t.food,
      toilet: t.toilet,
      bar: lang === 'nl' ? 'Bar' : 'Bar',
      icecream: lang === 'nl' ? 'IJskar' : 'Ice cream',
      firstaid: t.firstaid,
      merch: lang === 'nl' ? 'Merchandise' : 'Merch',
      locker: t.lockers,
      entrance: t.entrance,
      stage: lang === 'nl' ? 'Podium' : 'Stage',
    })[kind];

  const stage = selected?.stageId ? stages.find((s) => s.id === selected.stageId) : null;

  // Toast voor "buiten festival" / geweigerd: laat de gebruiker weten dat sim-modus bestaat.
  const errorBannerShownRef = useRef<string | null>(null);
  useEffect(() => {
    const s = location.status;
    if ((s === 'outside' || s === 'denied' || s === 'unavailable' || s === 'error') && errorBannerShownRef.current !== s) {
      errorBannerShownRef.current = s;
      const titles: Record<string, { nl: string; en: string }> = {
        outside: { nl: 'Je bent niet op het festival', en: 'You are not at the festival' },
        denied: { nl: 'Locatie geweigerd', en: 'Location denied' },
        unavailable: { nl: 'Geen locatie beschikbaar', en: 'Location unavailable' },
        error: { nl: 'Locatie mislukt', en: 'Location failed' },
      };
      const subs: Record<string, { nl: string; en: string }> = {
        outside: { nl: 'Gebruik testmodus om de kaart te proberen.', en: 'Use test mode to try the map.' },
        denied: { nl: 'Sta locatie toe of gebruik testmodus.', en: 'Allow location or use test mode.' },
        unavailable: { nl: 'Deze browser ondersteunt geen GPS.', en: 'This browser has no GPS support.' },
        error: { nl: 'Probeer opnieuw of gebruik testmodus.', en: 'Try again or use test mode.' },
      };
      showToast({
        title: titles[s][lang],
        sub: subs[s][lang],
        icon: 'heart-off',
      });
    }
    if (s === 'idle' || s === 'real' || s === 'simulated') {
      errorBannerShownRef.current = null;
    }
  }, [location.status, lang, showToast]);

  // Auto-center wanneer een nieuwe real-fix binnenkomt voor het eerst.
  const centeredForRealRef = useRef(false);
  useEffect(() => {
    if (location.status === 'real' && location.position && !centeredForRealRef.current) {
      handleRef.current?.centerOn(location.position);
      centeredForRealRef.current = true;
    }
    if (location.status !== 'real') {
      centeredForRealRef.current = false;
    }
  }, [location.status, location.position]);

  // Volg-mij: kaart elke ~400ms recenteren op de pin tijdens wandelen of GPS-test.
  const lastFollowRef = useRef(0);
  useEffect(() => {
    const moving = location.walk === 'walking' || location.gpsTest;
    if (followMe && moving && location.position) {
      const now = performance.now();
      if (now - lastFollowRef.current > 400) {
        lastFollowRef.current = now;
        handleRef.current?.centerOn(location.position);
      }
    }
  }, [followMe, location.walk, location.gpsTest, location.position]);

  const onLocationButton = () => {
    if (location.position) {
      handleRef.current?.centerOn(location.position);
      return;
    }
    location.requestReal();
  };

  const onSimTap = (p: SvgPoint) => {
    location.setSimulated(p);
  };

  const activePresetId = isSim && location.position
    ? SIM_PRESETS.find((p) => Math.abs(p.pos.x - location.position!.x) < 1 && Math.abs(p.pos.y - location.position!.y) < 1)?.id
    : undefined;

  return (
    <div className="map">
      <div className="screen-header">
        <div className="map__header-row">
          <div>
            <div className="screen-header__title">{t.map}</div>
            <div className="screen-header__subtitle">Strijkviertel · Utrecht</div>
          </div>
          <button type="button" className="map__fullscreen-btn" onClick={() => setFullscreen(!fullscreen)}>
            <MatIcon name={fullscreen ? 'close_fullscreen' : 'open_in_full'} size={14} weight={500} />
            {fullscreen ? (lang === 'nl' ? 'Sluit' : 'Close') : lang === 'nl' ? 'Vol scherm' : 'Fullscreen'}
          </button>
        </div>
      </div>

      <div className="map__filters">
        {filterGroups.map((f) => (
          <button
            type="button"
            key={f.id}
            className={`map__filter ${filter === f.id ? 'is-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {(location.status === 'real' || location.status === 'requesting') && (
        <div className="map__loc-banner">
          <span className="map__loc-banner-dot" />
          <div className="map__loc-banner-text">
            {location.status === 'requesting'
              ? lang === 'nl' ? 'Locatie zoeken…' : 'Finding your location…'
              : lang === 'nl'
                ? `Live locatie${location.accuracy ? ` · ±${Math.round(location.accuracy)} m` : ''}`
                : `Live location${location.accuracy ? ` · ±${Math.round(location.accuracy)} m` : ''}`}
          </div>
          <button type="button" className="map__loc-banner-btn" onClick={location.clear}>
            {lang === 'nl' ? 'Stop' : 'Stop'}
          </button>
        </div>
      )}

      {(location.status === 'denied' || location.status === 'outside' || location.status === 'unavailable' || location.status === 'error') && (
        <div className="map__loc-banner is-warn">
          <MatIcon name="location_off" size={16} weight={500} color="var(--accent)" />
          <div className="map__loc-banner-text">
            {location.status === 'denied' && (lang === 'nl' ? 'Locatie geweigerd in de browser.' : 'Location blocked in browser.')}
            {location.status === 'outside' && (lang === 'nl' ? 'Je bent niet op het festivalterrein.' : 'You are not on the festival grounds.')}
            {location.status === 'unavailable' && (lang === 'nl' ? 'Deze browser kent geen GPS.' : 'No GPS in this browser.')}
            {location.status === 'error' && (lang === 'nl' ? 'Locatie ophalen mislukt.' : 'Could not get location.')}
          </div>
          <button type="button" className="map__loc-banner-btn" onClick={() => location.setSimulated(SIM_PRESETS[0].pos)}>
            {lang === 'nl' ? 'Test thuis' : 'Test mode'}
          </button>
        </div>
      )}

      {isSim && (
        <div className="map__loc-banner is-sim">
          <span className="map__loc-banner-dot" />
          <div className="map__loc-banner-text">
            {location.gpsTest
              ? lang === 'nl' ? 'GPS-test loopt — beweeg jezelf met je telefoon.' : 'GPS test running — move with your phone.'
              : location.walk === 'walking'
                ? lang === 'nl' ? 'Testmodus — pin wandelt over het terrein.' : 'Test mode — pin is walking the grounds.'
                : location.walk === 'paused'
                  ? lang === 'nl' ? 'Testmodus — wandeling gepauzeerd.' : 'Test mode — walk paused.'
                  : lang === 'nl' ? 'Testmodus actief — tik op de kaart of kies hieronder.' : 'Test mode active — tap the map or pick below.'}
          </div>
          <button type="button" className="map__loc-banner-btn" onClick={location.clear}>
            {lang === 'nl' ? 'Stop' : 'Stop'}
          </button>
        </div>
      )}

      <div className={`map__container ${fullscreen ? 'is-fullscreen' : ''}`}>
        <MapScrollArea
          pins={visiblePins}
          selected={selected}
          setSelected={setSelected}
          fullscreen={fullscreen}
          handleRef={handleRef}
          userPosition={location.position}
          userLabel={isSim ? (lang === 'nl' ? 'TEST' : 'TEST') : lang === 'nl' ? 'Jij' : 'You'}
          simMode={isSim}
          onSimTap={onSimTap}
        />

        <div className="map__controls">
          <button type="button" className="map__btn" onClick={() => handleRef.current?.zoom(1.15)} aria-label="Zoom in">
            <MatIcon name="add" size={18} weight={600} color="#fff" />
          </button>
          <button type="button" className="map__btn" onClick={() => handleRef.current?.zoom(1 / 1.15)} aria-label="Zoom out">
            <MatIcon name="remove" size={18} weight={600} color="#fff" />
          </button>
          <button type="button" className="map__btn" onClick={() => handleRef.current?.recenter()} aria-label="Recenter">
            <MatIcon name="filter_center_focus" size={18} weight={500} color="#fff" />
          </button>
          <button
            type="button"
            className="map__btn"
            onClick={onLocationButton}
            aria-label={lang === 'nl' ? 'Mijn locatie' : 'My location'}
            style={location.position ? { background: '#2C86FF' } : undefined}
          >
            <MatIcon name="my_location" size={18} weight={500} color="#fff" />
          </button>
        </div>

        <div className="map__count">
          {visiblePins.length} {lang === 'nl' ? 'LOCATIES' : 'LOCATIONS'}
        </div>
      </div>

      {isSim && (
        <div className="map__sim-panel">
          <div className="map__sim-title">
            <MatIcon name="science" size={16} weight={500} />
            {lang === 'nl' ? 'Testmodus' : 'Test mode'}
            <span className="map__sim-title-badge">DEV</span>
          </div>
          <div className="map__sim-hint">
            {lang === 'nl'
              ? 'Doe alsof je op het festival bent. Tik op de kaart om jezelf te verplaatsen, of kies een preset.'
              : 'Pretend you are at the festival. Tap the map to move yourself, or pick a preset.'}
          </div>
          <div className="map__sim-presets">
            {SIM_PRESETS.map((p) => (
              <button
                type="button"
                key={p.id}
                className={`map__sim-preset ${activePresetId === p.id ? 'is-active' : ''}`}
                disabled={location.walk === 'walking' || location.gpsTest}
                onClick={() => {
                  location.setSimulated(p.pos);
                  handleRef.current?.centerOn(p.pos);
                }}
              >
                {lang === 'nl' ? p.labelNL : p.labelEN}
              </button>
            ))}
          </div>

          <div className="map__sim-divider" />

          <div className="map__sim-subtitle">
            <MatIcon name="directions_walk" size={14} weight={500} />
            {lang === 'nl' ? 'Beweeg automatisch over het terrein' : 'Auto-walk around the grounds'}
          </div>

          <div className="map__sim-walk-row">
            {location.walk === 'off' && (
              <button
                type="button"
                className="map__sim-walk-btn is-primary"
                disabled={location.gpsTest}
                onClick={() => {
                  location.startWalk();
                  if (followMe) handleRef.current?.centerOn({ x: 400, y: 1000 });
                }}
              >
                <MatIcon name="play_arrow" size={14} weight={600} color="#fff" />
                {lang === 'nl' ? 'Start wandeling' : 'Start walking'}
              </button>
            )}
            {location.walk === 'walking' && (
              <>
                <button type="button" className="map__sim-walk-btn" onClick={location.pauseWalk}>
                  <MatIcon name="pause" size={14} weight={600} />
                  {lang === 'nl' ? 'Pauzeer' : 'Pause'}
                </button>
                <button type="button" className="map__sim-walk-btn" onClick={location.stopWalk}>
                  <MatIcon name="stop" size={14} weight={600} />
                  {lang === 'nl' ? 'Stop' : 'Stop'}
                </button>
              </>
            )}
            {location.walk === 'paused' && (
              <>
                <button type="button" className="map__sim-walk-btn is-primary" onClick={location.resumeWalk}>
                  <MatIcon name="play_arrow" size={14} weight={600} color="#fff" />
                  {lang === 'nl' ? 'Hervat' : 'Resume'}
                </button>
                <button type="button" className="map__sim-walk-btn" onClick={location.stopWalk}>
                  <MatIcon name="stop" size={14} weight={600} />
                  {lang === 'nl' ? 'Stop' : 'Stop'}
                </button>
              </>
            )}
          </div>

          <div className="map__sim-speed-row">
            <span className="map__sim-speed-label">{lang === 'nl' ? 'Snelheid' : 'Speed'}</span>
            {(['slow', 'normal', 'fast'] as WalkSpeed[]).map((sp) => (
              <button
                type="button"
                key={sp}
                className={`map__sim-speed-btn ${location.walkSpeed === sp ? 'is-active' : ''}`}
                onClick={() => location.setWalkSpeed(sp)}
              >
                {sp === 'slow' && (lang === 'nl' ? 'Langzaam' : 'Slow')}
                {sp === 'normal' && (lang === 'nl' ? 'Normaal' : 'Normal')}
                {sp === 'fast' && (lang === 'nl' ? 'Snel' : 'Fast')}
              </button>
            ))}
          </div>

          <label className="map__sim-follow">
            <input type="checkbox" checked={followMe} onChange={(e) => setFollowMe(e.target.checked)} />
            <span>{lang === 'nl' ? 'Kaart volgt mijn pin' : 'Map follows my pin'}</span>
          </label>

          <div className="map__sim-divider" />

          <div className="map__sim-subtitle">
            <MatIcon name="directions_run" size={14} weight={500} />
            {lang === 'nl' ? 'Loop écht buiten met je telefoon' : 'Walk outside with your phone'}
          </div>
          <div className="map__sim-hint">
            {lang === 'nl'
              ? 'Zet de pin neer (preset of tik), start GPS-test, en je echte beweging wordt 1-op-1 op de festivalkaart geprojecteerd. Werkt in de geïnstalleerde app.'
              : 'Place the pin (preset or tap), start GPS test, and your real movement is mapped 1:1 onto the festival map. Works in the installed app.'}
          </div>

          <div className="map__sim-walk-row">
            {!location.gpsTest && (
              <button
                type="button"
                className="map__sim-walk-btn is-primary"
                disabled={location.walk === 'walking'}
                onClick={() => {
                  const anchor = location.position ?? SIM_PRESETS[0].pos;
                  location.startGpsTest(anchor);
                }}
              >
                <MatIcon name="gps_fixed" size={14} weight={600} color="#fff" />
                {lang === 'nl' ? 'Start GPS-test' : 'Start GPS test'}
              </button>
            )}
            {location.gpsTest && (
              <>
                <button type="button" className="map__sim-walk-btn" onClick={location.reanchorGpsTest}>
                  <MatIcon name="my_location" size={14} weight={600} />
                  {lang === 'nl' ? 'Reset hier' : 'Reset here'}
                </button>
                <button type="button" className="map__sim-walk-btn" onClick={location.stopGpsTest}>
                  <MatIcon name="stop" size={14} weight={600} />
                  {lang === 'nl' ? 'Stop' : 'Stop'}
                </button>
              </>
            )}
          </div>

          {location.gpsTest && (
            <div className="map__sim-gps-status">
              <MatIcon name="satellite_alt" size={13} weight={500} color="#2C86FF" />
              {location.accuracy
                ? lang === 'nl'
                  ? `GPS actief · ±${Math.round(location.accuracy)} m precisie`
                  : `GPS active · ±${Math.round(location.accuracy)} m accuracy`
                : lang === 'nl' ? 'Wachten op GPS-signaal…' : 'Waiting for GPS signal…'}
            </div>
          )}

          <div className="map__sim-actions">
            <button type="button" className="map__sim-stop" onClick={location.clear}>
              {lang === 'nl' ? 'Stop testmodus' : 'Stop test mode'}
            </button>
          </div>
        </div>
      )}

      {location.status === 'idle' && (
        <div className="map__loc-banner">
          <MatIcon name="explore" size={16} weight={500} color="var(--text-dim)" />
          <div className="map__loc-banner-text">
            {lang === 'nl'
              ? 'Tik op het locatie-icoon om je positie te zien.'
              : 'Tap the location icon to see where you are.'}
          </div>
          <button
            type="button"
            className="map__loc-banner-btn"
            onClick={() => location.setSimulated(SIM_PRESETS[0].pos)}
          >
            {lang === 'nl' ? 'Test thuis' : 'Test mode'}
          </button>
        </div>
      )}

      {selected && (
        <div className="map__card">
          <div className="map__card-head">
            <Pin kind={selected.kind} num={selected.num} size={48} />
            <div className="map__card-info">
              <div className="map__card-title">{selected.label || labelFor(selected.kind)}</div>
              <div className="map__card-sub">
                {selected.kind === 'stage'
                  ? `${lang === 'nl' ? 'Capaciteit' : 'Capacity'} · ${CAPACITIES[selected.id] || '—'}`
                  : labelFor(selected.kind)}
              </div>
            </div>
            <button type="button" className="map__card-close" onClick={() => setSelected(null)} aria-label="Close">
              {Icons.close('var(--text-dim)', 14)}
            </button>
          </div>
          {selected.kind === 'stage' && stage && (
            <>
              <div className="map__card-desc">{lang === 'nl' ? stage.descNL : stage.descEN}</div>
              <button type="button" className="map__card-cta" onClick={() => navigate('/lineup')}>
                {lang === 'nl' ? 'Bekijk programma →' : 'See programme →'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="map__legend-wrap">
        <div className="map__legend-title">{t.legend}</div>
        <div className="map__legend">
          {stages.map((s, i) => (
            <LegendRow key={s.id} label={s.name} sub={lang === 'nl' ? 'Podium' : 'Stage'} pin={<Pin kind="stage" num={i + 1} size={30} />} />
          ))}
          <LegendRow label={t.entrance} sub={lang === 'nl' ? 'In- en uitgang' : 'Entry & exit'} pin={<Pin kind="entrance" size={30} />} />
          <LegendRow label={t.food} sub={lang === 'nl' ? 'Eten' : 'Food'} pin={<Pin kind="food" size={30} />} />
          <LegendRow label={lang === 'nl' ? 'Bar' : 'Bar'} sub={lang === 'nl' ? 'Drinken' : 'Drinks'} pin={<Pin kind="bar" size={30} />} />
          <LegendRow label={lang === 'nl' ? 'IJskar' : 'Ice cream'} sub={lang === 'nl' ? 'Koud' : 'Cold'} pin={<Pin kind="icecream" size={30} />} />
          <LegendRow label={t.toilet} sub={lang === 'nl' ? 'WC' : 'Toilets'} pin={<Pin kind="toilet" size={30} />} />
          <LegendRow label={t.firstaid} sub={lang === 'nl' ? 'EHBO' : 'First aid'} pin={<Pin kind="firstaid" size={30} />} />
          <LegendRow label={lang === 'nl' ? 'Merchandise' : 'Merch'} sub={lang === 'nl' ? 'Shop' : 'Shop'} pin={<Pin kind="merch" size={30} />} />
          <LegendRow label={t.lockers} sub={lang === 'nl' ? 'Opslag' : 'Storage'} pin={<Pin kind="locker" size={30} />} />
        </div>
      </div>

      <div className="map__lost">
        <div className="map__lost-icon">
          <MatIcon name="emergency_home" size={22} weight={500} color="#fff" />
        </div>
        <div>
          <div className="map__lost-title">{lang === 'nl' ? 'Verdwaald?' : 'Lost?'}</div>
          <div className="map__lost-text">
            {lang === 'nl'
              ? 'Loop naar een EHBO-post of vraag een crewlid. Herken ze aan het rode shirt.'
              : 'Head to a first-aid post or ask a crew member — look for the red shirts.'}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendRow({ label, sub, pin }: { label: string; sub: string; pin: React.ReactNode }) {
  return (
    <div className="map__legend-row">
      {pin}
      <div className="map__legend-text">
        <div className="map__legend-label">{label}</div>
        <div className="map__legend-sub">{sub}</div>
      </div>
    </div>
  );
}
