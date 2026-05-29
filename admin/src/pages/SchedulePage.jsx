import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useToast } from '../components/Toast.jsx';

const EMPTY = { day: 'saturday', stage_id: '', act_id: '', start_h: '', end_h: '' };

function toTime(h) {
  const hours = Math.floor(h);
  const mins = Math.round((h - hours) * 60);
  return `${String(hours).padStart(2,'0')}:${String(mins).padStart(2,'0')}`;
}

export default function SchedulePage() {
  const [rows, setRows] = useState([]);
  const [stages, setStages] = useState([]);
  const [acts, setActs] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    const [s, st, a] = await Promise.all([api.get('/schedule'), api.get('/stages'), api.get('/acts')]);
    setRows(s); setStages(st); setActs(a);
  };
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function save() {
    setLoading(true);
    try {
      const body = { ...form, stage_id: Number(form.stage_id), act_id: Number(form.act_id), start_h: Number(form.start_h), end_h: Number(form.end_h) };
      if (modal === 'create') await api.post('/schedule', body);
      else await api.put(`/schedule/${form.id}`, body);
      toast('Slot opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/schedule/${confirm.id}`);
      toast('Slot verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  const columns = [
    { key: 'day',        label: 'Dag', render: v => v === 'saturday' ? 'Zaterdag' : 'Zondag' },
    { key: 'stage_name', label: 'Podium' },
    { key: 'act_name',   label: 'Artiest' },
    { key: 'start_h',    label: 'Start', render: v => toTime(v) },
    { key: 'end_h',      label: 'Einde', render: v => toTime(v) },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Programma</span>
        <button className="btn btn--primary" onClick={() => { setForm(EMPTY); setModal('create'); }}>
          <span className="material-icons-round">add</span> Nieuw slot
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
          title={modal === 'create' ? 'Nieuw programmaslot' : 'Slot bewerken'}
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
            <label>Dag</label>
            <select value={form.day} onChange={set('day')}>
              <option value="saturday">Zaterdag</option>
              <option value="sunday">Zondag</option>
            </select>
          </div>
          <div className="form-group">
            <label>Podium</label>
            <select value={form.stage_id} onChange={set('stage_id')}>
              <option value="">— Kies podium —</option>
              {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Artiest</label>
            <select value={form.act_id} onChange={set('act_id')}>
              <option value="">— Kies artiest —</option>
              {acts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
            <div className="form-group">
              <label>Starttijd (bv. 14.5 = 14:30)</label>
              <input type="number" step="0.25" min="0" max="27" value={form.start_h} onChange={set('start_h')} />
            </div>
            <div className="form-group">
              <label>Eindtijd (bv. 16 = 16:00)</label>
              <input type="number" step="0.25" min="0" max="27" value={form.end_h} onChange={set('end_h')} />
            </div>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Slot "${confirm.act_name} op ${confirm.stage_name}" verwijderen?`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
