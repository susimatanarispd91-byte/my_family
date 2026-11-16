import heroGroupImg from '../assets/images/family_hero_group_1794791646578.jpg';
import grandfatherImg from '../assets/images/char_grandfather_1794791646897.jpg';
import grandmotherImg from '../assets/images/char_grandmother_1794791648275.jpg';
import fatherImg from '../assets/images/char_father_1794791647939.jpg';
import motherImg from '../assets/images/char_mother_1794791647646.jpg';
import brotherImg from '../assets/images/char_brother_1794791648986.jpg';
import sisterImg from '../assets/images/char_sister_1794791650277.jpg';
import heBoyImg from '../assets/images/char_he_boy_1794791650837.jpg';
import sheGirlImg from '../assets/images/char_she_girl_1794791650811.jpg';

export type FamilyId =
  | 'grandfather'
  | 'grandmother'
  | 'father'
  | 'mother'
  | 'brother'
  | 'sister'
  | 'he'
  | 'she';

export interface FamilyItem {
  id: FamilyId;
  english: string;
  indonesian: string;
  pronunciationHint: string;
  gender: 'male' | 'female';
  isPronoun?: boolean;
  image: string;
  exampleSentence: string;
  exampleTranslation: string;
  extraSentences?: { en: string; id: string }[];
  pastelBg: string;
  pastelBorder: string;
  accentText: string;
  accentBg: string;
}

export const HERO_FAMILY_IMAGE = heroGroupImg;

export const FAMILY_VOCABULARY: FamilyItem[] = [
  {
    id: 'grandfather',
    english: 'GRANDFATHER',
    indonesian: 'KAKEK',
    pronunciationHint: 'gren-fa-dher',
    gender: 'male',
    image: grandfatherImg,
    exampleSentence: 'He is my grandfather.',
    exampleTranslation: 'Dia adalah kakekku.',
    pastelBg: 'bg-sky-50',
    pastelBorder: 'border-sky-200',
    accentText: 'text-sky-700',
    accentBg: 'bg-sky-500',
  },
  {
    id: 'grandmother',
    english: 'GRANDMOTHER',
    indonesian: 'NENEK',
    pronunciationHint: 'gren-ma-dher',
    gender: 'female',
    image: grandmotherImg,
    exampleSentence: 'She is my grandmother.',
    exampleTranslation: 'Dia adalah nenekku.',
    pastelBg: 'bg-pink-50',
    pastelBorder: 'border-pink-200',
    accentText: 'text-pink-700',
    accentBg: 'bg-pink-500',
  },
  {
    id: 'father',
    english: 'FATHER',
    indonesian: 'AYAH',
    pronunciationHint: 'fa-dher',
    gender: 'male',
    image: fatherImg,
    exampleSentence: 'He is my father.',
    exampleTranslation: 'Dia adalah ayahku.',
    pastelBg: 'bg-amber-50',
    pastelBorder: 'border-amber-200',
    accentText: 'text-amber-700',
    accentBg: 'bg-amber-500',
  },
  {
    id: 'mother',
    english: 'MOTHER',
    indonesian: 'IBU',
    pronunciationHint: 'ma-dher',
    gender: 'female',
    image: motherImg,
    exampleSentence: 'She is my mother.',
    exampleTranslation: 'Dia adalah ibuku.',
    pastelBg: 'bg-emerald-50',
    pastelBorder: 'border-emerald-200',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-500',
  },
  {
    id: 'brother',
    english: 'BROTHER',
    indonesian: 'SAUDARA LAKI-LAKI',
    pronunciationHint: 'bra-dher',
    gender: 'male',
    image: brotherImg,
    exampleSentence: 'He is my brother.',
    exampleTranslation: 'Dia adalah saudara laki-lakiku.',
    pastelBg: 'bg-purple-50',
    pastelBorder: 'border-purple-200',
    accentText: 'text-purple-700',
    accentBg: 'bg-purple-500',
  },
  {
    id: 'sister',
    english: 'SISTER',
    indonesian: 'SAUDARA PEREMPUAN',
    pronunciationHint: 'sis-ter',
    gender: 'female',
    image: sisterImg,
    exampleSentence: 'She is my sister.',
    exampleTranslation: 'Dia adalah saudara perempuanku.',
    pastelBg: 'bg-sky-50',
    pastelBorder: 'border-sky-200',
    accentText: 'text-sky-700',
    accentBg: 'bg-sky-500',
  },
  {
    id: 'he',
    english: 'HE',
    indonesian: 'DIA LAKI-LAKI',
    pronunciationHint: 'hi',
    gender: 'male',
    isPronoun: true,
    image: heBoyImg,
    exampleSentence: 'He is my father.',
    exampleTranslation: 'Dia adalah ayahku.',
    extraSentences: [
      { en: 'He is my father.', id: 'Dia adalah ayahku.' },
      { en: 'He is my brother.', id: 'Dia adalah saudara laki-lakiku.' },
      { en: 'He is my grandfather.', id: 'Dia adalah kakekku.' },
    ],
    pastelBg: 'bg-teal-50',
    pastelBorder: 'border-teal-200',
    accentText: 'text-teal-700',
    accentBg: 'bg-teal-500',
  },
  {
    id: 'she',
    english: 'SHE',
    indonesian: 'DIA PEREMPUAN',
    pronunciationHint: 'syi',
    gender: 'female',
    isPronoun: true,
    image: sheGirlImg,
    exampleSentence: 'She is my mother.',
    exampleTranslation: 'Dia adalah ibuku.',
    extraSentences: [
      { en: 'She is my mother.', id: 'Dia adalah ibuku.' },
      { en: 'She is my sister.', id: 'Dia adalah saudara perempuanku.' },
      { en: 'She is my grandmother.', id: 'Dia adalah nenekku.' },
    ],
    pastelBg: 'bg-rose-50',
    pastelBorder: 'border-rose-200',
    accentText: 'text-rose-700',
    accentBg: 'bg-rose-500',
  },
];

export const SIX_FAMILY_MEMBERS = FAMILY_VOCABULARY.filter((item) => !item.isPronoun);

export interface WhoIsQuestion {
  id: string;
  prompt: string;
  translation: string;
  answer: 'HE' | 'SHE';
  image: string;
  characterName: string;
  speechText: string;
}

export const WHO_IS_QUESTIONS: WhoIsQuestion[] = [
  {
    id: 'w1',
    prompt: 'Is he a boy?',
    translation: 'Apakah dia anak laki-laki?',
    answer: 'HE',
    image: heBoyImg,
    characterName: 'Boy',
    speechText: 'Is he a boy? He is a boy.',
  },
  {
    id: 'w2',
    prompt: 'Is she a girl?',
    translation: 'Apakah dia anak perempuan?',
    answer: 'SHE',
    image: sheGirlImg,
    characterName: 'Girl',
    speechText: 'Is she a girl? She is a girl.',
  },
  {
    id: 'w3',
    prompt: '___ is my father.',
    translation: 'Dia adalah ayahku.',
    answer: 'HE',
    image: fatherImg,
    characterName: 'Father',
    speechText: 'He is my father.',
  },
  {
    id: 'w4',
    prompt: '___ is my mother.',
    translation: 'Dia adalah ibuku.',
    answer: 'SHE',
    image: motherImg,
    characterName: 'Mother',
    speechText: 'She is my mother.',
  },
  {
    id: 'w5',
    prompt: '___ is my brother.',
    translation: 'Dia adalah saudara laki-lakiku.',
    answer: 'HE',
    image: brotherImg,
    characterName: 'Brother',
    speechText: 'He is my brother.',
  },
  {
    id: 'w6',
    prompt: '___ is my sister.',
    translation: 'Dia adalah saudara perempuanku.',
    answer: 'SHE',
    image: sisterImg,
    characterName: 'Sister',
    speechText: 'She is my sister.',
  },
  {
    id: 'w7',
    prompt: '___ is my grandfather.',
    translation: 'Dia adalah kakekku.',
    answer: 'HE',
    image: grandfatherImg,
    characterName: 'Grandfather',
    speechText: 'He is my grandfather.',
  },
  {
    id: 'w8',
    prompt: '___ is my grandmother.',
    translation: 'Dia adalah nenekku.',
    answer: 'SHE',
    image: grandmotherImg,
    characterName: 'Grandmother',
    speechText: 'She is my grandmother.',
  },
];

export interface CompleteWordItem {
  id: string;
  word: string;
  indonesian: string;
  image: string;
  // Pattern using '_' for missing letters
  pattern: string;
  missingLetters: string[];
  choices: string[];
}

export const COMPLETE_WORD_ITEMS: CompleteWordItem[] = [
  {
    id: 'cw-grandfather',
    word: 'GRANDFATHER',
    indonesian: 'KAKEK',
    image: grandfatherImg,
    pattern: 'GRAND__THER',
    missingLetters: ['F', 'A'],
    choices: ['F', 'A', 'M', 'O', 'E', 'B'],
  },
  {
    id: 'cw-grandmother',
    word: 'GRANDMOTHER',
    indonesian: 'NENEK',
    image: grandmotherImg,
    pattern: 'GRANDM_THER',
    missingLetters: ['O'],
    choices: ['O', 'A', 'I', 'U', 'E'],
  },
  {
    id: 'cw-father',
    word: 'FATHER',
    indonesian: 'AYAH',
    image: fatherImg,
    pattern: 'FAT_ER',
    missingLetters: ['H'],
    choices: ['H', 'M', 'S', 'T', 'B'],
  },
  {
    id: 'cw-mother',
    word: 'MOTHER',
    indonesian: 'IBU',
    image: motherImg,
    pattern: 'MOT_ER',
    missingLetters: ['H'],
    choices: ['H', 'F', 'R', 'K', 'P'],
  },
  {
    id: 'cw-brother',
    word: 'BROTHER',
    indonesian: 'SAUDARA LAKI-LAKI',
    image: brotherImg,
    pattern: 'BROT_ER',
    missingLetters: ['H'],
    choices: ['H', 'S', 'A', 'N', 'D'],
  },
  {
    id: 'cw-sister',
    word: 'SISTER',
    indonesian: 'SAUDARA PEREMPUAN',
    image: sisterImg,
    pattern: 'SIST_R',
    missingLetters: ['E'],
    choices: ['E', 'A', 'O', 'I', 'U'],
  },
];

export interface QuizQuestion {
  id: string;
  questionId: string;
  questionEn?: string;
  image?: string;
  speechText?: string;
  options: string[];
  correctAnswer: string;
  explanationId: string;
}

export const EXERCISE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'ex1',
    questionId: 'Siapakah anggota keluarga pada gambar ini?',
    image: fatherImg,
    speechText: 'Father',
    options: ['Father', 'Mother', 'Brother'],
    correctAnswer: 'Father',
    explanationId: 'Gambar ini adalah Ayah. Dalam Bahasa Inggris disebut Father.',
  },
  {
    id: 'ex2',
    questionId: 'Siapakah anggota keluarga pada gambar ini?',
    image: grandmotherImg,
    speechText: 'Grandmother',
    options: ['Sister', 'Grandmother', 'Mother'],
    correctAnswer: 'Grandmother',
    explanationId: 'Gambar ini adalah Nenek. Dalam Bahasa Inggris disebut Grandmother.',
  },
  {
    id: 'ex3',
    questionId: 'Siapakah anggota keluarga pada gambar ini?',
    image: brotherImg,
    speechText: 'Brother',
    options: ['Grandfather', 'Sister', 'Brother'],
    correctAnswer: 'Brother',
    explanationId: 'Gambar ini adalah Saudara laki-laki. Dalam Bahasa Inggris disebut Brother.',
  },
  {
    id: 'ex4',
    questionId: 'Apa arti kata "MOTHER" dalam Bahasa Indonesia?',
    speechText: 'Mother',
    options: ['Nenek', 'Ibu', 'Saudara Perempuan'],
    correctAnswer: 'Ibu',
    explanationId: 'Mother artinya Ibu.',
  },
  {
    id: 'ex5',
    questionId: 'Apa Bahasa Inggris dari "KAKEK"?',
    speechText: 'Grandfather',
    options: ['Grandfather', 'Father', 'Brother'],
    correctAnswer: 'Grandfather',
    explanationId: 'Kakek dalam Bahasa Inggris adalah Grandfather.',
  },
  {
    id: 'ex6',
    questionId: 'Apa arti kata "SISTER" dalam Bahasa Indonesia?',
    speechText: 'Sister',
    options: ['Saudara Laki-laki', 'Ibu', 'Saudara Perempuan'],
    correctAnswer: 'Saudara Perempuan',
    explanationId: 'Sister artinya Saudara Perempuan.',
  },
  {
    id: 'ex7',
    questionId: 'Pilih kata yang tepat untuk melengkapi kalimat:',
    questionEn: '___ is my father.',
    image: fatherImg,
    speechText: 'He is my father',
    options: ['He', 'She', 'It'],
    correctAnswer: 'He',
    explanationId: 'Father adalah laki-laki, jadi kita memakai kata "He".',
  },
  {
    id: 'ex8',
    questionId: 'Pilih kata yang tepat untuk melengkapi kalimat:',
    questionEn: '___ is my mother.',
    image: motherImg,
    speechText: 'She is my mother',
    options: ['He', 'She', 'We'],
    correctAnswer: 'She',
    explanationId: 'Mother adalah perempuan, jadi kita memakai kata "She".',
  },
  {
    id: 'ex9',
    questionId: 'Apa arti kata "HE" dalam Bahasa Indonesia?',
    image: heBoyImg,
    speechText: 'He',
    options: ['Dia Perempuan', 'Dia Laki-laki', 'Saya'],
    correctAnswer: 'Dia Laki-laki',
    explanationId: 'He artinya Dia (untuk laki-laki).',
  },
  {
    id: 'ex10',
    questionId: 'Pilih kalimat yang benar sesuai gambar:',
    image: sisterImg,
    speechText: 'She is my sister',
    options: ['He is my sister.', 'She is my sister.', 'He is my brother.'],
    correctAnswer: 'She is my sister.',
    explanationId: 'Sister adalah perempuan, jadi kalimat yang tepat adalah "She is my sister."',
  },
];

export const SMART_QUIZ_POOL: QuizQuestion[] = [
  ...EXERCISE_QUESTIONS,
  {
    id: 'sq11',
    questionId: 'Siapakah anggota keluarga pada gambar ini?',
    image: grandfatherImg,
    speechText: 'Grandfather',
    options: ['Father', 'Grandfather', 'Grandmother'],
    correctAnswer: 'Grandfather',
    explanationId: 'Gambar ini adalah Kakek (Grandfather).',
  },
  {
    id: 'sq12',
    questionId: 'Siapakah anggota keluarga pada gambar ini?',
    image: motherImg,
    speechText: 'Mother',
    options: ['Mother', 'Sister', 'Grandmother'],
    correctAnswer: 'Mother',
    explanationId: 'Gambar ini adalah Ibu (Mother).',
  },
  {
    id: 'sq13',
    questionId: 'Siapakah anggota keluarga pada gambar ini?',
    image: sisterImg,
    speechText: 'Sister',
    options: ['Brother', 'Mother', 'Sister'],
    correctAnswer: 'Sister',
    explanationId: 'Gambar ini adalah Saudara Perempuan (Sister).',
  },
  {
    id: 'sq14',
    questionId: 'Apa Bahasa Inggris dari "SAUDARA LAKI-LAKI"?',
    speechText: 'Brother',
    options: ['Brother', 'Father', 'Sister'],
    correctAnswer: 'Brother',
    explanationId: 'Saudara laki-laki dalam Bahasa Inggris adalah Brother.',
  },
  {
    id: 'sq15',
    questionId: 'Apa arti kata "SHE" dalam Bahasa Indonesia?',
    image: sheGirlImg,
    speechText: 'She',
    options: ['Dia Laki-laki', 'Dia Perempuan', 'Ibu'],
    correctAnswer: 'Dia Perempuan',
    explanationId: 'She artinya Dia (untuk perempuan).',
  },
  {
    id: 'sq16',
    questionId: 'Lengkapi kalimat sesuai gambar:',
    questionEn: '___ is my grandfather.',
    image: grandfatherImg,
    speechText: 'He is my grandfather',
    options: ['He', 'She', 'They'],
    correctAnswer: 'He',
    explanationId: 'Grandfather adalah laki-laki, jadi memakai "He".',
  },
  {
    id: 'sq17',
    questionId: 'Lengkapi kalimat sesuai gambar:',
    questionEn: '___ is my grandmother.',
    image: grandmotherImg,
    speechText: 'She is my grandmother',
    options: ['He', 'She', 'You'],
    correctAnswer: 'She',
    explanationId: 'Grandmother adalah perempuan, jadi memakai "She".',
  },
  {
    id: 'sq18',
    questionId: 'Lengkapi kalimat sesuai gambar:',
    questionEn: '___ is my brother.',
    image: brotherImg,
    speechText: 'He is my brother',
    options: ['She', 'He', 'It'],
    correctAnswer: 'He',
    explanationId: 'Brother adalah laki-laki, jadi memakai "He".',
  },
];

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
