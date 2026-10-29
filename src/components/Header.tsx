/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, SubscriptionState } from '../types';
import { StorageService, ADMIN_CONFIG } from '../services/storageService';
import {
  Smartphone,
  Monitor,
  Crown,
  FileCode2,
  Lock,
  Clock,
  Download,
  Flame,
} from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  subscription: SubscriptionState;
  onOpenSubscription: () => void;
  onOpenApkModal: () => void;
  onOpenAdminPanel: () => void;
  onOpenDirectInstall: () => void;
  onOpenSfxModal: () => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  setScreen,
  subscription,
  onOpenSubscription,
  onOpenApkModal,
  onOpenAdminPanel,
  onOpenDirectInstall,
  onOpenSfxModal,
  isMobileFrame,
  setIsMobileFrame,
}) => {
  const [trialTime, setTrialTime] = useState<{ hours: number; minutes: number; isExpired: boolean }>(() =>
    StorageService.getTrialRemainingFormatted()
  );

  // Update trial clock every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTrialTime(StorageService.getTrialRemainingFormatted());
    }, 30000);
    return () => clearInterval(timer);
  }, [subscription]);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group"
        >
          {/* App Icon: Letter P in green circle */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#00b050] flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-xs ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            P
          </div>
          <div className="min-w-0">
            <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight truncate">
              Pak Copyright Fixer
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block truncate">
              Support: {ADMIN_CONFIG.supportEmail}
            </span>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-600">
          <button
            onClick={() => setScreen('home')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 ${
              currentScreen === 'home' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setScreen('editor')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 ${
              currentScreen === 'editor' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            Video Editor
          </button>
          <button
            onClick={() => setScreen('fixer')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 ${
              currentScreen === 'fixer' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            120 NCS Music
          </button>
          <button
            onClick={onOpenSfxModal}
            className="whitespace-nowrap transition-colors hover:text-amber-600 flex items-center gap-1 font-semibold text-slate-700"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Viral SFX</span>
          </button>
          <button
            onClick={() => setScreen('about')}
            className={`whitespace-nowrap transition-colors hover:text-emerald-700 ${
              currentScreen === 'about' ? 'text-emerald-700 font-bold' : ''
            }`}
          >
            About & Fair Use
          </button>
        </nav>

        {/* Action Zone: Trial countdown, Direct Install & Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Direct Install button */}
          <button
            onClick={onOpenDirectInstall}
            className="px-2.5 py-1.5 text-xs font-bold text-[#00b050] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1 shadow-2xs"
            title="Direct Install to Android"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Direct</span> Install
          </button>

          {/* Standalone APK button */}
          <button
            onClick={onOpenApkModal}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors hidden sm:flex items-center gap-1"
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>APK & ZIP</span>
          </button>

          {/* Device Frame View Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            title={isMobileFrame ? 'Full View' : 'Phone View'}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors hidden lg:flex items-center"
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4 text-emerald-600" />
            ) : (
              <Smartphone className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Admin Portal Button */}
          <button
            onClick={onOpenAdminPanel}
            title="Admin Login (Umar Iltaf)"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>

          {/* 24-Hour Free Trial Countdown & Subscription Button */}
          <button
            onClick={onOpenSubscription}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs ${
              subscription.isPremium
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : trialTime.isExpired
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-[#00b050] text-white hover:bg-emerald-700'
            }`}
          >
            {subscription.isPremium ? (
              <>
                <Crown className="w-3.5 h-3.5" />
                <span>Pro Active</span>
              </>
            ) : trialTime.isExpired ? (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Trial Expired · Upgrade</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>{trialTime.hours}h {trialTime.minutes}m Free Trial</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
