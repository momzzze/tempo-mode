import { useEffect, useState } from 'react';
import { Outlet, Link, useRouter } from '@tanstack/react-router';
import { Home, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { useTheme } from './theme/useTheme';
import ThemeDropdown from './components/ThemeDropdown';
import { Button } from '@/components/ui/button';
import { fetchRandomWorldImage } from './services/pexelsService';
import {
  useAppDispatch,
  useAppSelector,
  selectIsAuthed,
  logout,
} from './store';

export default function App() {
  const { theme, setPalette, setMode, palettes, modes } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthed = useAppSelector(selectIsAuthed);

  type Layer = 'solid' | 'fog';
  const [layer, setLayer] = useState<Layer>(() => {
    if (typeof window === 'undefined') return 'solid';
    const stored = window.localStorage.getItem(
      'tempo-mode-layer'
    ) as Layer | null;
    return stored === 'fog' || stored === 'solid' ? stored : 'solid';
  });

  // Background image state
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.layer = layer;
    window.localStorage.setItem('tempo-mode-layer', layer);
  }, [layer]);

  // Load background image on mount
  useEffect(() => {
    fetchRandomWorldImage().then(setBackgroundUrl);
  }, []);

  const currentMode = theme.endsWith('-light') ? 'light' : 'dark';
  const currentPalette = theme.split('-')[0];

  return (
    <div className="relative min-h-screen text-white">
      {/* Background Image */}
      {backgroundUrl && (
        <div
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
        />
      )}
      <div className="fixed inset-0 z-0 bg-black/30" />

      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.9) 100%)',
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        {/* App Header */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-transparent backdrop-blur-md">
          <div className="shell">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold tracking-wider text-white/80">
                tempo-mode
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  title="Home"
                  className="!text-white/80 hover:!text-white hover:!bg-white/10"
                >
                  <Link to="/">
                    <Home size={20} />
                  </Link>
                </Button>

                {!isAuthed && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Login"
                      className="!text-white/80 hover:!text-white hover:!bg-white/10"
                    >
                      <Link to="/login">
                        <LogIn size={20} />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="Register"
                      className="!text-white/80 hover:!text-white hover:!bg-white/10"
                    >
                      <Link to="/register">
                        <UserPlus size={20} />
                      </Link>
                    </Button>
                  </>
                )}

                {isAuthed && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      title="App"
                      className="!text-white/80 hover:!text-white hover:!bg-white/10"
                    >
                      <Link to="/app">
                        <LayoutDashboard size={20} />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Logout"
                      className="!text-white/80 hover:!text-white hover:!bg-white/10 cursor-pointer"
                      onClick={() => {
                        dispatch(logout());
                        router.navigate({ to: '/' });
                      }}
                    >
                      <LogOut size={20} />
                    </Button>
                  </>
                )}
                <>
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
                </>
              </div>
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-64px)] justify-center flex py-8 items-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
