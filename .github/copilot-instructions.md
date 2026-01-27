# Copilot Instructions — TempoMode Monorepo

This repository is a pnpm-workspace monorepo with two apps:

- `server/` (Node.js + Express + TypeScript, ESM)
- `client/` (Vite + React + TypeScript + Tailwind + shadcn/ui)

Follow these instructions exactly. Do not invent alternative structures.

---

## ✅ Checklist

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements
- [x] Scaffold the Project
- [x] Customize the Project
- [x] Install Required Extensions
- [x] Compile the Project
- [x] Create and Run Task
- [x] Launch the Project
- [ ] Ensure Documentation is Complete

---

## 1) Clarify Project Requirements

Project requirements are already specified. Do NOT ask follow-up questions unless absolutely required.

**✅ COMPLETED**: Monorepo, server, and client requirements confirmed and aligned.

Monorepo requirements:

- Use `pnpm` workspaces
- Root has `package.json` + `pnpm-workspace.yaml`
- Apps live in `client/` and `server/`

Server requirements:

- Express + TypeScript
- `type: "module"` (ESM), not CommonJS
- Has `src/` folder
- Architecture: `controllers/ services/ routes/ middlewares/ utils/`
- Postgres (use `pg`)
- Logger: `pino` with `pino-pretty` in `utils`
- Request logging middleware: ONE line output per request (method + url + status + response time). No fancy multi-line logs.

Client requirements:

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui

Mark this checklist item complete once aligned.

---

## 2) Scaffold the Project

### Root (pnpm workspace)

Create:

- `package.json` (private, workspaces scripts)
- `pnpm-workspace.yaml` with:
  - `packages: ["client", "server"]`

Root scripts:

- `pnpm -r dev` should run both apps in dev
- `pnpm -r build` should build both
- `pnpm -r lint` if lint exists

### Server scaffold

Location: `./server`

Must contain:

- `package.json` with:
  - `"type": "module"`
  - scripts: `dev`, `build`, `start`
- `tsconfig.json` configured for ESM NodeNext
- `src/` folder with:
  - `src/index.ts` (bootstrap)
  - `src/app.ts` (express app)
  - `src/routes/`
  - `src/controllers/`
  - `src/services/`
  - `src/middlewares/`
  - `src/utils/`
  - `src/db/` (Postgres pool + helpers)

### Client scaffold

Location: `./client`

Must be created using Vite (React + TS).
Then add Tailwind and shadcn/ui.

Do not create extra top-level folders besides `client/`, `server/`, and optional `.vscode/`.

**✅ COMPLETED**:

- Root `package.json` with workspace scripts (`pnpm -r dev`, `pnpm -r build`, `pnpm -r lint`)
- `pnpm-workspace.yaml` configured
- Server scaffold complete with all required folders and files
- Client folder exists (Vite scaffolded)
- No extra top-level folders created

---

## 3) Customize the Project (Server Rules)

### Server conventions

- Use ESM imports everywhere (no `require`)
- Prefer explicit file boundaries:
  - `controllers` only handle req/res and validation orchestration
  - `services` contain business logic
  - `db` contains pool and DB queries
  - `routes` only map routes → controller functions
  - `middlewares` only middleware
  - `utils` only shared helpers (including logger)

### Logger (required)

Create `src/utils/logger.ts` exporting a configured `pino` instance.
Use `pino-pretty` for dev output (transport).
Do not create multiple logger instances.

### Request logging middleware (required)

Create `src/middlewares/requestLogger.ts`:

- Must log one line per request.
- Format should include: METHOD URL STATUS DURATION_MS
- Do not log headers or bodies by default.

### Postgres (required)

Use `pg` with a pooled connection in `src/db/pool.ts`.
Read connection string from env:

- `DATABASE_URL`

Provide a simple `health` route that checks DB connectivity.

### Environment

Use `.env` for local dev (do not commit secrets).
Server should read:

- `PORT` (default 8080)
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (for JWT token signing)

**Environment Configuration**:

- `.env` file configured with all required variables
- Fixed: dotenv loading order (moved `import 'dotenv/config'` to pool.ts top)
- Server port: 8080
- Database: `postgres://postgres:postgres@localhost:5432/tempo_mode`

### Error handling

- Provide a centralized error middleware: `src/middlewares/errorHandler.ts`
- Keep responses consistent JSON:
  - `{ error: { message, code? } }`

**✅ COMPLETED**:

- Express app with middleware chain in [src/index.ts](server/src/index.ts)
- Logger (`pino` + `pino-pretty`) in [src/utils/logger.ts](server/src/utils/logger.ts)
- Request logging middleware in [src/middlewares/requestLogger.ts](server/src/middlewares/requestLogger.ts) (one-line format: METHOD URL STATUS DURATION_MS)
- Error handler middleware in [src/middlewares/errorHandler.ts](server/src/middlewares/errorHandler.ts)
- Postgres pool in [src/db/pool.ts](server/src/db/pool.ts) with `.env` configuration
- Health service and controller with DB connectivity check
- Health route at `GET /api/health`
- `.env` file configured with PORT=8080 and DATABASE_URL
- Database schema created: [src/db/schema.sql](server/src/db/schema.sql) with tables: `users`, `user_settings`, `sessions`, `usage_limits`
- Migration runner: [src/db/migrate.ts](server/src/db/migrate.ts) (run via `pnpm run db:migrate`)
- User model: [src/db/models/User.ts](server/src/db/models/User.ts) with methods: `findByEmail()`, `create()`, `existsByEmail()`, `toSafe()`
- Auth service: [src/services/authService.ts](server/src/services/authService.ts) with `registerUser()` and `loginUser()`
- Auth controller: [src/controllers/authController.ts](server/src/controllers/authController.ts) with `register()` and `login()` handlers
- Auth routes at `/api/auth/register` and `/api/auth/login`
- Issues fixed: UTF-8 BOM in schema.sql, duplicate bcrypt import, dotenv loading order, TypeScript strictNullChecks

---

## 4) Customize the Project (Client Rules)

### Client conventions

- React + TypeScript (Vite scaffold).
- Tailwind + shadcn/ui allowed; keep components reusable.
- Do not hardcode backend URLs; use `VITE_API_URL`.

### Current timer implementation (do not regress)

- Modes: only `focus` and `break` (no long break).
- Auto-transition focus ↔ break; respects `autoStart` toggle.
- Timer state persisted to `localStorage` (mode, seconds, running flag, task, stats).
- Settings live in Redux `timerSettings` slice and drive the timer (durations, toggles, triggers for complete/restart/add time).
- Settings menu is attached to the timer card (3 dots shown on hover), dark transparent dropdown with arrow, slim underlined inputs for minutes.
- Controls: Start/Pause only (no Reset). Keep hover-reveal for the settings trigger.

If updating UI, keep the settings dropdown under the trigger (not in the navbar) and preserve the dark translucent styling with arrow.

---

## 5) Install Required Extensions

Do not install extensions unless explicitly required by the environment setup tool.
If none are required, mark this step complete.

**✅ COMPLETED**: No extensions required for current setup.

---

## 6) Compile the Project

- Install deps with `pnpm install` at repo root.
- Ensure:
  - `pnpm -C server build` succeeds
  - `pnpm -C client build` succeeds
- Fix any TypeScript/ESM issues properly (do not switch to CommonJS).

**✅ COMPLETED**: Both builds succeed with no TypeScript errors.

---

## 7) Create and Run Task (VS Code)

Only create `.vscode/tasks.json` if necessary.
If created, tasks should run:

- `pnpm -r dev`

**✅ COMPLETED**: Server runs via `pnpm -C server dev` with nodemon watching.

---

## 8) Launch the Project

Do not launch unless user confirms.
If launching, use:

- `pnpm -r dev`
  Client and server should run concurrently.

**✅ COMPLETED**: Server running on port 8080 with database connected.

---

## 9) Ensure Documentation is Complete

- Ensure `README.md` exists and reflects:
  - pnpm workspace usage
  - how to run dev/build
  - env vars required
- Ensure this file exists: `.github/copilot-instructions.md`
- Remove all HTML comments from documentation files if present.

Mark this checklist item complete when docs are consistent and current.

---

## Development Rules (Strict)

- Use current directory `.` as the project root.
- Do not add unrelated libraries.
- Do not add Docker, CI, or deployment unless explicitly requested.
- Avoid verbose explanations; keep changes precise and minimal.
- Keep folder structure exactly as specified.
- Prefer small, composable functions.
- Never introduce CommonJS in the server.

## 10) Postman Collection

A Postman collection is available for testing the API: `TempoMode.postman_collection.json`

To import:

1. Open Postman
2. Click **Import**
3. Select the `TempoMode.postman_collection.json` file
4. Set environment variable: `base_url=http://localhost:8080`

Current endpoints:

- `GET /api/health` - Server health & DB connectivity check
- `POST /api/auth/register` - Register new user (body: `{email, password}`)
- `POST /api/auth/login` - Login with credentials (body: `{email, password}`)

**Auth Flow**:

1. Register returns user object (no password)
2. Login returns JWT token (7 day expiry) and user object
3. Token saved to `jwt_token` environment variable automatically via test scripts
4. Use token in `Authorization: Bearer {{jwt_token}}` header for protected routes

**Error Codes**:

- `400` - Missing required fields
- `401` - Invalid credentials
- `409` - Email already exists
- `500` - Server error (JWT_SECRET missing, etc.)
