import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useToast } from '../components/Toast.jsx';

const EMPTY = { lang: 'nl', question: '', answer: '', sort: 0 };

export default function FaqsPage() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = () => api.get('/faqs').then(setRows);
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function save() {
    setLoading(true);
    try {
      if (modal === 'create') await api.post('/faqs', form);
      else await api.put(`/faqs/${form.id}`, form);
      toast('FAQ opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/faqs/${confirm.id}`);
      toast('FAQ verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  const columns = [
    { key: 'lang',     label: 'Taal', render: v => v.toUpperCase() },
    { key: 'question', label: 'Vraag' },
    { key: 'sort',     label: 'Volgorde' },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">FAQ's</span>
        <button className="btn btn--primary" onClick={() => { setForm(EMPTY); setModal('create'); }}>
          <span className="material-icons-round">add</span> Nieuwe vraag
        </button>
      </div>
      <div className="page-content">
        <Table
          columns={columns}
          data={rows}
          actions={row => (
            <>
              <button className="btn btn--icon" onClick={() => { setForm({ ...row }); setModal('edit'); }} title="Bewerken">
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
          title={modal === 'create' ? 'Nieuwe FAQ' : 'FAQ bewerken'}
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
            <div className="form-group">
              <label>Taal</label>
              <select value={form.lang} onChange={set('lang')}>
                <option value="nl">Nederlands (NL)</option>
                <option value="en">English (EN)</option>
              </select>
            </div>
            <div className="form-group"><label>Sorteervolgorde</label><input type="number" value={form.sort} onChange={set('sort')} /></div>
          </div>
          <div className="form-group"><label>Vraag</label><input value={form.question} onChange={set('question')} /></div>
          <div className="form-group"><label>Antwoord</label><textarea value={form.answer} onChange={set('answer')} style={{ minHeight:120 }} /></div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`FAQ "${confirm.question}" verwijderen?`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
