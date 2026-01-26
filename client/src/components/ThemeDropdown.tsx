import { useState, useRef, useEffect } from 'react';
import { Settings } from 'lucide-react';

type Palette = 'green' | 'amber' | 'mono';
type Mode = 'dark' | 'light';

interface ThemeDropdownProps {
  palettes: readonly Palette[];
  modes: readonly Mode[];
  currentPalette: string;
  currentMode: string;
  currentLayer: 'solid' | 'fog';
  onPaletteChange: (palette: Palette) => void;
  onModeChange: (mode: Mode) => void;
  onLayerChange: (layer: 'solid' | 'fog') => void;
}

export default function ThemeDropdown({
  palettes,
  modes,
  currentPalette,
  currentMode,
  currentLayer,
  onPaletteChange,
  onModeChange,
  onLayerChange,
}: ThemeDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        className="btn btn--icon"
        onClick={() => setOpen(!open)}
        title="Theme Settings"
      >
        <Settings size={16} />
      </button>
      {open && (
        <div
          className="theme-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '4px',
            minWidth: '200px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-outer)',
            borderRadius: 'var(--radius-sm)',
            zIndex: 1000,
            padding: 'var(--space-2)',
          }}
        >
          {/* Palettes */}
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--gray-500)',
                marginBottom: 'var(--space-1)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-ui)',
              }}
            >
              Palette
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              {palettes.map((p) => (
                <button
                  key={p}
                  className={`palette-btn ${currentPalette === p ? 'active' : ''}`}
                  onClick={() => onPaletteChange(p)}
                  style={{
                    padding: 'var(--space-1) var(--space-2)',
                    fontSize: 'var(--font-size-xs)',
                    background:
                      currentPalette === p
                        ? 'var(--neon-400)'
                        : 'var(--surface-2)',
                    color:
                      currentPalette === p
                        ? 'var(--gray-900)'
                        : 'var(--gray-400)',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-out',
                  }}
                  onMouseEnter={(e) => {
                    if (currentPalette !== p) {
                      e.currentTarget.style.color = 'var(--gray-300)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPalette !== p) {
                      e.currentTarget.style.color = 'var(--gray-400)';
                    }
                  }}
                >
                  {p.slice(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Modes */}
          <div style={{ marginBottom: 'var(--space-3)' }}>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--gray-500)',
                marginBottom: 'var(--space-1)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-ui)',
              }}
            >
              Mode
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              {modes.map((m) => (
                <button
                  key={m}
                  className={`mode-btn ${currentMode === m ? 'active' : ''}`}
                  onClick={() => onModeChange(m)}
                  style={{
                    padding: 'var(--space-1) var(--space-2)',
                    fontSize: 'var(--font-size-xs)',
                    background:
                      currentMode === m
                        ? 'var(--neon-400)'
                        : 'var(--surface-2)',
                    color:
                      currentMode === m ? 'var(--gray-900)' : 'var(--gray-400)',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-out',
                  }}
                  onMouseEnter={(e) => {
                    if (currentMode !== m) {
                      e.currentTarget.style.color = 'var(--gray-300)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentMode !== m) {
                      e.currentTarget.style.color = 'var(--gray-400)';
                    }
                  }}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Layer */}
          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--gray-500)',
                marginBottom: 'var(--space-1)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--letter-ui)',
              }}
            >
              Layer
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              {(['solid', 'fog'] as const).map((l) => (
                <button
                  key={l}
                  className={`layer-btn ${currentLayer === l ? 'active' : ''}`}
                  onClick={() => onLayerChange(l)}
                  style={{
                    padding: 'var(--space-1) var(--space-2)',
                    fontSize: 'var(--font-size-xs)',
                    background:
                      currentLayer === l
                        ? 'var(--neon-400)'
                        : 'var(--surface-2)',
                    color:
                      currentLayer === l
                        ? 'var(--gray-900)'
                        : 'var(--gray-400)',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-out',
                  }}
                  onMouseEnter={(e) => {
                    if (currentLayer !== l) {
                      e.currentTarget.style.color = 'var(--gray-300)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentLayer !== l) {
                      e.currentTarget.style.color = 'var(--gray-400)';
                    }
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
