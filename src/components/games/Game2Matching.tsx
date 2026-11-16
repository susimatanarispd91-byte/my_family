import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Volume2, RotateCcw } from 'lucide-react';
import { SIX_FAMILY_MEMBERS, FamilyItem, shuffleArray } from '../../data/familyData';
import { CharacterImage } from '../CharacterImage';
import { ResultSummary, ResultData } from '../ResultSummary';
import { audioManager } from '../../utils/audio';

interface Game2MatchingProps {
  studentName: string;
  onChangeStudentName: (name: string) => void;
  onBackToGames: () => void;
  onBackToMenu: () => void;
  onReviewMaterial: () => void;
  onAddStars: (count: number) => void;
}

export function Game2Matching({
  studentName,
  onChangeStudentName,
  onBackToGames,
  onBackToMenu,
  onReviewMaterial,
  onAddStars,
}: Game2MatchingProps) {
  const [seed, setSeed] = useState(0);
  const pictureCards = useMemo(() => shuffleArray(SIX_FAMILY_MEMBERS), [seed]);
  const wordCards = useMemo(() => shuffleArray(SIX_FAMILY_MEMBERS), [seed]);

  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);

  const handleRestart = () => {
    setSeed((s) => s + 1);
    setSelectedWordId(null);
    setSelectedPictureId(null);
    setMatchedIds([]);
    setWrongCount(0);
    setScore(0);
    setFeedback(null);
    setFinished(false);
  };

  const evaluatePair = (wordId: string, pictureId: string) => {
    if (matchedIds.includes(pictureId)) return;

    if (wordId === pictureId) {
      const matchedItem = SIX_FAMILY_MEMBERS.find((m) => m.id === wordId);
      audioManager.playSuccess();
      if (matchedItem) {
        audioManager.speakEnglish(matchedItem.english);
      }
      const nextMatched = [...matchedIds, wordId];
      setMatchedIds(nextMatched);
      setScore((s) => s + 15);
      setSelectedWordId(null);
      setSelectedPictureId(null);
      setFeedback({
        type: 'success',
        text: `Benar! Itu adalah ${matchedItem?.english} (${matchedItem?.indonesian})!`,
      });

      if (nextMatched.length === SIX_FAMILY_MEMBERS.length) {
        onAddStars(3);
        window.setTimeout(() => setFinished(true), 800);
      }
    } else {
      audioManager.playError();
      setWrongCount((w) => w + 1);
      setSelectedWordId(null);
      setSelectedPictureId(null);
      setFeedback({
        type: 'error',
        text: 'Belum cocok! Ayo coba pasangan yang lain ya!',
      });
    }
  };

  const handleWordClick = (item: FamilyItem) => {
    if (matchedIds.includes(item.id)) return;
    audioManager.playClick();
    audioManager.speakEnglish(item.english);
    if (selectedPictureId) {
      evaluatePair(item.id, selectedPictureId);
    } else {
      setSelectedWordId(item.id === selectedWordId ? null : item.id);
    }
  };

  const handlePictureClick = (item: FamilyItem) => {
    if (matchedIds.includes(item.id)) return;
    audioManager.playClick();
    if (selectedWordId) {
      evaluatePair(selectedWordId, item.id);
    } else {
      setSelectedPictureId(item.id === selectedPictureId ? null : item.id);
    }
  };

  if (finished) {
    const finalScore = Math.max(20, 90 - wrongCount * 5);
    const result: ResultData = {
      title: 'GAME 2 · MATCHING GAME',
      correctCount: SIX_FAMILY_MEMBERS.length,
      wrongCount,
      totalQuestions: SIX_FAMILY_MEMBERS.length,
      score: Math.min(90, Math.max(score - wrongCount * 5, 30)),
      maxScore: SIX_FAMILY_MEMBERS.length * 15,
    };
    void finalScore;
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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 animate-pop-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            GAME 2: MATCHING GAME
          </h1>
          <p className="text-sm sm:text-base font-semibold text-slate-600 tabular-nums">
            Cocok: {matchedIds.length}/{SIX_FAMILY_MEMBERS.length} · Skor: {score}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              audioManager.playClick();
              handleRestart();
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border-2 border-amber-200 bg-amber-50 px-4 py-2 font-display text-sm font-bold text-amber-800 hover:bg-amber-100 cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            Acak Ulang
          </button>

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
      </div>

      {/* Instruction */}
      <div className="mb-5 rounded-2xl border-2 border-pink-200 bg-pink-50 p-4 text-center">
        <p className="font-display text-base sm:text-lg font-bold text-slate-800">
          Tarik kartu kata ke gambar, atau klik satu <strong>Kata</strong> lalu klik <strong>Gambar</strong> yang cocok!
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-5 rounded-2xl border-2 p-3.5 text-center font-display text-lg font-extrabold animate-pop-in ${
            feedback.type === 'success'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
              : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Matching Board: Words + Pictures */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 6 Word Cards */}
        <div className="lg:col-span-5">
          <h2 className="mb-3 font-display text-lg font-extrabold text-slate-800">
            1. Pilih Kartu Kata
          </h2>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {wordCards.map((wordItem) => {
              const isMatched = matchedIds.includes(wordItem.id);
              const isSelected = selectedWordId === wordItem.id;
              return (
                <button
                  key={wordItem.id}
                  type="button"
                  draggable={!isMatched}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', wordItem.id);
                    setSelectedWordId(wordItem.id);
                  }}
                  disabled={isMatched}
                  onClick={() => handleWordClick(wordItem)}
                  className={`flex min-h-[60px] items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 font-display text-lg font-extrabold transition-all cursor-pointer ${
                    isMatched
                      ? 'border-emerald-300 bg-emerald-100 text-emerald-800 opacity-75 cursor-default'
                      : isSelected
                        ? 'border-sky-500 bg-sky-500 text-white shadow-md scale-[1.02]'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  <span>{wordItem.english}</span>
                  {isMatched ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                  ) : (
                    <Volume2 className={`h-5 w-5 shrink-0 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6 Picture Cards */}
        <div className="lg:col-span-7">
          <h2 className="mb-3 font-display text-lg font-extrabold text-slate-800">
            2. Cocokkan dengan Gambar
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {pictureCards.map((picItem) => {
              const isMatched = matchedIds.includes(picItem.id);
              const isSelected = selectedPictureId === picItem.id;

              return (
                <button
                  key={picItem.id}
                  type="button"
                  disabled={isMatched}
                  onDragOver={(e) => {
                    if (!isMatched) e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedWordId = e.dataTransfer.getData('text/plain');
                    if (draggedWordId && !isMatched) {
                      evaluatePair(draggedWordId, picItem.id);
                    }
                  }}
                  onClick={() => handlePictureClick(picItem)}
                  className={`relative flex flex-col items-center rounded-3xl border-2 p-2.5 transition-all cursor-pointer ${
                    isMatched
                      ? 'border-emerald-400 bg-emerald-50'
                      : isSelected
                        ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-200'
                        : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-sky-50/40'
                  }`}
                >
                  <CharacterImage
                    src={picItem.image}
                    alt="Kartu gambar anggota keluarga"
                    className="aspect-square w-full rounded-2xl"
                    fallbackLabel="Family"
                  />

                  {isMatched ? (
                    <div className="mt-2 flex items-center gap-1 text-emerald-700 font-display text-sm font-extrabold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{picItem.english}</span>
                    </div>
                  ) : (
                    <span className="mt-2 font-display text-sm font-bold text-slate-500">
                      {isSelected ? 'Dipilih' : 'Pilih / Taruh di sini'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
