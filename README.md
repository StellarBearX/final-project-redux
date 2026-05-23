<div align="center">

# ✈ Nimbus Fleet Manager

**A modern airline fleet and flight operations dashboard**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=for-the-badge)](LICENSE)

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app)

[Live Demo](#live-demo) · [Features](#features) · [Quick Start](#installation--setup) · [API Docs](#api-endpoints)

</div>

---

## Overview

Nimbus Fleet Manager simulates the operations dashboard of a regional airline. Operators can view live flight status, schedule new flights, edit or cancel existing ones, and monitor the aircraft registry — all backed by a custom REST API deployed on Railway.

The frontend is built entirely with **React 19** and **TypeScript**, using **Redux Toolkit** for global state and **RTK Query** for all server communication. RTK Query handles caching, tag-based invalidation, and loading/error states automatically, eliminating manual fetch logic across the app.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Deployment Architecture](#deployment-architecture)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Live Demo

| Service | URL |
|---|---|
| Frontend (Vercel) | _Deploy and add your URL here_ |
| Backend API (Railway) | _Deploy and add your URL here_ |

---

## Features

### Flight Management
- **Flight list** — searchable table across flight number, origin, destination, and gate
- **Status filters** — chip-based filter by On Time / Delayed / Boarding / Cancelled with live counts
- **Flight details** — dedicated detail page per flight with full record display
- **Create flight** — validated form with IATA code enforcement and time format checks
- **Edit flight** — pre-populated form, patches existing record via `PUT`
- **Delete flight** — confirmation modal before any destructive action

### Fleet Management
- **Aircraft registry** — glassmorphism card grid for every aircraft in the fleet
- **Fleet statistics** — live stat strip showing total / active / maintenance / retired counts
- **Loading skeletons** — shimmer cards render during data fetch

### UX & Reliability
- **RTK Query caching** — responses cached with tag-based invalidation; no redundant network requests
- **Optimistic error handling** — all mutations use `.unwrap()` inside `try/catch`; failures surface an inline error message and navigation only triggers on success
- **Loading states** — skeleton rows on the flights table, skeleton cards on the fleet grid
- **Error states** — dedicated error UI with retry action on every data-fetch failure
- **Responsive layout** — works across desktop and tablet viewports

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | 19 |
| Language | TypeScript | 6 |
| State Management | Redux Toolkit | 2 |
| Data Fetching | RTK Query | (bundled with RTK) |
| Routing | React Router | v7 |
| Build Tool | Vite | 8 |
| Styling | CSS Modules | — |
| Backend API | Custom Node.js REST server | — |
| Database | JSON flat-file (`db.json`) | — |
| Frontend Host | Vercel | — |
| Backend Host | Railway | — |

---

## Project Structure

```
nimbus-fleet-manager/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── app/
│   │   ├── hooks.ts            # Typed useAppDispatch / useAppSelector
│   │   ├── store.ts            # Redux store — injects RTK Query reducers
│   │   └── uiSlice.ts          # UI state slice (sidebar, theme)
│   │
│   ├── components/ui/
│   │   ├── AppShell.tsx        # Top nav + sidebar shell
│   │   ├── Button.tsx          # Polymorphic button (primary/secondary/ghost/danger)
│   │   ├── Input.tsx           # Labelled input with inline error display
│   │   ├── Select.tsx          # Styled select with same API as Input
│   │   └── StatusBadge.tsx     # Colour-coded flight/aircraft status pill
│   │
│   ├── features/
│   │   ├── flights/
│   │   │   ├── flightsApi.ts         # RTK Query API slice (CRUD + tag invalidation)
│   │   │   ├── flightsSelectors.ts   # Memoised selectors for filtered flights & stats
│   │   │   ├── FlightForm.tsx        # Add / Edit form with field-level validation
│   │   │   └── FlightsList.tsx       # Table, search bar, filter chips, delete modal
│   │   │
│   │   └── fleet/
│   │       ├── fleetApi.ts           # RTK Query API slice (read-only aircraft list)
│   │       └── FleetList.tsx         # Aircraft card grid with skeleton loading
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── FlightsPage.tsx
│   │   ├── FlightDetailsPage.tsx
│   │   ├── FleetPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── App.tsx                 # Route definitions
│   └── main.tsx                # Redux Provider + Router entry point
│
├── server.cjs                  # Dependency-free Node.js REST API
├── db.json                     # JSON flat-file database
├── vite.config.ts
├── vercel.json                 # SPA rewrite rule for client-side routing
├── nixpacks.toml               # Railway build configuration
├── .env.example
└── package.json
```

---

## Installation & Setup

### Prerequisites

- **Node.js** 20.x or later
- **npm** 9+

### 1. Clone the repository

```bash
git clone https://github.com/Yasatsawin/nimbus-fleet-manager.git
cd nimbus-fleet-manager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

The default value works out of the box for local development — the Vite dev server proxy forwards `/api` calls to the local API server automatically:

```env
VITE_API_BASE_URL=/api/v1
```

### 4. Start the API server

```bash
npm run dev:api
```

The REST API will be running at `http://localhost:3001/api/v1`.

### 5. Start the frontend dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Proxy note:** The Vite dev server proxies all `/api` requests to `http://localhost:3001`, so no manual CORS configuration is needed during local development.

---

## Environment Variables

| Variable | Description | Default (dev) |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for all RTK Query API calls | `/api/v1` |

In **production**, set this to your Railway deployment URL inside your Vercel project's **Environment Variables** settings:

```
VITE_API_BASE_URL=https://your-project.up.railway.app/api/v1
```

---

## Available Scripts

```bash
# Start the backend REST API on port 3001
npm run dev:api

# Start the Vite frontend dev server on port 5173
npm run dev

# Run both the API and frontend concurrently
#   (open two terminals and run dev:api + dev separately)

# TypeScript type-check without emitting output
npx tsc --noEmit

# Production build — type-checks then bundles with Vite
npm run build

# Preview the production bundle locally
npm run preview

# Run ESLint across the entire codebase
npm run lint

# Start the API in production mode (used by Railway)
npm start
```

---

## API Endpoints

The backend is a dependency-free Node.js HTTP server (`server.cjs`) backed by `db.json`. It requires no build step and runs identically in local development and on Railway.

**Base URL (local):** `http://localhost:3001/api/v1`

### Flights

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/flights` | List all flights |
| `GET` | `/flights/:id` | Get a single flight by ID |
| `POST` | `/flights` | Create a new flight |
| `PUT` | `/flights/:id` | Replace a flight record |
| `DELETE` | `/flights/:id` | Remove a flight |

#### Flight schema

```json
{
  "id": "1",
  "flightNumber": "NM101",
  "origin": "BKK",
  "destination": "LHR",
  "departureTime": "08:30",
  "arrivalTime": "14:45",
  "status": "On Time",
  "aircraftId": "HS-TGA",
  "gate": "A12"
}
```

`status` must be one of: `"On Time"` · `"Delayed"` · `"Boarding"` · `"Cancelled"`

---

### Aircraft

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/aircraft` | List all aircraft in the fleet |

#### Aircraft schema

```json
{
  "id": "1",
  "registration": "HS-TGA",
  "model": "737-800",
  "manufacturer": "Boeing",
  "capacity": 162,
  "status": "Active",
  "yearOfManufacture": 2015
}
```

`status` must be one of: `"Active"` · `"Maintenance"` · `"Retired"`

---

## Deployment Architecture

```
User Browser
    │
    ▼
┌─────────────────────┐
│   Vercel (CDN/Edge) │  ← React SPA (static build)
│   vercel.json SPA   │
│   rewrite rule      │
└────────┬────────────┘
         │ HTTPS — VITE_API_BASE_URL
         ▼
┌─────────────────────┐
│  Railway (Node.js)  │  ← server.cjs REST API
│  nixpacks.toml      │
│  node server.cjs    │
└────────┬────────────┘
         │ fs read/write
         ▼
      db.json
```

### Frontend — Vercel

The React app is deployed as a static SPA. `vercel.json` rewrites all routes to `index.html` to support client-side navigation:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Vercel project settings:**

| Setting | Value |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variable | `VITE_API_BASE_URL` → Railway URL |

### Backend — Railway

The API server deploys on Railway via `nixpacks.toml`. Railway injects `PORT` automatically; no build step is required.

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.build]
cmds = []

[start]
cmd = "node server.cjs"
```

**Deploy steps:**

1. Push to GitHub — Railway auto-deploys from the connected repo
2. Copy the Railway public URL (e.g. `https://your-project.up.railway.app`)
3. In Vercel, set `VITE_API_BASE_URL` = `https://your-project.up.railway.app/api/v1`
4. Trigger a Vercel redeploy to pick up the new environment variable

---

## Screenshots

> _Add screenshots after deployment. Suggested tool: [Screenzy](https://screenzy.io) or browser DevTools device toolbar._

| Page | Preview |
|---|---|
| Home / Dashboard | _(screenshot)_ |
| Flights List | _(screenshot)_ |
| Flight Detail | _(screenshot)_ |
| Add / Edit Flight Form | _(screenshot)_ |
| Fleet Registry | _(screenshot)_ |

---

## Future Improvements

- **Authentication** — JWT-based login with role-protected routes for write operations
- **Pagination** — server-side cursor pagination for large flight datasets
- **Real-time updates** — WebSocket or SSE for live flight status push
- **Aircraft CRUD** — add, edit, and retire aircraft directly from the fleet view
- **Date-aware scheduling** — full date + time fields with timezone support
- **Optimistic updates** — RTK Query `onQueryStarted` for instant UI feedback before server confirmation
- **Unit & integration tests** — Vitest + React Testing Library coverage for form validation and RTK Query selectors
- **Dark mode** — theme toggle persisted to `localStorage` via `uiSlice`

---

## Author

**Kunanan Wongsing**

- GitHub: [@StellarBearX](https://github.com/StellarBearX)

**Yasatsawin Panyawai**

- GitHub: [@YasatsawinP](https://github.com/YasatsawinP)

---

<div align="center">

Final project — React & Redux Toolkit course · Chiang Mai University

</div>
