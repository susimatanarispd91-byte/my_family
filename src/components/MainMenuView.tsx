import {
  BookOpen,
  Mic,
  Gamepad2,
  ClipboardCheck,
  Trophy,
  Info,
  Volume2,
} from 'lucide-react';
import { AppScreen } from './TopBar';
import { audioManager } from '../utils/audio';

interface MainMenuViewProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onNavigate: (screen: AppScreen) => void;
  totalStars: number;
}

interface MenuCardConfig {
  id: AppScreen;
  title: string;
  subtitle: string;
  icon: typeof BookOpen;
  cardClass: string;
  iconBoxClass: string;
  borderBottomClass: string;
}

const MENU_ITEMS: MenuCardConfig[] = [
  {
    id: 'learn',
    title: 'MARI BELAJAR',
    subtitle: 'Kenali 8 kosakata anggota keluarga dengan gambar & suara',
    icon: BookOpen,
    cardClass: 'bg-sky-50 border-sky-200 hover:bg-sky-100/80',
    iconBoxClass: 'bg-sky-500 text-white',
    borderBottomClass: 'border-b-4 border-b-sky-300',
  },
  {
    id: 'listen',
    title: 'DENGARKAN DAN TIRUKAN',
    subtitle: 'Dengar pengucapan Bahasa Inggris lalu tirukan suaranya',
    icon: Mic,
    cardClass: 'bg-pink-50 border-pink-200 hover:bg-pink-100/80',
    iconBoxClass: 'bg-pink-500 text-white',
    borderBottomClass: 'border-b-4 border-b-pink-300',
  },
  {
    id: 'games',
    title: 'AYO BERMAIN',
    subtitle: '4 permainan seru: Tebak Gambar, Cocokkan, He/She, & Kata',
    icon: Gamepad2,
    cardClass: 'bg-amber-50 border-amber-200 hover:bg-amber-100/80',
    iconBoxClass: 'bg-amber-500 text-white',
    borderBottomClass: 'border-b-4 border-b-amber-300',
  },
  {
    id: 'exercise',
    title: 'LATIHAN SOAL',
    subtitle: '10 soal latihan bertahap dengan umpan balik langsung',
    icon: ClipboardCheck,
    cardClass: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/80',
    iconBoxClass: 'bg-emerald-500 text-white',
    borderBottomClass: 'border-b-4 border-b-emerald-300',
  },
  {
    id: 'quiz',
    title: 'KUIS CERDAS',
    subtitle: '10 pertanyaan acak untuk meraih piala & bintang!',
    icon: Trophy,
    cardClass: 'bg-purple-50 border-purple-200 hover:bg-purple-100/80',
    iconBoxClass: 'bg-purple-500 text-white',
    borderBottomClass: 'border-b-4 border-b-purple-300',
  },
  {
    id: 'about',
    title: 'TENTANG PEMBELAJARAN',
    subtitle: 'Tujuan belajar, panduan siswa, dan daftar kosakata',
    icon: Info,
    cardClass: 'bg-orange-50 border-orange-200 hover:bg-orange-100/80',
    iconBoxClass: 'bg-orange-500 text-white',
    borderBottomClass: 'border-b-4 border-b-orange-300',
  },
];

export function MainMenuView({
  studentName,
  onChangeStudentName,
  onNavigate,
  totalStars,
}: MainMenuViewProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 animate-pop-in">
      {/* Friendly Greeting Banner */}
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border-2 border-sky-200 bg-white p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            Halo{studentName.trim() ? `, ${studentName.trim()}` : ' Anak Hebat'}!
          </h1>
          <p className="mt-1 text-base sm:text-lg text-slate-600">
            Pilih menu di bawah ini untuk mulai belajar tentang <strong className="text-sky-700">My Family</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="menu-student-name" className="sr-only">
              Nama Siswa
            </label>
            <input
              id="menu-student-name"
              type="text"
              value={studentName}
              onChange={(e) => onChangeStudentName(e.target.value)}
              placeholder="Nama kamu (opsional)..."
              maxLength={28}
              className="min-h-[46px] rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => audioManager.speakEnglish("Let's learn and play together!")}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50 px-4 py-2 font-display text-sm font-bold text-sky-700 hover:bg-sky-100 cursor-pointer whitespace-nowrap"
          >
            <Volume2 className="h-5 w-5" />
            <span>Bintangmu: {totalStars}</span>
          </button>
        </div>
      </div>

      {/* 6 Main Menu Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                audioManager.playClick();
                onNavigate(item.id);
              }}
              className={`group flex flex-col items-start rounded-3xl border-2 p-6 text-left transition-transform hover:-translate-y-1 active:translate-y-0 cursor-pointer ${item.cardClass} ${item.borderBottomClass}`}
            >
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${item.iconBoxClass}`}
              >
                <Icon className="h-8 w-8" />
              </div>

              <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 text-base leading-relaxed text-slate-700">
                {item.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
