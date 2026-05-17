import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Icons } from '../brand/Icons';
import './tabbar.scss';

type TabId = 'home' | 'lineup' | 'map' | 'favs' | 'info';

export function TabBar() {
  const { t, favorites } = useApp();
  const location = useLocation();
  const pathTab = (location.pathname.replace(/^\/+/, '') || 'home') as TabId;

  const tabs: { id: TabId; to: string; label: string; render: (active: boolean) => React.ReactNode }[] = [
    { id: 'home', to: '/home', label: t.home, render: (a) => Icons.home(a ? '#E5352B' : 'var(--tab-inactive)') },
    { id: 'lineup', to: '/lineup', label: t.lineup, render: (a) => Icons.lineup(a ? '#E5352B' : 'var(--tab-inactive)') },
    { id: 'map', to: '/map', label: t.map, render: (a) => Icons.map(a ? '#E5352B' : 'var(--tab-inactive)') },
    { id: 'favs', to: '/favs', label: t.favs, render: (a) => Icons.favs(a ? '#E5352B' : 'var(--tab-inactive)', a) },
    { id: 'info', to: '/info', label: t.info, render: (a) => Icons.info(a ? '#E5352B' : 'var(--tab-inactive)') },
  ];

  return (
    <nav className="tabbar">
      <div className="tabbar__inner">
        {tabs.map((tab) => {
          const active = pathTab === tab.id;
          return (
            <NavLink
              key={tab.id}
              to={tab.to}
              className={`tabbar__item ${active ? 'is-active' : ''}`}
            >
              {active && <span className="tabbar__indicator" />}
              {tab.render(active)}
              <span className="tabbar__label">{tab.label}</span>
              {tab.id === 'favs' && favorites.length > 0 && (
                <span className="tabbar__badge">{favorites.length}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
