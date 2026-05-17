import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatIcon } from '../../components/brand/MatIcon';
import { Section } from '../../components/section/Section';
import './info.scss';

export default function Info() {
  const { t, lang } = useApp();

  const faqs =
    lang === 'nl'
      ? [
          {
            q: 'Ik gebruik medicatie. Wat nu?',
            a: 'Neem je medicatie mee in de originele verpakking en zorg dat er niet meer dan nodig voor 1 dag op het terrein is. Bij twijfel: vraag onze EHBO-post om mee te helpen.',
          },
          {
            q: 'Mag ik het festivalterrein tussentijds verlaten?',
            a: 'Helaas niet. Om de veiligheid te waarborgen kun je alleen met een vip-pas heen en weer. We zorgen voor genoeg toiletten, eten en drinken binnen.',
          },
          {
            q: 'Zijn er lockers?',
            a: 'Ja, bij de ingang vind je kleine, middel en grote lockers. Je kunt ze de hele dag openen en sluiten met je wristband.',
          },
          {
            q: 'Kan ik pinnen aan de bar?',
            a: 'Zeker. Het hele terrein is cashless — wij accepteren alleen pin en contactless.',
          },
          {
            q: 'Hoe laat begint het festival?',
            a: 'Zaterdag 5 september om 12:00 uur. Programma loopt tot 03:00 uur.',
          },
        ]
      : [
          {
            q: 'I need to take medication. What now?',
            a: "Bring it in its original packaging and keep no more than one day's supply on site. If in doubt, speak to our first-aid team.",
          },
          {
            q: 'Can I leave the festival grounds mid-day?',
            a: "Unfortunately not. For safety reasons only VIP passes allow re-entry. We'll make sure there's plenty of toilets, food and drinks inside.",
          },
          {
            q: 'Are there lockers?',
            a: 'Yes — small, medium and large lockers are available at the entrance. Open & close them all day with your wristband.',
          },
          { q: 'Can I pay with card?', a: 'Absolutely. The entire site is cashless — card and contactless only.' },
          { q: 'What time does it start?', a: 'Saturday 5 September at 12:00. Programme runs until 03:00.' },
        ];

  const reach =
    lang === 'nl'
      ? [
          { icon: 'directions_bike', title: 'Fiets', desc: 'Er is een grote gratis fietsenstalling waar je je fiets de hele dag kunt stallen.' },
          { icon: 'directions_car', title: 'Auto', desc: 'In kaart zijn parkeerplekken aangeduid. Parkeren kan op P+R Papendorp, volg vanaf daar de borden.' },
          { icon: 'train', title: 'OV', desc: 'Kom je met het openbaar vervoer naar Utrecht? Plan dan je trip via 9292.' },
          { icon: 'directions_bus', title: 'Shuttlebus', desc: 'Vanaf Utrecht Centraal kun je een gratis shuttlebus nemen richting het festivalterrein.' },
          { icon: 'local_taxi', title: 'Taxi + Kiss & Ride', desc: 'Navigeer naar Strijkviertel en volg de borden "Kiss & Ride" of de Taxi-borden.' },
        ]
      : [
          { icon: 'directions_bike', title: 'Bike', desc: 'Big free bike parking where you can leave your bike all day.' },
          { icon: 'directions_car', title: 'Car', desc: 'Parking is marked on the map. Park at P+R Papendorp and follow the signs.' },
          { icon: 'train', title: 'Public transport', desc: 'Coming by train? Plan your journey with 9292.' },
          { icon: 'directions_bus', title: 'Shuttle bus', desc: 'Free shuttle bus from Utrecht Central to the festival site.' },
          { icon: 'local_taxi', title: 'Taxi + Kiss & Ride', desc: 'Navigate to Strijkviertel and follow the Kiss & Ride or Taxi signs.' },
        ];

  return (
    <div className="info">
      <div className="screen-header">
        <div className="screen-header__title">{t.info}</div>
      </div>

      <div className="info__contact-wrap">
        <div className="info__contact">
          <div className="info__contact-eyebrow">{t.contact}</div>
          <div className="info__contact-title">
            ❤U Festival
            <br />
            2026
          </div>
          <div className="info__contact-rows">
            <InfoRow k={lang === 'nl' ? 'Adres' : 'Address'} v="Strijkviertelweg, Utrecht" />
            <InfoRow k={lang === 'nl' ? 'Datum' : 'Date'} v={lang === 'nl' ? '5–6 september 2026' : '5–6 September 2026'} />
            <InfoRow k={lang === 'nl' ? 'Tijd' : 'Time'} v="12:00 – 03:00" />
          </div>
          <div className="info__contact-bg">❤</div>
        </div>
      </div>

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
          <div className="info__lockers">
            {lang === 'nl'
              ? 'Op het festivalterrein zijn lockers aanwezig waar je je spullen veilig kunt opbergen. Klein €4 · Middel €6 · Groot €8.'
              : 'Lockers are available on site to safely store your belongings. Small €4 · Medium €6 · Large €8.'}
          </div>
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
