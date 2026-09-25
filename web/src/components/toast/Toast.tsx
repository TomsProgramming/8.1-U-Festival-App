import { useEffect, useState } from 'react';
import { useApp, type Toast as ToastData } from '../../context/AppContext';
import { Icons } from '../brand/Icons';
import './toast.scss';

export function Toast() {
  const { toast } = useApp();
  const [display, setDisplay] = useState<ToastData | null>(null);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (toast) {
      setDisplay(toast);
      setExiting(false);
    } else if (display) {
      setExiting(true);
      const id = setTimeout(() => setDisplay(null), 270);
      return () => clearTimeout(id);
    }
  }, [toast]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!display) return null;

  return (
    <div className={`toast${exiting ? ' is-exiting' : ''}`}>
      <div className="toast__icon">{Icons.heart(display.icon === 'heart', 16)}</div>
      <div className="toast__body">
        <div className="toast__title">{display.title}</div>
        <div className="toast__sub">{display.sub}</div>
      </div>
    </div>
  );
}
