import { useApp } from '../../context/AppContext';
import { ACTS, SCHEDULE, STAGES, formatHour, type DayId, type Stage } from '../../data/festival';
import { Icons } from '../../components/brand/Icons';
import './favs.scss';

interface ShowTime {
  day: DayId;
  start: number;
  end: number;
  stage: Stage;
}

export default function Favs() {
  const { t, lang, favorites, toggleFav, showActDetail } = useApp();
  const favActs = favorites.map((id) => ACTS.find((a) => a.id === id)).filter((a): a is NonNullable<typeof a> => Boolean(a));

  const scheduleFor = (id: string): ShowTime[] => {
    const res: ShowTime[] = [];
    for (const day of ['saturday', 'sunday'] as DayId[]) {
      for (const s of SCHEDULE[day]) {
        if (s.actId === id) {
          const stage = STAGES.find((st) => st.id === s.stageId);
          if (stage) res.push({ day, start: s.start, end: s.end, stage });
        }
      }
    }
    return res;
  };

  return (
    <div className="favs">
      <div className="screen-header">
        <div className="screen-header__title">{t.favs}</div>
        <div className="screen-header__subtitle">
          {favActs.length === 0
            ? lang === 'nl'
              ? 'Tik harten in de line-up om acts te volgen.'
              : 'Tap hearts in the line-up to follow acts.'
            : lang === 'nl'
              ? `${favActs.length} acts · meldingen 15/10/5 min voor aanvang`
              : `${favActs.length} acts · notifications 15/10/5 min before`}
        </div>
      </div>

      {favActs.length === 0 ? (
        <div className="favs__empty">
          <div className="favs__empty-heart">❤</div>
          <div className="favs__empty-title">{lang === 'nl' ? 'Nog geen favorieten' : 'No favorites yet'}</div>
          <div className="favs__empty-text">{t.noFavs}</div>
        </div>
      ) : (
        <div className="favs__list">
          {favActs.map((a) => {
            const shows = scheduleFor(a.id);
            return (
              <div key={a.id} className="favs__item" onClick={() => showActDetail(a.id)}>
                <img src={a.img} alt={a.name} className="favs__img" />
                <div className="favs__info">
                  <div className="favs__name">{a.name}</div>
                  <div className="favs__genre">{a.genre}</div>
                  <div className="favs__shows">
                    {shows.map((s, i) => (
                      <div key={i} className="favs__show">
                        <span className="favs__show-dot" style={{ background: s.stage.color }} />
                        <span className="favs__show-day">
                          {s.day === 'saturday' ? (lang === 'nl' ? 'za' : 'Sat') : lang === 'nl' ? 'zo' : 'Sun'}
                        </span>
                        <span>
                          {formatHour(s.start)}–{formatHour(s.end)}
                        </span>
                        <span className="favs__show-sep">·</span>
                        <span>{s.stage.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="favs__heart"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(a.id);
                  }}
                  aria-label="Remove favorite"
                >
                  {Icons.heart(true, 16)}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
