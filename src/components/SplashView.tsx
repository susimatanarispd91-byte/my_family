import { Play, Music, Volume2, VolumeX, Star } from 'lucide-react';
import { HERO_FAMILY_IMAGE } from '../data/familyData';
import { CharacterImage } from './CharacterImage';
import { audioManager } from '../utils/audio';

interface SplashViewProps {
  musicOn: boolean;
  sfxOn: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onStart: () => void;
}

export function SplashView({
  musicOn,
  sfxOn,
  onToggleMusic,
  onToggleSfx,
  onStart,
}: SplashViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-[#FFFDF8] to-amber-50 flex flex-col">
      {/* Top Sound Settings Row */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 pt-5 sm:px-6">
        <span className="font-display text-base sm:text-lg font-bold text-sky-800">
          Bahasa Inggris Kelas 1 SD
        </span>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onToggleMusic();
            }}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 px-4 py-2 font-display text-sm font-bold transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap ${
              musicOn
                ? 'border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            aria-pressed={musicOn}
          >
            <Music className="h-5 w-5" />
            <span>Musik: {musicOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 px-4 py-2 font-display text-sm font-bold transition-transform active:translate-y-0.5 cursor-pointer whitespace-nowrap ${
              sfxOn
                ? 'border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
            aria-pressed={sfxOn}
          >
            {sfxOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            <span>Suara: {sfxOn ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Welcome Hero */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-8 px-4 py-8 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-10">
        {/* Text & Primary CTA Column */}
        <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left animate-pop-in">
          <div className="mb-3 flex items-center gap-2 text-amber-500">
            <Star className="h-6 w-6 fill-amber-400" />
            <Star className="h-7 w-7 fill-amber-400" />
            <Star className="h-6 w-6 fill-amber-400" />
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900">
            <span className="text-sky-600">MY </span>
            <span className="text-pink-500">FAMILY</span>
          </h1>

          <p className="mt-3 font-display text-2xl sm:text-3xl font-bold text-amber-600">
            Let&apos;s Learn About My Family!
          </p>

          <p className="mt-4 max-w-lg text-lg leading-relaxed text-slate-700">
            Ayo berkenalan dengan Kakek, Nenek, Ayah, Ibu, Kakak, dan Adik dalam Bahasa Inggris lewat gambar lucu, suara, dan permainan seru!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() => {
                audioManager.playSuccess();
                audioManager.speakEnglish("Let's learn about my family!");
                onStart();
              }}
              className="inline-flex min-h-[64px] items-center justify-center gap-3 rounded-3xl border-b-4 border-emerald-700 bg-emerald-500 px-9 py-4 font-display text-2xl font-extrabold text-white shadow-md transition-transform hover:scale-[1.02] hover:bg-emerald-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Play className="h-7 w-7 fill-white" />
              MULAI BELAJAR
            </button>

            <button
              type="button"
              onClick={() => {
                audioManager.speakEnglish('Hello! My family is happy!');
              }}
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border-2 border-sky-200 bg-white px-5 py-3 font-display text-base font-bold text-sky-700 transition-colors hover:bg-sky-50 cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="h-5 w-5" />
              Dengar Sapaan
            </button>
          </div>
        </div>

        {/* Happy Family Illustration Column */}
        <div className="w-full max-w-xl lg:col-span-6">
          <div className="relative rounded-3xl border-4 border-white bg-sky-100 p-3 shadow-lg animate-float-slow">
            <CharacterImage
              src={HERO_FAMILY_IMAGE}
              alt="Ilustrasi keluarga bahagia: kakek, nenek, ayah, ibu, anak laki-laki, dan anak perempuan"
              className="aspect-[4/3] w-full rounded-2xl"
              fallbackLabel="My Happy Family"
            />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-slate-700">
              <span>Grandfather</span>
              <span aria-hidden="true">·</span>
              <span>Grandmother</span>
              <span aria-hidden="true">·</span>
              <span>Father</span>
              <span aria-hidden="true">·</span>
              <span>Mother</span>
              <span aria-hidden="true">·</span>
              <span>Brother</span>
              <span aria-hidden="true">·</span>
              <span>Sister</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
