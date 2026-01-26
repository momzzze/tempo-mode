export default function App() {
  return (
    <div className="pomodoro">
      {/* App Header */}
      <div className="app-header">
        <div className="app-logo">tempo-mode</div>
        <div className="app-status">
          <span>uptime: 4d 12h</span>
          <span>time: 14:32:18</span>
        </div>
      </div>

      <div className="divider">// POMODORO SESSION</div>

      <div className="pomodoro__layout">
        {/* Main Timer Card */}
        <div>
          <div className="timer-card timer--running">
            <div className="timer__digits">25:00</div>

            {/* Mode Selector */}
            <div className="timer__mode-selector">
              <div className="segmented">
                <button className="active">Focus</button>
                <button>Short</button>
                <button>Long</button>
              </div>
            </div>

            {/* Controls */}
            <div className="timer__controls">
              <button className="btn btn--primary">Start</button>
              <button className="btn">Pause</button>
              <button className="btn">Reset</button>
              <button className="btn">Skip</button>
            </div>

            {/* Task Input */}
            <div className="task-input-group">
              <label>Current Task</label>
              <input
                type="text"
                placeholder="Enter what you're working on..."
              />
            </div>
          </div>

          {/* Status Strip */}
          <div className="divider" style={{ marginTop: 'var(--space-6)' }}>
            // STATUS
          </div>
          <div className="status-strip">
            <div className="status-item">
              <div className="status-item__label">Streak</div>
              <div className="status-item__value">7</div>
            </div>
            <div className="status-item">
              <div className="status-item__label">Sessions</div>
              <div className="status-item__value">12</div>
            </div>
            <div className="status-item">
              <div className="status-item__label">Focus Min</div>
              <div className="status-item__value">300</div>
            </div>
            <div className="status-item">
              <div className="status-item__label">Breaks</div>
              <div className="status-item__value">11</div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="terminal-panel">
            <div className="terminal-panel__header">Terminal Log</div>
            <div className="terminal">
              <div className="terminal__line">READY</div>
              <div className="terminal__line--success">SESSION STARTED</div>
              <div className="terminal__line">FOCUS MODE ACTIVE</div>
              <div className="terminal__line--warn">60 SEC REMAINING</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
