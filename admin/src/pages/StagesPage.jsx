import { useEffect, useState } from 'react';
import { api } from '../api.js';
import Table from '../components/Table.jsx';
import Modal from '../components/Modal.jsx';
import Confirm from '../components/Confirm.jsx';
import BilingualTabs from '../components/BilingualTabs.jsx';
import { useToast } from '../components/Toast.jsx';

const EMPTY = { slug:'', name:'', short:'', img:'', color:'#F03228', desc_nl:'', desc_en:'', capacity:'', sort:0 };

export default function StagesPage() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const load = () => api.get('/stages').then(setRows);
  useEffect(() => { load(); }, []);

  function openCreate() { setForm(EMPTY); setModal('create'); }
  function openEdit(row) { setForm({ ...row }); setModal('edit'); }

  async function save() {
    setLoading(true);
    try {
      if (modal === 'create') await api.post('/stages', form);
      else await api.put(`/stages/${form.id}`, form);
      toast('Podium opgeslagen', 'success');
      setModal(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  async function remove() {
    setLoading(true);
    try {
      await api.delete(`/stages/${confirm.id}`);
      toast('Podium verwijderd', 'success');
      setConfirm(null);
      load();
    } catch (e) { toast(e.message, 'error'); }
    finally { setLoading(false); }
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const columns = [
    { key: 'color', label: 'Kleur', render: v => <span style={{ display:'inline-block', width:18, height:18, borderRadius:4, background:v, border:'1px solid #dee2e6' }} /> },
    { key: 'name',     label: 'Naam' },
    { key: 'short',    label: 'Afkorting' },
    { key: 'capacity', label: 'Capaciteit' },
    { key: 'sort',     label: 'Volgorde' },
  ];

  return (
    <>
      <div className="page-header">
        <span className="page-header__title">Podia</span>
        <button className="btn btn--primary" onClick={openCreate}>
          <span className="material-icons-round">add</span> Nieuw podium
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
          title={modal === 'create' ? 'Nieuw podium' : 'Podium bewerken'}
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
          <div className="form-group"><label>Slug (URL-naam)</label><input value={form.slug} onChange={set('slug')} /></div>
          <div className="form-group"><label>Naam</label><input value={form.name} onChange={set('name')} /></div>
          <div className="form-group"><label>Afkorting (3 tekens)</label><input value={form.short} onChange={set('short')} maxLength={8} /></div>
          <div className="form-group"><label>Afbeelding URL</label><input value={form.img} onChange={set('img')} /></div>
          <div className="form-group"><label>Kleur</label><input type="color" value={form.color} onChange={set('color')} /></div>
          <div className="form-group"><label>Capaciteit</label><input type="number" value={form.capacity} onChange={set('capacity')} /></div>
          <div className="form-group"><label>Sorteervolgorde</label><input type="number" value={form.sort} onChange={set('sort')} /></div>
          <BilingualTabs>
            {lang => (
              <>
                <div className="form-group">
                  <label>Beschrijving ({lang.toUpperCase()})</label>
                  <textarea value={form[`desc_${lang}`]} onChange={set(`desc_${lang}`)} />
                </div>
              </>
            )}
          </BilingualTabs>
        </Modal>
      )}

      {confirm && (
        <Confirm
          message={`Podium "${confirm.name}" verwijderen? Bijbehorende programmaslots worden ook verwijderd.`}
          onConfirm={remove}
          onClose={() => setConfirm(null)}
          loading={loading}
        />
      )}
    </>
  );
}
