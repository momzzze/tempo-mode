/**
 * EXAMPLE COMPONENT LIBRARY
 *
 * This file demonstrates how to structure reusable React components
 * using the TempoMode CSS system. Copy and adapt these patterns.
 */

// ============================================
// CARD COMPONENT
// ============================================

interface CardProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export function Card({ title, children, variant = 'primary' }: CardProps) {
  const variantClass = variant === 'primary' ? '' : `card--${variant}`;

  return (
    <div className={`card ${variantClass}`}>
      {title && <h2 className="card__title">{title}</h2>}
      {children}
    </div>
  );
}

// ============================================
// BUTTON COMPONENT
// ============================================

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary';
  disabled?: boolean;
}

export function Button({
  children,
  onClick,
  variant = 'default',
  disabled = false,
}: ButtonProps) {
  const className = `btn ${variant === 'primary' ? 'btn--primary' : ''}`;

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

// ============================================
// SEGMENTED CONTROL COMPONENT
// ============================================

interface SegmentedOption {
  label: string;
  value: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Segmented({ options, value, onChange }: SegmentedProps) {
  return (
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option.value}
          className={value === option.value ? 'active' : ''}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ============================================
// DIVIDER COMPONENT
// ============================================

interface DividerProps {
  label: string;
}

export function Divider({ label }: DividerProps) {
  return <div className="divider">{label}</div>;
}

// ============================================
// INPUT FIELD COMPONENT
// ============================================

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  disabled?: boolean;
}

export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
}: InputProps) {
  return (
    <div className="form-group">
      <label className="form-group__label">{label}</label>
      <input
        className="form-group__input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

// ============================================
// TOGGLE / SWITCH COMPONENT
// ============================================

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <div className="setting-row">
      <div className="setting-row__label">
        <p className="setting-row__label-text">{label}</p>
        {description && (
          <p className="setting-row__description">{description}</p>
        )}
      </div>
      <div
        className={`toggle ${checked ? 'active' : ''}`}
        onClick={() => onChange(!checked)}
        role="checkbox"
        aria-checked={checked}
      />
    </div>
  );
}

// ============================================
// TERMINAL LOG COMPONENT
// ============================================

export type TerminalLineType = 'default' | 'success' | 'warn' | 'error';

interface TerminalLine {
  id: string;
  text: string;
  type?: TerminalLineType;
}

interface TerminalProps {
  lines: TerminalLine[];
}

export function Terminal({ lines }: TerminalProps) {
  return (
    <div className="terminal">
      {lines.map((line) => (
        <div
          key={line.id}
          className={`terminal__line${
            line.type ? ` terminal__line--${line.type}` : ''
          }`}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}

// ============================================
// STATUS GRID COMPONENT
// ============================================

interface StatusItem {
  label: string;
  value: string | number;
}

interface StatusStripProps {
  items: StatusItem[];
}

export function StatusStrip({ items }: StatusStripProps) {
  return (
    <div className="status-strip">
      {items.map((item) => (
        <div key={item.label} className="status-item">
          <div className="status-item__label">{item.label}</div>
          <div className="status-item__value">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// TIMER DISPLAY COMPONENT
// ============================================

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
  isRunning?: boolean;
}

export function TimerDisplay({
  minutes,
  seconds,
  isRunning = false,
}: TimerDisplayProps) {
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={`timer__digits ${isRunning ? 'timer--running' : ''}`}>
      {formattedTime}
    </div>
  );
}

// ============================================
// USAGE EXAMPLES
// ============================================

/*

// In your page component:

import {
  Card,
  Button,
  Segmented,
  Divider,
  Input,
  Toggle,
  Terminal,
  StatusStrip,
  TimerDisplay
} from '@/components/Example'
import { useState } from 'react'

export default function PomodoroPage() {
  const [mode, setMode] = useState('focus')
  const [task, setTask] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  return (
    <div className="pomodoro">
      <Divider label="// POMODORO" />
      
      <Card title="Timer">
        <TimerDisplay minutes={25} seconds={0} isRunning={isRunning} />
        
        <Segmented
          options={[
            { label: 'Focus', value: 'focus' },
            { label: 'Short', value: 'short' },
            { label: 'Long', value: 'long' }
          ]}
          value={mode}
          onChange={setMode}
        />
        
        <div className="timer__controls">
          <Button variant="primary" onClick={() => setIsRunning(true)}>
            Start
          </Button>
          <Button onClick={() => setIsRunning(false)}>
            Pause
          </Button>
        </div>
        
        <Input
          label="Task"
          value={task}
          onChange={setTask}
          placeholder="What are you working on?"
        />
      </Card>

      <StatusStrip items={[
        { label: 'Streak', value: 7 },
        { label: 'Sessions', value: 12 },
        { label: 'Focus Min', value: 300 }
      ]} />

      <Terminal lines={[
        { id: '1', text: 'READY' },
        { id: '2', text: 'SESSION STARTED', type: 'success' }
      ]} />
    </div>
  )
}

*/
