import { useState } from 'react';
import { Volume2, RotateCcw, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { FAMILY_VOCABULARY } from '../data/familyData';
import { CharacterImage } from './CharacterImage';
import { audioManager } from '../utils/audio';

interface LearningTimeViewProps {
  onBackToMenu: () => void;
  onGoToListenRepeat: () => void;
}

export function LearningTimeView({ onBackToMenu, onGoToListenRepeat }: LearningTimeViewProps) {
  const [index, setIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const item = FAMILY_VOCABULARY[index];

  const handleSpeakWord = (slow?: boolean) => {
    audioManager.speakEnglish(item.english, {
      slow,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handleSpeakSentence = (sentence: string) => {
    audioManager.speakEnglish(sentence, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
    });
  };

  const handlePrev = () => {
    audioManager.playClick();
    setIndex((prev) => (prev === 0 ? FAMILY_VOCABULARY.length - 1 : prev - 1));
  };

  const handleNext = () => {
    audioManager.playClick();
    setIndex((prev) => (prev === FAMILY_VOCABULARY.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 animate-pop-in">
      {/* Header Row */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            MARI BELAJAR <span className="text-sky-600">(LEARNING TIME)</span>
          </h1>
          <p className="mt-1 text-base text-slate-600">
            Kosakata {index + 1} dari {FAMILY_VOCABULARY.length} · Tekan tombol speaker untuk mendengarkan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            audioManager.playClick();
            onBackToMenu();
          }}
          className="inline-flex min-h-[46px] items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 font-display text-sm font-bold text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <ArrowLeft className="h-4 w-4" />
          Menu Utama
        </button>
      </div>

      {/* Quick Selector Strip */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {FAMILY_VOCABULARY.map((vocab, i) => {
          const active = i === index;
          return (
            <button
              key={vocab.id}
              type="button"
              onClick={() => {
                audioManager.playClick();
                setIndex(i);
                audioManager.speakEnglish(vocab.english);
              }}
              className={`min-h-[44px] shrink-0 rounded-2xl border-2 px-4 py-2 font-display text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                active
                  ? `${vocab.accentBg} border-transparent text-white shadow-sm`
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {i + 1}. {vocab.english}
            </button>
          );
        })}
      </div>

      {/* Main Vocabulary Card */}
      <div className={`rounded-3xl border-2 p-6 sm:p-8 shadow-sm ${item.pastelBg} ${item.pastelBorder}`}>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {/* Character Illustration */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-xs rounded-3xl border-4 border-white bg-white p-2 shadow-md">
              <CharacterImage
                src={item.image}
                alt={`${item.english} - ${item.indonesian}`}
                className={`aspect-square w-full rounded-2xl transition-transform ${
                  isSpeaking ? 'scale-[1.03]' : ''
                }`}
                fallbackLabel={item.english}
              />
            </div>
          </div>

          {/* Word, Meaning, Audio Controls, Example Sentences */}
          <div className="md:col-span-7 flex flex-col items-center text-center md:items-start md:text-left">
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
              {item.isPronoun ? 'Kata Ganti Orang (Pronoun)' : 'Anggota Keluarga (Family Member)'}
            </span>

            <h2 className="mt-2 font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
              {item.english}
            </h2>

            <p className={`mt-2 font-display text-2xl sm:text-3xl font-bold ${item.accentText}`}>
              = {item.indonesian}
            </p>

            <p className="mt-1 text-base font-medium text-slate-600">
              Cara baca: <span className="font-bold text-slate-800">/{item.pronunciationHint}/</span>
            </p>

            {/* Speaker + Repeat Audio Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={() => handleSpeakWord(false)}
                className="inline-flex min-h-[56px] items-center gap-2.5 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-6 py-3 font-display text-lg font-bold text-white transition-transform hover:bg-sky-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="h-6 w-6" />
                Dengarkan
              </button>

              <button
                type="button"
                onClick={() => handleSpeakWord(true)}
                className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-b-4 border-amber-500 bg-amber-300 px-5 py-3 font-display text-base font-bold text-slate-900 transition-transform hover:bg-amber-200 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="h-5 w-5" />
                Ulangi Audio (Pelan)
              </button>
            </div>

            {/* Example Sentences */}
            <div className="mt-6 w-full rounded-2xl border border-slate-200 bg-white p-4 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Contoh Kalimat Sederhana
              </p>

              {item.extraSentences ? (
                <div className="space-y-2.5">
                  {item.extraSentences.map((s) => (
                    <div
                      key={s.en}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="font-display text-lg font-bold text-slate-900">{s.en}</p>
                        <p className="text-sm text-slate-600">{s.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeakSentence(s.en)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-sky-100 px-3 py-1.5 font-display text-sm font-bold text-sky-800 hover:bg-sky-200 cursor-pointer whitespace-nowrap"
                        aria-label={`Dengarkan kalimat ${s.en}`}
                      >
                        <Volume2 className="h-4 w-4" />
                        Dengar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900">
                      {item.exampleSentence}
                    </p>
                    <p className="text-sm text-slate-600">{item.exampleTranslation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSpeakSentence(item.exampleSentence)}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-sky-100 px-4 py-2 font-display text-sm font-bold text-sky-800 hover:bg-sky-200 cursor-pointer whitespace-nowrap"
                  >
                    <Volume2 className="h-4 w-4" />
                    Putar Kalimat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Previous & Next Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-b-4 border-slate-300 bg-white px-6 py-3 font-display text-lg font-extrabold text-slate-800 transition-transform hover:bg-slate-50 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
        >
          <ChevronLeft className="h-6 w-6" />
          PREVIOUS
        </button>

        {index === FAMILY_VOCABULARY.length - 1 ? (
          <button
            type="button"
            onClick={() => {
              audioManager.playSuccess();
              onGoToListenRepeat();
            }}
            className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-b-4 border-pink-700 bg-pink-500 px-6 py-3 font-display text-lg font-extrabold text-white transition-transform hover:bg-pink-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            LANJUT: DENGARKAN &amp; TIRUKAN
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-8 py-3 font-display text-lg font-extrabold text-white transition-transform hover:bg-emerald-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            NEXT
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}
