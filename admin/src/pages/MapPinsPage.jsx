import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import { useToast } from '../components/Toast.jsx';

const KINDS = ['stage','food','toilet','bar','icecream','firstaid','merch','locker','entrance'];
const EMPTY = { slug:'', kind:'food', num:'', x:'', y:'', label:'', stage_id:'' };

export default function MapPinsPage() {
  const [rows, setRows] = useState([]);
  const [stages, setStages] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = async () => {
    const [pins, st] = await Promise.all([api.get('/map-pins'), api.get('/stages')]);
    setRows(pins); setStages(st);
  };
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  async function save() {
    setLoading(true);
    try {
      const body = { ...form, x: Number(form.x), y: Number(form.y), num: form.num || null, stage_id: form.stage_id || null };
      if (modal === 'create') await api.post('/map-pins', body);
      else await api.put(`/map-pins/${form.id}`, body);
      toast('Kaartpunt opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/map-pins/${confirm.id}`);
      toast('Kaartpunt verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  const columns = [
    { key: 'slug',  label: 'Slug' },
    { key: 'kind',  label: 'Type' },
    { key: 'label', label: 'Label' },
    { key: 'x',     label: 'X' },
    { key: 'y',     label: 'Y' },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Kaartpunten</span>
        <button className="btn btn--primary" onClick={() => { setForm(EMPTY); setModal('create'); }}>
          <span className="material-icons-round">add</span> Nieuw punt
        </button>
      </div>
      <div className="page-content">
        <Table
          columns={columns}
          data={rows}
          actions={row => (
            <>
              <button className="btn btn--icon" onClick={() => { setForm({ ...row, num: row.num ?? '', stage_id: row.stage_id ?? '' }); setModal('edit'); }} title="Bewerken">
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
          title={modal === 'create' ? 'Nieuw kaartpunt' : 'Kaartpunt bewerken'}
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
            <div className="form-group"><label>Slug</label><input value={form.slug} onChange={set('slug')} /></div>
            <div className="form-group"><label>Label</label><input value={form.label} onChange={set('label')} /></div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.kind} onChange={set('kind')}>
                {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Nummer (optioneel)</label><input type="number" value={form.num} onChange={set('num')} /></div>
            <div className="form-group"><label>X-coördinaat</label><input type="number" value={form.x} onChange={set('x')} /></div>
            <div className="form-group"><label>Y-coördinaat</label><input type="number" value={form.y} onChange={set('y')} /></div>
            <div className="form-group">
              <label>Gekoppeld podium (optioneel)</label>
              <select value={form.stage_id} onChange={set('stage_id')}>
                <option value="">— Geen —</option>
                {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Kaartpunt "${confirm.label}" verwijderen?`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
