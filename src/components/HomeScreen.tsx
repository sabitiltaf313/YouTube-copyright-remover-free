/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { ScreenType, SubscriptionState, VideoProject } from '../types';
import { StorageService, ADMIN_CONFIG } from '../services/storageService';
import {
  Upload,
  ShieldAlert,
  Play,
  Sparkles,
  Music2,
  Clock,
  ArrowRight,
  Sliders,
  Flame,
  Download,
  Mail,
  Smartphone,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { createDemoVideoBlob } from '../utils/sampleVideo';

interface HomeScreenProps {
  subscription: SubscriptionState;
  onOpenSubscription: () => void;
  onSelectVideo: (project: VideoProject, targetScreen: ScreenType) => void;
  setScreen: (screen: ScreenType) => void;
  onOpenApkModal: () => void;
  onOpenDirectInstall: () => void;
  onOpenSfxModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  subscription,
  onOpenSubscription,
  onSelectVideo,
  setScreen,
  onOpenApkModal,
  onOpenDirectInstall,
  onOpenSfxModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [trialTime, setTrialTime] = useState<{ hours: number; minutes: number; isExpired: boolean }>(() =>
    StorageService.getTrialRemainingFormatted()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTrialTime(StorageService.getTrialRemainingFormatted());
    }, 30000);
    return () => clearInterval(timer);
  }, [subscription]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetScreen: ScreenType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      const project: VideoProject = {
        id: 'proj_' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        videoUrl: url,
        videoFile: file,
        duration: video.duration || 10,
        width: video.videoWidth || 1920,
        height: video.videoHeight || 1080,
        startTime: 0,
        endTime: Math.min(video.duration || 10, 60),
        aspectRatio: video.videoWidth < video.videoHeight ? '9:16' : '16:9',
        isMuted: false,
        speed: 1.0,
        filter: 'none',
        overlayText: '',
        textColor: '#ffffff',
        textPosition: 'bottom',
        textSize: 32,
        isCopyrightDetected: true,
        detectedSongName: 'Commercial Music Track (ID #49821)',
        claimant: 'Universal Music Publishing / Sony Music Rights',
        riskLevel: 'high',
        selectedNcsTrackId: null,
        musicVolume: 0.8,
        originalAudioVolume: 0.2,
        selectedSfxIds: [],
        voiceOver: {
          enabled: false,
          text: 'Welcome to this educational video presentation.',
          voiceStyle: 'tech',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
        },
      };
      onSelectVideo(project, targetScreen);
    };
  };

  const loadSampleVideo = async (sampleName: string, targetScreen: ScreenType) => {
    setIsLoadingSample(true);
    try {
      const url = await createDemoVideoBlob(sampleName, 8);
      const project: VideoProject = {
        id: 'demo_' + Date.now(),
        title: sampleName,
        videoUrl: url,
        duration: 8,
        width: 1280,
        height: 720,
        startTime: 0,
        endTime: 8,
        aspectRatio: '16:9',
        isMuted: false,
        speed: 1.0,
        filter: 'none',
        overlayText: 'Fixed with Pak Copyright Fixer',
        textColor: '#ffffff',
        textPosition: 'bottom',
        textSize: 32,
        isCopyrightDetected: true,
        detectedSongName: 'Commercial Pop Beat #PK-8820',
        claimant: 'Digital Rights Worldwide',
        riskLevel: 'high',
        selectedNcsTrackId: 'ncs-1',
        musicVolume: 0.8,
        originalAudioVolume: 0.0,
        selectedSfxIds: ['sfx_boom'],
        voiceOver: {
          enabled: false,
          text: 'In this video, we review fair-use legal guidelines for content creators.',
          voiceStyle: 'host',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
        },
      };
      onSelectVideo(project, targetScreen);
    } finally {
      setIsLoadingSample(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-4 py-5 sm:py-7 space-y-5 sm:space-y-6">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'editor')}
      />

      {/* 1. 24-HOUR FREE TRIAL TIMER BANNER (Top of Screen) */}
      <div className="bg-white border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                subscription.isPremium
                  ? 'bg-amber-100 text-amber-700'
                  : trialTime.isExpired
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-[#00b050]'
              }`}
            >
              {subscription.isPremium ? (
                <Sparkles className="w-6 h-6" />
              ) : (
                <Clock className="w-6 h-6 animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {subscription.isPremium
                    ? 'Pro Plan Active (Unlimited Access)'
                    : trialTime.isExpired
                    ? '24-Hour Free Trial Expired'
                    : '24-Hour Free Trial Active'}
                </h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    subscription.isPremium
                      ? 'bg-amber-100 text-amber-800'
                      : trialTime.isExpired
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-[#00b050]'
                  }`}
                >
                  {subscription.isPremium
                    ? 'Pro'
                    : trialTime.isExpired
                    ? 'Expired'
                    : `${trialTime.hours}h ${trialTime.minutes}m Left`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {subscription.isPremium
                  ? 'All 120 viral tracks, sound effects, 12 filters & 1080p enabled.'
                  : trialTime.isExpired
                  ? 'Your 24-hour trial period has ended. Activate Pro for only 500 PKR.'
                  : 'Full access to all editing features. (Only 1 trial per device IP allowed).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenDirectInstall}
              className="px-3 py-2 text-xs font-bold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#00b050]" />
              <span>Direct Install</span>
            </button>

            <button
              onClick={onOpenSubscription}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs ${
                subscription.isPremium
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-[#00b050] text-white hover:bg-emerald-700'
              }`}
            >
              {subscription.isPremium ? 'Account Info' : 'Upgrade Pro (500 PKR)'}
            </button>
          </div>
        </div>
      </div>

      {/* App Identity Banner */}
      <div className="text-center py-1 sm:py-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00b050] text-white font-black text-2xl shadow-md mb-2 ring-4 ring-emerald-100">
          P
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pak Copyright Fixer
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mt-1">
          Replace copyrighted audio with 120 certified viral NCS tracks, meme sound effects & AI voice-over.
        </p>
        <div className="mt-2 inline-flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          <Mail className="w-3.5 h-3.5 text-emerald-600" />
          <span>Support: <strong className="text-slate-800">{ADMIN_CONFIG.supportEmail}</strong></span>
          <span>·</span>
          <Phone className="w-3 h-3 text-[#00b050]" />
          <span>WhatsApp: <strong className="text-slate-800">{ADMIN_CONFIG.accountNumber}</strong></span>
        </div>
      </div>

      {/* TWO BIG ACTION BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Big Button 1: Import Video */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center p-7 sm:p-8 bg-[#00b050] hover:bg-emerald-700 active:scale-[0.99] text-white rounded-3xl shadow-md transition-all text-center border-2 border-emerald-400/30"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight">
            Import Video
          </span>
          <span className="text-xs text-emerald-100 mt-1.5 font-medium max-w-xs">
            Open from gallery to trim, crop, mute copyright music, speed & add filters
          </span>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs bg-emerald-900/30 px-3 py-1.5 rounded-full text-emerald-100 font-semibold">
            <span>Video Editor Module</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Big Button 2: Check & Fix Copyright */}
        <button
          onClick={() => loadSampleVideo('Vlog with Copyrighted Music', 'fixer')}
          className="group relative flex flex-col items-center justify-center p-7 sm:p-8 bg-white hover:bg-emerald-50/60 active:scale-[0.99] text-slate-900 rounded-3xl shadow-md transition-all text-center border-2 border-[#00b050]"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-7 h-7 text-[#00b050]" />
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-900">
            Check & Fix Copyright
          </span>
          <span className="text-xs text-slate-600 mt-1.5 font-medium max-w-xs">
            Scan audio for Content ID matches & replace with 120 Viral & NCS tracks
          </span>
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-full font-bold">
            <span>120 Music Tracks & Audio Remover</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          onClick={() => setScreen('fixer')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-emerald-500 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#00b050] flex items-center justify-center mb-2">
            <Music2 className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">120 Music Tracks</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Viral TikTok, Phonk, Lo-Fi & NCS Beats
          </p>
        </button>

        <button
          onClick={onOpenSfxModal}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-amber-500 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
            <Flame className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Viral Sound Effects</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            15 Meme sounds & transitions
          </p>
        </button>

        <button
          onClick={() => setScreen('editor')}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-emerald-500 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#00b050] flex items-center justify-center mb-2">
            <Sliders className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">12 Video Filters</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Teal & orange, VHS, vivid & cinematic
          </p>
        </button>

        <button
          onClick={onOpenDirectInstall}
          className="bg-white p-3.5 rounded-2xl border border-slate-200 text-left hover:border-emerald-500 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
            <Download className="w-4 h-4 text-[#00b050]" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Direct Install</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Install without Google Play Store
          </p>
        </button>
      </div>

      {/* Quick Test Samples */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Try Instant Demo Videos
            </h3>
            <p className="text-[11px] text-slate-500">
              Test copyright removal, 120 tracks & viral sound effects with pre-loaded clips
            </p>
          </div>
          {isLoadingSample && (
            <span className="text-xs text-[#00b050] font-bold animate-pulse">
              Generating...
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => loadSampleVideo('Islamabad Travel Vlog (Copyright Match)', 'editor')}
            disabled={isLoadingSample}
            className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00b050] text-white flex items-center justify-center shrink-0">
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Travel Vlog
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                Copyright music detected
              </span>
            </div>
          </button>

          <button
            onClick={() => loadSampleVideo('Gaming Montage (Flagged Sound Recording)', 'fixer')}
            disabled={isLoadingSample}
            className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00b050] text-white flex items-center justify-center shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Gaming Highlight
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                120 NCS tracks mixer
              </span>
            </div>
          </button>

          <button
            onClick={() => loadSampleVideo('TikTok Reel (Fair-Use Commentary)', 'editor')}
            disabled={isLoadingSample}
            className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00b050] text-white flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Viral Reel Clip
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                12 filters & Meme SFX
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mandatory Fair-Use Disclaimer Box */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-bold text-emerald-900">
            Legal & Fair-Use Notice:
          </p>
          <p className="leading-relaxed">
            &ldquo;This app does not bypass YouTube Content ID illegally. It only helps edit and replace audio with royalty-free music. User is responsible for uploads.&rdquo;
          </p>
          <p className="text-[11px] text-slate-500 pt-0.5">
            Official Developer Support: <strong className="text-slate-800">{ADMIN_CONFIG.supportEmail}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
