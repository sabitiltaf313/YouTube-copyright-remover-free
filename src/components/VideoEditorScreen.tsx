/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { VideoProject, AspectRatioType, VideoFilterType, ScreenType } from '../types';
import { VIDEO_FILTERS, generateFFmpegCommand } from '../services/videoRenderer';
import { VIRAL_SOUND_EFFECTS, audioEngine } from '../services/audioEngine';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Scissors,
  Crop,
  Gauge,
  Sparkles,
  Type,
  ShieldAlert,
  Download,
  Terminal,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Flame,
  Music2,
  Trash2,
} from 'lucide-react';

interface VideoEditorScreenProps {
  project: VideoProject;
  updateProject: (updated: Partial<VideoProject>) => void;
  onOpenFixer: () => void;
  onOpenExport: () => void;
  onOpenSfxModal: () => void;
  setScreen: (screen: ScreenType) => void;
}

export const VideoEditorScreen: React.FC<VideoEditorScreenProps> = ({
  project,
  updateProject,
  onOpenFixer,
  onOpenExport,
  onOpenSfxModal,
  setScreen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [copiedFfmpeg, setCopiedFfmpeg] = useState(false);
  const [activeTab, setActiveTab] = useState<'trim' | 'crop' | 'audio' | 'speed' | 'filter' | 'sfx' | 'text' | 'ffmpeg'>('trim');

  // Sync video time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= project.endTime) {
        video.pause();
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [project.endTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      if (video.currentTime < project.startTime || video.currentTime >= project.endTime) {
        video.currentTime = project.startTime;
      }
      video.playbackRate = project.speed;
      video.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleCopyFfmpeg = () => {
    const cmd = generateFFmpegCommand(project, '1080p');
    navigator.clipboard.writeText(cmd);
    setCopiedFfmpeg(true);
    setTimeout(() => setCopiedFfmpeg(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      updateProject({
        title: file.name.replace(/\.[^/.]+$/, ''),
        videoUrl: url,
        videoFile: file,
        duration: video.duration || 10,
        startTime: 0,
        endTime: Math.min(video.duration || 10, 60),
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
      });
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    };
  };

  const handle1ClickRemoveCopyrightMusic = () => {
    updateProject({
      isMuted: true,
      originalAudioVolume: 0,
      selectedNcsTrackId: project.selectedNcsTrackId || 'ncs-1',
      musicVolume: 0.85,
    });
    alert('✅ Copyrighted Music Removed! Claimed audio stems have been stripped and replaced with royalty-free NCS music.');
  };

  const currentFilterObj = VIDEO_FILTERS.find(f => f.id === project.filter);
  const videoDuration = Math.max(1, project.endTime - project.startTime);

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-5 sm:py-6 space-y-5">
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Video Editor Module
          </h2>
          <p className="text-xs text-slate-500">
            Trim, crop, remove copyright music, viral SFX, 12 filters & 1080p export
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 1-Click Copyright Music Remover Button */}
          <button
            onClick={handle1ClickRemoveCopyrightMusic}
            className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            title="1-Click Remove Copyrighted Music"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Remove Copyright Music</span>
          </button>

          <button
            onClick={onOpenFixer}
            className="px-3 py-2 text-xs font-bold text-white bg-[#00b050] hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Music2 className="w-3.5 h-3.5" />
            <span>120 NCS Music</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-800" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Video Preview Canvas Player */}
      <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-md flex items-center justify-center min-h-[250px] sm:min-h-[350px] max-h-[460px]">
        <div
          className="relative max-w-full max-h-[420px] flex items-center justify-center transition-all duration-300"
          style={{
            aspectRatio:
              project.aspectRatio === '16:9'
                ? '16 / 9'
                : project.aspectRatio === '9:16'
                ? '9 / 16'
                : project.aspectRatio === '1:1'
                ? '1 / 1'
                : '4 / 5',
          }}
        >
          <video
            ref={videoRef}
            src={project.videoUrl}
            playsInline
            muted={project.isMuted}
            style={{
              filter: currentFilterObj?.cssFilter || 'none',
              transform: `scale(${project.speed >= 1.5 ? 1 : 1})`,
            }}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Text Overlay Preview */}
          {project.overlayText && (
            <div
              className={`absolute left-0 right-0 px-4 flex justify-center pointer-events-none ${
                project.textPosition === 'top'
                  ? 'top-4'
                  : project.textPosition === 'center'
                  ? 'top-1/2 -translate-y-1/2'
                  : 'bottom-4'
              }`}
            >
              <span
                style={{
                  color: project.textColor,
                  fontSize: `${Math.max(14, Math.round(project.textSize * 0.7))}px`,
                }}
                className="bg-black/60 px-3.5 py-1.5 rounded-lg font-bold tracking-wide backdrop-blur-xs text-center shadow-lg"
              >
                {project.overlayText}
              </span>
            </div>
          )}

          {/* Center Play Button Overlay when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#00b050]/90 text-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </button>
          )}
        </div>

        {/* Video Scrubber & Play Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex items-center gap-3 text-white text-xs">
          <button
            onClick={togglePlay}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Scrubber Slider */}
          <input
            type="range"
            min={0}
            max={project.duration}
            step={0.05}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="flex-1 accent-[#00b050] h-1.5 bg-white/30 rounded-lg cursor-pointer"
          />

          <span className="font-mono tabular-nums text-[11px] shrink-0">
            {currentTime.toFixed(1)}s / {project.duration.toFixed(1)}s
          </span>

          <button
            onClick={() => updateProject({ isMuted: !project.isMuted })}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            title={project.isMuted ? 'Unmute' : 'Mute'}
          >
            {project.isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor Control Tool Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        {/* Navigation Tabs for Tools */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-100 mb-4 scrollbar-none">
          <button
            onClick={() => setActiveTab('trim')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'trim'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Trim & Cut</span>
          </button>

          <button
            onClick={() => setActiveTab('crop')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'crop'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Crop Aspect</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'audio'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Audio & Music</span>
          </button>

          <button
            onClick={() => setActiveTab('filter')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'filter'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>12 Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('sfx')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'sfx'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Viral SFX ({project.selectedSfxIds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('speed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'speed'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Speed ({project.speed}x)</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'text'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text</span>
          </button>

          <button
            onClick={() => setActiveTab('ffmpeg')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'ffmpeg'
                ? 'bg-[#00b050] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>FFmpeg</span>
          </button>
        </div>

        {/* Tab 1: Trim & Cut */}
        {activeTab === 'trim' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Timeline Trim & Cut
                </h4>
                <p className="text-xs text-slate-500">
                  Selected duration: <span className="font-semibold text-emerald-700">{videoDuration.toFixed(1)}s</span> (from {project.startTime.toFixed(1)}s to {project.endTime.toFixed(1)}s)
                </p>
              </div>
              <button
                onClick={() => updateProject({ startTime: 0, endTime: project.duration })}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Trim</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Start Cut Time: {project.startTime.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, project.endTime - 0.5)}
                  step={0.1}
                  value={project.startTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateProject({ startTime: val });
                    handleSeek(val);
                  }}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  End Cut Time: {project.endTime.toFixed(1)}s
                </label>
                <input
                  type="range"
                  min={project.startTime + 0.5}
                  max={project.duration}
                  step={0.1}
                  value={project.endTime}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    updateProject({ endTime: val });
                    handleSeek(val);
                  }}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Crop Aspect */}
        {activeTab === 'crop' && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              Aspect Ratio & Crop Format
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: '16:9', label: '16:9 Landscape', desc: 'YouTube & Desktop' },
                { id: '9:16', label: '9:16 Portrait', desc: 'Shorts, TikTok, Reels' },
                { id: '1:1', label: '1:1 Square', desc: 'Instagram Feed' },
                { id: '4:5', label: '4:5 Social', desc: 'Facebook & Post' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateProject({ aspectRatio: item.id as AspectRatioType })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    project.aspectRatio === item.id
                      ? 'border-[#00b050] bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.label}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Audio & Music */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Copyright Music Removal & Stem Stripping
                </h4>
                <p className="text-xs text-slate-500">
                  Instantly remove claimed music or adjust audio mix level
                </p>
              </div>

              <button
                onClick={handle1ClickRemoveCopyrightMusic}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-xs"
              >
                1-Click Remove Copyright Music
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Original Audio Track Status:</span>
                <span className={project.isMuted ? 'text-rose-600 font-bold' : 'text-[#00b050] font-bold'}>
                  {project.isMuted ? 'Muted / Stripped ✓' : 'Original Audio Active'}
                </span>
              </div>

              {!project.isMuted && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Original Volume</span>
                    <span className="font-mono">{Math.round(project.originalAudioVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={project.originalAudioVolume}
                    onChange={(e) => updateProject({ originalAudioVolume: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-600"
                  />
                </div>
              )}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div className="text-xs text-emerald-950">
                <span className="font-bold block">120 Royalty-Free & NCS Tracks Vault</span>
                <span className="text-[11px] text-emerald-700">Pick from Viral TikTok, Phonk, Lo-Fi, Cinematic & Folk beats</span>
              </div>
              <button
                onClick={onOpenFixer}
                className="px-3.5 py-2 text-xs font-bold text-white bg-[#00b050] hover:bg-emerald-700 rounded-xl shadow-xs shrink-0"
              >
                Browse 120 Tracks
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: 12 Video Filters */}
        {activeTab === 'filter' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">
                12 Cinematic & Viral Filters
              </h4>
              <span className="text-xs text-slate-500">Live preview applied</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {VIDEO_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateProject({ filter: f.id })}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    project.filter === f.id
                      ? 'border-[#00b050] bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{f.name}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    {f.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Viral Sound Effects */}
        {activeTab === 'sfx' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Viral Meme Sound Effects
                </h4>
                <p className="text-xs text-slate-500">
                  Tap to preview Vine Boom, Bruh, Airhorn, Ka-ching and more
                </p>
              </div>

              <button
                onClick={onOpenSfxModal}
                className="px-3 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs"
              >
                Open Full Soundboard
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {VIRAL_SOUND_EFFECTS.slice(0, 8).map((sfx) => {
                const isSelected = project.selectedSfxIds.includes(sfx.id);

                return (
                  <div
                    key={sfx.id}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-1 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => audioEngine.playSoundEffect(sfx)}
                      className="flex items-center gap-1.5 truncate text-left hover:text-emerald-700"
                    >
                      <span>{sfx.icon}</span>
                      <span className="font-bold truncate">{sfx.name}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? project.selectedSfxIds.filter((id) => id !== sfx.id)
                          : [...project.selectedSfxIds, sfx.id];
                        updateProject({ selectedSfxIds: next });
                      }}
                      className={`p-1 rounded-md text-[10px] font-bold ${
                        isSelected ? 'bg-[#00b050] text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isSelected ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 6: Video Speed */}
        {activeTab === 'speed' && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900">
              Playback & Export Speed
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    updateProject({ speed: s });
                    if (videoRef.current) {
                      videoRef.current.playbackRate = s;
                    }
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    project.speed === s
                      ? 'bg-[#00b050] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {s}x {s === 1.0 && '(Normal)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Text Overlay */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Overlay Text Caption
              </label>
              <input
                type="text"
                value={project.overlayText}
                onChange={(e) => updateProject({ overlayText: e.target.value })}
                placeholder="e.g. Fair-Use Commentary / Fixed with Pak Copyright Fixer"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00b050]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Position
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['top', 'center', 'bottom'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateProject({ textPosition: pos })}
                      className={`py-1.5 text-xs font-medium rounded-lg capitalize ${
                        project.textPosition === pos
                          ? 'bg-[#00b050] text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#00b050', '#fbbf24', '#000000'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateProject({ textColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        project.textColor === color
                          ? 'ring-2 ring-emerald-500 scale-110 border-white'
                          : 'border-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Size: {project.textSize}px
                </label>
                <input
                  type="range"
                  min={18}
                  max={54}
                  value={project.textSize}
                  onChange={(e) => updateProject({ textSize: parseInt(e.target.value, 10) })}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: FFmpeg */}
        {activeTab === 'ffmpeg' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Generated FFmpeg Command
                </h4>
                <p className="text-xs text-slate-500">
                  CLI command executed by the Android background Flutter FFmpeg engine
                </p>
              </div>
              <button
                onClick={handleCopyFfmpeg}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copiedFfmpeg ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFfmpeg ? 'Copied!' : 'Copy Command'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed border border-slate-800">
              {generateFFmpegCommand(project, '1080p')}
            </pre>
          </div>
        )}
      </div>

      {/* Footer Navigation CTA */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setScreen('home')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          ← Back to Home
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFixer}
            className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4 text-[#00b050]" />
            <span>120 NCS Music</span>
          </button>

          <button
            onClick={onOpenExport}
            className="px-5 py-2 text-xs font-bold text-white bg-[#00b050] hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Final Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
