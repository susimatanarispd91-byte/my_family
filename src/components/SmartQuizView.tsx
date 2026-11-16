import { useMemo, useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { SMART_QUIZ_POOL, shuffleArray } from '../data/familyData';
import { CharacterImage } from './CharacterImage';
import { ResultSummary, ResultData } from './ResultSummary';
import { audioManager } from '../utils/audio';

interface SmartQuizViewProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
  onAddStars: (count: number) => void;
}

export function SmartQuizView({
  studentName,
  onChangeStudentName,
  onBackToMenu,
  onReviewMaterial,
  onAddStars,
}: SmartQuizViewProps) {
  const [seed, setSeed] = useState(0);

  const questions = useMemo(() => {
    const picked = shuffleArray(SMART_QUIZ_POOL).slice(0, 10);
    return picked.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  }, [seed]);

  const [idx, setIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];
  const answered = selectedOption !== null;
  const isCorrect = selectedOption === q.correctAnswer;

  const handleRestart = () => {
    setSeed((s) => s + 1);
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
    if (idx + 1 >= questions.length) {
      onAddStars(Math.max(1, Math.round(correctCount / 2)));
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelectedOption(null);
    }
  };

  if (finished) {
    const result: ResultData = {
      title: 'KUIS CERDAS (SMART QUIZ)',
      correctCount,
      wrongCount,
      totalQuestions: questions.length,
      score,
      maxScore: questions.length * 10,
      isQuiz: true,
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
            KUIS CERDAS <span className="text-purple-600">(SMART QUIZ)</span>
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 tabular-nums">
            Pertanyaan Acak {idx + 1} dari {questions.length} · Skor: {score}
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

      {/* Question Indicator Dots */}
      <div className="mb-6 flex flex-wrap items-center gap-1.5" aria-label="Indikator soal kuis">
        {questions.map((item, i) => (
          <div
            key={item.id}
            className={`h-3 flex-1 min-w-[20px] rounded-full transition-colors ${
              i < idx ? 'bg-purple-500' : i === idx ? 'bg-amber-400' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      <div className="rounded-3xl border-2 border-purple-200 bg-purple-50/60 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="font-display text-sm font-extrabold uppercase tracking-wider text-purple-700">
            Kuis Nomor {idx + 1}
          </span>

          <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {q.questionId}
          </h2>

          {q.questionEn && (
            <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-purple-700">
              {q.questionEn}
            </p>
          )}

          {q.image && (
            <div className="mt-5 w-full max-w-[220px] rounded-3xl border-4 border-white bg-white p-2 shadow-md">
              <CharacterImage
                src={q.image}
                alt="Gambar soal kuis"
                className="aspect-square w-full rounded-2xl"
              />
            </div>
          )}

          {q.speechText && (
            <button
              type="button"
              onClick={() => audioManager.speakEnglish(q.speechText!)}
              className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-purple-300 bg-white px-4 py-2 font-display text-sm font-bold text-purple-800 hover:bg-purple-50 cursor-pointer"
            >
              <Volume2 className="h-4 w-4" />
              Dengarkan Audio
            </button>
          )}

          {/* 3 Choices */}
          <div className="mt-6 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {q.options.map((option) => {
              const isPicked = selectedOption === option;
              const isAnswer = option === q.correctAnswer;

              let btnStyle =
                'border-purple-200 bg-white text-slate-900 hover:bg-purple-100/70';
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
                  className={`flex min-h-[68px] items-center justify-center gap-2 rounded-2xl border-b-4 border-2 px-4 py-3 font-display text-xl font-extrabold transition-transform active:translate-y-0.5 cursor-pointer ${btnStyle}`}
                >
                  <span>{option}</span>
                  {answered && isAnswer && <CheckCircle2 className="h-6 w-6 shrink-0" />}
                  {answered && isPicked && !isAnswer && <XCircle className="h-6 w-6 shrink-0" />}
                </button>
              );
            })}
          </div>

          {answered && (
            <div
              className={`mt-6 flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border-2 p-4 sm:p-5 animate-pop-in ${
                isCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : 'border-amber-300 bg-amber-50 text-amber-900'
              }`}
            >
              <p className="font-display text-xl sm:text-2xl font-extrabold">
                {isCorrect ? 'BENAR SEKALI! (+10 Poin)' : 'AYO TERUS SEMANGAT!'}
              </p>
              <p className="text-base font-medium">{q.explanationId}</p>

              <button
                type="button"
                onClick={handleNext}
                className="mt-1 inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-b-4 border-purple-700 bg-purple-600 px-8 py-3 font-display text-lg font-extrabold text-white hover:bg-purple-700 cursor-pointer"
              >
                {idx + 1 >= questions.length ? 'LIHAT PIALA & HASIL' : 'LANJUT'}
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
