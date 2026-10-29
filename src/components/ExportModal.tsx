/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VideoProject, SubscriptionState } from '../types';
import { renderAndExportVideo, RenderProgress } from '../services/videoRenderer';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  FileCode2,
  Share2,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
  subscription: SubscriptionState;
  onOpenSubscription: () => void;
  onOpenApkModal: () => void;
  onExportSuccess: (updatedSub: SubscriptionState) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  subscription,
  onOpenSubscription,
  onOpenApkModal,
  onExportSuccess,
}) => {
  const [resolution, setResolution] = useState<'720p' | '1080p'>('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setErrorMsg(null);
    setExportedUrl(null);

    // Check export quota
    if (!subscription.isPremium && subscription.freeExportsRemaining <= 0) {
      onOpenSubscription();
      return;
    }

    setIsExporting(true);
    setProgress({ percent: 0, stage: 'Initializing hardware encoder...', frame: 0, totalFrames: 100 });

    try {
      // Find or create hidden video element
      let videoEl = document.querySelector('video') as HTMLVideoElement;
      if (!videoEl || !videoEl.src) {
        videoEl = document.createElement('video');
        videoEl.src = project.videoUrl;
        videoEl.muted = project.isMuted;
        await new Promise((res) => {
          videoEl.onloadedmetadata = res;
        });
      }

      const blob = await renderAndExportVideo(videoEl, project, resolution, (p) => {
        setProgress(p);
      });

      const url = URL.createObjectURL(blob);
      setExportedUrl(url);

      // Decrement quota and update local storage
      const result = StorageService.decrementExportQuota();
      StorageService.incrementExportsTotal();
      const updatedSub = StorageService.getSubscription();
      onExportSuccess(updatedSub);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}
    } catch (err: unknown) {
      console.error('Export error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Video export failed. Please try a shorter duration or 720p.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportedUrl) return;
    const a = document.createElement('a');
    a.href = exportedUrl;
    a.download = `${project.title || 'fixed_video'}_${resolution}_fairuse.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                Export Video ({resolution})
              </h3>
              <p className="text-xs text-emerald-100">
                Pak Copyright Fixer FFmpeg Processing Pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExporting}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Quota Check Alert */}
          {!subscription.isPremium && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">
                Free Trial: <strong>{subscription.freeExportsRemaining} export left</strong>
              </span>
              <button
                onClick={onOpenSubscription}
                className="font-bold text-amber-800 underline hover:text-amber-950"
              >
                Upgrade to Unlimited
              </button>
            </div>
          )}

          {/* Resolution Options */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-2">
              Select Output Video Quality:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setResolution('720p')}
                disabled={isExporting}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  resolution === '720p'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">720p HD</span>
                  <span className="text-[10px] font-mono bg-slate-200/60 px-1.5 py-0.5 rounded">
                    1280×720
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Fast render speed, optimized for mobile data & WhatsApp
                </p>
              </button>

              <button
                type="button"
                onClick={() => setResolution('1080p')}
                disabled={isExporting}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                  resolution === '1080p'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">1080p Full HD</span>
                  <span className="text-[10px] font-mono bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                    1920×1080
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Crystal clear studio quality for YouTube & TikTok
                </p>
              </button>
            </div>
          </div>

          {/* Active Settings Summary */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Aspect Ratio:</span>
              <strong className="text-slate-800">{project.aspectRatio}</strong>
            </div>
            <div className="flex justify-between">
              <span>Clip Duration:</span>
              <strong className="text-slate-800 font-mono">
                {(project.endTime - project.startTime).toFixed(1)}s
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Royalty-Free Audio:</span>
              <strong className="text-emerald-700">
                {project.selectedNcsTrackId ? 'NCS Track Applied' : 'Original Muted'}
              </strong>
            </div>
            {project.voiceOver.enabled && (
              <div className="flex justify-between">
                <span>AI Voice Over:</span>
                <strong className="text-emerald-700">English Enabled</strong>
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Progress Indicator */}
          {isExporting && progress && (
            <div className="space-y-2 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
              <div className="flex justify-between text-xs font-semibold text-emerald-900">
                <span>{progress.stage}</span>
                <span className="font-mono">{progress.percent}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-150"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <p className="text-[11px] text-emerald-700 font-mono text-center">
                Processing frame {progress.frame} of {progress.totalFrames}
              </p>
            </div>
          )}

          {/* Export Complete State */}
          {exportedUrl && (
            <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-2xl space-y-3 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Video Rendered Successfully!
                </h4>
                <p className="text-xs text-slate-600">
                  Your video is cleaned and ready for upload without copyright issues.
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Save Video to Gallery / Storage</span>
              </button>
            </div>
          )}

          {/* Action Trigger Button */}
          {!exportedUrl && (
            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className={`w-full py-3.5 px-4 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
                isExporting
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99]'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Encoding Video...' : `Export Now (${resolution})`}</span>
            </button>
          )}

          {/* APK Build Shortcut Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need standalone Android installer?</span>
            <button
              onClick={() => {
                onClose();
                onOpenApkModal();
              }}
              className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Build & Download APK File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
