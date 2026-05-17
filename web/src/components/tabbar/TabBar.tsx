import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MatIcon } from '../brand/MatIcon';
import './tabbar.scss';

type TabId = 'home' | 'lineup' | 'map' | 'favs' | 'info';

interface TabDef {
  id: TabId;
  to: string;
  label: string;
  icon: string;
}

export function TabBar() {
  const { t, favorites } = useApp();
  const location = useLocation();
  const pathTab = (location.pathname.replace(/^\/+/, '') || 'home') as TabId;

  const tabs: TabDef[] = [
    { id: 'home', to: '/home', label: t.home, icon: 'home' },
    { id: 'lineup', to: '/lineup', label: t.lineup, icon: 'queue_music' },
    { id: 'map', to: '/map', label: t.map, icon: 'map' },
    { id: 'favs', to: '/favs', label: t.favs, icon: 'favorite' },
    { id: 'info', to: '/info', label: t.info, icon: 'info' },
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
              <MatIcon
                name={tab.icon}
                size={22}
                filled={active}
                weight={active ? 500 : 400}
                color={active ? 'var(--accent)' : 'var(--tab-inactive)'}
              />
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
