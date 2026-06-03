# Technische Presentatie — ❤U Festival App

## Wat vertel je in een technische presentatie?

Een technische presentatie gaat over **hoe** iets werkt, niet alleen **wat** het doet.
Gebruik de structuur hieronder als leidraad.

---

## 1. Projectintroductie (1–2 minuten)

Begin met het grote plaatje zodat iedereen weet waar het over gaat.

- **Wat is het?** — Een Progressive Web App (PWA) voor het ❤U Festival 2026.
- **Voor wie?** — Bezoekers (web-app) en organisatoren (admin CMS).
- **Wat kan een bezoeker doen?**
  - Line-up bekijken per dag en podium
  - Artiesten toevoegen aan favorieten (offline opgeslagen)
  - Interactieve festivalkaart met GPS-locatie
  - Push-notificaties ontvangen van favoriete artiesten
  - App installeren op telefoon als native app
  - Taal wisselen (NL/EN) en dark/light mode

---

## 2. Technische architectuur (3–5 minuten)

Leg uit welke lagen de applicatie heeft en waarom.

```
Browser / Telefoon
        │
  [React PWA - web/]          ← wat de bezoeker ziet
        │
  [Node.js API - server/]     ← de logica en dataopslag
        │
  [MySQL database]            ← de data

  [React Admin - admin/]      ← alleen voor de organisator
        │
  [zelfde API]
```

### Frontend (web/)
- **React 19 + TypeScript** — component-based UI, type-safe
- **Vite** — snelle build tool en dev-server
- **React Router** — navigatie zonder pagina-reload (SPA)
- **SCSS** — styling met variabelen en nesting
- **Service Worker** — maakt offline werken mogelijk

### Backend (server/)
- **Node.js + Express** — REST API op poort 4000
- **MySQL** — relationele database (artiesten, schema's, podia, etc.)
- **JWT** — beveiligde admin-routes (token wordt meegezonden in header)
- **bcryptjs** — wachtwoorden worden gehasht opgeslagen, nooit plain text

### Deployment
- **Docker + docker-compose** — alles draait in containers
- **Nginx** — webserver die requests doorstuurt (reverse proxy)
- **Cloudflare Tunnel** — veilige publieke URL zonder open poorten

---

## 3. Database-ontwerp (2–3 minuten)

Vertel welke tabellen er zijn en hoe ze samenhangen.

```
acts ──────┐
           ├── act_genres ── genres
schedule ──┘       (many-to-many)
    │
  stages

devices ── favorites ── acts
       └── push_subscriptions

faqs / reach_info / info_facts  (content-tabellen, tweetalig)
map_pins                        (kaartmarkeringen)
admins                          (beheerders)
```

**Belangrijke ontwerpkeuzes:**
- Tweetaligheid zit direct in de tabel als `*_nl` en `*_en` kolommen (simpel en snel)
- Artiesten en genres hebben een many-to-many relatie via `act_genres`
- Bezoekers worden anoniem bijgehouden via een `deviceId` (geen account nodig)
- Tijden in het rooster staan als decimale uren (`start_h = 14.5` = 14:30)

---

## 4. API-structuur (2–3 minuten)

Laat zien hoe de frontend met de backend communiceert.

| Methode | Endpoint | Wat het doet |
|---------|----------|--------------|
| GET | `/api/acts` | Alle artiesten ophalen (met genres) |
| GET | `/api/schedule` | Rooster ophalen |
| GET | `/api/map-pins` | Kaartmarkeringen ophalen |
| POST | `/api/devices` | Apparaat registreren, krijgt `deviceId` terug |
| POST | `/api/favorites/:deviceId/:actId` | Artiest toevoegen aan favorieten |
| POST | `/api/push/subscribe` | Apparaat aanmelden voor pushberichten |
| POST | `/api/push/broadcast-act` | Pushbericht sturen naar fans van artiest |
| POST | `/api/admin/*` | Admin-endpoints (JWT vereist) |

**Vertel dit erbij:**
- Alle data wordt als JSON verstuurd
- Admin-endpoints controleren een JWT-token in de `Authorization` header
- Publieke endpoints hebben geen authenticatie nodig

---

## 5. PWA-features (2–3 minuten)

Dit is het meest interessante technische onderdeel — leg uit wat een PWA uniek maakt.

### Installeerbaar
Via het Web App Manifest (`manifest.json`) kan de browser de app aanbieden om te installeren op het startscherm. Dan gedraagt het zich als een native app.

### Offline werken (Service Worker)
De Service Worker is een achtergrondscript dat:
1. Bij eerste bezoek alle pagina's en assets in de cache opslaat
2. Bij geen internet de gecachte versie toont
3. Favorieten worden ook offline opgeslagen via `localStorage`

### Push-notificaties (VAPID)
```
Browser ──► vraagt toestemming ──► gebruiker accepteert
Browser ──► stuurt push-subscription op naar API
API ──► slaat subscription op in database

Organisator ──► klikt "stuur bericht" in admin
Admin ──► POST /api/push/broadcast-act
Server ──► haalt subscriptions op van fans
Server ──► stuurt pushbericht via Web Push protocol
Browser ──► toont notificatie (ook als app gesloten is)
```

---

## 6. Beveiliging (1–2 minuten)

Laat zien dat je bewust hebt nagedacht over veiligheid.

- **Wachtwoorden** — gehasht met bcryptjs (nooit plain text in database)
- **JWT-tokens** — verlopen na verloop van tijd, worden gecontroleerd op elke admin-request
- **VAPID-sleutels** — publiek/privé sleutelpaar voor veilige push-communicatie
- **Anonieme gebruikers** — geen persoonlijke data, alleen een willekeurige `deviceId`
- **HTTPS** — via Cloudflare Tunnel altijd versleuteld verkeer

---

## 7. AI-gebruik (1 minuten)

Het project bevat een `ai-logboek.md` — vertel eerlijk hoe je AI hebt ingezet.

- Uitgebreide artiestenbio's zijn gegenereerd met een LLM
- Elke AI-prompt is gedocumenteerd met een nutsscore (1–5)
- AI werd gebruikt als hulpmiddel, niet als vervanger van eigen werk

---

## 8. Demo-volgorde (optioneel)

Als je een live demo geeft, doe het dan in deze volgorde:

1. Open de app op telefoon (geïnstalleerd als PWA)
2. Toon de line-up en klik op een artiest
3. Voeg artiest toe aan favorieten
4. Zet telefoon op vliegtuigmodus → app werkt nog steeds
5. Toon de interactieve kaart (pinch-to-zoom)
6. Open het admin-dashboard → toon hoe je een artiest bewerkt
7. Stuur een test-pushnotificatie vanuit de admin

---

## 9. Wat je achter je hand houdt (vragen verwachten)

Bereid antwoorden voor op deze veelgestelde vragen:

- **Waarom PWA en geen native app?** → Één codebase, geen app store nodig, werkt op iOS en Android
- **Hoe werkt offline opslaan?** → Service Worker + Cache API + localStorage
- **Hoe beveilig je de admin?** → JWT-tokens, wachtwoord-hashing, HTTPS
- **Hoe schaalt dit bij veel gebruikers?** → Docker maakt horizontaal schalen mogelijk, Nginx verdeelt verkeer
- **Waarom MySQL en geen NoSQL?** → De data is relationeel (artiesten ↔ podia ↔ roosters), SQL is logischer

---

## Presentatietips

- Laat altijd **code zien** naast de uitleg — toon een relevant stukje, niet alles
- Gebruik een **architectuurdiagram** (zie sectie 2) als visuele ankerpunt
- Begin met het **eindresultaat** (de werkende app), dan pas de techniek
- Spreek over **keuzes en afwegingen**, niet alleen over wat je gebouwd hebt
- Houd rekening met je publiek: minder technisch? Meer demo. Meer technisch? Meer code.
