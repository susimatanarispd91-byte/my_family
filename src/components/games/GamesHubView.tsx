import { ArrowLeft, HelpCircle, Puzzle, Users, SpellCheck } from 'lucide-react';
import { AppScreen } from '../TopBar';
import { audioManager } from '../../utils/audio';

interface GamesHubViewProps {
  onSelectGame: (screen: AppScreen) => void;
  onBackToMenu: () => void;
}

const GAME_CARDS = [
  {
    id: 'game1' as AppScreen,
    badge: 'GAME 1',
    title: 'GUESS THE FAMILY',
    subtitle: 'Tebak siapa anggota keluarga pada gambar dari 3 pilihan kata!',
    icon: HelpCircle,
    bg: 'bg-sky-50 border-sky-200 hover:bg-sky-100/80',
    iconBg: 'bg-sky-500 text-white',
    btnBg: 'bg-sky-500 border-sky-700 text-white',
  },
  {
    id: 'game2' as AppScreen,
    badge: 'GAME 2',
    title: 'MATCHING GAME',
    subtitle: 'Cocokkan 6 gambar anggota keluarga dengan kata Bahasa Inggrisnya!',
    icon: Puzzle,
    bg: 'bg-pink-50 border-pink-200 hover:bg-pink-100/80',
    iconBg: 'bg-pink-500 text-white',
    btnBg: 'bg-pink-500 border-pink-700 text-white',
  },
  {
    id: 'game3' as AppScreen,
    badge: 'GAME 3',
    title: 'WHO IS HE? WHO IS SHE?',
    subtitle: 'Pilih kata HE atau SHE yang sesuai dengan gambar karakter!',
    icon: Users,
    bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/80',
    iconBg: 'bg-emerald-500 text-white',
    btnBg: 'bg-emerald-500 border-emerald-700 text-white',
  },
  {
    id: 'game4' as AppScreen,
    badge: 'GAME 4',
    title: 'COMPLETE THE WORD',
    subtitle: 'Lengkapi huruf yang hilang dari nama anggota keluarga!',
    icon: SpellCheck,
    bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100/80',
    iconBg: 'bg-amber-500 text-white',
    btnBg: 'bg-amber-400 border-amber-600 text-slate-900',
  },
];

export function GamesHubView({ onSelectGame, onBackToMenu }: GamesHubViewProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 animate-pop-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            AYO BERMAIN <span className="text-amber-600">(MINI GAMES)</span>
          </h1>
          <p className="mt-1 text-base sm:text-lg text-slate-600">
            Pilih salah satu permainan di bawah ini dan kumpulkan bintang sebanyak-banyaknya!
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            audioManager.playClick();
            onBackToMenu();
          }}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 font-display text-base font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-5 w-5" />
          Menu Utama
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {GAME_CARDS.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              className={`flex flex-col justify-between rounded-3xl border-2 p-6 transition-transform hover:-translate-y-1 ${game.bg}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${game.iconBg}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="font-display text-sm font-extrabold tracking-wider text-slate-500">
                    {game.badge}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-2xl font-extrabold text-slate-900">
                  {game.title}
                </h2>
                <p className="mt-2 text-base leading-relaxed text-slate-700">
                  {game.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  audioManager.playClick();
                  onSelectGame(game.id);
                }}
                className={`mt-6 inline-flex min-h-[54px] w-full items-center justify-center rounded-2xl border-b-4 px-6 py-3 font-display text-lg font-extrabold transition-transform active:translate-y-0.5 cursor-pointer ${game.btnBg}`}
              >
                MAIN SEKARANG
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
