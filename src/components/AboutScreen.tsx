/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScreenType } from '../types';
import { ADMIN_CONFIG } from '../services/storageService';
import {
  ShieldCheck,
  Scale,
  Music,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Mail,
  Phone,
  Flame,
  Smartphone,
} from 'lucide-react';

interface AboutScreenProps {
  setScreen: (screen: ScreenType) => void;
  onOpenApkModal: () => void;
  onOpenDirectInstall?: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({
  setScreen,
  onOpenApkModal,
  onOpenDirectInstall,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-3.5 sm:px-4 py-5 sm:py-8 space-y-5 sm:space-y-6">
      <button
        onClick={() => setScreen('home')}
        className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* App Brand Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 text-center shadow-xs space-y-3">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#00b050] flex items-center justify-center text-white font-black text-3xl sm:text-4xl shadow-md ring-8 ring-emerald-50 mx-auto">
          P
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Pak Copyright Fixer
        </h1>
        <p className="text-xs font-mono text-slate-500">
          Package ID: com.pak.copyrightfixer · Version 1.0.0
        </p>

        {/* Support & Contact Card */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-slate-100 p-2.5 rounded-2xl text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#00b050]" />
            <span>Support: <strong className="text-slate-900">{ADMIN_CONFIG.supportEmail}</strong></span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#00b050]" />
            <span>WhatsApp: <strong className="text-slate-900">{ADMIN_CONFIG.accountNumber}</strong> ({ADMIN_CONFIG.name})</span>
          </div>
        </div>

        {/* MANDATORY TEXT REQUIRED BY USER PROMPT */}
        <div className="mt-3 p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl text-left max-w-xl mx-auto">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-semibold">
              &ldquo;This app does not bypass YouTube Content ID illegally. It only helps edit and replace audio with royalty-free music. User is responsible for uploads.&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Fair-Use Guidance */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-[#00b050]" />
          <span>Fair-Use Legal Video Utility</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pak Copyright Fixer helps Pakistani and global content creators fix claimed background music legally by substituting copyrighted sounds with 120 certified royalty-free tracks, viral meme effects, and English narration.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#00b050]" />
              <span>Legal Capabilities</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>120 royalty-free NCS music library</li>
              <li>15 viral meme sound effects</li>
              <li>12 cinematic & viral video filters</li>
              <li>1-click copyright music stem stripping</li>
              <li>24-hour free trial for every device</li>
            </ul>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Fair Play Invariants</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>Does not alter YouTube digital audio hashes</li>
              <li>Does not hack Content ID servers</li>
              <li>Does not grant rights to stolen video clips</li>
              <li>Protects fair-use commentary & educational review</li>
            </ul>
          </div>
        </div>
      </div>

      {/* APK & Direct Install Shortcuts */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold tracking-tight">
            Direct Mobile Installation (No Store Needed)
          </h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-md">
            Install directly to your Android device with one tap or download the standalone APK file.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenDirectInstall && (
            <button
              onClick={onOpenDirectInstall}
              className="px-3.5 py-2 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
            >
              Direct Install
            </button>
          )}

          <button
            onClick={onOpenApkModal}
            className="px-3.5 py-2 bg-emerald-950 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-900 transition-colors"
          >
            APK & Source
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-1">
        Official Support: ub514417@gmail.com · Umar Iltaf (03105423365)
      </div>
    </div>
  );
};
