/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { generateStandaloneApkBlob } from '../services/flutterCodeGenerator';
import { ADMIN_CONFIG } from '../services/storageService';
import {
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  X,
  PlusSquare,
  Sparkles,
} from 'lucide-react';

interface DirectInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectInstallModal: React.FC<DirectInstallModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Direct APK download fallback
      handleDownloadDirectApk();
    }
  };

  const handleDownloadDirectApk = async () => {
    setIsDownloadingApk(true);
    setDownloadSuccess(false);
    try {
      const blob = await generateStandaloneApkBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pak-copyright-fixer-v1.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDownloadingApk(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                Direct Android Install (No Play Store)
              </h2>
              <p className="text-xs text-emerald-100">
                Install Pak Copyright Fixer directly to your phone Home Screen
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

        <div className="p-5 sm:p-6 space-y-5">
          {/* App Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#00b050] text-white flex items-center justify-center font-black text-3xl shadow-sm shrink-0">
              P
            </div>
            <div className="text-xs space-y-1">
              <h3 className="font-bold text-sm text-slate-900">
                Pak Copyright Fixer Mobile
              </h3>
              <p className="text-slate-500 font-mono">
                com.pak.copyrightfixer · v1.0.0
              </p>
              <div className="flex items-center gap-2 text-emerald-700 font-medium pt-0.5">
                <span>Free Trial Active</span>
                <span>·</span>
                <span>FFmpeg Engine</span>
              </div>
            </div>
          </div>

          {/* 1-Tap Direct Install Button */}
          <div className="space-y-3">
            <button
              onClick={handleInstallPwa}
              className="w-full py-3.5 px-4 bg-[#00b050] hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <PlusSquare className="w-5 h-5" />
              <span>
                {isInstalled
                  ? 'App Installed on Home Screen! ✓'
                  : '1-Tap Direct Install to Home Screen'}
              </span>
            </button>

            <button
              onClick={handleDownloadDirectApk}
              disabled={isDownloadingApk}
              className="w-full py-3 px-4 bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>
                {isDownloadingApk
                  ? 'Generating Standalone APK...'
                  : 'Download Standalone .APK File'}
              </span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>pak-copyright-fixer-v1.0.apk downloaded! Ready to install.</span>
            </div>
          )}

          {/* Browser Instructions */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">
              Direct Browser Installation Steps:
            </span>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>In Chrome on Android, tap the three dots (<strong className="text-slate-800">⋮</strong>) at top-right.</li>
              <li>Select <strong className="text-slate-800">&quot;Install app&quot;</strong> or <strong className="text-slate-800">&quot;Add to Home screen&quot;</strong>.</li>
              <li>The icon with letter &quot;P&quot; in green circle will appear on your home screen!</li>
            </ol>
          </div>

          <div className="text-center text-xs text-slate-400">
            Support: {ADMIN_CONFIG.supportEmail} · WhatsApp: {ADMIN_CONFIG.accountNumber}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end text-xs">
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
