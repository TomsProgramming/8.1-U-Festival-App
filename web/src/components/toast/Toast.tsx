import { useApp } from '../../context/AppContext';
import { Icons } from '../brand/Icons';
import './toast.scss';

export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  return (
    <div className="toast">
      <div className="toast__icon">{Icons.heart(toast.icon === 'heart', 16)}</div>
      <div className="toast__body">
        <div className="toast__title">{toast.title}</div>
        <div className="toast__sub">{toast.sub}</div>
      </div>
    </div>
  );
}
