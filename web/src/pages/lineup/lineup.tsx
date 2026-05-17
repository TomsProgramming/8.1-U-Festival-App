import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ACTS, SCHEDULE, STAGES, formatHour, type DayId } from '../../data/festival';
import { Icons } from '../../components/brand/Icons';
import './lineup.scss';

const HOUR_START = 13;
const HOUR_END = 26;
const PX_PER_HOUR = 90;

export default function Lineup() {
  const { t, lang, favorites, toggleFav, showActDetail } = useApp();
  const [day, setDay] = useState<DayId>('saturday');
  const scrollersRef = useRef<HTMLDivElement[]>([]);

  const hours = [];
  for (let h = HOUR_START; h <= HOUR_END; h++) hours.push(h);

  const items = SCHEDULE[day];
  const nowH = 20.25;
  const showNow = day === 'saturday';

  useEffect(() => {
    let syncing = false;
    const scrollers = scrollersRef.current;
    const onScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (syncing) return;
      syncing = true;
      const x = target.scrollLeft;
      scrollers.forEach((s) => {
        if (s !== target) s.scrollLeft = x;
      });
      requestAnimationFrame(() => {
        syncing = false;
      });
    };
    scrollers.forEach((s) => s?.addEventListener('scroll', onScroll));
    return () => scrollers.forEach((s) => s?.removeEventListener('scroll', onScroll));
  }, [day]);

  const setScrollerRef = (el: HTMLDivElement | null, idx: number) => {
    if (el) scrollersRef.current[idx] = el;
  };

  return (
    <div className="lineup">
      <div className="screen-header">
        <div className="screen-header__title">{t.lineup}</div>
        <div className="screen-header__subtitle">
          {lang === 'nl' ? 'Veeg om te bladeren · tik op een act' : 'Swipe to browse · tap an act'}
        </div>
      </div>

      <div className="lineup__day-toggle">
        {(['saturday', 'sunday'] as DayId[]).map((d) => (
          <button
            type="button"
            key={d}
            onClick={() => setDay(d)}
            className={`lineup__day ${day === d ? 'is-active' : ''}`}
          >
            <div>{t[d]}</div>
            <div className="lineup__day-date">{d === 'saturday' ? '5 SEP' : '6 SEP'}</div>
          </button>
        ))}
      </div>

      <div className="lineup__schema">
        <div className="lineup__row">
          <div className="lineup__row-label lineup__row-label--header" />
          <div
            className="lineup__row-scroll"
            ref={(el) => setScrollerRef(el, 0)}
          >
            <div
              className="lineup__row-track lineup__row-track--header"
              style={{ width: (HOUR_END - HOUR_START + 1) * PX_PER_HOUR }}
            >
              {hours.map((h) => (
                <div key={h} className="lineup__hour" style={{ width: PX_PER_HOUR }}>
                  <div className="lineup__hour-label">{formatHour(h)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {STAGES.map((stage, idx) => {
          const rowItems = items.filter((i) => i.stageId === stage.id);
          return (
            <div className="lineup__row" key={stage.id}>
              <div className="lineup__row-label">
                <div className="lineup__row-bar" style={{ background: stage.color }} />
                <div>
                  <div className="lineup__row-name">{stage.name}</div>
                  <div className="lineup__row-sub">STAGE 0{STAGES.findIndex((s) => s.id === stage.id) + 1}</div>
                </div>
              </div>
              <div
                className="lineup__row-scroll"
                ref={(el) => setScrollerRef(el, idx + 1)}
              >
                <div
                  className="lineup__row-track"
                  style={{
                    width: (HOUR_END - HOUR_START + 1) * PX_PER_HOUR,
                    backgroundImage: `repeating-linear-gradient(90deg, transparent 0, transparent ${PX_PER_HOUR - 1}px, var(--grid-line) ${PX_PER_HOUR - 1}px, var(--grid-line) ${PX_PER_HOUR}px)`,
                  }}
                >
                  {showNow && (
                    <div
                      className="lineup__now"
                      style={{ left: (nowH - HOUR_START) * PX_PER_HOUR }}
                    >
                      <span className="lineup__now-dot" />
                    </div>
                  )}
                  {rowItems.map((it, i) => {
                    const act = ACTS.find((a) => a.id === it.actId);
                    if (!act) return null;
                    const fav = favorites.includes(act.id);
                    const isNow = showNow && it.start <= nowH && it.end > nowH;
                    const left = (it.start - HOUR_START) * PX_PER_HOUR;
                    const width = (it.end - it.start) * PX_PER_HOUR - 4;
                    const classes = ['lineup__block'];
                    if (isNow) classes.push('is-now');
                    if (stage.id === 'hangar') classes.push('is-light-stage');
                    return (
                      <div
                        key={i}
                        className={classes.join(' ')}
                        style={{
                          left,
                          width,
                          borderLeftColor: stage.color,
                          background: isNow ? stage.color : undefined,
                        }}
                        onClick={() => showActDetail(act.id)}
                      >
                        <div className="lineup__block-name">{act.name}</div>
                        <div className="lineup__block-foot">
                          <div className="lineup__block-time">
                            {formatHour(it.start)}–{formatHour(it.end)}
                          </div>
                          {isNow && <div className="lineup__block-now">{t.now.toUpperCase()}</div>}
                        </div>
                        <button
                          type="button"
                          className="lineup__block-fav"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFav(act.id);
                          }}
                          aria-label="Toggle favorite"
                        >
                          {Icons.heart(fav, 12)}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="lineup__legend">
        {Icons.bell('#E5352B', 16)}
        <div className="lineup__legend-text">
          {lang === 'nl'
            ? 'Tik het hart om een act te volgen. Je krijgt een melding 15, 10 en 5 min voor aanvang.'
            : "Tap the heart to follow an act. You'll get a notification 15, 10 and 5 min before."}
        </div>
      </div>
    </div>
  );
}
