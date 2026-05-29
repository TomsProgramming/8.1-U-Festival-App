# ❤U Festival 2026 — Setup (van nul tot volledig draaiend project)

Deze handleiding neemt iemand die **niets** heeft staan stap voor stap mee:
van een verse `git clone` tot een volledig werkende web-app, API + database
én het admin-CMS op de eigen computer. Daarna staat onderaan hoe je het naar
productie deployt.

> **TL;DR volgorde:** 1) tools installeren → 2) clonen → 3) database →
> 4) server → 5) admin-gebruiker → 6) web → 7) CMS → 8) testen.

---

## 0. Wat je vooraf nodig hebt

Installeer deze tools (eenmalig op je machine):

| Tool | Versie | Waarvoor | Download |
| ---- | ------ | -------- | -------- |
| **Node.js** | 20.19+ of 22+ | web, admin én server | <https://nodejs.org> |
| **npm** | komt met Node mee | dependencies installeren | — |
| **MySQL** | 8.x (of MariaDB 10.4+) | database | <https://dev.mysql.com/downloads/> |
| **Git** | recent | repo clonen | <https://git-scm.com> |

Controleer dat alles werkt:

```bash
node -v      # v20.19+ of v22+
npm -v
mysql --version
git --version
```

> 💡 Op Windows kun je MySQL het makkelijkst installeren met de **MySQL
> Installer** of via [XAMPP](https://www.apachefriends.org/). Zorg dat je het
> root-wachtwoord onthoudt — dat heb je zo nodig.

---

## 1. Project clonen

```bash
git clone https://github.com/TomsProgramming/8.1-U-Festival-App.git
cd 8.1-U-Festival-App
```

De repo bestaat uit drie deelprojecten, elk met een eigen `package.json`:

```
8.1-U-Festival-App/
├── web/      → publieke festival-app (React + Vite + TypeScript)
├── admin/    → admin-CMS (React + Vite)
├── server/   → API + push-backend (Node.js + Express + MySQL)
└── docker-compose.yml  → productie-stack
```

---

## 2. Database aanmaken

Vereist: MySQL 8 (of MariaDB 10.4+) draaiend op je machine.

```bash
mysql -u root -p < server/schema.sql
```

Dit **dropt en hermaakt** de database `ufestival` en vult alle tabellen
(`stages`, `acts`, `schedule`, `map_pins`, `faqs`, `reach_items`,
`info_facts`, `admin_users`) met seed-data uit `server/schema.sql`. Alle
primaire sleutels zijn auto-increment integers en de tabellen hebben
relaties (foreign keys) onderling.

**Heb je de database al en wil je 'm alleen bijwerken** (zonder alles te
resetten)? Draai dan alleen de admin-migratie:

```bash
mysql -u root -p ufestival < server/migrate-admin.sql
```

---

## 3. Server starten (Node.js + Express)

```bash
cd server
npm install
```

**`.env` aanmaken** (kopieer het voorbeeld en vul je gegevens in):

```bash
cp .env.example .env
```

Open `server/.env` en zet minimaal:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=jouw-mysql-wachtwoord
DB_NAME=ufestival

PORT=4000
CORS_ORIGIN=http://localhost:5173

# JWT voor de admin-login — vul een lange willekeurige string in
JWT_SECRET=verzin-hier-een-lange-willekeurige-string

# Push (genereer in de volgende stap)
VAPID_PUBLIC=
VAPID_PRIVATE=
VAPID_SUBJECT=mailto:info@ufestival.nl
```

**VAPID-sleutels genereren** (eenmalig — nodig voor push-meldingen):

```bash
npm run gen-vapid
```

Kopieer de geprinte `VAPID_PUBLIC` en `VAPID_PRIVATE` naar `server/.env`.
De publieke sleutel heb je straks ook nodig in `web/.env`.

> ⚠️ Genereer dit sleutelpaar **één keer** en roteer het niet — anders worden
> alle bestaande push-subscriptions ongeldig.

**Server starten:**

```bash
npm run dev        # draait op http://localhost:4000
```

Controleer dat de API leeft:

```bash
curl http://localhost:4000/api/health      # → {"ok":true}
```

Alle endpoints staan in [server/README.md](server/README.md).

---

## 4. Admin-gebruiker aanmaken

Eenmalig, ná de database-setup. Maak een login aan voor het CMS:

```bash
cd server
npm run create-admin admin jouwwachtwoord
```

Herhaal dit commando later om een wachtwoord te wijzigen of een extra admin
toe te voegen.

---

## 5. Web-app starten (React + Vite)

In een **nieuw** terminal-venster (de server moet blijven draaien):

```bash
cd web
npm install
cp .env.example .env
```

Open `web/.env` en zet:

```env
VITE_API_BASE=http://localhost:4000
VITE_VAPID_PUBLIC=<de VAPID_PUBLIC uit stap 3>
```

Starten:

```bash
npm run dev        # draait op http://localhost:5173
```

Open <http://localhost:5173> in de browser. De app haalt zijn data op via
`http://localhost:4000/api/*`. Valt de server weg, dan blijft de app werken
op de localStorage-cache van de laatste sessie en — bij een koude start — op
de bundled fallback in `web/src/data/festival.ts`.

---

## 6. Admin-CMS starten

Het CMS is een **aparte** React-app op poort **5174** waarmee je alle
festivalcontent beheert zonder direct in de database te werken.

In weer een nieuw terminal-venster:

```bash
cd admin
npm install
npm run dev        # draait op http://localhost:5174
```

Open <http://localhost:5174> en log in met de gebruikersnaam + wachtwoord uit
stap 4.

### Wat je in het CMS kunt beheren

| Pagina         | Inhoud                                                  |
|----------------|---------------------------------------------------------|
| Dashboard      | Overzicht: aantallen content + laatste pushmeldingen    |
| Podia          | Naam, kleur, beschrijving (NL/EN), capaciteit, volgorde |
| Artiesten      | Bio, AI-blurb, genres, YouTube-link, afbeelding         |
| Programma      | Dag, podium, artiest, start- en eindtijd                |
| Genres         | Toevoegen, hernoemen en verwijderen                     |
| Kaartpunten    | Coördinaten, type, label, gekoppeld podium              |
| FAQ's          | Vragen en antwoorden per taal (NL/EN)                   |
| Vervoer        | Transportopties per taal (NL/EN)                        |
| Festivalinfo   | Adres, datum, openingstijden, lockerinformatie          |
| Push Meldingen | Broadcast versturen naar alle abonnees                  |

### Hoe het CMS technisch in elkaar zit

- **Aparte app/poort:** eigen build en eigen toegang, los van de publieke
  festival-app — die wordt nooit beïnvloed door het CMS.
- **Authenticatie:** JWT (geldig 8 uur), opgeslagen in `localStorage`.
- **API-routes:** alle admin-routes vallen onder `/api/admin/` en vereisen
  een geldig Bearer-token.
- **JWT_SECRET:** ingesteld via `server/.env` — gebruik in productie een lange
  willekeurige string.

---

## 7. Alles in één oogopslag — wat draait waar?

| Onderdeel | Commando (in eigen terminal) | URL |
| --------- | ---------------------------- | --- |
| Database  | MySQL service                | `localhost:3306` |
| Server/API | `cd server && npm run dev`  | <http://localhost:4000> |
| Web-app   | `cd web && npm run dev`      | <http://localhost:5173> |
| Admin-CMS | `cd admin && npm run dev`    | <http://localhost:5174> |

Voor een volledig werkende lokale setup moeten **database + server** altijd
draaien; web en admin kun je los starten.

---

## 8. PWA-functionaliteit

| Eis                        | Waar geregeld                                                                                                                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Installeren op startscherm | `web/public/manifest.webmanifest` + in-app install-sheet `web/src/components/pwa-install`                                                                                                                                          |
| Push-meldingen             | Server: `server/server.js` (`/api/push/*`) + `server/push.js`<br/>Web: `web/src/pwa/push.ts`<br/>SW: `web/public/sw.js` `push` / `notificationclick`                                                                               |
| Offline werken             | SW-strategieën in `web/public/sw.js`:<br/>– App-shell **cache-first**<br/>– API **network-first** met cache-fallback<br/>– Assets **stale-while-revalidate**<br/>+ extra localStorage-cache in `web/src/data/api.ts` voor data-laag |
| QR-launch                  | App is een gewone PWA op `/` — elke QR die naar de URL wijst opent hem direct, daarna kan de gebruiker installeren via de install-bubble of het systeemmenu                                                                         |

---

## 9. Op je telefoon testen (PWA + GPS-test)

De plattegrond heeft een **GPS-test**-modus waarmee je echte beweging IRL op
de festivalkaart kunt zien (handig: dan loop je gewoon in je tuin/op straat en
zie je de pin schuiven over Strijkviertel).

Twee dingen nodig:

1. **De dev-server moet bereikbaar zijn vanaf je telefoon**

   ```bash
   cd web
   npm run dev -- --host        # bindt op 0.0.0.0
   ```

   Vite logt nu een `Network:`-URL met je LAN-IP, bv.
   `http://192.168.1.42:5173`.

2. **HTTPS, anders weigert de browser GPS en PWA-install**

   Localhost is een uitzondering, een LAN-IP niet. Tunnel het via:

   ```bash
   npx ngrok http 5173
   ```

   Ngrok print een HTTPS-URL (`https://abc123.ngrok-free.app`). Die open je op
   je telefoon. (Of gebruik gewoon de live-URL, zie de README.)

3. **Installeren + GPS-test gebruiken**

   - Open de URL in Chrome (Android) of Safari (iOS).
   - Voeg toe aan beginscherm via de install-bubble of het systeemmenu.
   - Open de app vanaf je beginscherm → tab **Plattegrond** → **Test thuis**.
   - Scroll naar **Loop écht buiten met je telefoon** → **Start GPS-test**.
   - Geef locatie-toestemming. Eerste GPS-reading wordt je nulpunt.
   - Loop fysiek rond — je pin schuift mee over de festivalkaart.
   - **Reset hier**: pak een nieuw GPS-nulpunt vanaf de huidige pin-positie.

---

## 10. Push-meldingen testen

1. Open de app, ga naar **Info** → **Meldingen** → **Zet aan**.
2. Geef toestemming in de browser.
3. Klik op **Test-melding** — de server stuurt een push naar dit device.

Broadcasten naar alle abonnees via het **CMS** (aanbevolen):

- Open <http://localhost:5174> → **Push Meldingen** → vul titel en bericht in →
  **Verstuur melding**.

Of programmatisch via de API:

```bash
curl -X POST http://localhost:4000/api/push/broadcast-act \
  -H 'Content-Type: application/json' \
  -d '{"actId":"armin","title":"Armin begint om 23:00","body":"Loop nu richting Ponton.","url":"/lineup"}'
```

---

## 11. Veelvoorkomende problemen

| Symptoom | Oorzaak / oplossing |
| -------- | ------------------- |
| `ECONNREFUSED` bij API-calls | MySQL draait niet of `DB_*` in `server/.env` klopt niet. |
| App toont alleen oude/bundled data | Server staat uit — start `cd server && npm run dev`. |
| CMS-login mislukt | Admin-gebruiker niet aangemaakt (stap 4) of verkeerd wachtwoord. |
| Push werkt niet | `VAPID_*` ontbreekt in `server/.env` of `VITE_VAPID_PUBLIC` ontbreekt in `web/.env`. |
| CORS-fout in console | `CORS_ORIGIN` in `server/.env` moet de URL van de web-app bevatten. |
| GPS/install werkt niet op telefoon | Geen HTTPS — gebruik ngrok of de live-URL (LAN-IP via http werkt niet). |

---

## 12. Productie / hosting (Docker + Cloudflare)

De app draait via Docker op een Raspberry Pi / NAS, achter Nginx Proxy Manager
(NPM) en een Cloudflare Tunnel. Live:

- **App:** <https://ufestival.tomtiedemann.com/>
- **Admin:** <https://admin-ufestival.tomtiedemann.com/>

### a) Frontend bouwen en deployen

```bash
# Lokaal (Windows)
cd web && npm run build

# Kopieer web/dist/* naar de NAS:
scp -r web/dist/* tom@TomRasberrypi:/mnt/storage/nas/ufestival/frontend/
```

### b) Admin-CMS bouwen en deployen

```bash
# Lokaal (Windows)
cd admin && npm run build

# Maak de map aan op de Pi:
ssh tom@TomRasberrypi "mkdir -p /mnt/storage/nas/ufestival/admin"

# Kopieer de gebouwde bestanden:
scp -r admin/dist/* tom@TomRasberrypi:/mnt/storage/nas/ufestival/admin/

# Kopieer de nginx-config voor de admin container:
scp admin/nginx.conf tom@TomRasberrypi:/mnt/storage/nas/ufestival/admin-nginx.conf
```

### c) docker-compose.yml updaten

De `admin`-service staat al in
`/mnt/storage/docker/ufestival/docker-compose.yml` — zie [docker-compose.yml](docker-compose.yml)
voor de exacte definitie.

### d) Database-migratie + admin-gebruiker

```bash
# SSH naar de Pi
ssh tom@TomRasberrypi

# Admin-tabel aanmaken in MySQL (vervang container-naam indien anders)
docker exec -i $(docker ps -qf name=mysql) \
  mysql -u root -p ufestival \
  < /mnt/storage/nas/ufestival/api/migrate-admin.sql

# Admin-gebruiker aanmaken via de API container
docker exec ufestival_api \
  node scripts/create-admin.js admin JouwSterkWachtwoord
```

### e) Admin-container starten

```bash
cd /mnt/storage/docker/ufestival
docker compose up -d admin
```

### f) Nginx Proxy Manager — proxy host toevoegen

1. Open NPM → **Proxy Hosts** → **Add Proxy Host**
2. Stel in:
   - **Domain:** `admin-ufestival.tomtiedemann.com`
   - **Scheme:** `http`
   - **Forward Hostname:** `ufestival_admin`
   - **Forward Port:** `80`
   - Vink **Block Common Exploits** aan
3. Ga naar het **SSL**-tabblad → **Request a new SSL Certificate** → Let's Encrypt

> 💡 **Tip:** Voeg in NPM een **Access List** toe aan dit proxy host om het CMS
> extra te beveiligen (IP-whitelist of HTTP Basic Auth).

### g) Cloudflare Tunnel — admin-subdomein toevoegen

1. Open Cloudflare → **Zero Trust** → **Tunnels** → jouw tunnel → **Edit**
2. Voeg een **Public Hostname** toe:
   - **Subdomain:** `admin-ufestival`
   - **Domain:** `tomtiedemann.com`
   - **Service:** de NPM-interne URL

### h) Productie-instellingen controleren

Controleer in `/mnt/storage/nas/ufestival/api/.env`:

```env
JWT_SECRET=vervang-dit-door-een-lange-willekeurige-string
CORS_ORIGIN=https://ufestival.tomtiedemann.com,https://admin-ufestival.tomtiedemann.com
```

Herstart de API na `.env`-wijzigingen:

```bash
docker restart ufestival_api
```

---

> - Genereer **één** vast VAPID-sleutelpaar en deel de publieke sleutel met de
>   web-app via `VITE_VAPID_PUBLIC`. Roteer je sleutels niet — alle bestaande
>   subscriptions worden dan ongeldig.
> - Stel `JWT_SECRET` in op een lange willekeurige string in productie — de
>   standaardwaarde is onveilig.
