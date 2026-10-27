# 🗺️ WonderMap

An immersive, gamified educational platform where learners travel through beautiful
interactive worlds completing lessons — think *Duolingo × Monument Valley*. Built as
a production-style monorepo with a React 19 client, an Express/MongoDB API, and a
shared TypeScript contract package.

![tech](https://img.shields.io/badge/React-19-61dafb) ![tech](https://img.shields.io/badge/TypeScript-5-3178c6) ![tech](https://img.shields.io/badge/Express-4-000000) ![tech](https://img.shields.io/badge/MongoDB-8-47a248)

---

## ✨ Features

- **Interactive isometric-style world map** — drag to pan (with inertia), wheel &
  pinch to zoom (zoom-to-cursor), and a smooth eased *center-on-player* camera.
- **12 themed worlds** (Forest, Beach, Snow, Mountain, Jungle, City, Space, Ocean,
  Volcano, Egypt, Future, Magic) each with its own palette, terrain, river,
  decorations and drifting clouds — all procedurally authored and fully editable.
- **Reusable SVG decorations** — `<Tree/>`, `<Pine/>`, `<Bush/>`, `<Rock/>`,
  `<Flower/>`, `<Mountain/>`, `<Building/>`, `<Castle/>`, `<Bridge/>`, `<Lamp/>`,
  `<Cloud/>`, `<Grass/>`.
- **Lesson nodes** with per-user states (locked / unlocked / completed / perfect)
  and types (lesson, boss, challenge, treasure, review), curved progress paths,
  stars, and an animated walking avatar.
- **Real mini-lesson loop** — tap-the-answer questions → score → server awards
  XP/coins/stars → unlocks the next node/world → confetti celebration.
- **Progression system** — XP, coins, streak, hearts, energy, levels, daily/weekly
  goals, achievements with a rule engine, and badges.
- **Full HUD** — menu drawer, world signboard with prev/next, coins/XP/hearts/
  profile, and a bottom navigation bar.
- **Admin dashboard** — analytics, world & user management, and a **visual map
  editor** (drag lesson nodes & decorations, paint scenery, save coordinates).
- **Auth** — JWT access tokens + httpOnly refresh cookie, with silent refresh.
- **Polish** — Framer Motion micro-interactions, ambient particles, parallax depth,
  soft shadows/gradients, reduced-motion support, and keyboard/ARIA accessibility.

---

## 🧱 Tech Stack

| Layer     | Tech |
|-----------|------|
| Frontend  | React 19, Vite, React Router, Framer Motion, Zustand, TailwindCSS, React Query, Axios, TypeScript |
| Backend   | Node.js, Express, JWT, MongoDB, Mongoose, Zod, TypeScript |
| Shared    | `@wondermap/shared` — types & contracts consumed by both sides |
| Tooling   | npm workspaces, tsx, Docker |

---

## 📁 Project Structure

```
WonderMap/
├── client/            # React 19 + Vite SPA
│   └── src/
│       ├── components/ # ui, hud, map (+ map/decorations)
│       ├── features/   # auth, lesson, admin
│       ├── hooks/      # useMapCamera, react-query hooks
│       ├── lib/        # api, services, theme, nodeState
│       ├── pages/      # Login, Map, Achievements, Profile, Shop, Settings, Admin
│       └── store/      # zustand stores (auth, ui)
├── server/            # Express + Mongoose API
│   └── src/
│       ├── config/     # env, db
│       ├── controllers/ routes/ services/ middleware/
│       ├── models/     # User, World, Lesson, Achievement
│       └── seed/       # procedural world/lesson seed
├── shared/            # @wondermap/shared TypeScript contracts
├── docker-compose.yml
└── package.json       # npm workspaces + scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- A MongoDB instance (local `mongod`, Docker, or Atlas)

### 1. Install
```bash
npm install            # installs all workspaces
```

### 2. Configure environment
```bash
cp .env.example .env
cp server/.env.example server/.env   # adjust MONGO_URI / JWT secrets if needed
```

### 3. Seed the database
```bash
npm run seed
```
This creates 12 worlds, ~106 lessons, 8 achievements, and two accounts:

| Role  | Email                   | Password    |
|-------|-------------------------|-------------|
| User  | `demo@wondermap.dev`    | `demo1234`  |
| Admin | `admin@wondermap.dev`   | `admin1234` |

### 4. Run (client + server together)
```bash
npm run dev
```
- Client → http://localhost:5173
- API    → http://localhost:4000/api  (proxied through Vite at `/api`)

---

## 🐳 Docker

Spin up MongoDB + API + client with one command:

```bash
docker compose up --build
```
Then seed once:
```bash
docker compose exec server npm run seed
```
- Client → http://localhost:5173
- API    → http://localhost:4000

---

## 🔌 API Overview

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Login |
| POST | `/api/auth/refresh` | cookie | Rotate access token |
| POST | `/api/auth/logout` | – | Clear refresh cookie |
| GET  | `/api/me` | ✓ | Current user |
| PATCH| `/api/profile` | ✓ | Update name/avatar |
| GET  | `/api/progress` | ✓ | Progress snapshot |
| GET  | `/api/worlds` | – | All worlds |
| GET  | `/api/world/:id` | – | World + lessons |
| GET  | `/api/lesson/:id` | – | Lesson detail |
| POST | `/api/lesson/complete` | ✓ | Submit score, award & unlock |
| GET  | `/api/achievements` | ✓ | Achievements + unlock state |
| GET  | `/api/rewards` · POST `/api/claim` | ✓ | Reward catalogue / claim |
| `/api/admin/*` | | ✓ admin | Worlds/lessons/users CRUD, scene save, analytics |

---

## 🧭 Architecture Notes

- **Camera** (`useMapCamera`) writes the transform straight to the DOM every frame —
  panning/zooming never re-render React, keeping the map at 60fps.
- **Ambient animations** use compositor-driven CSS keyframes rather than per-frame JS
  so the main thread stays free.
- **Progression** is authoritative on the server: `progress.service` awards rewards,
  unlocks lessons whose prerequisites are met, unlocks worlds by XP threshold, and
  evaluates achievement rules — the client only reflects the returned state.
- **Shared contracts** (`@wondermap/shared`) guarantee the client and server agree on
  every DTO.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client + server concurrently |
| `npm run dev:server` / `dev:client` | Run one side |
| `npm run seed` | Reseed the database |
| `npm run build` | Build shared + client for production |
| `npm run lint` | Lint the client |

---

## 📝 License

MIT — sample assets are original SVG/emoji; no third-party copyrighted assets are used.
