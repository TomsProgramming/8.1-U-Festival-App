# ❤U Festival API

Node.js + Express + MySQL backend voor de festival-app.

## Setup

1. **MySQL aanmaken**

   ```bash
   mysql -u root -p < schema.sql
   ```

   Dit dropt en hermaakt de database `ufestival` en vult alle tabellen met seed-data.

2. **Dependencies**

   ```bash
   npm install
   ```

3. **`.env` configureren**

   ```bash
   cp .env.example .env
   ```

   Open `.env` en zet `DB_USER` / `DB_PASSWORD`.

4. **VAPID-sleutels (eenmalig)**

   ```bash
   npm run gen-vapid
   ```

   Plak de output in `.env`. Kopieer de `VAPID_PUBLIC` ook naar
   `web/.env`:

   ```
   VITE_API_BASE=http://localhost:4000
   VITE_VAPID_PUBLIC=<dezelfde sleutel>
   ```

5. **Start de server**

   ```bash
   npm run dev
   ```

   API draait op `http://localhost:4000`.

## API endpoints

| Method | Path                                     | Doel                                  |
| ------ | ---------------------------------------- | ------------------------------------- |
| GET    | `/api/health`                            | Health-check                          |
| GET    | `/api/stages`                            | Alle podia                            |
| GET    | `/api/acts`                              | Alle acts                             |
| GET    | `/api/schedule`                          | Programma per dag                     |
| GET    | `/api/map-pins`                          | Plattegrond-pins                      |
| GET    | `/api/faqs?lang=nl`                      | FAQ                                   |
| GET    | `/api/reach?lang=nl`                     | Bereikbaarheid                        |
| GET    | `/api/info?lang=nl`                      | Info-feiten (adres / datum / tijd)    |
| POST   | `/api/devices`                           | Toestel registreren                   |
| GET    | `/api/favorites/:deviceId`               | Favorieten ophalen                    |
| POST   | `/api/favorites/:deviceId/:actId`        | Toevoegen                             |
| DELETE | `/api/favorites/:deviceId/:actId`        | Verwijderen                           |
| GET    | `/api/push/vapid-public-key`             | Publieke VAPID-sleutel                |
| POST   | `/api/push/subscribe`                    | Subscription opslaan                  |
| POST   | `/api/push/unsubscribe`                  | Subscription verwijderen              |
| POST   | `/api/push/test`                         | Test-push naar 1 device               |
| POST   | `/api/push/broadcast-act`                | Broadcast naar fans van een act       |
