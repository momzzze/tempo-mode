import { useEffect, useState } from 'react';
import { Outlet, Link } from '@tanstack/react-router';
import { Home, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useTheme } from './theme/useTheme';
import ThemeDropdown from './components/ThemeDropdown';

export default function App() {
  const { theme, setPalette, setMode, palettes, modes } = useTheme();

  type Layer = 'solid' | 'fog';
  const [layer, setLayer] = useState<Layer>(() => {
    if (typeof window === 'undefined') return 'solid';
    const stored = window.localStorage.getItem(
      'tempo-mode-layer'
    ) as Layer | null;
    return stored === 'fog' || stored === 'solid' ? stored : 'solid';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.layer = layer;
    window.localStorage.setItem('tempo-mode-layer', layer);
  }, [layer]);

  const currentMode = theme.endsWith('-light') ? 'light' : 'dark';
  const currentPalette = theme.split('-')[0];

  return (
    <div className="pomodoro">
      {/* App Header */}
      <div className="app-header">
        <div className="app-logo">tempo-mode</div>
        <div className="app-status">
          <Link to="/" className="btn btn--icon" title="Home">
            <Home size={16} />
          </Link>
          <Link to="/login" className="btn btn--icon" title="Login">
            <LogIn size={16} />
          </Link>
          <Link to="/register" className="btn btn--icon" title="Register">
            <UserPlus size={16} />
          </Link>
          <Link to="/app" className="btn btn--icon" title="App">
            <LayoutDashboard size={16} />
          </Link>
          <ThemeDropdown
            palettes={palettes}
            modes={modes}
            currentPalette={currentPalette}
            currentMode={currentMode}
            currentLayer={layer}
            onPaletteChange={setPalette}
            onModeChange={setMode}
            onLayerChange={setLayer}
          />
        </div>
      </div>

      <Outlet />
    </div>
  );
}
