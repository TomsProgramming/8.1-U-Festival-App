import { useEffect, useState } from 'react';
import { api } from '../api.js';

function fmt(dt) {
  return new Date(dt).toLocaleString('nl-NL', { dateStyle: 'short', timeStyle: 'short' });
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard').then(setData).catch(e => setError(e.message));
  }, []);

  if (error) return <div className="page-content" style={{ color: '#e74c3c' }}>{error}</div>;
  if (!data) return <div className="page-content">Laden...</div>;

  const stats = [
    { label: 'Podia',        value: data.counts.stages,      icon: 'stadium' },
    { label: 'Artiesten',    value: data.counts.acts,        icon: 'mic' },
    { label: 'Programmaslots', value: data.counts.slots,     icon: 'calendar_month' },
    { label: 'Kaartpunten',  value: data.counts.pins,        icon: 'location_on' },
    { label: 'Push-abonnees', value: data.counts.subscribers, icon: 'notifications' },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Dashboard</span>
      </div>
      <div className="page-content">
        <div className="stat-grid">
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-card__value">{s.value}</div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: 12 }}>Laatste pushmeldingen</h2>
        {data.notifications.length === 0 ? (
          <p style={{ color: '#6c757d' }}>Nog geen meldingen verstuurd.</p>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titel</th>
                  <th>Bericht</th>
                  <th>Verstuurd op</th>
                </tr>
              </thead>
              <tbody>
                {data.notifications.map((n, i) => (
                  <tr key={i}>
                    <td>{n.title}</td>
                    <td>{n.body}</td>
                    <td>{fmt(n.sent_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
