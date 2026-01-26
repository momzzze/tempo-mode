# Pomodoro Implementation Tasks

## Goals

- Implement the Pomodoro experience with theme-aware UI (palette/mode + fog/solid layer).
- Track session state and persist progress between page reloads.
- Provide controls for start/pause/reset, session type switching, and stats surface.

## Task List

1. State model

- Define timer state shape: `{ phase: 'focus' | 'short-break' | 'long-break', remainingMs, isRunning, completedSessions, longBreakInterval }`.
- Add settings shape: focus length, short break length, long break length, long break cadence, sound on/off, auto-start options.
- Add actions/types for start, pause, reset, tick, change phase, and settings update.
- Store and rehydrate timer/settings in localStorage (or reuse global store infrastructure if shared).

2. Timer engine

- Create a tick loop using `requestAnimationFrame` or `setInterval` in a dedicated hook (e.g., `usePomodoroTimer`).
- Ensure drift correction by computing elapsed time from timestamps, not relying on interval count.
- Auto-switch phases when `remainingMs <= 0`; increment `completedSessions` and schedule long breaks per cadence.

3. UI composition

- Page route: `/app/pomodoro` registered in TanStack Router under the protected shell.
- Components: timer display, control buttons (start/pause, reset, skip), phase selector (focus/short/long), progress/status strip.
- Use existing design tokens and fog/solid layer awareness (CSS already present for timer/status strip).

4. Settings panel

- Form to adjust durations and behaviors; validate numeric ranges.
- Save updates to persistence and apply to the running session (reset if necessary).
- Include quick presets (e.g., classic 25/5/15, short 20/3/10).

5. Sounds/feedback (optional toggleable)

- Play a short chime on phase change; ensure user-controlled mute setting.
- Consider vibration support for mobile if available.

6. Stats surface

- Show session counts and total focus minutes for the current day.
- Keep in-memory counters and persist totals; optionally expose a simple history array for future charts.

7. UX polish

- Keyboard shortcuts: space to start/pause, `r` to reset, `s` to skip.
- Accessible focus states and aria labels on controls.
- Guard against double starts; disable controls during transitions.

8. Tests / checks

- Unit tests for the timer reducer/state transitions and phase progression logic.
- Build check: `pnpm -C client build`.

## Acceptance Criteria

- Timer runs accurately over minutes without drift; switching phases happens at zero.
- State persists across reloads (phase, remaining time, settings) unless reset.
- Protected route under `/app`; unauthenticated users redirected to `/login`.
- UI respects current palette/mode and fog/solid layer.
- Build passes: `pnpm -C client build`.
