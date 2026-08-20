# Lead Management System (React + Vite)

Converted from Next.js (App Router) to React + Vite.

## Why there's a `server/` folder

Vite is a frontend build tool only — it has no equivalent of Next.js API routes.
The original `app/api/lead/route.js` handler (with the same Mongoose `Lead`
model and `dbConnect` logic) has been moved into a small Express server in
`server/`, so the API behavior is unchanged. The React frontend still calls
`/api/lead` exactly as before.

## Setup

```bash
npm install
```

`.env` already contains the same `MONGODB_URI` used by the original project.

## Run in development

You need two processes running:

```bash
# Terminal 1 - API server (http://localhost:5000)
npm run server

# Terminal 2 - Vite dev server (http://localhost:3000)
npm run dev
```

Vite is configured to proxy `/api/*` requests to the Express server (see
`vite.config.js`), so the frontend fetch calls (`/api/lead`) work unchanged.

## Build for production

```bash
npm run build      # outputs static frontend to dist/
npm run start       # runs the Express API server
```

Serve `dist/` with any static host, or add `express.static` to `server/index.js`
to serve the built frontend from the same server.
