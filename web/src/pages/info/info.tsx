import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatIcon } from '../../components/brand/MatIcon';
import { Section } from '../../components/section/Section';
import { api } from '../../data/api';
import './info.scss';

interface ReachItem { icon: string; title: string; desc: string; }
interface Faq { q: string; a: string; }

export default function Info() {
  const {
    t, lang,
    pushSupported, pushPermission, pushOn,
    enableNotifications, disableNotifications,
    deviceId,
    online, pendingSync,
  } = useApp();

  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [reach, setReach] = useState<ReachItem[]>([]);
  const [facts, setFacts] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const [f, r, i] = await Promise.all([api.faqs(lang), api.reach(lang), api.info(lang)]);
      if (!alive) return;
      setFaqs(f);
      setReach(r);
      setFacts(i);
    })();
    return () => { alive = false; };
  }, [lang]);

  const address = facts.address || (lang === 'nl' ? 'Strijkviertelweg, Utrecht' : 'Strijkviertelweg, Utrecht');
  const dateStr = facts.date    || (lang === 'nl' ? '5–6 september 2026' : '5–6 September 2026');
  const timeStr = facts.time    || '12:00 – 03:00';
  const lockers = facts.lockers || (lang === 'nl'
    ? 'Op het festivalterrein zijn lockers aanwezig waar je je spullen veilig kunt opbergen. Klein €4 · Middel €6 · Groot €8.'
    : 'Lockers are available on site to safely store your belongings. Small €4 · Medium €6 · Large €8.');

  const onTestPush = async () => {
    await api.sendTestPush(deviceId);
  };

  return (
    <div className="info">
      <div className="screen-header">
        <div className="screen-header__title">{t.info}</div>
      </div>

      {(!online || pendingSync > 0) && (
        <div className="info__sync">
          <MatIcon name={online ? 'cloud_sync' : 'cloud_off'} size={18} color="var(--accent)" weight={500} />
          <span>
            {!online
              ? lang === 'nl' ? 'Offline — wijzigingen worden gesynct zodra je weer verbinding hebt.'
                              : 'Offline — changes will sync once you reconnect.'
              : lang === 'nl' ? `Syncen… ${pendingSync} wijziging${pendingSync === 1 ? '' : 'en'} in de wachtrij.`
                              : `Syncing… ${pendingSync} change${pendingSync === 1 ? '' : 's'} queued.`}
          </span>
        </div>
      )}

      <div className="info__contact-wrap">
        <div className="info__contact">
          <div className="info__contact-eyebrow">{t.contact}</div>
          <div className="info__contact-title">
            ❤U Festival
            <br />
            2026
          </div>
          <div className="info__contact-rows">
            <InfoRow k={lang === 'nl' ? 'Adres' : 'Address'} v={address} />
            <InfoRow k={lang === 'nl' ? 'Datum' : 'Date'} v={dateStr} />
            <InfoRow k={lang === 'nl' ? 'Tijd' : 'Time'} v={timeStr} />
          </div>
          <div className="info__contact-bg">❤</div>
        </div>
      </div>

      {pushSupported && (
        <Section title={lang === 'nl' ? 'Meldingen' : 'Notifications'}>
          <div className="info__push">
            <div className="info__push-icon">
              <MatIcon name={pushOn ? 'notifications_active' : 'notifications'} size={22} color="var(--accent)" weight={500} />
            </div>
            <div className="info__push-body">
              <div className="info__push-title">
                {pushOn
                  ? lang === 'nl' ? 'Meldingen staan aan' : 'Notifications are on'
                  : lang === 'nl' ? 'Krijg meldingen voor je favorieten' : 'Get notifications for your favorites'}
              </div>
              <div className="info__push-text">
                {pushPermission === 'denied'
                  ? lang === 'nl'
                    ? 'Meldingen zijn geblokkeerd in je browser. Zet ze aan in de browser-instellingen.'
                    : 'Notifications are blocked in your browser. Enable them in browser settings.'
                  : lang === 'nl'
                    ? 'We sturen je 15, 10 en 5 minuten vóór elke favoriete act een melding.'
                    : "We'll notify you 15, 10 and 5 minutes before each favorite act."}
              </div>
              <div className="info__push-actions">
                {pushOn ? (
                  <>
                    <button type="button" className="info__push-btn is-ghost" onClick={disableNotifications}>
                      {lang === 'nl' ? 'Uit' : 'Off'}
                    </button>
                    <button type="button" className="info__push-btn is-ghost" onClick={onTestPush}>
                      {lang === 'nl' ? 'Test-melding' : 'Send test'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="info__push-btn"
                    disabled={pushPermission === 'denied'}
                    onClick={enableNotifications}
                  >
                    {lang === 'nl' ? 'Zet aan' : 'Turn on'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </Section>
      )}

      <Section title={t.reach}>
        <div className="info__reach">
          {reach.map((r, i) => (
            <div key={i} className="info__reach-item">
              <div className="info__reach-icon">
                <MatIcon name={r.icon} size={22} color="var(--accent)" weight={500} />
              </div>
              <div>
                <div className="info__reach-title">{r.title}</div>
                <div className="info__reach-desc">{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.lockers_h}>
        <div className="info__lockers-wrap">
          <div className="info__lockers">{lockers}</div>
        </div>
      </Section>

      <Section title={t.faq}>
        <div className="info__faqs">
          {faqs.map((f, i) => (
            <FAQItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="info__row">
      <div className="info__row-k">{k}</div>
      <div className="info__row-v">{v}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`info__faq ${open ? 'is-open' : ''}`}>
      <button type="button" className="info__faq-head" onClick={() => setOpen(!open)}>
        <span className="info__faq-q">{q}</span>
        <span className={`info__faq-chev ${open ? 'is-open' : ''}`}>
          <MatIcon name="expand_more" size={20} color="var(--text-mute)" weight={500} />
        </span>
      </button>
      {open && <div className="info__faq-a">{a}</div>}
    </div>
  );
}
