import { Home } from 'lucide-react';
import { audioManager } from '../utils/audio';

export type AppScreen =
  | 'splash'
  | 'menu'
  | 'learn'
  | 'listen'
  | 'games'
  | 'game1'
  | 'game2'
  | 'game3'
  | 'game4'
  | 'exercise'
  | 'quiz'
  | 'about';

interface TopBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export function TopBar({ currentScreen, onNavigate }: TopBarProps) {
  const navItems: { id: AppScreen; label: string }[] = [
    { id: 'menu', label: 'Menu Utama' },
    { id: 'learn', label: 'Mari Belajar' },
    { id: 'games', label: 'Ayo Bermain' },
    { id: 'quiz', label: 'Kuis Cerdas' },
  ];

  const isGameActive =
    currentScreen === 'games' ||
    currentScreen === 'game1' ||
    currentScreen === 'game2' ||
    currentScreen === 'game3' ||
    currentScreen === 'game4';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3 sm:px-6">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => {
            audioManager.playClick();
            onNavigate('splash');
          }}
          className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-sky-700 hover:text-sky-600 transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          MY FAMILY
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600" aria-label="Navigasi Utama">
          {navItems.map((item) => {
            const active =
              currentScreen === item.id || (item.id === 'games' && isGameActive);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  audioManager.playClick();
                  onNavigate(item.id);
                }}
                className={`cursor-pointer whitespace-nowrap shrink-0 border-b-2 py-1 transition-colors ${
                  active
                    ? 'border-sky-500 text-sky-700'
                    : 'border-transparent hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary HOME CTA */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onNavigate('menu');
            }}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border-b-3 border-sky-700 bg-sky-500 px-4 py-2 font-display text-sm font-bold text-white transition-transform hover:bg-sky-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Home className="h-4 w-4" />
            HOME
          </button>
        </div>
      </div>
    </header>
  );
}
