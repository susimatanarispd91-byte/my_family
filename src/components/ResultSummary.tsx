import { useEffect, useState } from 'react';
import { RotateCcw, Home, BookOpen, Star, Trophy, CheckCircle2, XCircle, User } from 'lucide-react';
import { ConfettiBurst } from './ConfettiBurst';
import { audioManager } from '../utils/audio';

export interface ResultData {
  title: string;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  score: number;
  maxScore: number;
  isQuiz?: boolean;
}

interface ResultSummaryProps {
  result: ResultData;
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
}

export function ResultSummary({
  result,
  studentName,
  onChangeStudentName,
  onPlayAgain,
  onBackToMenu,
  onReviewMaterial,
}: ResultSummaryProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const percentage =
    result.maxScore > 0
      ? Math.round((result.score / result.maxScore) * 100)
      : result.totalQuestions > 0
        ? Math.round((result.correctCount / result.totalQuestions) * 100)
        : 0;

  // Star count out of 5
  const stars =
    percentage >= 90 ? 5 : percentage >= 75 ? 4 : percentage >= 55 ? 3 : percentage >= 30 ? 2 : 1;

  // Grade category per specification
  const getCategory = (pct: number) => {
    if (pct >= 90) {
      return {
        badge: 'EXCELLENT!',
        message: 'Luar biasa! Kamu sudah sangat pintar mengenal anggota keluarga dalam Bahasa Inggris!',
        bg: 'bg-emerald-50 border-emerald-200',
        titleColor: 'text-emerald-700',
      };
    }
    if (pct >= 70) {
      return {
        badge: 'VERY GOOD!',
        message: 'Bagus sekali! Kamu hampir menguasai semua kosakata keluarga. Terus berlatih ya!',
        bg: 'bg-sky-50 border-sky-200',
        titleColor: 'text-sky-700',
      };
    }
    if (pct >= 50) {
      return {
        badge: 'GOOD JOB!',
        message: 'Kerja bagus! Ayo ulangi materi sebentar agar nilaimu makin tinggi!',
        bg: 'bg-amber-50 border-amber-200',
        titleColor: 'text-amber-700',
      };
    }
    return {
      badge: 'KEEP LEARNING!',
      message: 'Semangat terus ya! Kamu hebat sudah mencoba. Ayo belajar lagi bersama keluarga!',
      bg: 'bg-pink-50 border-pink-200',
      titleColor: 'text-pink-700',
    };
  };

  const category = getCategory(percentage);

  useEffect(() => {
    audioManager.playVictoryFanfare();
    const timer = window.setTimeout(() => setShowConfetti(false), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 animate-pop-in">
      <ConfettiBurst active={showConfetti} />

      <div className={`rounded-3xl border-2 p-6 sm:p-10 shadow-sm ${category.bg}`}>
        <div className="flex flex-col items-center text-center">
          {/* Illustrated Trophy */}
          <div className="relative mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-amber-100 border-4 border-amber-300 shadow-sm animate-gentle-bounce">
            <Trophy className="h-14 w-14 text-amber-500" strokeWidth={2.2} />
          </div>

          <p className="text-sm font-semibold text-slate-600">{result.title}</p>
          <h2 className={`mt-1 font-display text-4xl sm:text-5xl font-extrabold tracking-tight ${category.titleColor}`}>
            {category.badge}
          </h2>

          {/* Stars Earned */}
          <div className="mt-4 flex items-center gap-2" aria-label={`Mendapat ${stars} dari 5 bintang`}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Star
                key={num}
                className={`h-9 w-9 transition-transform ${
                  num <= stars
                    ? 'fill-amber-400 text-amber-500 scale-110'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-base font-bold text-slate-700 tabular-nums">
            {stars} Bintang Diperoleh
          </p>

          {/* Student Name Input (Optional) */}
          <div className="mt-6 w-full max-w-sm">
            <label htmlFor="result-student-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Nama Siswa (Opsional)
            </label>
            <div className="relative flex items-center">
              <User className="pointer-events-none absolute left-3.5 h-5 w-5 text-slate-400" />
              <input
                id="result-student-name"
                type="text"
                value={studentName}
                onChange={(e) => onChangeStudentName(e.target.value)}
                placeholder="Tulis namamu di sini..."
                maxLength={32}
                className="w-full rounded-2xl border-2 border-slate-200 bg-white py-2.5 pl-11 pr-4 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
            {studentName.trim() && (
              <p className="mt-2 text-base font-bold text-sky-700">
                Hebat sekali, {studentName.trim()}!
              </p>
            )}
          </div>

          {/* Score Breakdown Grid */}
          <div className="mt-7 grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Benar</span>
              </div>
              <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {result.correctCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-rose-600">
                <XCircle className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wide">Salah</span>
              </div>
              <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {result.wrongCount}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-amber-600">
                Total Skor
              </span>
              <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {result.score}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-purple-600">
                Keberhasilan
              </span>
              <p className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {percentage}%
              </p>
            </div>
          </div>

          {/* Motivational Message */}
          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-slate-800">
            {category.message}
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                onPlayAgain();
              }}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-6 py-3 font-display text-lg font-bold text-white transition-transform hover:bg-emerald-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="h-5 w-5" />
              MAIN LAGI
            </button>

            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                onReviewMaterial();
              }}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-6 py-3 font-display text-lg font-bold text-white transition-transform hover:bg-sky-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="h-5 w-5" />
              ULANGI MATERI
            </button>

            <button
              type="button"
              onClick={() => {
                audioManager.playClick();
                onBackToMenu();
              }}
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border-b-4 border-amber-600 bg-amber-400 px-6 py-3 font-display text-lg font-bold text-slate-900 transition-transform hover:bg-amber-300 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <Home className="h-5 w-5" />
              KEMBALI KE MENU
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
