# TempoMode Tasks Roadmap

Central tracker for small, verifiable tasks (Ralph Wiggum method). Use GitHub Issues for execution; this file is the roadmap and checklist.

## How We Work

- Create a GitHub Issue using the template: New Issue → “Task”.
- Each task is small, testable, and marked with checkboxes.
- Reference issues in commits (e.g., `Fix: auth register (#12)`), then close them when done.
- Keep statuses in the issue (not-started → in-progress → completed). This roadmap shows the bigger picture.

## Phase 1: Database Foundation

### Task 1.1: Install Database/Auth Dependencies (Issue)

- [x] `@types/pg`
- [x] `bcrypt` + `@types/bcrypt`
- [x] `jsonwebtoken` + `@types/jsonwebtoken`

### Task 1.2: DB Pool Query Function (Issue)

- [x] Add `query()` helper in `server/src/db/pool.ts`
  - Signature: `query<T>(sql: string, params?: any[]): Promise<QueryResult<T>>`
  - Logs failures via `pino` and rethrows
  - Centralizes DB access for all models/services

### Task 1.3: Initialize DB on Startup (Issue)

- [x] Keep `app.listen(...)` and log DB connectivity inside
  - On start: `Database connected` | `Database connection failed`
  - For dev, server can stay up but errors are clear in logs

### Task 1.4: Test DB Connection (Issue)

- [ ] Verify startup logs with configured `DATABASE_URL`
  - `.env` example: `DATABASE_URL=postgres://user:pass@localhost:5432/tempmode`
  - If using hosted PG with SSL, add `?sslmode=require`

---

## Phase 2: Database Schema (MVP - Pomodoro SaaS)

### Task 2.1: Create Core Tables (Issue)

- [x] Add schema SQL at `server/src/db/schema.sql`
- [x] Migration runner `server/src/db/migrate.ts`
- [ ] Run migration against dev DB
  - Ensure `pgcrypto` extension exists (for `gen_random_uuid()`)
  - Idempotency: `CREATE TABLE IF NOT EXISTS`
  - Indexes:
    - [ ] `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    - [ ] `CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)`
  - Future seeds: system modes/presets/audio sources

---

## Phase 3: Authentication System

### Task 3.1: Auth Routes Structure (Issue)

- [x] `server/src/routes/auth/index.ts` (login/register)
- [x] Mount under `/api/auth`

### Task 3.2: Auth Controller (Issue)

- [x] `server/src/controllers/authController.ts` (validate + orchestrate)
- Behavior:
  - Validate required fields; return `400` on missing
  - Return consistent JSON: `{ user }` or `{ token, user }`
  - Delegate business logic to service

### Task 3.3: Auth Service + Model (Issue)

- [x] `server/src/db/models/User.ts` (queries: find/create/exists)
- [x] `server/src/services/authService.ts` (bcrypt + JWT)
- [ ] Configure `JWT_SECRET` in `.env`
- [ ] Test register/login via Postman
- Details:
  - Hashing: `bcrypt` with `SALT_ROUNDS = 10`
  - JWT claims: `sub`, `email`, `plan`; expiry: `7d`
  - Errors: `409` (duplicate email), `401` (invalid creds), `500` if `JWT_SECRET` missing
  - Do not expose `password_hash` in responses (`toSafe()`)

---

## Phase 4: Protected Routes & Middleware (Future)

### Task 4.1: Auth Middleware (Issue)

- [ ] Verify JWT, attach `req.user`
- Details:
  - Read token from `Authorization: Bearer <token>`
  - On failure: `401 { error: { message: 'Unauthorized' } }`

### Task 4.2: Protect Session Routes (Issue)

- [ ] Apply middleware to session endpoints
- Details:
  - Only authenticated users can start/complete sessions

---

## Phase 5: Pomodoro Session Logic (Future)

### Task 5.1: Start Session Endpoint (Issue)

- [ ] Validate durations, enforce free plan
- [ ] Create session record
- Details:
  - Input: `{ planned_minutes, label? }`
  - Enforce daily free plan limit via `usage_limits`

### Task 5.2: Complete Session Endpoint (Issue)

- [ ] Mark completed, calculate minutes, update limits
- Details:
  - Input: `{ actual_minutes }`
  - Set `completed = true`, `ended_at = now()`

### Task 5.3: Free Plan Enforcement (Issue)

- [ ] Daily cycle limit for free users
- Details:
  - Rule (MVP): 1 cycle/day for `plan = 'free'`
  - Return `403 { error: { message: 'Daily limit exceeded' } }`

---

## Notes

- Minimal, composable tasks; each with its own Issue.
- Roadmap lives here; execution and status live in GitHub Issues.
- Use Postman collection for testing endpoints.
- Error format everywhere: `{ error: { message, code? } }`
- Logging: single-line request logs (method url status duration_ms), pino for app logs.
- ESM only in server; no CommonJS.
