# Lightmeter 📷

A mobile app for analog film photographers.

---

## The Problem

Analog cameras often lack a built-in light meter — and when they do have one, it frequently breaks over time. On top of that, film photography produces no EXIF data, so photographers have no record of the settings they used for each frame. Lightmeter solves both problems.

---

## Features

### Light Meter
Point your phone at a scene and tap Measure. The app reads the phone camera's sensor data (shutter speed, aperture, ISO) via EXIF, calculates the scene brightness as an EV100 value, and recommends the correct aperture and shutter speed for your chosen film stock. The light meter works fully offline — all calculations are handled client-side.

### ISO Selector
A scrollable chip picker with standard film ISO values (25, 50, 64, 100, 125, 160, 200, 400, 800, 1600, 3200). Changing the ISO instantly updates the recommended exposure.

### Exposure Ruler
A scrollable ruler displaying all valid aperture–shutter speed combinations for the current light level. Lets the photographer choose their preferred creative tradeoff — shallow depth of field vs. freezing motion — while keeping the exposure constant.

### Zoom Control
A slider to zoom the camera preview between wide and tele while composing your shot.

### Photo Logger
A digital logbook for your film shots. After taking a photo, log the settings you used — ISO, aperture, shutter speed, date, and location. All entries are saved to the backend and persist across sessions. Helps with retrospective analysis after the film is developed.

### Authentication
Secure sign up and login with JWT-based authentication. Access tokens are refreshed automatically. Each user's logs are private and tied to their account.

---

## Mathematical Model

The exposure calculation is based on the **Exposure Value (EV)** logarithmic scale.

**Step 1 — Calculate EV100:**
The app extracts raw sensor data from the phone camera (aperture Ns, shutter speed ts, ISO Ss) and converts it into a standardised EV100 value (at ISO 100). This is an absolute measure of scene brightness — EV 15 corresponds to bright sunlight, EV 1–4 to dim artificial light.

**Step 2 — Apply film ISO:**
Once EV100 is known, the user's chosen film ISO is applied via the reciprocity law to calculate the correct aperture and shutter speed pair.

**Step 3 — Snapping to standard stops:**
The raw mathematical result (e.g. 1/487.3s) is snapped to the nearest standard photographic stop using a closest-value search algorithm across predefined arrays of standard apertures and shutter speeds.

**Exposure Ruler generation:**
The app generates a full array of aperture–shutter speed pairs for the current EV and ISO, so the UI can render the interactive ruler without any on-the-fly computation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile framework | React Native + Expo |
| Navigation | Expo Router |
| Language | TypeScript |
| Camera | expo-camera |
| Builds | EAS Build |
| Backend | Elysia (Bun) |
| Database | PostgreSQL |
| Infrastructure | Kubernetes + Terraform |
| Testing | Jest |

---

## Project Structure

```
lightmeter/
├── frontend/
│   ├── app/
│   │   ├── (app)/        # Authenticated routes (meter, log)
│   │   └── (auth)/       # Auth routes (login, signup)
│   ├── src/
│   │   ├── api/          # Backend API calls (notes, etc.)
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom hooks (useMeter, etc.)
│   │   ├── types/        # Shared types and constants (photoConstants.ts)
│   │   └── utils/        # Exposure math and API client
│   └── assets/
└── backend/
    └── src/
        ├── db/           # Drizzle schema and migrations
        ├── plugins/      # Auth plugin (JWT)
        └── v1/
            └── routes/   # auth, notes
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- Bun
- PostgreSQL (local install or Docker)
- Android device (camera access is not available on emulators)
- EAS CLI: `npm install -g eas-cli`
- ngrok: `brew install ngrok`

### Clone the repo

```bash
git clone https://github.com/TUES-2026-PBL-11-klas/lightmeter
cd lightmeter
```

### Backend setup

```bash
cd backend
bun install
```

Create a `.env` file in `backend/` (see `.env.example`):
```
DATABASE_URL=postgres://postgres@localhost:5432/lightmeter
JWT_SECRET=your_secret_here
NODE_ENV=development
REFRESH_TOKEN_EXPIRY_DAYS=30
```

Create the database and run migrations:
```bash
psql postgres -c "CREATE DATABASE lightmeter;"
DATABASE_URL=postgres://postgres@localhost:5432/lightmeter bunx drizzle-kit migrate
```

Start the backend:
```bash
bun run dev
```

### Expose backend via ngrok

In a separate terminal, start ngrok using your static domain:
```bash
ngrok http 3000 --domain=your-domain.ngrok-free.dev
```

### Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (see `.env.example`):
```
EXPO_PUBLIC_API_URL=https://your-domain.ngrok-free.dev/api/v1
```

### Development build (required for camera)

```bash
npx expo run:android
```

> A development build is required because `expo-camera` uses native modules. The Expo Go app is not sufficient.

### Start Metro (after build is installed)

```bash
npx expo start
```

---

## Team

| Name | Role |
|---|---|
| Dilyana Vasileva | Light meter feature |
| Nikol Ivanova | Photo logging feature |
| Kiril Rangelov | Database |
| Vladimir Demirev | Backend |
