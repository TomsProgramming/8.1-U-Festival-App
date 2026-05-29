import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useToast } from '../components/Toast.jsx';

export default function GenresPage() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = () => api.get('/genres').then(setRows);
  useEffect(() => { load(); }, []);

  async function save() {
    setLoading(true);
    try {
      if (modal === 'create') await api.post('/genres', form);
      else await api.put(`/genres/${form.id}`, form);
      toast('Genre opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/genres/${confirm.id}`);
      toast('Genre verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Genres</span>
        <button className="btn btn--primary" onClick={() => { setForm({ name: '' }); setModal('create'); }}>
          <span className="material-icons-round">add</span> Nieuw genre
        </button>
      </div>
      <div className="page-content">
        <Table
          columns={[{ key: 'name', label: 'Naam' }]}
          data={rows}
          actions={row => (
            <>
              <button className="btn btn--icon" onClick={() => { setForm({ ...row }); setModal('edit'); }} title="Bewerken">
                <span className="material-icons-round">edit</span>
              </button>
              <button className="btn btn--icon" onClick={() => setConfirm(row)} title="Verwijderen">
                <span className="material-icons-round" style={{ color: '#e74c3c' }}>delete</span>
              </button>
            </>
          )}
        />
      </div>

      {modal && (
        <Modal
          title={modal === 'create' ? 'Nieuw genre' : 'Genre bewerken'}
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn--secondary" onClick={() => setModal(null)}>Annuleren</button>
              <button className="btn btn--primary" onClick={save} disabled={loading}>
                {loading ? 'Opslaan...' : 'Opslaan'}
              </button>
            </>
          }
        >
          <div className="form-group">
            <label>Naam</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Genre "${confirm.name}" verwijderen?`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
