import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import BilingualTabs from '../components/BilingualTabs.jsx';
import { useToast } from '../components/Toast.jsx';

const EMPTY = {
  slug:'', name:'', tag:'', img:'', bio_nl:'', bio_en:'',
  ai_blurb_nl:'', ai_blurb_en:'', youtube_url:'',
  primary_genre_id:'', genre_ids:[],
};

export default function ActsPage() {
  const [rows, setRows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    const [acts, gs] = await Promise.all([api.get('/acts'), api.get('/genres')]);
    setRows(acts);
    setGenres(gs);
  };

  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setModal('create'); }
  function openEdit(row) {
    setForm({ ...row, genre_ids: row.genre_ids || [], primary_genre_id: row.primary_genre_id || '' });
    setModal('edit');
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  function setGenreIds(e) {
    const selected = Array.from(e.target.selectedOptions).map(o => Number(o.value));
    setForm(f => ({ ...f, genre_ids: selected }));
  }

  async function save() {
    setLoading(true);
    try {
      const body = { ...form, primary_genre_id: form.primary_genre_id || null };
      if (modal === 'create') await api.post('/acts', body);
      else await api.put(`/acts/${form.id}`, body);
      toast('Artiest opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/acts/${confirm.id}`);
      toast('Artiest verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  const columns = [
    { key: 'name',  label: 'Naam' },
    { key: 'tag',   label: 'Tag' },
    { key: 'genre_ids', label: 'Genres', render: (ids) => `${ids?.length || 0} genres` },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Artiesten</span>
        <button className="btn btn--primary" onClick={openCreate}>
          <span className="material-icons-round">add</span> Nieuwe artiest
        </button>
      </div>
      <div className="page-content">
        <Table
          columns={columns}
          data={rows}
          actions={row => (
            <>
              <button className="btn btn--icon" onClick={() => openEdit(row)} title="Bewerken">
                <span className="material-icons-round">edit</span>
              </button>
              <button className="btn btn--icon" onClick={() => setConfirm(row)} title="Verwijderen">
                <span className="material-icons-round" style={{ color:'#e74c3c' }}>delete</span>
              </button>
            </>
          )}
        />
      </div>

      {modal && (
        <Modal
          title={modal === 'create' ? 'Nieuwe artiest' : 'Artiest bewerken'}
          onClose={() => setModal(null)}
          wide
          footer={
            <>
              <button className="btn btn--secondary" onClick={() => setModal(null)}>Annuleren</button>
              <button className="btn btn--primary" onClick={save} disabled={loading}>
                {loading ? 'Opslaan...' : 'Opslaan'}
              </button>
            </>
          }
        >
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            <div className="form-group"><label>Slug</label><input value={form.slug} onChange={set('slug')} /></div>
            <div className="form-group"><label>Naam</label><input value={form.name} onChange={set('name')} /></div>
            <div className="form-group"><label>Tag (korte omschrijving)</label><input value={form.tag} onChange={set('tag')} /></div>
            <div className="form-group"><label>Afbeelding URL</label><input value={form.img} onChange={set('img')} /></div>
            <div className="form-group"><label>YouTube URL</label><input value={form.youtube_url} onChange={set('youtube_url')} /></div>
            <div className="form-group">
              <label>Primair genre</label>
              <select value={form.primary_genre_id} onChange={set('primary_genre_id')}>
                <option value="">— Geen —</option>
                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Genres (meerdere keuzes mogelijk)</label>
            <select multiple value={form.genre_ids.map(String)} onChange={setGenreIds}>
              {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <BilingualTabs>
            {lang => (
              <>
                <div className="form-group">
                  <label>Biografie ({lang.toUpperCase()})</label>
                  <textarea value={form[`bio_${lang}`]} onChange={set(`bio_${lang}`)} style={{ minHeight:100 }} />
                </div>
                <div className="form-group">
                  <label>AI Blurb ({lang.toUpperCase()})</label>
                  <textarea value={form[`ai_blurb_${lang}`]} onChange={set(`ai_blurb_${lang}`)} style={{ minHeight:100 }} />
                </div>
              </>
            )}
          </BilingualTabs>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Artiest "${confirm.name}" verwijderen? Programmaslots van deze artiest worden ook verwijderd.`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
