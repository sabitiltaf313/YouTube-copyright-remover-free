/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NcsTrack, VoiceOverConfig, SoundEffectItem, MusicCategory } from '../types';

export const VIRAL_SOUND_EFFECTS: SoundEffectItem[] = [
  { id: 'sfx_boom', name: 'Vine Boom', category: 'Meme', icon: '💥', durationSec: 1.2, type: 'synth_boom' },
  { id: 'sfx_horn', name: 'Airhorn Hype', category: 'Meme', icon: '🎺', durationSec: 1.5, type: 'synth_horn' },
  { id: 'sfx_scratch', name: 'Record Scratch', category: 'Transition', icon: '💿', durationSec: 0.8, type: 'synth_scratch' },
  { id: 'sfx_violin', name: 'Sad Violin Fail', category: 'Meme', icon: '🎻', durationSec: 2.2, type: 'synth_violin' },
  { id: 'sfx_kaching', name: 'Cash Register Ka-Ching', category: 'Reaction', icon: '💰', durationSec: 1.0, type: 'synth_kaching' },
  { id: 'sfx_punch', name: 'Cartoon Punch Hit', category: 'Meme', icon: '🥊', durationSec: 0.6, type: 'synth_punch' },
  { id: 'sfx_swoosh', name: 'Fast Swoosh Transition', category: 'Transition', icon: '💨', durationSec: 0.5, type: 'synth_swoosh' },
  { id: 'sfx_ding', name: 'Correct Bell Ding', category: 'Reaction', icon: '🔔', durationSec: 0.7, type: 'synth_ding' },
  { id: 'sfx_glitch', name: 'Sci-Fi Glitch Bug', category: 'Transition', icon: '⚡', durationSec: 0.8, type: 'synth_glitch' },
  { id: 'sfx_dramatic', name: 'Dramatic Dun Dun Dun', category: 'Reaction', icon: '🥁', durationSec: 1.8, type: 'synth_dramatic' },
  { id: 'sfx_bruh', name: 'Bruh Sound', category: 'Meme', icon: '🗣️', durationSec: 0.9, type: 'synth_boom' },
  { id: 'sfx_wow', name: 'Anime Wow Reaction', category: 'Reaction', icon: '😮', durationSec: 1.0, type: 'synth_ding' },
  { id: 'sfx_camera', name: 'Camera Shutter Click', category: 'Transition', icon: '📸', durationSec: 0.4, type: 'synth_scratch' },
  { id: 'sfx_pop', name: 'Bubble Pop', category: 'Transition', icon: '🫧', durationSec: 0.3, type: 'synth_ding' },
  { id: 'sfx_laugh', name: 'Sitcom Audience Chuckle', category: 'Meme', icon: '😂', durationSec: 1.5, type: 'synth_horn' },
];

// Helper to generate the full list of 120 tracks across categories
function generate120Tracks(): NcsTrack[] {
  const categories: { cat: MusicCategory; count: number; bpmRange: [number, number]; genres: string[]; baseFreq: number }[] = [
    { cat: 'Viral TikTok', count: 20, bpmRange: [120, 135], genres: ['Viral Dance', 'TikTok Trending', 'Upbeat House', 'Bouncy Drill'], baseFreq: 261.63 },
    { cat: 'NCS Electro', count: 25, bpmRange: [126, 140], genres: ['Melodic Electro', 'Future Bass', 'Glitch Hop', 'Synthwave'], baseFreq: 220.0 },
    { cat: 'Lo-Fi Chill', count: 20, bpmRange: [78, 92], genres: ['Chillhop', 'Lo-Fi Study', 'Mellow Jazz', 'Coffee Beat'], baseFreq: 196.0 },
    { cat: 'Cinematic', count: 20, bpmRange: [90, 115], genres: ['Epic Trailer', 'Ambient Strings', 'Modern Hybrid', 'Orchestral Chill'], baseFreq: 164.81 },
    { cat: 'Gaming Phonk', count: 20, bpmRange: [130, 150], genres: ['Drift Phonk', 'Hyper Gaming', 'Hardwave', 'Speed Bass'], baseFreq: 130.81 },
    { cat: 'Pak Acoustic', count: 15, bpmRange: [85, 110], genres: ['Sufi Ambient', 'Indus Folk Fusion', 'Lahori Vlog', 'Margalla Chillstep'], baseFreq: 293.66 },
  ];

  const viralTitles = [
    'Horizon Echoes', 'Karachi Sunset Lo-Fi', 'Cyber Highway', 'Lahori Urban Groove', 'Indus Valley Ambient',
    'Margalla Chillstep', 'Neon Pulse Electro', 'Sufi Breeze Acoustic', 'Tech Review Catalyst', 'Victory Rush Gaming',
    'Trending Rhythm', 'Glow Drift', 'Midnight Runner', 'Breeze of Murree', 'Rawal Beat',
    'Euphoria Sparks', 'Tokyo Nights Lo-Fi', 'Drift King Phonk', 'Vlogger Sunlight', 'Aesthetic Morning',
    'Level Up Rush', 'Chill Tea Cafe', 'Faisal Mosque Dusk', 'Echoes of Swat', 'Hyperdrive Synth',
    'Retro Wave 80s', 'Bassline Drop NCS', 'Inspire Daily', 'Summer Vibe TikTok', 'Golden Hour Memory',
    'Cyberpunk Streets', 'Rainy Window Study', 'Epic Journey Begins', 'Shadow Phonk Demon', 'Monsoon Acoustic',
    'Neon Lights Speed', 'Lo-Fi Sunset Clouds', 'Warrior Anthem', 'Pak Beats Fair-Use', 'Speedway Phonk',
    'Elevate Your Mind', 'Smooth Jazz Chords', 'Trailer Cinematic Surge', 'Speed Drift Beat', 'Mountain Air NCS',
    'TikTok Bounce Hit', 'Coffee Shop Dreams', 'Battleground Royale', 'Deep Focus Wave', 'Sufi Soul Strings',
    'Galaxy Runner', 'Midnight Walk', 'Glory Moment', 'Drift Phonk Extreme', 'Hunza Valley Peace',
    'Viral Reel Catalyst', 'Warm Autumn Leaves', 'Dark Hero Cinematic', 'Arcade High Score', 'Chai Stall Acoustic',
    'Electro Horizon V2', 'Sleepy Cat Lo-Fi', 'Rise of Titans', 'Bass Overdrive 99', 'Punjab Groove',
    'Trendsetter Beat', 'Cozy Blanket Study', 'Cinematic Revelation', 'Cyber Phonk Tokyo', 'Folk Whistle NCS',
    'Sunrise in Nathia', 'Urban Explorer', 'Neon Skylines', 'Clutch Gaming Moment', 'Warm Fireplace Ambient',
    'Reel King Viral', 'Chill Sunday Morning', 'Inception Style Brass', 'Velocity Phonk Rush', 'Sarangi Fusion NCS',
    'Starlight Dreams', 'Lo-Fi Nostalgia 90s', 'Legendary Victory', 'Night Highway Drift', 'Bhakkar Rhythm',
    'Modern Creator Beat', 'Green Tea Lo-Fi', 'Future Cinematic Impact', 'Phonk Unleashed', 'Indus Delta Waves',
    'Sparkle Dance Pop', 'Campfire Acoustic', 'Heroic Return', 'Cyber Samurai', 'Attock Breeze',
    'Viral Soundwave', 'Study Session 3AM', 'Cinematic Dawn', 'Racer Track Heat', 'Sufi Harmony',
    'Electric Skyline', 'Quiet Library Lo-Fi', 'Orchestral Climax', 'Bass God Phonk', 'Karakoram Echo',
    'TikTok Energy Boost', 'Cozy Rain Ambience', 'Epic Trailer Hits', 'Street Drift King', 'Pak Melody NCS',
    'Viral Spark 2026', 'Lo-Fi Sunset Walk', 'Cinema Horizon', 'Adrenaline Rush Gaming', 'Desert Rose Acoustic',
    'Beat Drop Supreme', 'Dreamy Sleep Beats', 'Valkyrie Cinematic', 'Speedster Phonk', 'Badshahi Groove NCS',
  ];

  const tracks: NcsTrack[] = [];
  let titleIdx = 0;

  categories.forEach((cfg) => {
    for (let i = 1; i <= cfg.count; i++) {
      const id = `ncs-${tracks.length + 1}`;
      const title = viralTitles[titleIdx] || `${cfg.cat} Track #${i}`;
      titleIdx++;

      const bpm = Math.floor(cfg.bpmRange[0] + Math.random() * (cfg.bpmRange[1] - cfg.bpmRange[0]));
      const genre = cfg.genres[(i - 1) % cfg.genres.length];
      const root = cfg.baseFreq;
      const freqPattern = [
        root,
        root * (9 / 8),
        root * (5 / 4),
        root * (4 / 3),
        root * (3 / 2),
        root * (5 / 3),
      ];

      tracks.push({
        id,
        title,
        artist: `Pak Beat Lab & NCS (${cfg.cat})`,
        genre,
        category: cfg.cat,
        bpm,
        duration: Math.floor(120 + (i % 5) * 15),
        mood: `${cfg.cat} Safe Stream Vibe`,
        description: `100% royalty-free fair-use audio track. Safe from Content ID claims on YouTube, TikTok, and Meta platforms.`,
        freqPattern,
      });
    }
  });

  return tracks;
}

export const NCS_TRACKS: NcsTrack[] = generate120Tracks();

class AudioEngine {
  private audioCtx: AudioContext | null = null;
  private currentPlayingId: string | null = null;
  private timerId: number | null = null;
  private isSynthesizing = false;
  private onStateChangeCallback: ((id: string | null) => void) | null = null;

  public setOnStateChange(cb: (id: string | null) => void) {
    this.onStateChangeCallback = cb;
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public isPlaying(trackId?: string): boolean {
    if (!trackId) return this.currentPlayingId !== null;
    return this.currentPlayingId === trackId;
  }

  public getCurrentlyPlaying(): string | null {
    return this.currentPlayingId;
  }

  public stop() {
    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.isSynthesizing = false;
    this.currentPlayingId = null;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(null);
    }
  }

  // Play any of the 120 tracks with real synthesizer
  public playNcsTrack(track: NcsTrack, volume: number = 0.8) {
    this.initContext();
    if (!this.audioCtx) return;

    if (this.currentPlayingId === track.id) {
      this.stop();
      return;
    }

    this.stop();
    this.currentPlayingId = track.id;
    this.isSynthesizing = true;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(track.id);
    }

    const ctx = this.audioCtx;
    const intervalMs = Math.round((60 / track.bpm) * 1000 * 0.5);
    let step = 0;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const playStep = () => {
      if (!this.isSynthesizing || !this.audioCtx) return;

      const t = ctx.currentTime;
      const freq = track.freqPattern[step % track.freqPattern.length];

      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      if (track.category === 'Viral TikTok' || track.category === 'NCS Electro') {
        osc.type = 'sawtooth';
      } else if (track.category === 'Lo-Fi Chill' || track.category === 'Pak Acoustic') {
        osc.type = 'sine';
      } else if (track.category === 'Gaming Phonk') {
        osc.type = 'square';
      } else {
        osc.type = 'triangle';
      }

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(track.category === 'Lo-Fi Chill' ? 1300 : 3200, t);

      osc.frequency.setValueAtTime(freq, t);

      noteGain.gain.setValueAtTime(0.001, t);
      noteGain.gain.exponentialRampToValueAtTime(0.28, t + 0.03);
      noteGain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(t);
      osc.stop(t + 0.3);

      // Bass drum on beats 0 and 4
      if (step % 4 === 0) {
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.frequency.setValueAtTime(track.category === 'Gaming Phonk' ? 160 : 120, t);
        kickOsc.frequency.exponentialRampToValueAtTime(32, t + 0.16);

        kickGain.gain.setValueAtTime(0.55, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);

        kickOsc.start(t);
        kickOsc.stop(t + 0.2);
      }

      // Snare / clap on beat 2
      if (step % 4 === 2) {
        const snareOsc = ctx.createOscillator();
        const snareGain = ctx.createGain();
        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(240, t);
        snareGain.gain.setValueAtTime(0.18, t);
        snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        snareOsc.connect(snareGain);
        snareGain.connect(masterGain);

        snareOsc.start(t);
        snareOsc.stop(t + 0.12);
      }

      step++;
    };

    playStep();
    this.timerId = window.setInterval(playStep, intervalMs);
  }

  // Play Viral Sound Effect (Instant synthesizer for Meme & Video effects)
  public playSoundEffect(sfx: SoundEffectItem) {
    this.initContext();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const t = ctx.currentTime;

    switch (sfx.type) {
      case 'synth_boom': {
        // Vine Boom / Heavy sub-bass hit
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(30, t + 0.8);

        gain.gain.setValueAtTime(0.85, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.9);
        break;
      }
      case 'synth_horn': {
        // Airhorn / Hype triplet
        [0, 0.12, 0.24].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(466.16 + idx * 20, t + offset);

          gain.gain.setValueAtTime(0.35, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + offset);
          osc.stop(t + offset + 0.2);
        });
        break;
      }
      case 'synth_scratch': {
        // DJ Record Scratch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(1200, t + 0.15);
        osc.frequency.linearRampToValueAtTime(80, t + 0.4);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
        break;
      }
      case 'synth_kaching': {
        // Cash Register Ka-ching
        [587.33, 880, 1174.66].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + i * 0.08);

          gain.gain.setValueAtTime(0.3, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.45);
        });
        break;
      }
      case 'synth_ding': {
        // Bell Ding / Correct
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, t);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.7);
        break;
      }
      case 'synth_punch': {
        // Cartoon Punch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(45, t + 0.25);

        gain.gain.setValueAtTime(0.65, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      }
      case 'synth_swoosh': {
        // Fast Swoosh Transition
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(1600, t + 0.2);
        osc.frequency.exponentialRampToValueAtTime(120, t + 0.45);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
        break;
      }
      case 'synth_violin': {
        // Sad Violin
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.linearRampToValueAtTime(415.3, t + 0.6);
        osc.frequency.linearRampToValueAtTime(392.0, t + 1.2);

        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 1.7);
        break;
      }
      case 'synth_dramatic': {
        // Dun Dun Dun
        [164.81, 146.83, 110.0].forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, t + i * 0.45);

          gain.gain.setValueAtTime(0.45, t + i * 0.45);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.45 + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.45);
          osc.stop(t + i * 0.45 + 0.45);
        });
        break;
      }
      default: {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      }
    }
  }

  // AI Voice Over using English Web Speech API
  public speakEnglishVoiceOver(config: VoiceOverConfig, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    window.speechSynthesis.cancel();
    if (!config.text || !config.text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(config.text.trim());
    utterance.lang = 'en-US';
    utterance.rate = config.rate || 1.0;
    utterance.pitch = config.pitch || 1.0;
    utterance.volume = config.volume || 1.0;

    if (config.voiceStyle === 'storyteller') {
      utterance.pitch = 0.85;
      utterance.rate = 0.9;
    } else if (config.voiceStyle === 'motivational') {
      utterance.pitch = 1.1;
      utterance.rate = 1.1;
    } else if (config.voiceStyle === 'tech') {
      utterance.pitch = 1.0;
      utterance.rate = 1.05;
    }

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (enVoice) {
      utterance.voice = enVoice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopVoiceOver() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new AudioEngine();
