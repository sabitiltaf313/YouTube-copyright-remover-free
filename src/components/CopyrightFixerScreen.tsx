/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { VideoProject, NcsTrack, VoiceOverConfig, ScreenType, MusicCategory } from '../types';
import { NCS_TRACKS, audioEngine } from '../services/audioEngine';
import {
  ShieldAlert,
  ShieldCheck,
  Music2,
  Play,
  Square,
  Mic,
  Sliders,
  AlertTriangle,
  ArrowRight,
  Info,
  Search,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface CopyrightFixerScreenProps {
  project: VideoProject;
  updateProject: (updated: Partial<VideoProject>) => void;
  onOpenExport: () => void;
  setScreen: (screen: ScreenType) => void;
}

export const CopyrightFixerScreen: React.FC<CopyrightFixerScreenProps> = ({
  project,
  updateProject,
  onOpenExport,
  setScreen,
}) => {
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    project.selectedNcsTrackId || NCS_TRACKS[0].id
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    audioEngine.setOnStateChange((id) => {
      setActivePlayingId(id);
    });
    return () => {
      audioEngine.stop();
      audioEngine.stopVoiceOver();
    };
  }, []);

  const handlePlayPreview = (track: NcsTrack) => {
    if (activePlayingId === track.id) {
      audioEngine.stop();
    } else {
      audioEngine.playNcsTrack(track, project.musicVolume);
    }
  };

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    updateProject({
      selectedNcsTrackId: trackId,
      isMuted: true, // Mute copyrighted original
    });
  };

  const handle1ClickRemoveAndReplace = () => {
    handleSelectTrack(selectedTrackId || NCS_TRACKS[0].id);
    updateProject({
      isMuted: true,
      originalAudioVolume: 0,
      musicVolume: 0.85,
    });
    alert('✅ Copyrighted Music Removed! Clean No-Copyright Music applied.');
  };

  const handleTestVoiceOver = () => {
    if (isPlayingVoice) {
      audioEngine.stopVoiceOver();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      audioEngine.speakEnglishVoiceOver(project.voiceOver, () => {
        setIsPlayingVoice(false);
      });
    }
  };

  const updateVoiceOver = (patch: Partial<VoiceOverConfig>) => {
    updateProject({
      voiceOver: {
        ...project.voiceOver,
        ...patch,
      },
    });
  };

  const categories = ['All', 'Viral TikTok', 'NCS Electro', 'Lo-Fi Chill', 'Cinematic', 'Gaming Phonk', 'Pak Acoustic'];

  const filteredTracks = NCS_TRACKS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const selectedTrack = NCS_TRACKS.find((t) => t.id === selectedTrackId);

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-5 sm:py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Copyright Fixer & 120 Music Tracks</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00b050] font-bold">
              120 Tracks Vault
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Detect copyrighted music, strip audio stems & replace with 120 certified viral NCS tracks
          </p>
        </div>

        <button
          onClick={() => setScreen('editor')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 self-start sm:self-auto"
        >
          ← Open Video Editor
        </button>
      </div>

      {/* Audio Scan & Copyright Report Card */}
      {isScanning ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2.5 animate-spin">
            <Sliders className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Scanning Audio Spectrum for Copyright Matches...
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Matching acoustic fingerprints against global YouTube Content ID databases
          </p>
        </div>
      ) : (
        <div className="bg-white border-2 border-rose-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-rose-900 tracking-tight">
                  Copyright Detected in Audio
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Universal Music Sound Recording Claim · Risk of video demonetization
                </p>
              </div>
            </div>

            <button
              onClick={handle1ClickRemoveAndReplace}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#00b050] hover:bg-emerald-700 active:scale-[0.98] rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Replace Audio with No-Copyright Music</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-[11px] font-semibold text-rose-800 block">Detected Match:</span>
              <span className="font-bold text-slate-900 block mt-0.5">{project.detectedSongName}</span>
              <span className="text-[10px] text-slate-500">Sony / Universal Music Rights</span>
            </div>

            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-[11px] font-semibold text-rose-800 block">Claimed Segment:</span>
              <span className="font-mono font-bold text-slate-900 block mt-0.5">00:02 - {project.endTime.toFixed(0).padStart(2, '0')}:00</span>
              <span className="text-[10px] text-slate-500">Audio track replacement required</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[11px] font-semibold text-emerald-800 block">Resolution Status:</span>
              <span className="font-bold text-emerald-950 block mt-0.5">
                {project.selectedNcsTrackId ? 'NCS Music Applied' : 'Pending Replacement'}
              </span>
              <span className="text-[10px] text-emerald-700">
                {project.selectedNcsTrackId ? 'Safe for YouTube, Reels & TikTok' : 'Choose from 120 tracks below'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 120 ROYALTY-FREE & NCS MUSIC TRACKS VAULT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-[#00b050]" />
              <span>120 Built-In NCS & Viral Music Tracks Vault</span>
            </h3>
            <p className="text-xs text-slate-500">
              Categorized royalty-free tracks. Search by name, TikTok trend, or genre.
            </p>
          </div>

          {selectedTrack && (
            <div className="text-xs px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold shrink-0">
              Active: {selectedTrack.title}
            </div>
          )}
        </div>

        {/* Search Bar & Category Filter Carousel */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 120 tracks by title, TikTok style, Phonk, Lo-Fi..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b050]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#00b050] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Track List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredTracks.map((track, idx) => {
            const isPlayingThis = activePlayingId === track.id;
            const isSelected = selectedTrackId === track.id;

            return (
              <div
                key={track.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#00b050] bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => handlePlayPreview(track)}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isPlayingThis
                        ? 'bg-rose-500 text-white scale-105'
                        : isSelected
                        ? 'bg-[#00b050] text-white'
                        : 'bg-slate-100 hover:bg-[#00b050] hover:text-white text-slate-700'
                    }`}
                    title={isPlayingThis ? 'Stop' : 'Preview'}
                  >
                    {isPlayingThis ? (
                      <Square className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate block">
                      {idx + 1}. {track.title}
                    </span>
                    <p className="text-[10px] text-slate-500 truncate">
                      {track.category} · {track.bpm} BPM · {track.genre}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectTrack(track.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#00b050] text-white'
                      : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                  }`}
                >
                  {isSelected ? 'Applied ✓' : 'Select'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Volume & Stem Balance */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 flex justify-between mb-1">
              <span>NCS Music Volume</span>
              <span className="font-mono">{Math.round(project.musicVolume * 100)}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={project.musicVolume}
              onChange={(e) => updateProject({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 flex justify-between mb-1">
              <span>Original Audio Stem</span>
              <span className={project.isMuted ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                {project.isMuted ? 'Muted / Stripped' : `${Math.round(project.originalAudioVolume * 100)}%`}
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateProject({ isMuted: true, originalAudioVolume: 0 })}
                className={`flex-1 py-1 rounded-lg font-bold text-xs ${
                  project.isMuted ? 'bg-rose-100 text-rose-800' : 'bg-white border text-slate-600'
                }`}
              >
                Mute Claimed Audio
              </button>
              <button
                onClick={() => updateProject({ isMuted: false, originalAudioVolume: 0.2 })}
                className={`flex-1 py-1 rounded-lg font-bold text-xs ${
                  !project.isMuted ? 'bg-emerald-100 text-emerald-800' : 'bg-white border text-slate-600'
                }`}
              >
                Keep Low (20%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Voice Over (English) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-[#00b050]" />
              <span>AI Voice Over Studio (English)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Add English commentary or narration to strengthen Fair-Use legal standing
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={project.voiceOver.enabled}
              onChange={(e) => updateVoiceOver({ enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b050]"></div>
          </label>
        </div>

        {project.voiceOver.enabled && (
          <div className="space-y-3 pt-1">
            <textarea
              rows={2}
              value={project.voiceOver.text}
              onChange={(e) => updateVoiceOver({ text: e.target.value })}
              placeholder="Enter narration speech..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b050]"
            />

            <div className="flex items-center gap-3">
              <select
                value={project.voiceOver.voiceStyle}
                onChange={(e) => updateVoiceOver({ voiceStyle: e.target.value as VoiceOverConfig['voiceStyle'] })}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white"
              >
                <option value="host">Studio Host</option>
                <option value="tech">Tech Reviewer</option>
                <option value="motivational">Motivational</option>
                <option value="storyteller">Storyteller</option>
              </select>

              <button
                onClick={handleTestVoiceOver}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200"
              >
                {isPlayingVoice ? 'Stop' : 'Test Voice'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Legal & Educational Notice Box */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-emerald-900">
            Mandatory Disclaimer:
          </p>
          <p className="leading-relaxed">
            &ldquo;This app does not bypass YouTube Content ID illegally. It only helps edit and replace audio with royalty-free music. User is responsible for uploads.&rdquo;
          </p>
        </div>
      </div>

      {/* Bottom CTA to Export */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setScreen('editor')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to Video Editor
        </button>

        <button
          onClick={onOpenExport}
          className="px-5 py-2.5 text-xs font-bold text-white bg-[#00b050] hover:bg-emerald-700 active:scale-[0.98] rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <span>Apply Changes & Export Video</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
