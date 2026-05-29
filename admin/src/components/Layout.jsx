import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearToken } from '../auth.js';

const NAV = [
  { section: 'Overzicht', items: [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  ]},
  { section: 'Festival content', items: [
    { to: '/stages',   icon: 'stadium',       label: 'Podia' },
    { to: '/acts',     icon: 'mic',           label: 'Artiesten' },
    { to: '/schedule', icon: 'calendar_month', label: 'Programma' },
    { to: '/genres',   icon: 'label',         label: 'Genres' },
    { to: '/map-pins', icon: 'location_on',   label: 'Kaartpunten' },
  ]},
  { section: 'Informatie', items: [
    { to: '/faqs',       icon: 'help_outline',  label: "FAQ's" },
    { to: '/reach',      icon: 'directions',    label: 'Vervoer' },
    { to: '/info-facts', icon: 'info',          label: 'Festivalinfo' },
  ]},
  { section: 'Communicatie', items: [
    { to: '/push', icon: 'notifications', label: 'Push Meldingen' },
  ]},
];

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate('/login');
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <h1>❤U Festival</h1>
          <span>CMS Beheer</span>
        </div>
        <nav className="sidebar__nav">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <div className="sidebar__section-label">{section}</div>
              {items.map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`}
                >
                  <span className="material-icons-round">{icon}</span>
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar__footer">
          <button onClick={logout}>
            <span className="material-icons-round">logout</span>
            Uitloggen
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
