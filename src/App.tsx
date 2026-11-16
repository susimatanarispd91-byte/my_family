import { useEffect, useState } from 'react';
import { AppScreen, TopBar } from './components/TopBar';
import { AudioControlBar } from './components/AudioControlBar';
import { SplashView } from './components/SplashView';
import { MainMenuView } from './components/MainMenuView';
import { LearningTimeView } from './components/LearningTimeView';
import { ListenRepeatView } from './components/ListenRepeatView';
import { GamesHubView } from './components/games/GamesHubView';
import { Game1GuessFamily } from './components/games/Game1GuessFamily';
import { Game2Matching } from './components/games/Game2Matching';
import { Game3WhoIsHeShe } from './components/games/Game3WhoIsHeShe';
import { Game4CompleteWord } from './components/games/Game4CompleteWord';
import { ExerciseView } from './components/ExerciseView';
import { SmartQuizView } from './components/SmartQuizView';
import { AboutView } from './components/AboutView';
import { audioManager } from './utils/audio';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('splash');
  const [studentName, setStudentName] = useState<string>(() => {
    try {
      return localStorage.getItem('my_family_student_name') || '';
    } catch {
      return '';
    }
  });
  const [totalStars, setTotalStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('my_family_total_stars');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [slowMode, setSlowMode] = useState(false);

  const handleChangeStudentName = (name: string) => {
    setStudentName(name);
    try {
      localStorage.setItem('my_family_student_name', name);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleAddStars = (count: number) => {
    setTotalStars((prev) => {
      const next = prev + count;
      try {
        localStorage.setItem('my_family_total_stars', String(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
  };

  const handleToggleMusic = () => {
    setMusicOn((prev) => {
      const next = !prev;
      audioManager.setMusicEnabled(next);
      return next;
    });
  };

  const handleToggleSfx = () => {
    setSfxOn((prev) => {
      const next = !prev;
      audioManager.sfxEnabled = next;
      audioManager.speechEnabled = next;
      if (!next) {
        audioManager.stopSpeaking();
      } else {
        audioManager.playClick();
      }
      return next;
    });
  };

  const handleToggleSlow = () => {
    setSlowMode((prev) => {
      const next = !prev;
      audioManager.slowMode = next;
      return next;
    });
  };

  const handleNavigate = (nextScreen: AppScreen) => {
    audioManager.stopSpeaking();
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      audioManager.stopMusic();
      audioManager.stopSpeaking();
    };
  }, []);

  if (screen === 'splash') {
    return (
      <SplashView
        musicOn={musicOn}
        sfxOn={sfxOn}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
        onStart={() => handleNavigate('menu')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] text-slate-900">
      <TopBar currentScreen={screen} onNavigate={handleNavigate} />
      <AudioControlBar
        musicOn={musicOn}
        sfxOn={sfxOn}
        slowMode={slowMode}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
        onToggleSlow={handleToggleSlow}
      />

      <main className="flex-1 pb-10">
        {screen === 'menu' && (
          <MainMenuView
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onNavigate={handleNavigate}
            totalStars={totalStars}
          />
        )}

        {screen === 'learn' && (
          <LearningTimeView
            onBackToMenu={() => handleNavigate('menu')}
            onGoToListenRepeat={() => handleNavigate('listen')}
          />
        )}

        {screen === 'listen' && (
          <ListenRepeatView
            onBackToMenu={() => handleNavigate('menu')}
            onStarEarned={() => handleAddStars(1)}
          />
        )}

        {screen === 'games' && (
          <GamesHubView
            onSelectGame={handleNavigate}
            onBackToMenu={() => handleNavigate('menu')}
          />
        )}

        {screen === 'game1' && (
          <Game1GuessFamily
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onBackToGames={() => handleNavigate('games')}
            onBackToMenu={() => handleNavigate('menu')}
            onReviewMaterial={() => handleNavigate('learn')}
            onAddStars={handleAddStars}
          />
        )}

        {screen === 'game2' && (
          <Game2Matching
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onBackToGames={() => handleNavigate('games')}
            onBackToMenu={() => handleNavigate('menu')}
            onReviewMaterial={() => handleNavigate('learn')}
            onAddStars={handleAddStars}
          />
        )}

        {screen === 'game3' && (
          <Game3WhoIsHeShe
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onBackToGames={() => handleNavigate('games')}
            onBackToMenu={() => handleNavigate('menu')}
            onReviewMaterial={() => handleNavigate('learn')}
            onAddStars={handleAddStars}
          />
        )}

        {screen === 'game4' && (
          <Game4CompleteWord
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onBackToGames={() => handleNavigate('games')}
            onBackToMenu={() => handleNavigate('menu')}
            onReviewMaterial={() => handleNavigate('learn')}
            onAddStars={handleAddStars}
          />
        )}

        {screen === 'exercise' && (
          <ExerciseView
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onBackToMenu={() => handleNavigate('menu')}
            onReviewMaterial={() => handleNavigate('learn')}
            onAddStars={handleAddStars}
          />
        )}

        {screen === 'quiz' && (
          <SmartQuizView
            studentName={studentName}
            onChangeStudentName={handleChangeStudentName}
            onBackToMenu={() => handleNavigate('menu')}
            onReviewMaterial={() => handleNavigate('learn')}
            onAddStars={handleAddStars}
          />
        )}

        {screen === 'about' && (
          <AboutView
            onBackToMenu={() => handleNavigate('menu')}
            onStartLearn={() => handleNavigate('learn')}
          />
        )}
      </main>

      <footer className="border-t border-slate-200/70 bg-white py-4 text-center text-xs sm:text-sm text-slate-500">
        MY FAMILY · Media Pembelajaran Bahasa Inggris Kelas 1 SD
      </footer>
    </div>
  );
}
