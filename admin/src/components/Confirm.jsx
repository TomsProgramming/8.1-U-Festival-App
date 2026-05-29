import Modal from './Modal.jsx';

export default function Confirm({ message = 'Weet je het zeker? Dit kan niet ongedaan worden gemaakt.', onConfirm, onClose, loading }) {
  return (
    <Modal
      title="Bevestigen"
      onClose={onClose}
      footer={
        <>
          <button className="btn btn--secondary" onClick={onClose} disabled={loading}>Annuleren</button>
          <button className="btn btn--danger" onClick={onConfirm} disabled={loading}>
            <span className="material-icons-round">delete</span>
            {loading ? 'Bezig...' : 'Verwijderen'}
          </button>
        </>
      }
    >
      <div className="confirm-modal">
        <span className="material-icons-round confirm-modal__icon">warning</span>
        <p>{message}</p>
      </div>
    </Modal>
  );
}
