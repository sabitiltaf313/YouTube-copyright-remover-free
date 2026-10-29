/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SoundEffectItem } from '../types';
import { VIRAL_SOUND_EFFECTS, audioEngine } from '../services/audioEngine';
import {
  Sparkles,
  Volume2,
  Play,
  Check,
  X,
  Flame,
  Plus,
} from 'lucide-react';

interface SoundEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSfxIds: string[];
  onToggleSfx: (sfxId: string) => void;
}

export const SoundEffectsModal: React.FC<SoundEffectsModalProps> = ({
  isOpen,
  onClose,
  selectedSfxIds,
  onToggleSfx,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [playingSfxId, setPlayingSfxId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Meme', 'Transition', 'Reaction'];

  const filtered = activeCategory === 'All'
    ? VIRAL_SOUND_EFFECTS
    : VIRAL_SOUND_EFFECTS.filter((s) => s.category === activeCategory);

  const handlePlaySfx = (sfx: SoundEffectItem) => {
    setPlayingSfxId(sfx.id);
    audioEngine.playSoundEffect(sfx);
    setTimeout(() => {
      setPlayingSfxId((curr) => (curr === sfx.id ? null : curr));
    }, sfx.durationSec * 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Flame className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Viral Meme Soundboard & FX (15 Effects)
              </h2>
              <p className="text-xs text-emerald-100">
                Tap to preview instant viral sound effects for TikTok, YouTube & Reels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  activeCategory === cat
                    ? 'bg-[#00b050] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Soundboard Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {filtered.map((sfx) => {
              const isPlaying = playingSfxId === sfx.id;
              const isSelected = selectedSfxIds.includes(sfx.id);

              return (
                <div
                  key={sfx.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'border-[#00b050] bg-emerald-50/70 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{sfx.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {sfx.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {sfx.category} · {sfx.durationSec}s
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handlePlaySfx(sfx)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                        isPlaying
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isPlaying ? 'Playing...' : 'Play'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleSfx(sfx.id)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#00b050] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title={isSelected ? 'Remove from Video' : 'Add to Video'}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>Selected Sound Effects: <strong className="text-slate-900">{selectedSfxIds.length}</strong></span>
            <span className="text-slate-400">Instant Web Audio FX</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Viral SFX Library for Content Creators</span>
          <button
            onClick={onClose}
            className="font-bold text-[#00b050] hover:text-emerald-800"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
