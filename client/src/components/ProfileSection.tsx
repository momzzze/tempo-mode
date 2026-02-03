import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from '@tanstack/react-router';
import { useAppDispatch, useAppSelector, logout } from '@/store';

export function ProfileSection() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    router.navigate({ to: '/' });
  };

  if (!user) return null;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        title="Profile"
        className="!text-white/80 hover:!text-white hover:!bg-white/10"
      >
        <User size={20} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black/80 border border-white/10 shadow-lg backdrop-blur-md z-50">
          <div className="p-4 border-b border-white/10">
            <p className="text-sm text-white/90 font-medium truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => {
              router.navigate({ to: '/settings' });
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={16} />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
