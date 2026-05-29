# ❤U Festival 2026 — Setup

Eénmalig opzetten van database + server + web + admin-CMS.

## 1. Database

Vereist: MySQL 8 lokaal (of MariaDB 10.4+).

```bash
mysql -u root -p < server/schema.sql
```

Dit dropt en hermaakt de database `ufestival` en vult alle tabellen
(stages, acts, schedule, map_pins, faqs, reach_items, info_facts,
admin_users) met seed-data uit `server/schema.sql`.

**Bestaande database bijwerken** (zonder alles te resetten):

```bash
mysql -u root -p ufestival < server/migrate-admin.sql
```

## 2. Server (Node.js + Express)

```bash
cd server
npm install
cp .env.example .env        # zet DB_USER + DB_PASSWORD + JWT_SECRET
npm run gen-vapid           # output kopiëren naar .env
npm run dev                 # http://localhost:4000
```

Endpoints — zie [server/README.md](server/README.md).

Health-check: `curl http://localhost:4000/api/health` → `{"ok":true}`

## 3. Admin CMS

Het CMS is een aparte React-app die draait op poort 5174. Hiermee kun je
alle festivalcontent beheren zonder direct in de database te werken.

### Eerste keer instellen

**a) Admin-gebruiker aanmaken** (eenmalig, na database-setup):

```bash
cd server
npm run create-admin admin jouwwachtwoord
```

Je kunt dit commando later herhalen om het wachtwoord te wijzigen of
een extra admin toe te voegen.

**b) CMS starten:**

```bash
cd admin
npm install
npm run dev                 # http://localhost:5174
```

Open `http://localhost:5174` in de browser en log in met de
gebruikersnaam en het wachtwoord die je hierboven hebt ingesteld.

### Wat je kunt beheren

| Pagina         | Inhoud                                                  |
|----------------|---------------------------------------------------------|
| Dashboard      | Overzicht: aantallen content + laatste pushmeldingen    |
| Podia          | Naam, kleur, beschrijving (NL/EN), capaciteit, volgorde |
| Artiesten      | Bio, AI blurb, genres, YouTube-link, afbeelding         |
| Programma      | Dag, podium, artiest, start- en eindtijd                |
| Genres         | Toevoegen, hernoemen en verwijderen                     |
| Kaartpunten    | Coördinaten, type, label, gekoppeld podium              |
| FAQ's          | Vragen en antwoorden per taal (NL/EN)                   |
| Vervoer        | Transportopties per taal (NL/EN)                        |
| Festivalinfo   | Adres, datum, openingstijden, lockerinformatie          |
| Push Meldingen | Broadcast versturen naar alle abonnees                  |

### Technische details

- **Authenticatie:** JWT (geldig 8 uur), opgeslagen in localStorage
- **API-routes:** alle admin-routes vallen onder `/api/admin/` en
  vereisen een geldig Bearer-token — de publieke festival-app wordt
  niet beïnvloed
- **JWT_SECRET:** stel dit in via `server/.env`; gebruik een lange
  willekeurige string in productie

## 4. Web (React + Vite)

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

## 5. PWA-functionaliteit

| Eis                        | Waar geregeld                                                                                                                                                                                                                       |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Installeren op startscherm | `web/public/manifest.webmanifest` + in-app install-sheet `web/src/components/pwa-install`                                                                                                                                          |
| Push-meldingen             | Server: `server/server.js` (`/api/push/*`) + `server/push.js`<br/>Web: `web/src/pwa/push.ts`<br/>SW: `web/public/sw.js` `push` / `notificationclick`                                                                               |
| Offline werken             | SW-strategieën in `web/public/sw.js`:<br/>– App-shell **cache-first**<br/>– API **network-first** met cache-fallback<br/>– Assets **stale-while-revalidate**<br/>+ extra localStorage-cache in `web/src/data/api.ts` voor data-laag |
| QR-launch                  | App is een gewone PWA op `/` — elke QR die naar de URL wijst opent hem direct, daarna kan de gebruiker installeren via de install-bubble of het systeemmenu                                                                         |

## 6. Op je telefoon testen (PWA + GPS-test)

De plattegrond heeft een **GPS-test** modus waarmee je echte beweging IRL
op de festivalkaart kunt zien (handig: dan loop je gewoon in je tuin/op
straat en zie je de pin schuiven over Strijkviertel).

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

   Ngrok print een HTTPS-URL (`https://abc123.ngrok-free.app`). Die open
   je op je telefoon.

3. **Installeren + GPS-test gebruiken**

   - Open de ngrok-URL in Chrome (Android) of Safari (iOS).
   - Voeg toe aan beginscherm via de install-bubble of het systeemmenu.
   - Open de app vanaf je beginscherm → tab **Plattegrond** → **Test thuis**.
   - Scroll naar **Loop écht buiten met je telefoon** → **Start GPS-test**.
   - Geef locatie-toestemming. Eerste GPS-reading wordt je nulpunt.
   - Loop fysiek rond — je pin schuift mee over de festivalkaart.
   - **Reset hier**: pak een nieuwe GPS-nulpunt vanaf de huidige pin-positie
     (handig als je een eind verderop bent en weer "bij" een ander podium
     wil beginnen).

## 7. Push-meldingen testen

1. Open de app, ga naar **Info** → **Meldingen** → **Zet aan**.
2. Geef toestemming in de browser.
3. Klik op **Test-melding** — de server stuurt een push naar dit device.

Broadcasten naar alle abonnees via het **CMS** (aanbevolen):

- Open `http://localhost:5174` → **Push Meldingen** → vul titel en bericht in → **Verstuur melding**.

Of programmatisch via de API:

```bash
curl -X POST http://localhost:4000/api/push/broadcast-act \
  -H 'Content-Type: application/json' \
  -d '{"actId":"armin","title":"Armin begint om 23:00","body":"Loop nu richting Ponton.","url":"/lineup"}'
```

## 8. Productie / hosting (Docker + Cloudflare)

De app draait via Docker op een Raspberry Pi / NAS, achter Nginx Proxy
Manager (NPM) en een Cloudflare Tunnel. Zie hieronder voor de exacte
stappen.

### a) Frontend bouwen en deployen

```bash
# Lokaal (Windows)
cd web && npm run build

# Kopieer web/dist/* naar de NAS:
scp -r web/dist/* tom@TomRasberrypi:/mnt/storage/nas/ufestival/frontend/
```

### b) Admin CMS bouwen en deployen

```bash
# Lokaal (Windows)
cd admin && npm run build

# Maak de mappen aan op de Pi:
ssh tom@TomRasberrypi "mkdir -p /mnt/storage/nas/ufestival/admin"

# Kopieer de gebouwde bestanden:
scp -r admin/dist/* tom@TomRasberrypi:/mnt/storage/nas/ufestival/admin/

# Kopieer de nginx-config voor de admin container:
scp admin/nginx.conf tom@TomRasberrypi:/mnt/storage/nas/ufestival/admin-nginx.conf
```

### c) docker-compose.yml updaten

Voeg de `admin` service toe aan
`/mnt/storage/docker/ufestival/docker-compose.yml` — zie het bestand
voor de exacte toevoeging (al gedaan via Claude Code).

### d) Database migratie + admin-gebruiker

```bash
# SSH naar de Pi
ssh tom@TomRasberrypi

# Admin-tabel aanmaken in MySQL (vervang container-naam indien anders)
docker exec -i $(docker ps -qf name=mysql) \
  mysql -u root -pytz.HMW_pvn!yqv8kpr ufestival \
  < /mnt/storage/nas/ufestival/api/migrate-admin.sql

# Admin-gebruiker aanmaken via de API container
docker exec ufestival_api \
  node scripts/create-admin.js admin JouwSterkWachtwoord
```

### e) Admin container starten

```bash
cd /mnt/storage/docker/ufestival
docker compose up -d admin
```

### f) Nginx Proxy Manager — proxy host toevoegen

1. Open NPM → **Proxy Hosts** → **Add Proxy Host**
2. Stel in:
   - **Domain:** `admin.jouwdomein.nl`
   - **Scheme:** `http`
   - **Forward Hostname:** `ufestival_admin`
   - **Forward Port:** `80`
   - Vink **Block Common Exploits** aan
3. Ga naar het **SSL**-tabblad → **Request a new SSL Certificate** → Let's Encrypt

> 💡 **Tip:** Voeg in NPM een **Access List** toe aan dit proxy host om
> het CMS te beveiligen met een extra wachtwoord (IP-whitelist of
> HTTP Basic Auth). Het CMS is anders voor iedereen bereikbaar.

### g) Cloudflare Tunnel — admin subdomain toevoegen

1. Open Cloudflare → **Zero Trust** → **Tunnels** → jouw tunnel → **Edit**
2. Voeg een **Public Hostname** toe:
   - **Subdomain:** `admin`
   - **Domain:** `jouwdomein.nl`
   - **Service:** `http://localhost:81` (of de NPM-interne URL)

   *Of als NPM al via de tunnel binnenkomt:* voeg gewoon het
   `admin.jouwdomein.nl` DNS-record toe als CNAME naar je tunnel.

### h) Productie-instellingen controleren

Controleer in `/mnt/storage/nas/ufestival/api/.env`:

```env
JWT_SECRET=vervang-dit-door-een-lange-willekeurige-string
CORS_ORIGIN=https://jouwdomein.nl,https://admin.jouwdomein.nl
```

Herstart de API na `.env`-wijzigingen:

```bash
docker restart ufestival_api
```

---

- Genereer **één** vast VAPID-sleutelpaar en deel de publieke sleutel
  met de web-app via `VITE_VAPID_PUBLIC`. Roteer je sleutels niet —
  alle bestaande subscriptions worden dan ongeldig.
- Stel `JWT_SECRET` in op een lange willekeurige string in productie —
  de standaardwaarde is onveilig.
