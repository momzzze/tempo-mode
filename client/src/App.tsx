import { useEffect, useState } from 'react';
import { Outlet, Link } from '@tanstack/react-router';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchRandomWorldImage } from './services/pexelsService';
import { useAppSelector, selectIsAuthed } from './store';
import { ProfileSection } from './components/ProfileSection';
import Statistics from './pages/Statistics';

export default function App() {
  // const router = useRouter();
  const isAuthed = useAppSelector(selectIsAuthed);

  // Background image state
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);

  // Statistics modal state
  const [statsModalOpen, setStatsModalOpen] = useState(false);

  // Load background image on mount
  useEffect(() => {
    fetchRandomWorldImage().then(setBackgroundUrl);
  }, []);

  // NOTE: Rehydration is handled in main.tsx - do NOT duplicate here!

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
                <ProfileSection
                  isAuthed={isAuthed}
                  onOpenStats={() => setStatsModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-64px)] content-center py-8">
          <Outlet />
        </div>
      </div>

      {/* Statistics Modal Overlay */}
      {statsModalOpen && (
        <Statistics onClose={() => setStatsModalOpen(false)} />
      )}
    </div>
  );
}
