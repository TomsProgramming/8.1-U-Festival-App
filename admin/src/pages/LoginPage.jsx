import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../auth.js';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Inloggen mislukt');
      setToken(data.token);
      navigate('/dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__card">
        <span className="login-page__brand">❤U Festival</span>
        <h1>CMS Beheer</h1>
        <p>Log in om de festivalcontent te beheren.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Gebruikersnaam</label>
            <input
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label>Wachtwoord</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          {error && (
            <p style={{ color: '#e74c3c', fontSize: '.875rem', marginBottom: 12 }}>{error}</p>
          )}
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Bezig met inloggen...' : 'Inloggen'}
          </button>
        </form>
      </div>
    </div>
  );
}
