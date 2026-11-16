import { useMemo, useState } from 'react';
import { ArrowLeft, Volume2, Star, ChevronRight } from 'lucide-react';
import { WHO_IS_QUESTIONS, shuffleArray } from '../../data/familyData';
import { CharacterImage } from '../CharacterImage';
import { ResultSummary, ResultData } from '../ResultSummary';
import { audioManager } from '../../utils/audio';

interface Game3WhoIsHeSheProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onBackToGames: () => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
  onAddStars: (count: number) => void;
}

export function Game3WhoIsHeShe({
  studentName,
  onChangeStudentName,
  onBackToGames,
  onBackToMenu,
  onReviewMaterial,
  onAddStars,
}: Game3WhoIsHeSheProps) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => shuffleArray(WHO_IS_QUESTIONS), [seed]);

  const [idx, setIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongTried, setWrongTried] = useState<string | null>(null);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  const handleRestart = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setSolved(false);
    setWrongTried(null);
    setFirstTryCorrect(0);
    setWrongCount(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const handleAnswer = (choice: 'HE' | 'SHE') => {
    if (solved) return;

    if (choice === q.answer) {
      audioManager.playSuccess();
      audioManager.speakEnglish(q.speechText);
      setSolved(true);
      if (!wrongTried) {
        setFirstTryCorrect((c) => c + 1);
      }
      setScore((s) => s + 10);
      setFeedback({
        type: 'correct',
        text: `BENAR! "${q.speechText}" (${q.answer === 'HE' ? 'He = Dia Laki-laki' : 'She = Dia Perempuan'})`,
      });
    } else {
      audioManager.playError();
      if (!wrongTried) {
        setWrongCount((w) => w + 1);
      }
      setWrongTried(choice);
      setFeedback({
        type: 'wrong',
        text: `TRY AGAIN! Perhatikan gambarnya: ${q.characterName} adalah ${
          q.answer === 'HE' ? 'laki-laki (HE)' : 'perempuan (SHE)'
        }. Ayo pilih jawaban yang benar!`,
      });
    }
  };

  const handleNext = () => {
    audioManager.playClick();
    if (idx + 1 >= questions.length) {
      onAddStars(Math.max(1, Math.round(firstTryCorrect / 2)));
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSolved(false);
      setWrongTried(null);
      setFeedback(null);
    }
  };

  if (finished) {
    const result: ResultData = {
      title: 'GAME 3 · WHO IS HE? WHO IS SHE?',
      correctCount: firstTryCorrect,
      wrongCount,
      totalQuestions: questions.length,
      score,
      maxScore: questions.length * 10,
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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            GAME 3: WHO IS HE? WHO IS SHE?
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 tabular-nums">
            Pertanyaan {idx + 1} dari {questions.length} · Skor: {score}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            audioManager.playClick();
            onBackToGames();
          }}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 font-display text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          Pilih Game
        </button>
      </div>

      <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${((idx + (solved ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/70 p-6 sm:p-8 text-center">
        <div className="mx-auto w-full max-w-[240px] rounded-3xl border-4 border-white bg-white p-2 shadow-md">
          <CharacterImage
            src={q.image}
            alt={q.characterName}
            className="aspect-square w-full rounded-2xl"
            fallbackLabel={q.characterName}
          />
        </div>

        <h2 className="mt-5 font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
          {q.prompt}
        </h2>
        <p className="mt-1 text-base font-medium text-slate-600">{q.translation}</p>

        <button
          type="button"
          onClick={() => audioManager.speakEnglish(q.speechText)}
          className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 font-display text-sm font-bold text-emerald-700 hover:bg-emerald-50 cursor-pointer"
        >
          <Volume2 className="h-4 w-4" />
          Dengarkan Kalimat
        </button>

        {/* Two Big HE and SHE Buttons */}
        <div className="mx-auto mt-7 grid max-w-xl grid-cols-2 gap-4 sm:gap-6">
          <button
            type="button"
            disabled={solved}
            onClick={() => handleAnswer('HE')}
            className={`min-h-[84px] rounded-3xl border-b-4 p-4 font-display text-3xl sm:text-4xl font-extrabold transition-transform active:translate-y-0.5 cursor-pointer ${
              solved && q.answer === 'HE'
                ? 'border-emerald-700 bg-emerald-500 text-white scale-[1.03]'
                : wrongTried === 'HE'
                  ? 'border-rose-300 bg-rose-100 text-rose-500 animate-wiggle'
                  : 'border-sky-700 bg-sky-500 text-white hover:bg-sky-600'
            }`}
          >
            HE
            <span className="block text-sm font-bold opacity-90">Dia Laki-laki</span>
          </button>

          <button
            type="button"
            disabled={solved}
            onClick={() => handleAnswer('SHE')}
            className={`min-h-[84px] rounded-3xl border-b-4 p-4 font-display text-3xl sm:text-4xl font-extrabold transition-transform active:translate-y-0.5 cursor-pointer ${
              solved && q.answer === 'SHE'
                ? 'border-emerald-700 bg-emerald-500 text-white scale-[1.03]'
                : wrongTried === 'SHE'
                  ? 'border-rose-300 bg-rose-100 text-rose-500 animate-wiggle'
                  : 'border-pink-700 bg-pink-500 text-white hover:bg-pink-600'
            }`}
          >
            SHE
            <span className="block text-sm font-bold opacity-90">Dia Perempuan</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-6 flex flex-col items-center gap-3 rounded-2xl border-2 p-4 sm:p-5 animate-pop-in ${
              feedback.type === 'correct'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-amber-300 bg-amber-50 text-amber-900'
            }`}
          >
            {feedback.type === 'correct' && (
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="h-7 w-7 fill-amber-400" />
                <Star className="h-8 w-8 fill-amber-400" />
                <Star className="h-7 w-7 fill-amber-400" />
              </div>
            )}
            <p className="font-display text-lg sm:text-xl font-extrabold">{feedback.text}</p>

            {solved && (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-8 py-3 font-display text-lg font-extrabold text-white hover:bg-emerald-600 cursor-pointer"
              >
                {idx + 1 >= questions.length ? 'LIHAT HASIL' : 'LANJUT'}
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
