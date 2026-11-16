import { useMemo, useState } from 'react';
import { ArrowLeft, Star, Volume2, ChevronRight } from 'lucide-react';
import { FAMILY_VOCABULARY, FamilyItem, shuffleArray } from '../../data/familyData';
import { CharacterImage } from '../CharacterImage';
import { ResultSummary, ResultData } from '../ResultSummary';
import { audioManager } from '../../utils/audio';

interface Game1GuessFamilyProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onBackToGames: () => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
  onAddStars: (count: number) => void;
}

interface RoundItem {
  target: FamilyItem;
  options: FamilyItem[];
}

function buildRounds(): RoundItem[] {
  const ordered = shuffleArray(FAMILY_VOCABULARY);
  return ordered.map((target) => {
    const distractors = shuffleArray(
      FAMILY_VOCABULARY.filter((item) => item.id !== target.id)
    ).slice(0, 2);
    return {
      target,
      options: shuffleArray([target, ...distractors]),
    };
  });
}

export function Game1GuessFamily({
  studentName,
  onChangeStudentName,
  onBackToGames,
  onBackToMenu,
  onReviewMaterial,
  onAddStars,
}: Game1GuessFamilyProps) {
  const [roundSeed, setRoundSeed] = useState(0);
  const rounds = useMemo(() => buildRounds(), [roundSeed]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [solvedCurrent, setSolvedCurrent] = useState(false);
  const [wrongAttemptedIds, setWrongAttemptedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentRound = rounds[currentIdx];

  const handleRestart = () => {
    setRoundSeed((s) => s + 1);
    setCurrentIdx(0);
    setSolvedCurrent(false);
    setWrongAttemptedIds([]);
    setFeedback(null);
    setFirstTryCorrectCount(0);
    setWrongCount(0);
    setScore(0);
    setFinished(false);
  };

  const handleOptionClick = (option: FamilyItem) => {
    if (solvedCurrent) return;

    if (option.id === currentRound.target.id) {
      audioManager.playSuccess();
      audioManager.speakEnglish(option.english);
      setSolvedCurrent(true);
      if (wrongAttemptedIds.length === 0) {
        setFirstTryCorrectCount((c) => c + 1);
      }
      setScore((s) => s + 10);
      setFeedback({
        type: 'correct',
        text: 'GREAT JOB! YOU ARE AMAZING!',
      });
    } else {
      audioManager.playError();
      if (!wrongAttemptedIds.includes(option.id)) {
        setWrongAttemptedIds((prev) => [...prev, option.id]);
        setWrongCount((w) => w + 1);
      }
      setFeedback({
        type: 'wrong',
        text: 'TRY AGAIN! YOU CAN DO IT!',
      });
    }
  };

  const handleNext = () => {
    audioManager.playClick();
    if (currentIdx + 1 >= rounds.length) {
      onAddStars(Math.max(1, Math.round(firstTryCorrectCount / 2)));
      setFinished(true);
    } else {
      setCurrentIdx((idx) => idx + 1);
      setSolvedCurrent(false);
      setWrongAttemptedIds([]);
      setFeedback(null);
    }
  };

  if (finished) {
    const result: ResultData = {
      title: 'GAME 1 · GUESS THE FAMILY',
      correctCount: firstTryCorrectCount,
      wrongCount,
      totalQuestions: rounds.length,
      score,
      maxScore: rounds.length * 10,
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
            GAME 1: GUESS THE FAMILY
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 tabular-nums">
            Gambar {currentIdx + 1} dari {rounds.length} · Skor: {score}
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

      {/* Progress Bar */}
      <div className="mb-6 h-3 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-sky-500 transition-all duration-300"
          style={{ width: `${((currentIdx + (solvedCurrent ? 1 : 0)) / rounds.length) * 100}%` }}
        />
      </div>

      <div className="rounded-3xl border-2 border-sky-200 bg-sky-50/70 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <p className="font-display text-xl sm:text-2xl font-bold text-slate-800">
            Siapakah anggota keluarga pada gambar ini?
          </p>

          <div className="mt-5 w-full max-w-[260px] rounded-3xl border-4 border-white bg-white p-2 shadow-md">
            <CharacterImage
              src={currentRound.target.image}
              alt="Tebak karakter keluarga"
              className="aspect-square w-full rounded-2xl"
              fallbackLabel="Who is this?"
            />
          </div>

          <button
            type="button"
            onClick={() => audioManager.speakEnglish(currentRound.target.english)}
            className="mt-4 inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-sky-300 bg-white px-4 py-2 font-display text-sm font-bold text-sky-700 hover:bg-sky-50 cursor-pointer"
          >
            <Volume2 className="h-4 w-4" />
            Petunjuk Suara
          </button>

          {/* 3 Choices */}
          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {currentRound.options.map((option) => {
              const isWrongTried = wrongAttemptedIds.includes(option.id);
              const isSolvedMatch = solvedCurrent && option.id === currentRound.target.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={solvedCurrent || isWrongTried}
                  onClick={() => handleOptionClick(option)}
                  className={`min-h-[64px] rounded-2xl border-b-4 px-5 py-4 font-display text-xl font-extrabold transition-transform active:translate-y-0.5 cursor-pointer ${
                    isSolvedMatch
                      ? 'border-emerald-700 bg-emerald-500 text-white scale-[1.03]'
                      : isWrongTried
                        ? 'border-rose-300 bg-rose-100 text-rose-400 cursor-not-allowed animate-wiggle'
                        : 'border-sky-300 bg-white text-slate-900 hover:bg-sky-100'
                  }`}
                >
                  {option.english}
                </button>
              );
            })}
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`mt-6 flex w-full flex-col items-center gap-3 rounded-2xl border-2 p-4 sm:p-5 animate-pop-in ${
                feedback.type === 'correct'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-amber-300 bg-amber-50 text-amber-900'
              }`}
            >
              {feedback.type === 'correct' && (
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Star className="h-7 w-7 fill-amber-400 animate-gentle-bounce" />
                  <Star className="h-9 w-9 fill-amber-400 animate-gentle-bounce" />
                  <Star className="h-7 w-7 fill-amber-400 animate-gentle-bounce" />
                </div>
              )}

              <p className="font-display text-xl sm:text-2xl font-extrabold">
                {feedback.text}
              </p>

              {solvedCurrent && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="mt-1 inline-flex min-h-[52px] items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-8 py-3 font-display text-lg font-extrabold text-white hover:bg-emerald-600 cursor-pointer"
                >
                  {currentIdx + 1 >= rounds.length ? 'LIHAT HASIL' : 'LANJUT'}
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
