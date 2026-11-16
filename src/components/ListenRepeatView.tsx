import { useEffect, useRef, useState } from 'react';
import { Volume2, Mic, MicOff, CheckCircle2, ChevronLeft, ChevronRight, ArrowLeft, Star } from 'lucide-react';
import { FAMILY_VOCABULARY } from '../data/familyData';
import { CharacterImage } from './CharacterImage';
import { audioManager } from '../utils/audio';

interface ListenRepeatViewProps {
  onBackToMenu: () => void;
  onStarEarned: () => void;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function getSpeechRecognitionConstructor(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

function isClosePronunciation(spoken: string, target: string): boolean {
  const cleanSpoken = spoken.toLowerCase().trim();
  const cleanTarget = target.toLowerCase().trim();
  if (!cleanSpoken) return false;
  if (cleanSpoken.includes(cleanTarget)) return true;

  // Forgiving phonetic equivalents for Grade 1 Indonesian ESL learners
  const aliases: Record<string, string[]> = {
    grandfather: ['grand father', 'grandpa', 'grenfader'],
    grandmother: ['grand mother', 'grandma', 'grenmader'],
    father: ['fader', 'fater', 'farther', 'baba'],
    mother: ['mader', 'mater', 'murder'],
    brother: ['brader', 'bruder', 'bro'],
    sister: ['sis', 'sista'],
    he: ['hi', 'key', 'eat', 'he is'],
    she: ['see', 'sea', 'shi', 'she is'],
  };

  return (aliases[cleanTarget] || []).some((a) => cleanSpoken.includes(a));
}

export function ListenRepeatView({ onBackToMenu, onStarEarned }: ListenRepeatViewProps) {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'retry' | 'info'; text: string } | null>(null);
  const [practicedIds, setPracticedIds] = useState<string[]>([]);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const item = FAMILY_VOCABULARY[index];
  const speechSupported = Boolean(getSpeechRecognitionConstructor());

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const markPracticed = () => {
    if (!practicedIds.includes(item.id)) {
      setPracticedIds((prev) => [...prev, item.id]);
      onStarEarned();
    }
  };

  const handleListenWord = () => {
    setFeedback(null);
    audioManager.speakEnglish(item.english);
  };

  const handleListenSentence = () => {
    setFeedback(null);
    audioManager.speakEnglish(item.exampleSentence);
  };

  const handleMicPractice = () => {
    const SpeechRec = getSpeechRecognitionConstructor();
    if (!SpeechRec) {
      setFeedback({
        type: 'info',
        text: 'Browser ini belum mendukung mikrofon otomatis. Dengarkan suara lalu tirukan dengan lantang ya!',
      });
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      recognitionRef.current = recognition;

      setListening(true);
      setFeedback({ type: 'info', text: `Ucapkan kata "${item.english}" sekarang...` });

      recognition.onresult = (event) => {
        const transcripts: string[] = [];
        const firstResult = event.results[0];
        if (firstResult) {
          for (let i = 0; i < firstResult.length; i += 1) {
            transcripts.push(firstResult[i].transcript);
          }
        }
        const matched = transcripts.some((t) => isClosePronunciation(t, item.english));
        if (matched) {
          audioManager.playSuccess();
          markPracticed();
          setFeedback({
            type: 'success',
            text: `HEBAT! Pengucapan "${item.english}" terdengar jelas sekali!`,
          });
        } else {
          audioManager.playError();
          setFeedback({
            type: 'retry',
            text: `Bagus sudah mencoba! (Terdengar: "${transcripts[0] || '...'}"). Tekan Dengarkan lalu coba ucapkan "${item.english}" lagi ya!`,
          });
        }
      };

      recognition.onerror = (err) => {
        setListening(false);
        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          setFeedback({
            type: 'info',
            text: 'Izin mikrofon belum aktif. Kamu tetap bisa belajar dengan menekan tombol Dengarkan berulang kali!',
          });
        } else {
          setFeedback({
            type: 'retry',
            text: 'Suara belum terdengar jelas. Ayo coba tekan mikrofon dan ucapkan lagi!',
          });
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch {
      setListening(false);
      setFeedback({
        type: 'info',
        text: 'Mikrofon tidak dapat dibuka. Gunakan tombol Dengarkan untuk berlatih pengucapan.',
      });
    }
  };

  const handleSelfConfirm = () => {
    audioManager.playSuccess();
    markPracticed();
    setFeedback({
      type: 'success',
      text: `Pintar! Kamu sudah berlatih mengucapkan "${item.english}"!`,
    });
  };

  const goCard = (nextIdx: number) => {
    recognitionRef.current?.stop();
    setListening(false);
    setFeedback(null);
    audioManager.playClick();
    setIndex(nextIdx);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 animate-pop-in">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">
            DENGARKAN DAN TIRUKAN
          </h1>
          <p className="mt-1 font-display text-lg font-bold text-pink-600">
            Listen and Repeat! · Sudah berlatih {practicedIds.length}/{FAMILY_VOCABULARY.length} kata
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

      {/* Instruction Banner */}
      <div className="mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-base sm:text-lg font-bold text-slate-800">
          1. Tekan <span className="text-sky-700">Dengarkan Kata</span> &nbsp;→&nbsp; 2. Tirukan dengan suara lantang!
        </p>
        <button
          type="button"
          onClick={() => audioManager.speakEnglish(`Listen and repeat! ${item.english}`)}
          className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-amber-300 px-4 py-2 font-display text-sm font-extrabold text-slate-900 hover:bg-amber-200 cursor-pointer whitespace-nowrap"
        >
          <Volume2 className="h-4 w-4" />
          Putar Instruksi
        </button>
      </div>

      {/* Interactive Practice Card */}
      <div className={`rounded-3xl border-2 p-6 sm:p-8 shadow-sm ${item.pastelBg} ${item.pastelBorder}`}>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-xs rounded-3xl border-4 border-white bg-white p-2 shadow-md">
              <CharacterImage
                src={item.image}
                alt={item.english}
                className="aspect-square w-full rounded-2xl"
                fallbackLabel={item.english}
              />
            </div>
          </div>

          <div className="md:col-span-7 flex flex-col items-center text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900">
                {item.english}
              </h2>
              {practicedIds.includes(item.id) && (
                <Star className="h-8 w-8 fill-amber-400 text-amber-500" aria-label="Sudah berlatih" />
              )}
            </div>

            <p className={`mt-1 font-display text-2xl font-bold ${item.accentText}`}>
              {item.indonesian}
            </p>
            <p className="mt-1 text-base text-slate-600">
              Contoh kalimat: <strong className="text-slate-900">&ldquo;{item.exampleSentence}&rdquo;</strong>
            </p>

            {/* Primary Audio & Microphone Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                type="button"
                onClick={handleListenWord}
                className="inline-flex min-h-[60px] items-center gap-2.5 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-6 py-3 font-display text-lg font-extrabold text-white hover:bg-sky-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="h-6 w-6" />
                Dengarkan Kata
              </button>

              <button
                type="button"
                onClick={handleListenSentence}
                className="inline-flex min-h-[60px] items-center gap-2 rounded-2xl border-b-4 border-purple-700 bg-purple-500 px-5 py-3 font-display text-base font-extrabold text-white hover:bg-purple-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <Volume2 className="h-5 w-5" />
                Dengarkan Kalimat
              </button>
            </div>

            {/* Mic + Self Practice Controls */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
              {speechSupported && (
                <button
                  type="button"
                  onClick={handleMicPractice}
                  className={`inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-b-4 px-5 py-3 font-display text-base font-extrabold text-white active:translate-y-0.5 cursor-pointer whitespace-nowrap ${
                    listening
                      ? 'border-rose-700 bg-rose-500 hover:bg-rose-600'
                      : 'border-pink-700 bg-pink-500 hover:bg-pink-600'
                  }`}
                >
                  {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  {listening ? 'Mendengarkan... (Ketuk Berhenti)' : 'Tirukan dengan Mikrofon'}
                </button>
              )}

              <button
                type="button"
                onClick={handleSelfConfirm}
                className="inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3 font-display text-base font-extrabold text-white hover:bg-emerald-600 active:translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="h-5 w-5" />
                Aku Sudah Menirukan!
              </button>
            </div>

            {!speechSupported && (
              <p className="mt-3 text-sm font-medium text-slate-600">
                Mode Audio Aktif: Dengarkan pengucapan berulang kali lalu ucapkan bersama guru atau orang tua.
              </p>
            )}

            {/* Feedback Banner */}
            {feedback && (
              <div
                className={`mt-5 w-full rounded-2xl border-2 p-4 text-left font-semibold animate-pop-in ${
                  feedback.type === 'success'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                    : feedback.type === 'retry'
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : 'border-sky-300 bg-white text-sky-900'
                }`}
              >
                {feedback.text}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation between vocabulary items */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => goCard(index === 0 ? FAMILY_VOCABULARY.length - 1 : index - 1)}
          className="inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-b-4 border-slate-300 bg-white px-6 py-3 font-display text-lg font-extrabold text-slate-800 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
        >
          <ChevronLeft className="h-6 w-6" />
          Sebelumnya
        </button>

        <span className="font-display text-lg font-bold text-slate-700 tabular-nums">
          {index + 1} / {FAMILY_VOCABULARY.length}
        </span>

        <button
          type="button"
          onClick={() => goCard(index === FAMILY_VOCABULARY.length - 1 ? 0 : index + 1)}
          className="inline-flex min-h-[54px] items-center gap-2 rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-6 py-3 font-display text-lg font-extrabold text-white hover:bg-sky-600 cursor-pointer whitespace-nowrap"
        >
          Berikutnya
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
