import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useToast } from '../components/Toast.jsx';

const EMPTY = { fkey: '', lang: 'nl', value: '' };

export default function InfoFactsPage() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = () => api.get('/info').then(setRows);
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function save() {
    setLoading(true);
    try {
      if (modal === 'create') await api.post('/info', form);
      else await api.put(`/info/${form.id}`, form);
      toast('Info opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/info/${confirm.id}`);
      toast('Info verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  const columns = [
    { key: 'fkey',  label: 'Sleutel' },
    { key: 'lang',  label: 'Taal', render: v => v.toUpperCase() },
    { key: 'value', label: 'Waarde' },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Festivalinfo</span>
        <button className="btn btn--primary" onClick={() => { setForm(EMPTY); setModal('create'); }}>
          <span className="material-icons-round">add</span> Nieuw feit
        </button>
      </div>
      <div className="page-content">
        <Table columns={columns} data={rows} actions={row => (
          <>
            <button className="btn btn--icon" onClick={() => { setForm({ ...row }); setModal('edit'); }} title="Bewerken">
              <span className="material-icons-round">edit</span>
            </button>
            <button className="btn btn--icon" onClick={() => setConfirm(row)} title="Verwijderen">
              <span className="material-icons-round" style={{ color:'#e74c3c' }}>delete</span>
            </button>
          </>
        )} />
      </div>

      {modal && (
        <Modal
          title={modal === 'create' ? 'Nieuw feit' : 'Feit bewerken'}
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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            <div className="form-group"><label>Sleutel (bv. address, date)</label><input value={form.fkey} onChange={set('fkey')} /></div>
            <div className="form-group">
              <label>Taal</label>
              <select value={form.lang} onChange={set('lang')}>
                <option value="nl">Nederlands (NL)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label>Waarde</label><textarea value={form.value} onChange={set('value')} /></div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Info "${confirm.fkey} (${confirm.lang?.toUpperCase()})" verwijderen?`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
