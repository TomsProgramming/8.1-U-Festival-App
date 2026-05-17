# ❤U Festival 2026 — Setup

Eénmalig opzetten van database + server + web.

## 1. Database

Vereist: MySQL 8 lokaal (of MariaDB 10.4+).

```bash
mysql -u root -p < server/schema.sql
```

Dit dropt en hermaakt de database `ufestival` en vult alle tabellen
(stages, acts, schedule, map_pins, faqs, reach_items, info_facts) met
seed-data uit `server/schema.sql`.

## 2. Server (Node.js + Express)

```bash
cd server
npm install
cp .env.example .env        # zet DB_USER + DB_PASSWORD
npm run gen-vapid           # output kopiëren naar .env
npm run dev                 # http://localhost:4000
```

Endpoints — zie [server/README.md](server/README.md).

Health-check: `curl http://localhost:4000/api/health` → `{"ok":true}`

## 3. Web (React + Vite)

```bash
cd web
npm install
cp .env.example .env        # zet VITE_VAPID_PUBLIC = de pub-sleutel uit stap 2
npm run dev                 # http://localhost:5173
```

Open je in de browser? De console toont eerst een korte fetch naar
`http://localhost:4000/api/*`. Bij succes komt de data uit MySQL; valt
de server uit, dan blijft de app werken op de localStorage-cache van
de laatste sessie en — bij een koude start — op de bundled fallback in
`web/src/data/festival.ts`.

## 4. PWA-functionaliteit

| Eis                       | Waar geregeld                                          |
| ------------------------- | ------------------------------------------------------ |
| Installeren op startscherm | `web/public/manifest.webmanifest` + in-app install-sheet `web/src/components/pwa-install` |
| Push-meldingen            | Server: `server/server.js` (`/api/push/*`) + `server/push.js`<br/>Web: `web/src/pwa/push.ts`<br/>SW: `web/public/sw.js` `push` / `notificationclick` |
| Offline werken            | SW-strategieën in `web/public/sw.js`:<br/>– App-shell **cache-first**<br/>– API **network-first** met cache-fallback<br/>– Assets **stale-while-revalidate**<br/>+ extra localStorage-cache in `web/src/data/api.ts` voor data-laag |
| QR-launch                 | App is een gewone PWA op `/` — elke QR die naar de URL wijst opent hem direct, daarna kan de gebruiker installeren via de install-bubble of het systeemmenu |

## 5. Push-meldingen testen

1. Open de app, ga naar **Info** → **Meldingen** → **Zet aan**.
2. Geef toestemming in de browser.
3. Klik op **Test-melding** — de server stuurt een push naar dit device.

Programmatisch broadcasten naar fans van een act:

```bash
curl -X POST http://localhost:4000/api/push/broadcast-act \
  -H 'Content-Type: application/json' \
  -d '{"actId":"armin","title":"Armin begint om 23:00","body":"Loop nu richting Ponton.","url":"/lineup"}'
```

## 6. Productie / hosting

- Bouw de web-app met `npm run build` (output: `web/dist/`).
- Serveer `web/dist/` statisch achter HTTPS — anders weigert de browser
  service-worker registratie en push-meldingen.
- Server draait op een eigen host; zet `CORS_ORIGIN` in `server/.env`
  naar de productie-URL van de web-app.
- Genereer **één** vast VAPID-sleutelpaar en deel de publieke sleutel
  met de web-app via `VITE_VAPID_PUBLIC`. Roteer je sleutels niet —
  alle bestaande subscriptions worden dan ongeldig.
