// Audio engine for Web Speech API (English pronunciation) + Web Audio API (SFX & cheerful background music)

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicTimer: number | null = null;
  private musicStep = 0;
  public sfxEnabled = true;
  public speechEnabled = true;
  public musicEnabled = false;
  public slowMode = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public speakEnglish(
    text: string,
    options?: { slow?: boolean; onStart?: () => void; onEnd?: () => void }
  ): boolean {
    if (!this.speechEnabled) {
      options?.onEnd?.();
      return false;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.playClick();
      options?.onEnd?.();
      return false;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      const useSlow = options?.slow ?? this.slowMode;
      utterance.rate = useSlow ? 0.68 : 0.86;
      utterance.pitch = 1.08;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find((v) => v.lang.startsWith('en-US') && !v.localService) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => options?.onStart?.();
      utterance.onend = () => options?.onEnd?.();
      utterance.onerror = () => options?.onEnd?.();

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      options?.onEnd?.();
      return false;
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public playClick() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playSuccess() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Cheerful C-E-G-C ascending xylophone chime
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const start = now + idx * 0.075;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });

    // Soft rhythmic clap-like burst simulating applause
    this.playSoftApplause(ctx, now + 0.18);
  }

  private playSoftApplause(ctx: AudioContext, startTime: number) {
    const claps = [0, 0.08, 0.16, 0.23, 0.31];
    claps.forEach((offset) => {
      const bufferSize = Math.floor(ctx.sampleRate * 0.055);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i += 1) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, startTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + offset + 0.055);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(startTime + offset);
    });
  }

  public playError() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Gentle, soft encouraging descending two-tone note
    const notes = [349.23, 293.66];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const start = now + idx * 0.13;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.11, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.2);
    });
  }

  public playVictoryFanfare() {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const melody = [
      { freq: 523.25, t: 0, d: 0.14 },
      { freq: 659.25, t: 0.12, d: 0.14 },
      { freq: 783.99, t: 0.24, d: 0.14 },
      { freq: 1046.5, t: 0.38, d: 0.45 },
      { freq: 783.99, t: 0.56, d: 0.14 },
      { freq: 1046.5, t: 0.7, d: 0.55 },
    ];
    melody.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, now + n.t);
      gain.gain.setValueAtTime(0.001, now + n.t);
      gain.gain.linearRampToValueAtTime(0.15, now + n.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
    this.playSoftApplause(ctx, now + 0.45);
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  private startMusic() {
    if (this.musicTimer !== null) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Gentle cheerful nursery-style pentatonic loop (C5, D5, E5, G5, A5)
    const pattern = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 659.25, 523.25, 0,
      659.25, 783.99, 880.0, 783.99,
      659.25, 587.33, 523.25, 0,
    ];

    const playStep = () => {
      if (!this.musicEnabled) return;
      const audioCtx = this.getContext();
      if (!audioCtx) return;

      const freq = pattern[this.musicStep % pattern.length];
      this.musicStep += 1;
      if (freq > 0) {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
      }
    };

    playStep();
    this.musicTimer = window.setInterval(playStep, 400);
  }

  public stopMusic() {
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const audioManager = new AudioManager();
