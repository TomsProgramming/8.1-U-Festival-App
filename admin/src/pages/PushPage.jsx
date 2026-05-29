import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useToast } from '../components/Toast.jsx';

export default function PushPage() {
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({ title: '', body: '', url: '/' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    api.get('/push/stats').then(setStats).catch(() => {});
  }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function send(e) {
    e.preventDefault();
    if (!form.title || !form.body) return toast('Vul titel en bericht in', 'error');
    setLoading(true);
    try {
      const result = await api.post('/push/broadcast', form);
      toast(`Verstuurd naar ${result.sent} abonnees${result.failed ? `, ${result.failed} mislukt` : ''}`, 'success');
      setForm({ title: '', body: '', url: '/' });
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Push Meldingen</span>
      </div>
      <div className="page-content">
        {stats && (
          <div className="stat-grid" style={{ marginBottom: 28 }}>
            <div className="stat-card">
              <div className="stat-card__value">{stats.subscribers}</div>
              <div className="stat-card__label">Actieve abonnees</div>
            </div>
          </div>
        )}

        <div className="data-table-wrap" style={{ padding: 24, maxWidth: 520 }}>
          <h2 style={{ marginBottom: 20 }}>Melding versturen naar alle abonnees</h2>
          <form onSubmit={send}>
            <div className="form-group">
              <label>Titel</label>
              <input value={form.title} onChange={set('title')} placeholder="Bijv. Armin van Buuren begint over 15 min!" required />
            </div>
            <div className="form-group">
              <label>Bericht</label>
              <textarea value={form.body} onChange={set('body')} placeholder="Bijv. Ren naar het Ponton podium!" required />
            </div>
            <div className="form-group">
              <label>Link URL (optioneel)</label>
              <input type="url" value={form.url} onChange={set('url')} placeholder="/" />
            </div>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              <span className="material-icons-round">send</span>
              {loading ? 'Versturen...' : 'Verstuur melding'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
