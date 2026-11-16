import { useMemo, useState } from 'react';
import { ArrowLeft, Volume2, RotateCcw, Star, ChevronRight } from 'lucide-react';
import { COMPLETE_WORD_ITEMS, shuffleArray } from '../../data/familyData';
import { CharacterImage } from '../CharacterImage';
import { ResultSummary, ResultData } from '../ResultSummary';
import { audioManager } from '../../utils/audio';

interface Game4CompleteWordProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onBackToGames: () => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
  onAddStars: (count: number) => void;
}

export function Game4CompleteWord({
  studentName,
  onChangeStudentName,
  onBackToGames,
  onBackToMenu,
  onReviewMaterial,
  onAddStars,
}: Game4CompleteWordProps) {
  const [seed, setSeed] = useState(0);
  const items = useMemo(() => shuffleArray(COMPLETE_WORD_ITEMS), [seed]);

  const [idx, setIdx] = useState(0);
  const [filledLetters, setFilledLetters] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [hadWrong, setHadWrong] = useState(false);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);

  const item = items[idx];
  const letterChoices = useMemo(() => shuffleArray(item.choices), [item, seed]);

  const handleRestart = () => {
    setSeed((s) => s + 1);
    setIdx(0);
    setFilledLetters([]);
    setSolved(false);
    setHadWrong(false);
    setFirstTryCorrect(0);
    setWrongCount(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const handleLetterClick = (letter: string) => {
    if (solved) return;
    if (filledLetters.length >= item.missingLetters.length) return;

    audioManager.playClick();
    const nextLetters = [...filledLetters, letter];
    setFilledLetters(nextLetters);

    if (nextLetters.length === item.missingLetters.length) {
      const isMatch = nextLetters.every((ch, i) => ch === item.missingLetters[i]);
      if (isMatch) {
        audioManager.playSuccess();
        audioManager.speakEnglish(item.word);
        setSolved(true);
        if (!hadWrong) {
          setFirstTryCorrect((c) => c + 1);
        }
        setScore((s) => s + 10);
        setFeedback({
          type: 'correct',
          text: `HEBAT! Kata yang benar adalah ${item.word} (${item.indonesian})! (+10 Poin)`,
        });
      } else {
        audioManager.playError();
        setWrongCount((w) => w + 1);
        setHadWrong(true);
        setFeedback({
          type: 'wrong',
          text: 'Hampir benar! Ayo coba pilih huruf yang tepat lagi!',
        });
        window.setTimeout(() => {
          setFilledLetters([]);
        }, 550);
      }
    }
  };

  const handleClear = () => {
    if (solved) return;
    audioManager.playClick();
    setFilledLetters([]);
    setFeedback(null);
  };

  const handleNext = () => {
    audioManager.playClick();
    if (idx + 1 >= items.length) {
      onAddStars(Math.max(1, Math.round(firstTryCorrect / 2)));
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setFilledLetters([]);
      setSolved(false);
      setHadWrong(false);
      setFeedback(null);
    }
  };

  if (finished) {
    const result: ResultData = {
      title: 'GAME 4 · COMPLETE THE WORD',
      correctCount: firstTryCorrect,
      wrongCount,
      totalQuestions: items.length,
      score,
      maxScore: items.length * 10,
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

  let blankPointer = 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 animate-pop-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            GAME 4: COMPLETE THE WORD
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 tabular-nums">
            Kata {idx + 1} dari {items.length} · Skor: {score} Poin
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
          className="h-full rounded-full bg-amber-500 transition-all duration-300"
          style={{ width: `${((idx + (solved ? 1 : 0)) / items.length) * 100}%` }}
        />
      </div>

      <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/70 p-6 sm:p-8 text-center">
        <p className="font-display text-lg sm:text-xl font-bold text-slate-800">
          Klik huruf yang tepat untuk melengkapi kata!
        </p>

        <div className="mt-4 mx-auto w-full max-w-[220px] rounded-3xl border-4 border-white bg-white p-2 shadow-md">
          <CharacterImage
            src={item.image}
            alt={item.indonesian}
            className="aspect-square w-full rounded-2xl"
            fallbackLabel={item.indonesian}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <span className="font-display text-lg font-extrabold text-amber-800">
            Arti: {item.indonesian}
          </span>
          <button
            type="button"
            onClick={() => audioManager.speakEnglish(item.word)}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-amber-300 bg-white px-4 py-2 font-display text-sm font-bold text-amber-900 hover:bg-amber-100 cursor-pointer"
          >
            <Volume2 className="h-4 w-4" />
            Dengarkan Kata
          </button>
        </div>

        {/* Word Tile Display */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {item.pattern.split('').map((ch, charIdx) => {
            if (ch === '_') {
              const filled = filledLetters[blankPointer];
              blankPointer += 1;
              return (
                <span
                  key={charIdx}
                  className={`flex h-12 w-10 sm:h-14 sm:w-12 items-center justify-center rounded-xl border-2 font-display text-2xl sm:text-3xl font-extrabold ${
                    solved
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : filled
                        ? 'border-sky-500 bg-sky-100 text-sky-900'
                        : 'border-dashed border-amber-500 bg-white text-amber-500'
                  }`}
                >
                  {filled || '?'}
                </span>
              );
            }
            return (
              <span
                key={charIdx}
                className="flex h-12 w-9 sm:h-14 sm:w-11 items-center justify-center rounded-xl border border-slate-200 bg-white font-display text-2xl sm:text-3xl font-extrabold text-slate-900"
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* Letter Choices */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {letterChoices.map((letter) => (
            <button
              key={letter}
              type="button"
              disabled={solved}
              onClick={() => handleLetterClick(letter)}
              className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-4 border-sky-700 bg-sky-500 font-display text-3xl font-extrabold text-white shadow-sm transition-transform hover:bg-sky-600 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
            >
              {letter}
            </button>
          ))}

          {!solved && filledLetters.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex h-16 items-center gap-2 rounded-2xl border-b-4 border-slate-300 bg-white px-4 font-display text-base font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="h-5 w-5" />
              Ulangi
            </button>
          )}
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
                {idx + 1 >= items.length ? 'LIHAT HASIL' : 'LANJUT'}
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
