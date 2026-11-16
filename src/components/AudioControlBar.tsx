import { Music, Volume2, VolumeX, Gauge } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface AudioControlBarProps {
  musicOn: boolean;
  sfxOn: boolean;
  slowMode: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onToggleSlow: () => void;
}

export function AudioControlBar({
  musicOn,
  sfxOn,
  slowMode,
  onToggleMusic,
  onToggleSfx,
  onToggleSlow,
}: AudioControlBarProps) {
  return (
    <div className="border-b border-slate-200/70 bg-sky-50/60">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          LEARN · LISTEN · PLAY · PRACTICE · WIN
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onToggleMusic();
            }}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
              musicOn
                ? 'border-purple-300 bg-purple-100 text-purple-800 hover:bg-purple-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            aria-pressed={musicOn}
          >
            <Music className="h-4 w-4" />
            <span>Musik: {musicOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
              sfxOn
                ? 'border-emerald-300 bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            aria-pressed={sfxOn}
          >
            {sfxOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>Suara: {sfxOn ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onToggleSlow();
            }}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs sm:text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
              slowMode
                ? 'border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            aria-pressed={slowMode}
            title="Atur kecepatan suara Bahasa Inggris"
          >
            <Gauge className="h-4 w-4" />
            <span>Bicara: {slowMode ? 'Pelan' : 'Normal'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
