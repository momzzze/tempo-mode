import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import './PomodoroSettings.css';

type TimerStyle = 'classic' | 'halo';

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
  // Reserved for future timer style switching
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

  // timerStyle,

  // onStyleChange,
  // secondsLeft = 0,
  // totalSeconds = 1,
}: PomodoroSettingsProps) {
  // Reserved for future timer style switching
  // void timerStyle;
  // void onStyleChange;

  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // const menuHeight = 400; // Approximate menu height
      const menuWidth = 280;

      const positioning: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      } = {};

      // Position to the right of the button
      const rightPos = window.innerWidth - rect.right + 38; // 8px gap from button

      // Check if menu would go off right edge, adjust left if needed
      if (window.innerWidth - rect.right + 8 + menuWidth > window.innerWidth) {
        positioning.left = rect.left - menuWidth - 8; // Position to the left instead
      } else {
        positioning.right = rightPos;
      }

      // Position slightly above the button (vertically centered to button area)
      positioning.top = rect.top - 50; // Slightly above the button

      setMenuPos(positioning);
    }
    setIsOpen(!isOpen);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || 'auto';
    }

    return () => {
      document.body.style.overflow = originalOverflow || 'auto';
    };
  }, [isOpen]);

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
    <div ref={menuRef}>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        onClick={handleMenuToggle}
        className="!text-white/80 hover:!text-white hover:!bg-white/10 [&_svg]:!text-white/80 [&_svg]:hover:!text-white"
        title="Timer settings"
      >
        <MoreVertical size={20} />
      </Button>

      {isOpen &&
        createPortal(
          <div
            className="pomodoro-settings__menu"
            style={{
              top: menuPos.top !== undefined ? `${menuPos.top}px` : 'auto',
              bottom:
                menuPos.bottom !== undefined ? `${menuPos.bottom}px` : 'auto',
              left: menuPos.left !== undefined ? `${menuPos.left}px` : 'auto',
              right:
                menuPos.right !== undefined ? `${menuPos.right}px` : 'auto',
            }}
            ref={menuRef}
          >
            <div className="pomodoro-settings__section-title">Session Menu</div>

            <div className="pomodoro-settings__actions">
              <button
                className="pomodoro-settings__button"
                onClick={() => {
                  onComplete();
                  setIsOpen(false);
                }}
              >
                Complete timer
              </button>
              <button
                className="pomodoro-settings__button"
                onClick={() => {
                  onRestart();
                  setIsOpen(false);
                }}
              >
                Restart timer
              </button>
              <button
                className="pomodoro-settings__button"
                onClick={() => {
                  onAddTime();
                  setIsOpen(false);
                }}
              >
                + Add 10 minutes
              </button>
            </div>

            <div className="pomodoro-settings__divider" />

            <div className="pomodoro-settings__durations">
              <div className="pomodoro-settings__duration-row">
                <Label className="pomodoro-settings__duration-label">
                  Focus
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={String(focusDuration)}
                  onChange={(e) => onFocusChange(Number(e.target.value))}
                  className="pomodoro-settings__duration-input"
                />
                <span className="pomodoro-settings__duration-unit">min</span>
              </div>

              <div className="pomodoro-settings__duration-row">
                <Label className="pomodoro-settings__duration-label">
                  Break
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={60}
                  value={String(breakDuration)}
                  onChange={(e) => onBreakChange(Number(e.target.value))}
                  className="pomodoro-settings__duration-input"
                />
                <span className="pomodoro-settings__duration-unit">min</span>
              </div>
            </div>

            <div className="pomodoro-settings__divider" />

            <div className="pomodoro-settings__toggles">
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
              ].map((item) => (
                <button
                  key={item.label}
                  className="pomodoro-settings__toggle-button"
                  onClick={() => {
                    item.onToggle();
                  }}
                  aria-pressed={item.enabled}
                >
                  <span>{item.label}</span>
                  <span
                    className={`pomodoro-settings__toggle-switch ${
                      item.enabled
                        ? 'pomodoro-settings__toggle-switch--active'
                        : 'pomodoro-settings__toggle-switch--inactive'
                    }`}
                  >
                    <span
                      className={`pomodoro-settings__toggle-knob ${
                        item.enabled
                          ? 'pomodoro-settings__toggle-knob--active'
                          : 'pomodoro-settings__toggle-knob--inactive'
                      }`}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
