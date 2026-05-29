import { useEffect } from 'react';
import '../styles/table.scss';

export default function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal${wide ? ' modal--wide' : ''}`}>
        <div className="modal__header">
          <h2>{title}</h2>
          <button className="btn btn--icon" onClick={onClose}>
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
