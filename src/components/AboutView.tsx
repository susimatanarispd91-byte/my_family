import { Volume2, BookOpen, Headphones, Gamepad2, Trophy, ArrowLeft } from 'lucide-react';
import { FAMILY_VOCABULARY } from '../data/familyData';
import { CharacterImage } from './CharacterImage';
import { audioManager } from '../utils/audio';

interface AboutViewProps {
  onBackToMenu: () => void;
  onStartLearn: () => void;
}

export function AboutView({ onBackToMenu, onStartLearn }: AboutViewProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 animate-pop-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            TENTANG PEMBELAJARAN
          </h1>
          <p className="mt-1 text-base sm:text-lg text-slate-600">
            Panduan Belajar Bahasa Inggris Kelas 1 SD — Tema: My Family
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
          Kembali ke Menu
        </button>
      </div>

      {/* Learning Steps */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border-2 border-sky-200 bg-sky-50 p-5">
          <BookOpen className="h-8 w-8 text-sky-600" />
          <h2 className="mt-3 font-display text-xl font-bold text-slate-900">1. LEARN</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Pelajari 8 kosakata keluarga (Grandfather, Grandmother, Father, Mother, Brother, Sister, He, She) dengan gambar & suara.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-pink-200 bg-pink-50 p-5">
          <Headphones className="h-8 w-8 text-pink-600" />
          <h2 className="mt-3 font-display text-xl font-bold text-slate-900">2. LISTEN</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Dengarkan pengucapan Bahasa Inggris yang benar berulang kali dan tirukan dengan lantang!
          </p>
        </div>

        <div className="rounded-3xl border-2 border-amber-200 bg-amber-50 p-5">
          <Gamepad2 className="h-8 w-8 text-amber-600" />
          <h2 className="mt-3 font-display text-xl font-bold text-slate-900">3. PLAY</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Mainkan 4 game edukatif agar semakin hafal tulisan, arti, dan penggunaan kata He dan She.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5">
          <Trophy className="h-8 w-8 text-emerald-600" />
          <h2 className="mt-3 font-display text-xl font-bold text-slate-900">4. PRACTICE &amp; WIN</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">
            Kerjakan Latihan Soal dan Kuis Cerdas untuk mengumpulkan bintang dan piala!
          </p>
        </div>
      </div>

      {/* Ringkasan Kosakata */}
      <div className="mt-8 rounded-3xl border-2 border-slate-200 bg-white p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">
              Ringkasan Kosakata My Family
            </h2>
            <p className="text-sm text-slate-600">
              Klik kartu mana saja untuk mendengarkan pengucapan Bahasa Inggrisnya.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              onStartLearn();
            }}
            className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-2.5 font-display text-base font-bold text-white hover:bg-sky-600 cursor-pointer whitespace-nowrap"
          >
            Buka Mari Belajar
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FAMILY_VOCABULARY.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => audioManager.speakEnglish(item.english)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-transform hover:-translate-y-0.5 cursor-pointer ${item.pastelBg} ${item.pastelBorder}`}
            >
              <CharacterImage
                src={item.image}
                alt={item.english}
                className="h-16 w-16 shrink-0 rounded-xl border border-white"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-display text-lg font-extrabold text-slate-900 truncate">
                    {item.english}
                  </span>
                  <Volume2 className={`h-4 w-4 shrink-0 ${item.accentText}`} />
                </div>
                <p className="text-sm font-bold text-slate-700">{item.indonesian}</p>
                <p className="text-xs text-slate-500">/{item.pronunciationHint}/</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Catatan Guru / Orang Tua */}
      <div className="mt-6 rounded-3xl border-2 border-purple-200 bg-purple-50 p-6">
        <h2 className="font-display text-xl font-extrabold text-purple-900">
          Catatan untuk Guru &amp; Orang Tua
        </h2>
        <p className="mt-2 text-base leading-relaxed text-slate-700">
          Media pembelajaran ini dirancang khusus untuk anak usia 6–7 tahun (Kelas 1 SD) dengan tombol berukuran besar, warna pastel yang ramah mata, serta pengucapan Bahasa Inggris otomatis melalui Web Speech API. Dampingi siswa saat mencoba fitur mikrofon pada menu <strong>Dengarkan dan Tirukan</strong> untuk melatih keberanian berbicara Bahasa Inggris.
        </p>
      </div>
    </div>
  );
}
