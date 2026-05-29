# ❤U Festival 2026 — App

Een **Progressive Web App (PWA)** voor het fictieve **❤U Festival 2026** op
Strijkviertel (Utrecht). Bezoekers kunnen de line-up bekijken, artiesten
volgen, clips kijken, hun favorieten bewaren, de interactieve plattegrond met
live GPS-positie gebruiken, push-meldingen ontvangen en de app offline
gebruiken. Achter de schermen draait een Node.js-API met MySQL en een volledig
admin-CMS om alle content te beheren.

> Gemaakt door **Tom Tiedemann** als schoolproject (Mobile Application
> Development). Het AI-gebruik tijdens de bouw is gedocumenteerd in
> [ai-logboek.md](ai-logboek.md).

---

## 🔗 Links

| Wat | Link |
| --- | ---- |
| 🎪 **Live app** | <https://ufestival.tomtiedemann.com/> |
| 🛠️ **Admin-CMS (live)** | <https://admin-ufestival.tomtiedemann.com/> |
| 💻 **GitHub-repo** | <https://github.com/TomsProgramming/8.1-U-Festival-App> |
| 📋 **Setup-handleiding** | [SETUP.md](SETUP.md) |
| 🤖 **AI-logboek** | [ai-logboek.md](ai-logboek.md) |
| 📡 **API-documentatie** | [server/README.md](server/README.md) |
| 📱 **Onderzoek Mobile App Development** | [Mobile-Application-Development.md](Mobile-Application-Development.md) |

### Externe bronnen & afhankelijkheden

- **Lettertype:** [Sansation (Google Fonts)](https://fonts.google.com/specimen/Sansation)
- **Iconen:** [Material Symbols / Icons](https://fonts.google.com/icons)
- **Framework:** [React 19](https://react.dev/) · [Vite](https://vite.dev/) · [TypeScript](https://www.typescriptlang.org/)
- **Backend:** [Node.js](https://nodejs.org/) · [Express](https://expressjs.com/) · [MySQL](https://www.mysql.com/)
- **Push:** [web-push (VAPID)](https://github.com/web-push-libs/web-push)
- **Hosting:** [Docker](https://www.docker.com/) · [Nginx Proxy Manager](https://nginxproxymanager.com/) · [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)

### Artiest-clips (YouTube)

De clip-knop bij elke act linkt naar:

| Artiest | Clip |
| ------- | ---- |
| Armin van Buuren | <https://www.youtube.com/watch?v=TxvpctgU_s8> |
| Martin Garrix | <https://www.youtube.com/watch?v=Zv1QV6lrc_Y> |
| Kensington | <https://www.youtube.com/watch?v=IH77eOyV95o> |
| Within Temptation | <https://www.youtube.com/watch?v=iQVei5C2N4E> |
| De Staat | <https://www.youtube.com/watch?v=0ttGgIQpAUc> |
| Chef'Special | <https://www.youtube.com/watch?v=l3jRIr44lss> |
| Navarone | <https://www.youtube.com/watch?v=EvLpaCSnc4k> |
| Dotan | <https://www.youtube.com/watch?v=FZEuqzW16Nw> |
| Eefje de Visser | <https://www.youtube.com/watch?v=6IlLJNmLDMg> |
| Froukje | <https://www.youtube.com/watch?v=g4PlReX9e-E> |
| Spinvis | <https://www.youtube.com/watch?v=F3ZTrGWSLf4> |

---

## ✨ Functionaliteit

- **Line-up & artiesten** — overzicht per dag/podium, artiestdetails met bio,
  genres en clips.
- **Favorieten** — artiesten volgen; werkt offline en synct later naar de
  server.
- **Interactieve plattegrond** — SVG-kaart met markers, pinch-to-zoom en een
  GPS-test waarmee je je eigen positie live op de festivalkaart ziet.
- **PWA** — installeerbaar op het startscherm, werkt offline (service worker
  caching) en ondersteunt push-meldingen.
- **Tweetalig** — volledige NL/EN-switch.
- **Light & dark mode.**
- **Admin-CMS** — beheer alle content (podia, artiesten, programma, genres,
  kaartpunten, FAQ's, vervoer, festivalinfo) en verstuur push-broadcasts,
  zonder de database aan te raken.

---

## 🏗️ Architectuur

```
8.1-U-Festival-App/
├── web/      → publieke festival-app   (React + Vite + TypeScript) → :5173
├── admin/    → admin-CMS               (React + Vite)              → :5174
├── server/   → API + push-backend      (Node.js + Express + MySQL) → :4000
└── docker-compose.yml  → productie-stack (nginx + nginx + node)
```

- **web** haalt zijn data uit de API; valt die weg, dan werkt de app door op
  een localStorage-cache en een gebundelde fallback.
- **admin** praat via geauthenticeerde `/api/admin/*`-routes met dezelfde API.
- **server** serveert publieke en admin-routes, beheert push-subscriptions en
  bewaart alles in MySQL.

---

## 🚀 Snel starten (lokaal)

Korte versie — de **volledige** stap-voor-stap-uitleg (van een verse machine
tot draaiend project) staat in **[SETUP.md](SETUP.md)**.

```bash
# 1. Clone
git clone https://github.com/TomsProgramming/8.1-U-Festival-App.git
cd 8.1-U-Festival-App

# 2. Database
mysql -u root -p < server/schema.sql

# 3. Server (terminal 1)
cd server && npm install && cp .env.example .env   # vul .env
npm run gen-vapid                                   # sleutels → .env
npm run create-admin admin jouwwachtwoord
npm run dev                                         # :4000

# 4. Web-app (terminal 2)
cd web && npm install && cp .env.example .env       # vul VITE_VAPID_PUBLIC
npm run dev                                         # :5173

# 5. Admin-CMS (terminal 3)
cd admin && npm install
npm run dev                                         # :5174
```

**Vereisten:** Node.js 20.19+ of 22+ · MySQL 8 (of MariaDB 10.4+) · Git.

---

## 🧰 Tech-stack

| Laag | Technologie |
| ---- | ----------- |
| Frontend | React 19, TypeScript, Vite, React Router, SCSS |
| PWA | Service Worker, Web Manifest, Web Push (VAPID) |
| Backend | Node.js, Express, mysql2, jsonwebtoken, bcryptjs, web-push |
| Database | MySQL 8 (auto-increment integer-PK's + foreign keys) |
| Admin | React, Vite, JWT-auth |
| Hosting | Docker, Nginx Proxy Manager, Cloudflare Tunnel |

---

## 📄 Documentatie

- **[SETUP.md](SETUP.md)** — volledige installatie van nul tot productie.
- **[server/README.md](server/README.md)** — alle API-endpoints.
- **[ai-logboek.md](ai-logboek.md)** — overzicht van het AI-gebruik tijdens de
  bouw, met per prompt een ingeschatte bruikbaarheid.
