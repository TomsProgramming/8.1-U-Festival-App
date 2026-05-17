import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ACTS, SCHEDULE, STAGES, formatHour, type Stage, type ScheduleItem, type Act } from '../../data/festival';
import { Icons } from '../../components/brand/Icons';
import { Logo } from '../../components/brand/Logo';
import { Section } from '../../components/section/Section';
import './home.scss';

export default function Home() {
  const { t, lang, favorites, toggleFav, showActDetail } = useApp();
  const navigate = useNavigate();

  const upcoming = SCHEDULE.saturday
    .filter((s) => s.start >= 20 && s.start <= 24)
    .slice(0, 3)
    .map((s) => ({
      ...s,
      act: ACTS.find((a) => a.id === s.actId)!,
      stage: STAGES.find((st) => st.id === s.stageId)!,
    }));

  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__hero-overlay" />
        <div className="home__topbar">
          <Logo size={42} invert={false} />
          <div className="home__bell">{Icons.bell('#fff', 20)}</div>
        </div>
        <div className="home__hero-text">
          <div className="home__eyebrow">{t.welcome}</div>
          <div className="home__title">
            ❤U
            <br />
            FESTIVAL
            <br />
            <span className="home__title-accent">2026</span>
          </div>
          <div className="home__chips">
            <span className="home__chip">{t.date}</span>
            <span className="home__chip">{t.location}</span>
          </div>
        </div>
      </div>

      <Section title={t.upNext} action="Line-up →" onAction={() => navigate('/lineup')}>
        <div className="home__upnext-row">
          {upcoming.map((u, i) => (
            <UpNextCard
              key={i}
              item={u}
              fav={favorites.includes(u.act.id)}
              onToggle={() => toggleFav(u.act.id)}
              onClick={() => showActDetail(u.act.id)}
            />
          ))}
        </div>
      </Section>

      <Section title={t.stagesHeader}>
        <div className="home__stages">
          {STAGES.map((s) => (
            <StageRow key={s.id} stage={s} lang={lang} onClick={() => navigate('/map')} />
          ))}
        </div>
      </Section>

      <Section
        title={t.favHeader}
        action={favorites.length ? `${favorites.length} →` : null}
        onAction={() => navigate('/favs')}
      >
        <div className="home__favs-wrap">
          {favorites.length === 0 ? (
            <div className="home__favs-empty">{t.noFavs}</div>
          ) : (
            <div className="home__favs-row">
              {favorites.map((id) => {
                const a = ACTS.find((x) => x.id === id);
                if (!a) return null;
                return (
                  <div key={id} className="home__fav-card" onClick={() => showActDetail(id)}>
                    <img src={a.img} alt={a.name} className="home__fav-img" />
                    <div className="home__fav-name">{a.name}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>

      <div className="home__glu-wrap">
        <div className="home__glu">
          <div className="home__glu-eyebrow">{t.golden}</div>
          <div className="home__glu-title">
            {lang === 'nl' ? 'Word Golden-GLU lid.' : 'Become a Golden-GLU member.'}
          </div>
          <div className="home__glu-sub">
            {lang === 'nl'
              ? 'VIP-ingangen, eerste rij toiletten en 15% korting aan de bar.'
              : 'VIP entry, front-row toilets and 15% off at the bar.'}
          </div>
          <div className="home__glu-orb" />
          <div className="home__glu-star">★</div>
        </div>
      </div>
    </div>
  );
}

interface UpNextItem extends ScheduleItem {
  act: Act;
  stage: Stage;
}

function UpNextCard({
  item,
  fav,
  onToggle,
  onClick,
}: {
  item: UpNextItem;
  fav: boolean;
  onToggle: () => void;
  onClick: () => void;
}) {
  return (
    <div className="upnext" onClick={onClick}>
      <div className="upnext__img" style={{ backgroundImage: `url('${item.act.img}')` }}>
        <div className="upnext__img-overlay" />
        <div
          className={`upnext__stage-pill ${item.stage.id === 'hangar' ? 'is-light' : ''}`}
          style={{ background: item.stage.color }}
        >
          {item.stage.name}
        </div>
        <button
          type="button"
          className="upnext__fav"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          aria-label="Toggle favorite"
        >
          {Icons.heart(fav, 16)}
        </button>
      </div>
      <div className="upnext__body">
        <div className="upnext__name">{item.act.name}</div>
        <div className="upnext__meta">
          {item.act.genre} • {formatHour(item.start)}
        </div>
      </div>
    </div>
  );
}

function StageRow({ stage, lang, onClick }: { stage: Stage; lang: 'nl' | 'en'; onClick: () => void }) {
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  return (
    <div className="stagerow" onClick={onClick} style={{ backgroundImage: `url('${stage.img}')` }}>
      <div className="stagerow__overlay" />
      <div className="stagerow__inner">
        <div className="stagerow__head">
          <div
            className={`stagerow__num ${stage.id === 'hangar' ? 'is-light' : ''}`}
            style={{ background: stage.color }}
          >
            {idx + 1}
          </div>
          <div className="stagerow__name">{stage.name}</div>
        </div>
        <div className="stagerow__desc">{lang === 'nl' ? stage.descNL : stage.descEN}</div>
      </div>
    </div>
  );
}
