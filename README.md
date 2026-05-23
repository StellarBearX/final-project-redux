# Nimbus Fleet Manager

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?style=flat-square&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

A full-stack airline operations dashboard for managing flights and aircraft fleets. Built with React, TypeScript, and Redux Toolkit — featuring real-time data sync via RTK Query, full CRUD operations, and a production deployment across Vercel (frontend) and Railway (backend).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [Author](#author)

---

## Overview

Nimbus Fleet Manager simulates the operations dashboard of a regional airline. Operators can view live flight status, schedule new flights, edit or cancel existing ones, and monitor the aircraft registry — all backed by a custom REST API deployed on Railway.

The frontend is built entirely with **React 19** and **TypeScript**, using **Redux Toolkit** for global state and **RTK Query** for all server communication. RTK Query handles caching, tag-based invalidation, and loading/error states automatically, eliminating manual fetch logic across the app.

---

## Features

### Flight Management
- **Flight list** — searchable table across flight number, origin, destination, and gate
- **Status filters** — chip-based filter by On Time / Delayed / Boarding / Cancelled with live counts
- **Flight details** — dedicated detail page per flight
- **Create flight** — validated form with IATA code enforcement and time format checks
- **Edit flight** — pre-populated form, patches existing record via PUT
- **Delete flight** — confirmation modal before destructive action

### Fleet Management
- **Aircraft registry** — glassmorphism card grid for every aircraft in the fleet
- **Fleet statistics** — live stat strip showing total / active / maintenance / retired counts
- **Loading skeletons** — shimmer cards during data fetch

### UX & Reliability
- **RTK Query caching** — responses cached with tag-based invalidation; no redundant requests
- **Optimistic error handling** — all mutations use `.unwrap()` inside `try/catch`; failures surface an inline error message and navigation only triggers on success
- **Loading states** — skeleton rows on the flights table, skeleton cards on the fleet grid
- **Error states** — dedicated error UI with retry action on every data-fetch failure
- **Responsive layout** — works across desktop and tablet viewports

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript 6 |
| State Management | Redux Toolkit 2 |
| Data Fetching | RTK Query |
| Routing | React Router v7 |
| Build Tool | Vite 8 |
| Styling | CSS Modules |
| Backend API | Custom Node.js REST server |
| Database | JSON flat-file (`db.json`) |
| Frontend Host | Vercel |
| Backend Host | Railway |

---

## Project Structure

```
nimbus-fleet-manager/
├── public/
├── src/
│   ├── app/
│   │   ├── hooks.ts          # Typed useAppDispatch / useAppSelector
│   │   ├── store.ts          # Redux store — injects RTK Query reducers
│   │   └── uiSlice.ts        # UI state slice (sidebar, theme)
│   │
│   ├── components/ui/
│   │   ├── AppShell.tsx      # Top nav + sidebar shell
│   │   ├── Button.tsx        # Polymorphic button (primary/secondary/ghost/danger)
│   │   ├── Input.tsx         # Labelled input with inline error display
│   │   ├── Select.tsx        # Styled select with same API as Input
│   │   └── StatusBadge.tsx   # Colour-coded flight/aircraft status pill
│   │
│   ├── features/
│   │   ├── flights/
│   │   │   ├── flightsApi.ts       # RTK Query API slice (CRUD + tag invalidation)
│   │   │   ├── flightsSelectors.ts # Memoised selectors for filtered flights & stats
│   │   │   ├── FlightForm.tsx      # Add / Edit form with field-level validation
│   │   │   └── FlightsList.tsx     # Table, search bar, filter chips, delete modal
│   │   │
│   │   └── fleet/
│   │       ├── fleetApi.ts         # RTK Query API slice (read-only aircraft list)
│   │       └── FleetList.tsx       # Aircraft card grid with skeleton loading
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── FlightsPage.tsx
│   │   ├── FlightDetailsPage.tsx
│   │   ├── FleetPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── App.tsx               # Route definitions
│   └── main.tsx              # Redux Provider + Router entry point
│
├── server.cjs                # Dependency-free Node.js REST API
├── db.json                   # JSON flat-file database
├── vite.config.ts
├── vercel.json               # SPA rewrite rule
├── nixpacks.toml             # Railway build config
├── .env.example
└── package.json
```

---

## Installation & Setup

### Prerequisites

- Node.js **20.x** or later
- npm **9+**

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nimbus-fleet-manager.git
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

The default value works out of the box for local development — the Vite dev server proxy handles routing to the local API:

```env
VITE_API_BASE_URL=/api/v1
```

### 4. Start the API server

```bash
node server.cjs
```

The REST API is now running at `http://localhost:3001/api/v1`.

### 5. Start the frontend dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:3001`, so no CORS configuration is needed during local development.

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL for all API calls | `/api/v1` (dev) or `https://your-api.up.railway.app/api/v1` (prod) |

Create a `.env` file at the project root (see `.env.example`). In production, configure this variable in your Vercel project settings under **Environment Variables**.

---

## Available Scripts

```bash
# Start the backend REST API on port 3001
node server.cjs

# Start the Vite frontend dev server on port 5173
npm run dev

# TypeScript type-check (no output emitted)
npx tsc --noEmit

# Production build — runs tsc then Vite bundle
npm run build

# Preview the production bundle locally
npm run preview

# Run ESLint across the codebase
npm run lint
```

---

## API Endpoints

The backend is a dependency-free Node.js HTTP server (`server.cjs`) backed by `db.json`. It requires no build step and runs identically in development and on Railway.

**Base URL (local):** `http://localhost:3001/api/v1`

### Flights

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/flights` | List all flights |
| `GET` | `/flights/:id` | Get a single flight by ID |
| `POST` | `/flights` | Create a new flight |
| `PUT` | `/flights/:id` | Replace a flight record |
| `DELETE` | `/flights/:id` | Remove a flight |

#### Flight object schema

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

`status` — one of: `"On Time"` `"Delayed"` `"Boarding"` `"Cancelled"`

### Aircraft

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/aircraft` | List all aircraft in the fleet |

#### Aircraft object schema

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

`status` — one of: `"Active"` `"Maintenance"` `"Retired"`

---

## Deployment

### Architecture

```
Browser ──► Vercel (React SPA) ──► Railway (Node.js REST API) ──► db.json
```

### Frontend — Vercel

The React app is deployed as a static SPA on Vercel. `vercel.json` rewrites all routes to `index.html` to support client-side navigation:

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
| Environment Variable | `VITE_API_BASE_URL` = your Railway URL |

### Backend — Railway

The API server deploys on Railway via `nixpacks.toml`. Railway injects `PORT` automatically; no build step is needed.

```toml
[phases.setup]
nixPkgs = ["nodejs_20"]

[phases.build]
cmds = []

[start]
cmd = "node server.cjs"
```

Once deployed, copy the Railway public URL and set it as `VITE_API_BASE_URL` in your Vercel environment variables:

```
https://your-project.up.railway.app/api/v1
```

---

## Screenshots

> _Add screenshots after deployment._

| Page | Preview |
|---|---|
| Home / Dashboard | _(add screenshot)_ |
| Flights List | _(add screenshot)_ |
| Flight Details | _(add screenshot)_ |
| Add / Edit Flight | _(add screenshot)_ |
| Fleet Registry | _(add screenshot)_ |

---

## Future Improvements

- **Authentication** — JWT-based login with role-protected routes for write operations
- **Pagination** — server-side pagination for large flight datasets
- **Real-time updates** — WebSocket or SSE for live flight status push
- **Aircraft CRUD** — add, edit, and retire aircraft directly from the fleet view
- **Date-aware scheduling** — full date + time fields with timezone support
- **Optimistic updates** — RTK Query `onQueryStarted` for instant UI feedback before server confirmation
- **Unit & integration tests** — Vitest + React Testing Library coverage for form validation and selectors

---

## Author

**Yasatsawin Pukdeewong**
- GitHub: [@Yasatsawin](https://github.com/Yasatsawin)
- Email: yasatsawin_p@cmu.ac.th

---

> Final project — React & Redux Toolkit course, Chiang Mai University.
