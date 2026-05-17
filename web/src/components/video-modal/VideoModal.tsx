import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MatIcon } from '../brand/MatIcon';
import { Icons } from '../brand/Icons';
import './video-modal.scss';

interface Props {
  url: string | null | undefined;
  title: string;
  onClose: () => void;
}

function youTubeId(url: string): string | null {
  // Accepteert standaard- en korte URL's: youtu.be/<id>, watch?v=<id>, /embed/<id>.
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1) || null;
    const v = u.searchParams.get('v');
    if (v) return v;
    const m = u.pathname.match(/\/(?:embed|shorts)\/([^/?]+)/);
    return m ? m[1] : null;
  } catch {
    return null;
  }
}

export function VideoModal({ url, title, onClose }: Props) {
  const { online, t } = useApp();
  const id = url ? youTubeId(url) : null;

  // Esc om te sluiten + lock body scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const playable = online && Boolean(id);

  return (
    <div className="video-modal" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="video-modal__backdrop"
        onClick={onClose}
        aria-label={t.closeVideo}
      />
      <div className="video-modal__card">
        <div className="video-modal__head">
          <div className="video-modal__title">{title}</div>
          <button
            type="button"
            className="video-modal__close"
            onClick={onClose}
            aria-label={t.closeVideo}
          >
            {Icons.close('var(--text)', 16)}
          </button>
        </div>

        {playable ? (
          <div className="video-modal__frame-wrap">
            <iframe
              className="video-modal__frame"
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="video-modal__offline">
            <div className="video-modal__offline-icon">
              <MatIcon
                name={online ? 'movie_off' : 'wifi_off'}
                size={42}
                weight={500}
                color="var(--accent)"
              />
            </div>
            <div className="video-modal__offline-title">
              {online ? t.videoUnavailable : t.videoOfflineTitle}
            </div>
            {!online && (
              <div className="video-modal__offline-text">{t.videoOfflineText}</div>
            )}
            {url && (
              <a
                className="video-modal__offline-link"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => { if (!online) e.preventDefault(); }}
                aria-disabled={!online}
              >
                {t.videoOpenYouTube}
                <MatIcon name="open_in_new" size={16} color="currentColor" weight={500} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
