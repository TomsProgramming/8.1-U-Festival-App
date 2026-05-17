import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { STAGES } from '../../data/festival';
import { Icons } from '../../components/brand/Icons';
import { Pin } from '../../components/pin/Pin';
import type { PinKind } from '../../components/pin/Pin';
import { MapScrollArea, type ScrollAreaHandle } from './MapScrollArea';
import { MAP_PINS, type MapPin } from './mapPins';
import './map.scss';

interface FilterGroup {
  id: string;
  label: string;
  kinds: PinKind[] | null;
}

const CAPACITIES: Record<string, string> = {
  ponton: '15,000',
  lake: '8,000',
  club: '3,500',
  hangar: '6,000',
};

export default function MapPage() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<MapPin | null>(null);
  const [filter, setFilter] = useState('all');
  const [fullscreen, setFullscreen] = useState(false);
  const handleRef = useRef<ScrollAreaHandle | null>(null);

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

  const stage = selected?.stageId ? STAGES.find((s) => s.id === selected.stageId) : null;

  return (
    <div className="map">
      <div className="screen-header">
        <div className="map__header-row">
          <div>
            <div className="screen-header__title">{t.map}</div>
            <div className="screen-header__subtitle">Strijkviertel · Utrecht</div>
          </div>
          <button type="button" className="map__fullscreen-btn" onClick={() => setFullscreen(!fullscreen)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              {fullscreen ? (
                <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              ) : (
                <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              )}
            </svg>
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

      <div className={`map__container ${fullscreen ? 'is-fullscreen' : ''}`}>
        <MapScrollArea
          pins={visiblePins}
          selected={selected}
          setSelected={setSelected}
          fullscreen={fullscreen}
          handleRef={handleRef}
        />

        <div className="map__controls">
          <button type="button" className="map__btn" onClick={() => handleRef.current?.zoom(1.15)}>
            ＋
          </button>
          <button type="button" className="map__btn" onClick={() => handleRef.current?.zoom(1 / 1.15)}>
            −
          </button>
          <button type="button" className="map__btn" onClick={() => handleRef.current?.recenter()}>
            ◎
          </button>
        </div>

        <div className="map__count">
          {visiblePins.length} {lang === 'nl' ? 'LOCATIES' : 'LOCATIONS'}
        </div>
      </div>

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
          {STAGES.map((s, i) => (
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 22s8-6 8-12a8 8 0 0 0-16 0c0 6 8 12 8 12z" stroke="#fff" strokeWidth="2" />
            <circle cx="12" cy="10" r="2.5" stroke="#fff" strokeWidth="2" />
          </svg>
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
