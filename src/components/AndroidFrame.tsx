/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wifi, BatteryMedium, Signal, ChevronLeft, Home, Square } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isMobileFrame: boolean;
  onBack?: () => void;
  onHome?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isMobileFrame,
  onBack,
  onHome,
}) => {
  if (!isMobileFrame) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-2 sm:px-4 flex items-center justify-center">
      {/* Android Device Mockup Container */}
      <div className="relative w-full max-w-[430px] h-[92vh] max-h-[920px] bg-slate-950 rounded-[44px] shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800 flex flex-col overflow-hidden">
        {/* Android Status Bar */}
        <div className="h-9 bg-white text-slate-800 px-6 flex items-center justify-between text-[11px] font-semibold select-none shrink-0 border-b border-slate-100 z-30">
          <span>12:00</span>
          {/* Camera Notch / Hole-punch */}
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 shadow-inner"></div>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Scrollable Mobile App Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          {children}
        </div>

        {/* Android Soft Navigation Bar */}
        <div className="h-10 bg-slate-950 px-8 flex items-center justify-around text-slate-400 select-none shrink-0 border-t border-slate-800">
          <button
            onClick={onBack}
            className="p-1 hover:text-white transition-colors"
            title="Android Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onHome}
            className="p-1 hover:text-white transition-colors"
            title="Android Home"
          >
            <div className="w-3 h-3 rounded-full border border-current"></div>
          </button>
          <button
            className="p-1 hover:text-white transition-colors"
            title="Recent Apps"
          >
            <Square className="w-3 h-3 rounded-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};
