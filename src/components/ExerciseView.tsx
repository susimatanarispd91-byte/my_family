import { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { EXERCISE_QUESTIONS } from '../data/familyData';
import { CharacterImage } from './CharacterImage';
import { ResultSummary, ResultData } from './ResultSummary';
import { audioManager } from '../utils/audio';

interface ExerciseViewProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
  onAddStars: (count: number) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C'];

export function ExerciseView({
  studentName,
  onChangeStudentName,
  onBackToMenu,
  onReviewMaterial,
  onAddStars,
}: ExerciseViewProps) {
  const [idx, setIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = EXERCISE_QUESTIONS[idx];
  const answered = selectedOption !== null;
  const isCorrect = selectedOption === q.correctAnswer;

  const handleRestart = () => {
    setIdx(0);
    setSelectedOption(null);
    setCorrectCount(0);
    setWrongCount(0);
    setScore(0);
    setFinished(false);
  };

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelectedOption(option);

    if (option === q.correctAnswer) {
      audioManager.playSuccess();
      setCorrectCount((c) => c + 1);
      setScore((s) => s + 10);
    } else {
      audioManager.playError();
      setWrongCount((w) => w + 1);
    }
  };

  const handleNext = () => {
    audioManager.playClick();
    if (idx + 1 >= EXERCISE_QUESTIONS.length) {
      const earnedStars = Math.max(1, Math.round(correctCount / 2));
      onAddStars(earnedStars);
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelectedOption(null);
    }
  };

  if (finished) {
    const result: ResultData = {
      title: 'LATIHAN SOAL (EXERCISE)',
      correctCount,
      wrongCount,
      totalQuestions: EXERCISE_QUESTIONS.length,
      score,
      maxScore: EXERCISE_QUESTIONS.length * 10,
    };
    return (
      <ResultSummary
        result={result}
        studentName={studentName}
        onChangeStudentName={onChangeStudentName}
        onPlayAgain={handleRestart}
        onBackToMenu={onBackToMenu}
        onReviewMaterial={onReviewMaterial}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 animate-pop-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            LATIHAN SOAL <span className="text-emerald-600">(EXERCISE)</span>
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 tabular-nums">
            Soal {idx + 1} dari {EXERCISE_QUESTIONS.length} · Skor: {score} Poin
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            audioManager.playClick();
            onBackToMenu();
          }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 font-display text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          Menu Utama
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((idx + (answered ? 1 : 0)) / EXERCISE_QUESTIONS.length) * 100}%` }}
          />
        </div>
        <span className="font-display text-sm font-extrabold text-slate-700 tabular-nums">
          {Math.round(((idx + (answered ? 1 : 0)) / EXERCISE_QUESTIONS.length) * 100)}%
        </span>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/60 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="font-display text-sm font-extrabold uppercase tracking-wider text-emerald-700">
            Pertanyaan Nomor {idx + 1}
          </span>

          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {q.questionId}
          </h2>

          {q.questionEn && (
            <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-sky-700">
              {q.questionEn}
            </p>
          )}

          {q.image && (
            <div className="mt-5 w-full max-w-[220px] rounded-3xl border-4 border-white bg-white p-2 shadow-md">
              <CharacterImage
                src={q.image}
                alt="Gambar pertanyaan"
                className="aspect-square w-full rounded-2xl"
              />
            </div>
          )}

          {q.speechText && (
            <button
              type="button"
              onClick={() => audioManager.speakEnglish(q.speechText!)}
              className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 font-display text-sm font-bold text-emerald-800 hover:bg-emerald-50 cursor-pointer"
            >
              <Volume2 className="h-4 w-4" />
              Dengarkan Pengucapan
            </button>
          )}

          {/* 3 Large A, B, C Buttons */}
          <div className="mt-6 flex w-full max-w-2xl flex-col gap-3">
            {q.options.map((option, optionIdx) => {
              const letter = OPTION_LETTERS[optionIdx];
              const isPicked = selectedOption === option;
              const isAnswer = option === q.correctAnswer;

              let btnStyle =
                'border-slate-300 bg-white text-slate-900 hover:bg-sky-50 hover:border-sky-300';
              if (answered) {
                if (isAnswer) {
                  btnStyle = 'border-emerald-700 bg-emerald-500 text-white';
                } else if (isPicked && !isAnswer) {
                  btnStyle = 'border-rose-500 bg-rose-100 text-rose-800';
                } else {
                  btnStyle = 'border-slate-200 bg-white/70 text-slate-400';
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelect(option)}
                  className={`flex min-h-[64px] items-center gap-4 rounded-2xl border-b-4 border-2 px-5 py-3 text-left font-display text-xl font-extrabold transition-transform active:translate-y-0.5 cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-extrabold ${
                      answered && isAnswer
                        ? 'bg-white text-emerald-700'
                        : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="flex-1">{option}</span>
                  {answered && isAnswer && <CheckCircle2 className="h-7 w-7 shrink-0" />}
                  {answered && isPicked && !isAnswer && <XCircle className="h-7 w-7 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next */}
          {answered && (
            <div
              className={`mt-6 flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border-2 p-4 sm:p-5 animate-pop-in ${
                isCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-amber-300 bg-amber-50 text-amber-900'
              }`}
            >
              <p className="font-display text-xl sm:text-2xl font-extrabold">
                {isCorrect ? 'HEBAT! JAWABAN BENAR! (+10 Poin)' : 'YAH, KURANG TEPAT!'}
              </p>
              <p className="text-base font-medium">{q.explanationId}</p>

              <button
                type="button"
                onClick={handleNext}
                className="mt-1 inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-8 py-3 font-display text-lg font-extrabold text-white hover:bg-sky-600 cursor-pointer"
              >
                {idx + 1 >= EXERCISE_QUESTIONS.length ? 'LIHAT HASIL LATIHAN' : 'SOAL BERIKUTNYA'}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
