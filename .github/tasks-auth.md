# Auth + State Tasks

## Goals

- Add login and register flows with persistent user state.
- Use TanStack Router for navigation and route protection.
- Centralize auth state in a Redux-like store (index.ts, actions.ts, types.ts) with persistence.

## Task List

1. Routing foundation (TanStack Router)

- Install TanStack Router and set up a root router with route files.
- Define routes: `/`, `/login`, `/register`, `/app` (protected shell), fallback 404.
- Add loader/redirect logic so authenticated users are sent to `/app` and unauthenticated users to `/login`.
- Wire a simple layout with header/footer placeholders and outlet.

2. Store scaffolding

- Create `src/store/` with `index.ts`, `actions.ts`, `types.ts`, and optionally `selectors.ts`.
- Define `User` shape (id, email, createdAt, token, etc.).
- Define auth state shape: `{ user: User | null, status: 'idle' | 'loading' | 'authenticated' | 'error', error?: string }`.
- Implement action types for login request/success/failure, logout, and register success.
- Implement reducers and a small helper to persist and rehydrate state (localStorage) for the `user` slice and token.
- Expose typed hooks for dispatch/select.

3. API client layer

- Add a lightweight fetch wrapper that reads `VITE_API_URL` and attaches `Authorization: Bearer <token>` when present.
- Implement `authApi.register(email, password)` and `authApi.login(email, password)`.
- Handle JSON errors consistently and surface friendly messages.

4. Auth flows

- Build `Login` and `Register` screens (form components) using existing design system.
- Form validation: required email/password, email format, min password length (e.g., 8).
- On submit: dispatch async thunk/promise action → call API → persist token + user → route to `/app`.
- Show loading state and inline error messages from the store.

5. Protected shell

- Create an auth guard that checks store state (rehydrated) and redirects to `/login` if missing token.
- Add a top-level `/app` layout with nav and an outlet; include a logout action that clears persisted state and returns to `/login`.

6. Persistence

- On app boot, attempt to read persisted auth data; validate shape; hydrate store before first render.
- Consider a "rehydrating" status to block protected routes until state is loaded.

7. UX polish

- Disable submit buttons while loading.
- Display success toast or inline message after register.
- Ensure focus/aria states for inputs and buttons.

8. Tests / checks

- Add unit tests for reducers and persistence helper.
- Add a basic integration test for redirect guard logic if test setup is available.

## Acceptance Criteria

- Navigating to `/app` while logged out redirects to `/login`.
- Successful login/register stores token+user in persisted state and routes to `/app`.
- Refreshing the page keeps the user authenticated.
- Logout clears persisted state and returns to `/login`.
- API base URL uses `VITE_API_URL`; no hardcoded localhost.
- Build passes: `pnpm -C client build`.
