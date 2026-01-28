import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TimerStyle = 'classic';

interface PomodoroSettingsProps {
  onComplete: () => void;
  onRestart: () => void;
  onAddTime: () => void;
  focusDuration: number;
  breakDuration: number;
  onFocusChange: (mins: number) => void;
  onBreakChange: (mins: number) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  autoStart: boolean;
  onAutoStartToggle: () => void;
  hideSeconds: boolean;
  onHideSecondsToggle: () => void;
  notifications: boolean;
  onNotificationsToggle: () => void;
  timerStyle?: TimerStyle;
  onStyleChange?: (style: TimerStyle) => void;
  secondsLeft?: number;
  totalSeconds?: number;
}

export function PomodoroSettings({
  onComplete,
  onRestart,
  onAddTime,
  focusDuration,
  breakDuration,
  onFocusChange,
  onBreakChange,
  soundEnabled,
  onSoundToggle,
  autoStart,
  onAutoStartToggle,
  hideSeconds,
  onHideSecondsToggle,
  notifications,
  onNotificationsToggle,
  timerStyle,
  onStyleChange,
  secondsLeft = 0,
  totalSeconds = 1,
}: PomodoroSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--neon-400)] !hover:text-[var(--neon-200)] !hover:bg-[var(--neon-400)]/10"
        title="Timer settings"
      >
        <MoreVertical size={20} />
      </Button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            minWidth: '280px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-outer)',
            borderRadius: 'var(--radius-sm)',
            zIndex: 100,
            padding: 'var(--space-2)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--gray-500)',
              marginBottom: 'var(--space-2)',
              textTransform: 'uppercase',
              letterSpacing: 'var(--letter-ui)',
            }}
          >
            Settings
          </div>

          <div
            style={{
              marginBottom: 'var(--space-2)',
              display: 'flex',
              gap: 'var(--space-1)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                flex: 1,
                height: '4px',
                background: 'var(--surface-2)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, var(--neon-400), var(--neon-300))`,
                  width: `${Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100))}%`,
                  transition: 'width 0.3s ease-out',
                  borderRadius: '2px',
                  boxShadow: '0 0 8px rgba(52, 211, 153, 0.6)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--gray-500)',
                minWidth: '28px',
              }}
            >
              {Math.ceil(secondsLeft / 60)}m
            </span>
          </div>

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <button
              style={{
                width: '100%',
                padding: 'var(--space-1) var(--space-2)',
                fontSize: 'var(--font-size-xs)',
                background: 'var(--surface-2)',
                color: 'var(--gray-400)',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-out',
                textAlign: 'left',
              }}
              onClick={() => {
                onComplete();
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gray-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--gray-400)';
              }}
            >
              Complete timer
            </button>
            <button
              style={{
                width: '100%',
                padding: 'var(--space-1) var(--space-2)',
                fontSize: 'var(--font-size-xs)',
                background: 'var(--surface-2)',
                color: 'var(--gray-400)',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-out',
                textAlign: 'left',
                marginTop: 'var(--space-1)',
              }}
              onClick={() => {
                onRestart();
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gray-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--gray-400)';
              }}
            >
              Restart timer
            </button>
            <button
              style={{
                width: '100%',
                padding: 'var(--space-1) var(--space-2)',
                fontSize: 'var(--font-size-xs)',
                background: 'var(--surface-2)',
                color: 'var(--gray-400)',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'all 0.15s ease-out',
                textAlign: 'left',
                marginTop: 'var(--space-1)',
              }}
              onClick={() => {
                onAddTime();
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--gray-300)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--gray-400)';
              }}
            >
              + Add 10 minutes
            </button>
          </div>

          <div
            style={{
              height: '1px',
              background: 'var(--border-inner)',
              marginBottom: 'var(--space-2)',
            }}
          />

          <div style={{ marginBottom: 'var(--space-2)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
              }}
            >
              <Label
                style={{
                  flex: 1,
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gray-400)',
                }}
              >
                Focus
              </Label>
              <Input
                type="number"
                min={1}
                max={120}
                value={focusDuration}
                onChange={(e) => onFocusChange(Number(e.target.value))}
                style={{
                  width: '60px',
                  textAlign: 'right',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-outer)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gray-400)',
                  padding: 'var(--space-1)',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gray-500)',
                }}
              >
                min
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <Label
                style={{
                  flex: 1,
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gray-400)',
                }}
              >
                Break
              </Label>
              <Input
                type="number"
                min={1}
                max={60}
                value={breakDuration}
                onChange={(e) => onBreakChange(Number(e.target.value))}
                style={{
                  width: '60px',
                  textAlign: 'right',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-outer)',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gray-400)',
                  padding: 'var(--space-1)',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--gray-500)',
                }}
              >
                min
              </span>
            </div>
          </div>

          <div
            style={{
              height: '1px',
              background: 'var(--border-inner)',
              marginBottom: 'var(--space-2)',
            }}
          />

          <div>
            {[
              {
                label: 'Timer sound effects',
                enabled: soundEnabled,
                onToggle: onSoundToggle,
              },
              {
                label: 'Auto-start timers',
                enabled: autoStart,
                onToggle: onAutoStartToggle,
              },
              {
                label: 'Hide seconds',
                enabled: hideSeconds,
                onToggle: onHideSecondsToggle,
              },
              {
                label: 'Browser notifications',
                enabled: notifications,
                onToggle: onNotificationsToggle,
              },
            ].map((item, idx) => (
              <button
                key={item.label}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-1) var(--space-2)',
                  fontSize: 'var(--font-size-xs)',
                  background: 'var(--surface-2)',
                  color: 'var(--gray-400)',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-out',
                  marginTop: idx > 0 ? 'var(--space-1)' : 0,
                }}
                onClick={() => {
                  item.onToggle();
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--gray-300)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--gray-400)';
                }}
                aria-pressed={item.enabled}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    height: '16px',
                    width: '28px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-outer)',
                    background: item.enabled
                      ? 'var(--neon-400)'
                      : 'var(--surface-3)',
                    transition: 'all 0.15s ease-out',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: item.enabled ? 'flex-end' : 'flex-start',
                    padding: '2px',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: item.enabled
                        ? 'var(--gray-900)'
                        : 'var(--gray-500)',
                    }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
