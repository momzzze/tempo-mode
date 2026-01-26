# TempoMode

Monorepo with an Express (TypeScript, ESM) API and a Vite + React + TypeScript frontend, managed via pnpm workspaces.

## Stack

- Server: Express, PostgreSQL (pg), pino, TypeScript (NodeNext ESM)
- Client: Vite, React, TypeScript, Tailwind, shadcn/ui, Redux Toolkit
- Tooling: pnpm workspaces

## Workspace Layout

```
tempo-mode/
├── client/   # Vite + React app
├── server/   # Express API
├── package.json
├── pnpm-workspace.yaml
└── TempoMode.postman_collection.json
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL 12+ (for API routes that hit the DB)

Install pnpm globally if needed:

```bash
npm install -g pnpm
```

## Setup

```bash
pnpm install
```

## Environment

Create `server/.env`:

```bash
PORT=8080
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tempo_mode
JWT_SECRET=replace-me
```

Create `client/.env` (Vite style):

```bash
VITE_API_URL=http://localhost:8080
```

## Development

- All apps: `pnpm dev` (runs `pnpm -r dev`)
- API only: `pnpm -C server dev`
- Client only: `pnpm -C client dev`

## Build

- All: `pnpm build`
- API: `pnpm -C server build`
- Client: `pnpm -C client build`

## API

- `GET /api/health` — DB connectivity check
- `POST /api/auth/register` — body `{ email, password }`
- `POST /api/auth/login` — body `{ email, password }`, returns JWT

**Note**: Authentication state is managed by Redux Toolkit without persistence. The JWT token and user data are stored in memory only and will be lost on page refresh.

## Postman

- Import `TempoMode.postman_collection.json`
- Set environment variable `base_url=http://localhost:8080`

## Frontend theming

- Palettes: green, amber, mono
- Modes: light and dark per palette
- Layer: fog vs. solid overlay toggle in the UI header

## Scripts reference

- Root: `pnpm dev`, `pnpm build`, `pnpm lint`
- Server: `pnpm -C server dev`, `pnpm -C server build`, `pnpm -C server start`
- Client: `pnpm -C client dev`, `pnpm -C client build`, `pnpm -C client preview`

## License

MIT
