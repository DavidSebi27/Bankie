# Bankie Frontend

Vue 3 + Vite + Pinia SPA for the Bankie school project. Customers can manage accounts, transfer money, and use a mock ATM. Employees can approve customers, set transfer limits, and view all transactions.

## Stack

- Vue 3 (`<script setup>`)
- Vite
- Pinia (state)
- Vue Router
- Axios
- Tailwind CSS + custom CSS
- `lucide-vue-next` icons

## Setup

```bash
npm install
```

Create a `.env.local` (already gitignored) pointing at the backend:

```
VITE_API_URL=https://bankieapi.onrender.com
```

For local backend development, use `http://localhost:8080` — but the dev server **must** run on port 5173 because the backend's CORS only whitelists that origin.

## Scripts

```bash
npm run dev      # dev server on http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the built dist/
```

## Deployment

Deployed to Netlify. The repo's `netlify.toml` configures the build command and an SPA fallback so deep links like `/atm` or `/dashboard` resolve through `vue-router` instead of 404ing.

`VITE_API_URL` must be set in Netlify's environment variables (Site configuration → Environment variables). After changing it, trigger **Clear cache and deploy site** — env vars are baked in at build time, so a regular re-deploy reuses the old bundle.

## Backend notes

- Cold start can take up to 2 minutes (Render free tier). The app pings `/actuator/health` on load and shows a banner if the response is slow.
- Backend uses in-memory H2 — every cold start wipes data. Register fresh users at the start of each demo.

## Project layout

```
src/
  api/         axios instance + per-domain API wrappers
  composables/ shared hooks (validation, format, list pagination)
  stores/      Pinia stores (auth, accounts, transactions, employee)
  views/       routed pages
    employee/  employee-only pages
  components/  reusable UI
  router/      routes + role-based guards
  assets/      styles, icons
```
