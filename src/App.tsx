/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenType, VideoProject, SubscriptionState } from './types';
import { StorageService } from './services/storageService';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { VideoEditorScreen } from './components/VideoEditorScreen';
import { CopyrightFixerScreen } from './components/CopyrightFixerScreen';
import { AboutScreen } from './components/AboutScreen';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ExportModal } from './components/ExportModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { DirectInstallModal } from './components/DirectInstallModal';
import { SoundEffectsModal } from './components/SoundEffectsModal';
import { AndroidFrame } from './components/AndroidFrame';
import { createDemoVideoBlob } from './utils/sampleVideo';
import {
  Home,
  Sliders,
  ShieldAlert,
  Info,
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [subscription, setSubscription] = useState<SubscriptionState>(() =>
    StorageService.getSubscription()
  );
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Modals
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDirectInstallModalOpen, setIsDirectInstallModalOpen] = useState(false);
  const [isSfxModalOpen, setIsSfxModalOpen] = useState(false);

  // Check URL on load for ?admin or /admin or #admin
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.href.includes('admin')) {
      setIsAdminModalOpen(true);
    }
  }, []);

  // Current working video project
  const [project, setProject] = useState<VideoProject>({
    id: 'proj_default',
    title: 'Islamabad Vlog (Music Match)',
    videoUrl: '',
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
    claimant: 'Digital Rights Worldwide / Universal Rights',
    riskLevel: 'high',
    selectedNcsTrackId: 'ncs-1',
    musicVolume: 0.8,
    originalAudioVolume: 0.0,
    selectedSfxIds: ['sfx_boom'],
    voiceOver: {
      enabled: false,
      text: 'In this video, we review fair-use legal guidelines for online video editing.',
      voiceStyle: 'host',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    },
  });

  // Pre-generate a synthetic sample video on first load if videoUrl is empty
  useEffect(() => {
    let isCancelled = false;
    createDemoVideoBlob('Pak Copyright Fixer Demo', 8).then((url) => {
      if (!isCancelled && url) {
        setProject((prev) => ({
          ...prev,
          videoUrl: url,
        }));
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);

  const updateProject = (updated: Partial<VideoProject>) => {
    setProject((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  const handleToggleSfx = (sfxId: string) => {
    setProject((prev) => {
      const exists = prev.selectedSfxIds.includes(sfxId);
      const updated = exists
        ? prev.selectedSfxIds.filter((id) => id !== sfxId)
        : [...prev.selectedSfxIds, sfxId];
      return { ...prev, selectedSfxIds: updated };
    });
  };

  const handleSelectVideo = (newProj: VideoProject, targetScreen: ScreenType) => {
    setProject(newProj);
    setCurrentScreen(targetScreen);
  };

  const handleSubscriptionUpdated = (newSub: SubscriptionState) => {
    setSubscription(newSub);
  };

  return (
    <AndroidFrame
      isMobileFrame={isMobileFrame}
      onBack={() => {
        if (currentScreen === 'about' || currentScreen === 'editor' || currentScreen === 'fixer') {
          setCurrentScreen('home');
        }
      }}
      onHome={() => setCurrentScreen('home')}
    >
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-8">
        {/* Top Header */}
        <Header
          currentScreen={currentScreen}
          setScreen={setCurrentScreen}
          subscription={subscription}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onOpenApkModal={() => setIsApkModalOpen(true)}
          onOpenAdminPanel={() => setIsAdminModalOpen(true)}
          onOpenDirectInstall={() => setIsDirectInstallModalOpen(true)}
          onOpenSfxModal={() => setIsSfxModalOpen(true)}
          isMobileFrame={isMobileFrame}
          setIsMobileFrame={setIsMobileFrame}
        />

        {/* Screen Routing */}
        <main className="flex-1">
          {currentScreen === 'home' && (
            <HomeScreen
              subscription={subscription}
              onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
              onSelectVideo={handleSelectVideo}
              setScreen={setCurrentScreen}
              onOpenApkModal={() => setIsApkModalOpen(true)}
              onOpenDirectInstall={() => setIsDirectInstallModalOpen(true)}
              onOpenSfxModal={() => setIsSfxModalOpen(true)}
            />
          )}

          {currentScreen === 'editor' && (
            <VideoEditorScreen
              project={project}
              updateProject={updateProject}
              onOpenFixer={() => setCurrentScreen('fixer')}
              onOpenExport={() => setIsExportModalOpen(true)}
              onOpenSfxModal={() => setIsSfxModalOpen(true)}
              setScreen={setCurrentScreen}
            />
          )}

          {currentScreen === 'fixer' && (
            <CopyrightFixerScreen
              project={project}
              updateProject={updateProject}
              onOpenExport={() => setIsExportModalOpen(true)}
              setScreen={setCurrentScreen}
            />
          )}

          {currentScreen === 'about' && (
            <AboutScreen
              setScreen={setCurrentScreen}
              onOpenApkModal={() => setIsApkModalOpen(true)}
              onOpenDirectInstall={() => setIsDirectInstallModalOpen(true)}
            />
          )}
        </main>

        {/* Bottom Mobile Tab Bar (For phone ergonomics & touch navigation) */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center h-16 max-w-md mx-auto md:hidden">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentScreen === 'home' ? 'text-[#00b050] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1">Home</span>
          </button>

          <button
            onClick={() => setCurrentScreen('editor')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentScreen === 'editor' ? 'text-[#00b050] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-5 h-5" />
            <span className="text-[10px] mt-1">Editor</span>
          </button>

          <button
            onClick={() => setCurrentScreen('fixer')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentScreen === 'fixer' ? 'text-[#00b050] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="text-[10px] mt-1">120 Music</span>
          </button>

          <button
            onClick={() => setCurrentScreen('about')}
            className={`flex flex-col items-center justify-center h-full transition-colors ${
              currentScreen === 'about' ? 'text-[#00b050] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-5 h-5" />
            <span className="text-[10px] mt-1">About</span>
          </button>
        </nav>

        {/* Global Modals */}
        <SubscriptionModal
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
          subscription={subscription}
          onSubscriptionUpdated={handleSubscriptionUpdated}
          onOpenAdminPanel={() => setIsAdminModalOpen(true)}
        />

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          project={project}
          subscription={subscription}
          onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
          onOpenApkModal={() => setIsApkModalOpen(true)}
          onExportSuccess={handleSubscriptionUpdated}
        />

        <ApkDownloadModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
          subscription={subscription}
          onSubscriptionUpdated={handleSubscriptionUpdated}
          onOpenAdminPanel={() => setIsAdminModalOpen(true)}
        />

        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onSubscriptionUpdated={handleSubscriptionUpdated}
        />

        <DirectInstallModal
          isOpen={isDirectInstallModalOpen}
          onClose={() => setIsDirectInstallModalOpen(false)}
        />

        <SoundEffectsModal
          isOpen={isSfxModalOpen}
          onClose={() => setIsSfxModalOpen(false)}
          selectedSfxIds={project.selectedSfxIds}
          onToggleSfx={handleToggleSfx}
        />
      </div>
    </AndroidFrame>
  );
}
