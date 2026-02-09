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
- [x] Ensure Documentation is Complete
- [x] Client Implementation Details (Timer, Sound, State, localStorage Persistence)

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

### Server Project Structure

**Core Files** (`src/`):

- `index.ts` - Bootstrap, middleware chain setup
- `app.ts` - Optional: Express app factory (if using)
- `routes/` - Route definitions
  - `index.ts` - Main router mounter
  - `auth/` folder - Auth routes (register, login)
  - `sessions/` folder - Session routes
  - `tasks/` folder - Task routes
- `controllers/` - Request handlers
  - `authController.ts` - Auth endpoints (register, login)
  - `healthController.ts` - Health check
  - `sessionController.ts` - Session management
  - `taskController.ts` - Task operations
- `services/` - Business logic
  - `authService.ts` - Registration, login, validation
  - `healthService.ts` - DB health check
  - `sessionService.ts` - Session logic
  - `taskService.ts` - Task CRUD operations
- `middlewares/` - Express middleware
  - `requestLogger.ts` - One-line request logging (METHOD URL STATUS DURATION_MS)
  - `errorHandler.ts` - Centralized error handling
  - `auth.ts` - JWT verification middleware
  - `rateLimiter.ts` - Rate limiting per endpoint
- `db/` - Database layer
  - `pool.ts` - PostgreSQL connection pool with .env loading
  - `schema.sql` - Initial schema (users, sessions, tasks, usage_limits tables)
  - `migrate.ts` - Migration runner
  - `models/` - Data models
    - `User.ts` - User model with methods: `findByEmail()`, `create()`, `existsByEmail()`, `toSafe()`
- `utils/` - Shared helpers
  - `logger.ts` - Pino logger instance (pino + pino-pretty)

### Database Design

**Schema Tables**:

1. **users** table
   - `id` - UUID primary key
   - `email` - Text, unique
   - `password_hash` - Bcrypt hashed password
   - `created_at` - Timestamp
   - `updated_at` - Timestamp

2. **user_settings** table
   - `user_id` - FK to users.id
   - `focus_duration` - Integer (minutes, default 25)
   - `break_duration` - Integer (minutes, default 5)
   - `sound_enabled` - Boolean (default true)
   - `notifications_enabled` - Boolean (default true)

3. **sessions** table
   - `id` - UUID primary key
   - `user_id` - FK to users.id
   - `task_id` - FK to tasks.id (nullable)
   - `mode` - Enum: 'focus' | 'break'
   - `duration_minutes` - Integer
   - `completed_at` - Timestamp (nullable, null if in-progress)
   - `created_at` - Timestamp

4. **tasks** table
   - `id` - UUID primary key
   - `user_id` - FK to users.id
   - `title` - Text
   - `description` - Text (nullable)
   - `completed` - Boolean (default false)
   - `created_at` - Timestamp
   - `updated_at` - Timestamp

### Logger Configuration

**File**: `src/utils/logger.ts`

- Uses `pino` with `pino-pretty` transport (dev)
- Single logger instance, exported as default
- Format: Clean, colorized output for development
- No multiple logger instances allowed

Example usage:

```typescript
import logger from './utils/logger.ts';
logger.info({ user: 123 }, 'User action');
logger.error({ err }, 'Error occurred');
```

### Request Logging Middleware

**File**: `src/middlewares/requestLogger.ts`

- One line per request
- Format: `METHOD URL STATUS DURATION_MS`
- Example: `GET /api/health 200 2.5ms`
- Do not log request bodies or headers by default

### Postgres Configuration

**Connection Pool** (`src/db/pool.ts`):

- Uses `pg.Pool` with environment variables
- Reads from `.env`: `DATABASE_URL`
- Format: `postgres://user:password@host:port/dbname`
- Health check available via `pool.query('SELECT 1')`

### Authentication & JWT

**Auth Flow**:

1. **Register** (`POST /api/auth/register`)
   - Body: `{email, password}`
   - Returns: User object (no password field)
   - Errors: 400 (missing fields), 409 (email exists), 500 (server error)

2. **Login** (`POST /api/auth/login`)
   - Body: `{email, password}`
   - Returns: `{user: {...}, token: "JWT..."}`
   - Token expiry: 7 days
   - Error: 401 (invalid credentials), 500 (JWT_SECRET missing)

3. **Protected Routes**
   - Header: `Authorization: Bearer {{jwt_token}}`
   - Middleware validates JWT, attaches user to `req.user`
   - Errors: 401 (missing/invalid token), 403 (expired)

**JWT Configuration**:

- Secret: Read from `.env` → `JWT_SECRET`
- Algorithm: HS256 (default)
- Payload: `{userId, email, iat, exp}`

### Error Handling Middleware

**File**: `src/middlewares/errorHandler.ts`

- Catches all errors, formats response
- Format: `{error: {message: string, code?: string}}`
- Status codes:
  - 400 - Bad request (validation)
  - 401 - Unauthorized (auth failed)
  - 403 - Forbidden (no permission)
  - 404 - Not found
  - 409 - Conflict (e.g., email exists)
  - 500 - Server error

### Environment Variables

**Required** (in `.env`):

```
PORT=8080                                                           # Server port
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tempo_mode # DB connection
JWT_SECRET=your-secret-key-here                                    # JWT signing key
```

**Optional**:

```
NODE_ENV=development  # development | production
LOG_LEVEL=info        # debug | info | warn | error
```

### API Response Format

All responses should follow this format:

**Success**:

```json
{
  "data": { ... },
  "status": 200
}
```

**Error**:

```json
{
  "error": {
    "message": "Description of error",
    "code": "ERROR_CODE" // optional
  },
  "status": 400
}
```

### Development Scripts

```bash
pnpm -C server dev       # Run with nodemon (watches for changes)
pnpm -C server build     # Compile TypeScript to dist/
pnpm -C server start     # Run compiled code
pnpm -C server db:migrate # Run database migrations
```

**Completed Server Implementation**:

- ✅ Express app with full middleware chain
- ✅ PostgreSQL pool with connection management
- ✅ Bcrypt password hashing (user registration)
- ✅ JWT authentication (7-day expiry)
- ✅ Request logging (one-line format)
- ✅ Error handling middleware
- ✅ User model with DB methods
- ✅ Auth service (registration, login validation)
- ✅ Health endpoint with DB connectivity check
- ✅ Database schema (users, sessions, tasks, user_settings)
- ✅ Migration runner for schema updates
- ✅ Postman collection for API testing

---

## 4) Customize the Project (Client Rules)

### Client conventions

- React + TypeScript (Vite scaffold).
- Tailwind + shadcn/ui allowed; keep components reusable.
- Do not hardcode backend URLs; use `VITE_API_URL`.

### Project structure

**Main App Architecture** (`src/`):

- `pages/` - Full page components
  - `AppShell.tsx` - Main timer controller, sound management, state orchestration ⭐**CORE**
  - `Home.tsx` - Dashboard, tasks, stats
  - `Login.tsx` / `Register.tsx` - Auth pages
  - `Statistics.tsx` - User stats and analytics
- `components/` - Reusable UI components
  - `PomodoroTimer.tsx` - Timer display and controls
  - `PomodoroSettings.tsx` - Settings modal/dropdown (durations, toggles)
  - `SoundscapePlayer.tsx` - Ambient sound control UI
  - `TaskPanel.tsx` - Task management
  - `Clock.tsx` - Analog clock display
  - `ThemeDropdown.tsx` - Theme switcher
  - `ToastProvider.tsx` / `toast.ts` - Notification system
  - `sounds/` - Soundscape UI components
- `store/` - Redux state management
  - `index.tsx` - Redux store setup with localStorage middleware
  - `timerState.ts` - Timer Redux slice
  - `timerSettings.ts` - Settings Redux slice
  - `user/` - User auth state
- `services/` - API & external service calls
  - `authService.ts` - Auth API calls
  - `pexelsService.ts` - Background image service
- `api/` - API client functions
  - `client.ts` - Axios instance setup
  - `auth.ts` - Authentication endpoints
  - `tasks.ts` - Task endpoints
- `audio/` - Sound/soundscape system
  - `SoundscapeEngine.ts` - Web Audio API soundscape generation
  - `AudioBufferCache.ts` - Audio caching system
  - `TrackPlayer.ts` - Individual track playback
  - `SoundscapePlayer.ts` - Soundscape controller
  - `ThunderScheduler.ts` - Thunder sound scheduling
  - `soundscapes.ts` - Soundscape definitions
- `hooks/` - Custom React hooks
  - `useSoundscapeEngine.ts` - Soundscape engine integration
  - `useTask.ts` - Task management hook
- `theme/` - Theme system
  - `useTheme.ts` - Dark/light mode hook
- `styles/` - CSS modules and globals
- `utils/` - Helper functions

**Redux State Shape**:

```typescript
{
  timerState: {
    mode: 'focus' | 'break',
    secondsLeft: number,
    isRunning: boolean,
    timestamp?: number, // When timer started (for elapsed calc on refresh)
  },
  timerSettings: {
    focusDuration: number, // minutes
    breakDuration: number, // minutes
    soundEnabled: boolean,
    notificationsEnabled: boolean,
    hideSeconds: boolean,
    rainfallVolume: number,
  },
  user: {
    id?: string,
    email?: string,
    // ... other user fields
  }
}
```

**localStorage Keys**:

- `tempo-mode-timer-state` - Persists: mode, secondsLeft, isRunning, timestamp, task
- `tempo-mode-timer-settings` - Persists: durations, toggles, volumes
- `tempo-mode-auth` - Persists: JWT token (validated as JWT format)

### Timer Implementation (Do NOT regress)

**Core Features**:

- Modes: `focus` and `break` only (no long break)
- **Auto-cycling**: When focus completes → auto-start break; when break completes → auto-start focus
- **Persistence**: Timer state saved to localStorage every second
  - Includes: mode, secondsLeft, isRunning, timestamp
  - Used to calculate elapsed time on page refresh
- **Auto-continue**: If page refreshed while timer running:
  - Calculates elapsed time: `Date.now() - timestamp`
  - Deducts from secondsLeft: `Math.max(0, secondsLeft - elapsed)`
  - Resumes automatically in running state
- **Controls**: Start/Pause buttons only (no Reset)
  - Start: Calls `unlockSound()` (browser autoplay policy requirement), then starts timer
  - Pause: Calls `unlockSound()`, then pauses, state persists

**Settings & Behavior** (controlled by Redux `timerSettings`):

- Duration sliders: Focus (5-60 min), Break (1-30 min)
- Toggles: Sound enabled, Notifications enabled, Hide seconds
- Settings dropdown: Attached to timer card (3-dot icon), opens on hover
- Styling: Dark semi-transparent background, arrow pointing to trigger, slim underlined inputs
- Sound volume: Separate slider for ambient soundscape (rainfall, etc.)

**Sound System**:

- Completion beep: Plays when session ends (if soundEnabled)
- Ambient soundscape: Rainfall, thunder, etc. (optional, controlled by volume)
- **Audio Unlock Mechanism** (browser autoplay policy compliance):
  - **Problem**: Browser blocks audio playback without user gesture
  - **Solution - Fix 1**: `unlockSound()` called on Start/Pause click
    - Plays silent audio (0.0001 volume) then immediately pauses
    - Unlocks audio context for subsequent playback
  - **Solution - Fix 2**: Modal overlay if timer running but audio locked
    - Shows message: "Sound is blocked after refresh. Tap once to enable alerts..."
    - Button: "Enable sound" - user clicks to call `unlockSound()`
    - Cleared once sound unlocked
  - **Queuing**: If completion fires while locked, queues sound; plays when unlocked

### Settings Menu Styling (MUST preserve)

Settings dropdown when open:

```
- Position: Below/aligned to 3-dot trigger
- Background: Solid dark with transparency (rgba(0,0,0,0.8))
- Border: Subtle white/gray border outline
- Arrow: White/light colored arrow pointing to trigger
- Text inputs: Slim, underlined style, light text
- No padding/margin surprises - keep compact
```

Do NOT move settings to navbar or change styling without explicit request.

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

## 9) Client Implementation Details (Recent Builds & Fixes)

### Timer State Management (Redux)

**File**: `client/src/store/timerState.ts`

- Slice: `timerState`
- State shape:
  ```typescript
  {
    mode: 'focus' | 'break',
    secondsLeft: number,
    isRunning: boolean,
    timestamp?: number // Date.now() when timer started
  }
  ```
- **Key Reducer**: `loadInitialState()`
  - Runs on app boot
  - Checks localStorage for saved state
  - **Calculates elapsed time** if timer was running:
    ```typescript
    if (state.isRunning && state.timestamp) {
      const elapsed = Math.floor((Date.now() - state.timestamp) / 1000);
      state.secondsLeft = Math.max(0, state.secondsLeft - elapsed);
    }
    ```
  - This allows timer to **continue from where it was** after page refresh
  - If timer ran out while page was closed, sets `isRunning = false`
- Reducers: `startTimer`, `pauseTimer`, `setSecondsLeft`, `setMode` all update `timestamp`

### Timer Settings (Redux)

**File**: `client/src/store/timerSettings.ts`

- Slice: `timerSettings`
- State shape:
  ```typescript
  {
    focusDuration: number,      // minutes (5-60)
    breakDuration: number,      // minutes (1-30)
    soundEnabled: boolean,
    notificationsEnabled: boolean,
    hideSeconds: boolean,
    rainfallVolume: number      // 0.0-1.0
  }
  ```
- Persisted to localStorage automatically via middleware

### Redux Store Setup

**File**: `client/src/store/index.tsx`

- Combines slices: `timerState`, `timerSettings`, `user`
- **localStorage Middleware** (custom middleware added):
  - Saves state to `tempo-mode-timer-state`, `tempo-mode-timer-settings` every second
  - **Token Validation** for `tempo-mode-auth`:
    - Must start with `eyJ` (valid JWT format)
    - Auto-detects & removes corrupted nested JSON tokens (old bug)
  - `isRehydrating` flag prevents double-saves on startup
  - All saves logged for debugging
  - **Fixed bug**: Was double-rehydrating (both App.tsx and main.tsx), caused token corruption

### AppShell Component (Main Timer Engine)

**File**: `client/src/pages/AppShell.tsx` ⭐ **CORE COMPONENT**

**Purpose**: Central orchestrator for timer loop, sound management, UI controls.

**Key State**:

```typescript
const [soundUnlocked, setSoundUnlocked] = React.useState(false);
// Tracks if audio context has been unlocked via user gesture
```

**Timer Loop**:

- Uses `setTimeout` (not setInterval) to avoid stale closures
- Dispatches Redux action every 1000ms: `dispatch(setSecondsLeft(newValue))`
- Auto-transitions: When `secondsLeft === 0`:
  - Plays completion sound (if `soundEnabled`)
  - Switches mode: focus → break, then break → focus
  - Auto-starts next session (always enabled, no toggle)
- Cleanup: Clears timeout on unmount/dependency change

**Startup Behavior**:

- `isInitialMount` ref: Skips first duration effect to preserve localStorage state
- Duration effect: **Does NOT include** `isRunning` in dependencies (prevents reset on pause)
- This ensures: refresh → resume with correct elapsed time

**Sound Unlock System** (Browser Autoplay Policy Compliance):

**Fix 1: Click-Based Unlock**

```typescript
const unlockSound = async (): Promise<boolean> => {
  const audio = new Audio(); // Temporary audio element
  audio.volume = 0.0001; // Silent
  await audio.play(); // Trigger browser to unlock
  audio.pause();
  setSoundUnlocked(true);

  // If completion fired while locked, play it now
  if (pendingCompletionRef.current && soundEnabled) {
    playCompletionSound(audioRef.current);
    pendingCompletionRef.current = false;
  }
  return true;
};
```

- Called on `handleStart()` click
- Called on `handlePause()` click
- Triggers browser to allow audio playback for rest of session

**Fix 2: Modal Overlay**

```tsx
{
  isRunning && soundEnabled && !soundUnlocked && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="rounded-xl border border-white/10 bg-black/80 p-6 max-w-sm">
        <div className="text-sm mb-4 opacity-90">
          Sound is blocked after refresh. Tap once to enable alerts...
        </div>
        <button onClick={unlockSound} className="...">
          Enable sound
        </button>
      </div>
    </div>
  );
}
```

- Shows when: timer is running, sound enabled, but audio hasn't been unlocked
- Forces user gesture: user must click "Enable sound"
- Critical for: timer running at page refresh (browser blocks audio)

**Sound Queuing** (if completion fires while locked):

```typescript
const pendingCompletionRef = useRef(false);

// In completion handler:
if (!soundUnlocked && soundEnabled) {
  pendingCompletionRef.current = true; // Queue it
} else if (soundEnabled) {
  playCompletionSound(audioRef.current); // Play immediately
}

// In unlockSound():
if (pendingCompletionRef.current && soundEnabled) {
  playCompletionSound(audioRef.current); // Play queued sound
}
```

**Completion Sound**:

- Played when `secondsLeft === 0` and `soundEnabled === true`
- Uses Web Audio API for beep: frequency 800Hz, 200ms duration
- Optional: skipped if sound is locked (queued instead)

### SoundscapePlayer Component

**File**: `client/src/components/SoundscapePlayer.tsx`

**Purpose**: Ambient soundscape UI and playback (rainfall, thunder, etc).

**Props**:

```typescript
interface Props {
  soundUnlocked: boolean; // From AppShell
  soundEnabled: boolean;
}
```

**Sound Lock Handling**:

```typescript
useEffect(() => {
  if (!soundUnlocked) {
    if (audio) {
      audio.pause(); // Don't play if locked
    }
    return;
  }

  // Only actually play audio if unlocked
  if (audio && isPlaying && soundEnabled) {
    audio.play().catch(() => {
      // Handle possible async errors
    });
  }
}, [soundUnlocked, isPlaying, soundEnabled]);
```

- Dependency array includes `soundUnlocked` so it retries when user unlocks
- Blocks `audio.play()` if `!soundUnlocked`
- Volume persisted in Redux (rainfallVolume)

### localStorage Persistence Strategy

**Three Keys** (persisted automatically by Redux middleware):

1. **`tempo-mode-timer-state`**
   - `{mode, secondsLeft, isRunning, timestamp}`
   - Updated every 1 second
   - Timestamp used to calculate elapsed time on refresh

2. **`tempo-mode-timer-settings`**
   - `{focusDuration, breakDuration, soundEnabled, notificationsEnabled, hideSeconds, rainfallVolume}`
   - Updated on every change
   - Survives across browser sessions

3. **`tempo-mode-auth`**
   - JWT token (string, must start with `eyJ`)
   - Validated on load
   - Auto-cleaned if corrupted (nested JSON detection)

**Bug Fix**: Token was being corrupted by duplicate rehydration calls. Fixed by removing rehydration from App.tsx, keeping only in main.tsx.

### Debug Logging

**Locations**:

- `timerState.ts`: Logs state loading, reducer calls, elapsed time calculation
- `store/index.tsx`: Logs wallet saves, token validation, rehydration
- `AppShell.tsx`: Logs timer loop ticks, sound unlock calls

**Format**: Prefixed with emoji for quick visual scanning (📋, 🔊, 🔐, ⏱)

---

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
