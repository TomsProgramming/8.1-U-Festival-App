import { useApp } from '../../context/AppContext';
import { ACTS, SCHEDULE, STAGES, formatHour, type DayId } from '../../data/festival';
import { Icons } from '../brand/Icons';
import './act-detail.scss';

export function ActDetail() {
  const { actDetail, showActDetail, favorites, toggleFav, lang, t } = useApp();
  if (!actDetail) return null;

  const act = ACTS.find((x) => x.id === actDetail);
  if (!act) return null;

  const fav = favorites.includes(act.id);
  const shows: { day: DayId; start: number; end: number; stage: (typeof STAGES)[number] }[] = [];
  for (const day of ['saturday', 'sunday'] as DayId[]) {
    for (const s of SCHEDULE[day]) {
      if (s.actId === act.id) {
        const stage = STAGES.find((st) => st.id === s.stageId);
        if (stage) shows.push({ day, start: s.start, end: s.end, stage });
      }
    }
  }

  return (
    <div className="act-detail" role="dialog" aria-modal="true">
      <div
        className="act-detail__hero"
        style={{ backgroundImage: `url('${act.img}')` }}
      >
        <div className="act-detail__hero-overlay" />
        <div className="act-detail__topbar">
          <button
            type="button"
            className="act-detail__icon-btn"
            onClick={() => showActDetail(null)}
            aria-label="Close"
          >
            {Icons.close('#fff', 16)}
          </button>
          <button
            type="button"
            className={`act-detail__icon-btn ${fav ? 'is-fav' : ''}`}
            onClick={() => toggleFav(act.id)}
            aria-label="Favorite"
          >
            {Icons.heart(fav, 18)}
          </button>
        </div>
        <div className="act-detail__title-block">
          <div className="act-detail__eyebrow">{act.genre}</div>
          <h1 className="act-detail__title">{act.name}</h1>
          <div className="act-detail__tag">{act.tag}</div>
        </div>
      </div>

      <div className="act-detail__body">
        <div className="act-detail__shows">
          {shows.map((s, i) => (
            <div
              key={i}
              className="act-detail__show"
              style={{ borderLeftColor: s.stage.color }}
            >
              <div>
                <div className="act-detail__show-time">{formatHour(s.start)}</div>
                <div className="act-detail__show-day">
                  {s.day === 'saturday'
                    ? lang === 'nl'
                      ? 'ZATERDAG'
                      : 'SATURDAY'
                    : lang === 'nl'
                      ? 'ZONDAG'
                      : 'SUNDAY'}
                </div>
              </div>
              <div className="act-detail__show-stage">
                <div className="act-detail__show-stage-name">{s.stage.name}</div>
                <div className="act-detail__show-stage-sub">
                  {formatHour(s.start)} – {formatHour(s.end)} · {((s.end - s.start) * 60).toFixed(0)} {t.min}
                </div>
              </div>
              {fav && Icons.bell('#E5352B', 18)}
            </div>
          ))}
        </div>

        <p className="act-detail__bio">{lang === 'nl' ? act.bioNL : act.bioEN}</p>

        <div className="act-detail__cta">
          <button
            type="button"
            className={`act-detail__cta-primary ${fav ? 'is-fav' : ''}`}
            onClick={() => toggleFav(act.id)}
          >
            {Icons.heart(fav, 16)}
            {fav
              ? lang === 'nl' ? 'Gevolgd' : 'Following'
              : lang === 'nl' ? 'Volg + meldingen' : 'Follow + notify'}
          </button>
          <button type="button" className="act-detail__cta-secondary">
            ▶ {t.watchClip}
          </button>
        </div>
      </div>
    </div>
  );
}
