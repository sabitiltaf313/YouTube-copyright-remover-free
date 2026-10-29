/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { generateStandaloneApkBlob, generateFlutterSourceZip } from '../services/flutterCodeGenerator';
import { StorageService, ADMIN_CONFIG } from '../services/storageService';
import { SubscriptionState } from '../types';
import confetti from 'canvas-confetti';
import {
  Download,
  Smartphone,
  CheckCircle2,
  X,
  Copy,
  Check,
  FolderArchive,
  Phone,
  AlertCircle,
  Lock,
} from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: SubscriptionState;
  onSubscriptionUpdated?: (newSub: SubscriptionState) => void;
  onOpenAdminPanel?: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSubscriptionUpdated,
  onOpenAdminPanel,
}) => {
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'pending' | 'error' } | null>(null);
  const [showApkProNote, setShowApkProNote] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isBuildingApk, setIsBuildingApk] = useState(false);
  const [isBuildingZip, setIsBuildingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Sync email from subscription if present
  useEffect(() => {
    if (subscription?.userEmail) {
      setEmail(subscription.userEmail);
    }
  }, [subscription?.userEmail]);

  if (!isOpen) return null;

  const isUserPro = (userEmail: string): boolean => {
    if (subscription?.isPremium) return true;
    if (localStorage.getItem('current_user_pro') === 'true') return true;
    if (!userEmail) return false;
    return StorageService.isEmailPro(userEmail);
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(ADMIN_CONFIG.accountNumber);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Logic matching user's checkStatus() function
  const handleCheckStatus = () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      alert('Please enter a valid Gmail / Email address (اپنی Gmail لکھیں)');
      return;
    }

    setShowApkProNote(false);
    const pending = StorageService.getPendingUsers();
    const pro = StorageService.getProUsers();

    if (pro.includes(cleanEmail) || subscription?.isPremium) {
      setStatusMsg({
        text: '✅ آپ Pro یوزر ہیں، اب آپ براہ راست ڈاؤن لوڈ کر سکتے ہیں (You are a verified Pro User! Ready to download)',
        type: 'success',
      });
      localStorage.setItem('current_user_pro', 'true');
      if (onSubscriptionUpdated) {
        onSubscriptionUpdated(StorageService.getSubscription());
      }
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else if (pending.includes(cleanEmail)) {
      setStatusMsg({
        text: '⏳ آپ کی درخواست پینڈنگ میں ہے، واٹس ایپ پر اسکرین شاٹ بھیجیں تاکہ فوراً Pro ایکٹیو ہو (Pending: Please send screenshot on WhatsApp for instant activation)',
        type: 'pending',
      });
    } else {
      // Add to pending_users
      StorageService.submitPaymentRequest(cleanEmail, 'pro_500', 'jazzcash');
      setStatusMsg({
        text: '⏳ آپ کی درخواست محفوظ ہو گئی ہے، عمر بھائی 03105423365 پر واٹس ایپ کریں تو فوراً Pro ہو جائے گا (Request saved. WhatsApp Umar Bhai at 03105423365 for instant activation)',
        type: 'pending',
      });
    }
  };

  // Logic matching user's downloadAPK() function
  const handleDownloadAPK = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const proStatus = isUserPro(cleanEmail);

    if (!proStatus) {
      setShowApkProNote(true);
      setStatusMsg({
        text: '⚠️ یہ APK صرف Pro یوزرز کے لیے ہے۔ پہلے 03105423365 (Umar Iltaf) پر 500 روپے بھیجیں (This APK is for Pro users. Send 500 PKR to Umar Iltaf 03105423365)',
        type: 'error',
      });
      return;
    }

    setIsBuildingApk(true);
    setDownloadSuccess(null);
    setShowApkProNote(false);

    try {
      const blob = await generateStandaloneApkBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pak-copyright-fixer-v1.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess('Download started: pak-copyright-fixer-v1.0.apk is ready for Android installation!');
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch {}
    } catch (e) {
      console.error(e);
      alert('Error packaging APK file.');
    } finally {
      setIsBuildingApk(false);
    }
  };

  // Logic matching user's downloadZIP() function
  const handleDownloadZIP = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const proStatus = isUserPro(cleanEmail);

    if (!proStatus) {
      setShowApkProNote(true);
      alert('Source Code ZIP صرف Pro کے لیے ہے (Flutter Source Code ZIP is for Pro users only)');
      return;
    }

    setIsBuildingZip(true);
    setDownloadSuccess(null);
    try {
      const blob = await generateFlutterSourceZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'pak_copyright_fixer_flutter_source.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess('Flutter Source Code ZIP downloaded successfully!');
    } catch (e) {
      console.error(e);
      alert('Error packaging Source Code ZIP.');
    } finally {
      setIsBuildingZip(false);
    }
  };

  const whatsappUrl = `https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    `السلام علیکم عمر بھائی Pro Plan چاہیے میرا ایمیل ${email || ''}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#f8fafc] rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-6">
        {/* Top Minimal Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#00b050] flex items-center justify-center text-white font-extrabold text-sm">
              P
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              Pak Copyright Fixer — Umar Iltaf (03105423365)
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* PRO BOX - UMAR ILTAF (Matching User Layout & Design) */}
          <div className="bg-[#f0fdf4] border-2 border-[#00b050] rounded-2xl p-4 sm:p-5 text-center shadow-xs">
            <h3 className="text-base sm:text-lg font-bold text-[#00b050] m-0">
              🔓 Pro ورژن حاصل کریں (Get Pro Plan - 500 PKR)
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-3">
              فری میں واٹر مارک آئے گا، Pro میں HD بغیر لوگو کے (Free has watermark, Pro has Full HD with no watermark)
            </p>

            {/* Account Details Box */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 my-3 shadow-xs">
              <div className="text-xs text-slate-500 font-semibold">
                JazzCash / Easypaisa
              </div>
              <div className="text-xs text-slate-800 mt-0.5">
                نام: <b className="font-bold text-slate-950">{ADMIN_CONFIG.name}</b>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-[#00b050] tracking-wider font-mono">
                  {ADMIN_CONFIG.accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                  title="Copy Number"
                >
                  {copiedNumber ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email Input */}
            <input
              id="emailInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="اپنی Gmail لکھیں (Enter your Gmail)"
              className="w-full sm:w-[94%] px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 text-center focus:outline-none focus:ring-2 focus:ring-[#00b050] bg-white mx-auto block shadow-xs"
            />

            {/* Action Buttons: Check Status & WhatsApp */}
            <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:w-[94%] mx-auto">
              <button
                type="button"
                onClick={handleCheckStatus}
                className="flex-1 py-3 px-4 bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center"
              >
                اسٹیٹس چیک کریں (Check Status)
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 bg-[#25D366] hover:bg-green-600 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all text-center no-underline flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>واٹس ایپ (WhatsApp)</span>
              </a>
            </div>

            {/* Status Message */}
            {statusMsg && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-semibold leading-relaxed border ${
                  statusMsg.type === 'success'
                    ? 'bg-emerald-100/80 border-emerald-300 text-emerald-950'
                    : statusMsg.type === 'pending'
                    ? 'bg-amber-100/80 border-amber-300 text-amber-950'
                    : 'bg-rose-100/80 border-rose-300 text-rose-950'
                }`}
              >
                {statusMsg.text}
              </div>
            )}
          </div>

          {/* CARD 1: STANDALONE APK DOWNLOAD */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#00b050] text-white flex items-center justify-center font-extrabold text-xl shadow-xs shrink-0">
                P
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-900 leading-tight">
                  Source · Package
                </div>
                <div className="font-mono text-xs text-slate-500">
                  com.pak.copyrightfixer
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              With app icon (Letter P in green circle). Sideload directly onto any Android device without Google Play Store.
            </p>

            <button
              id="apkBtn"
              onClick={handleDownloadAPK}
              disabled={isBuildingApk}
              className="w-full py-3 px-4 bg-[#00b050] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>
                {isBuildingApk
                  ? 'Packaging APK...'
                  : '⬇️ Download pak-copyright-fixer.apk'}
              </span>
            </button>

            {showApkProNote && (
              <p
                id="apkNote"
                className="text-xs font-bold text-rose-600 text-center m-0 pt-1"
              >
                پہلے اوپر Pro ایکٹیو کریں (Please activate Pro first with 500 PKR to Umar Iltaf 03105423365)
              </p>
            )}
          </div>

          {/* CARD 2: FULL FLUTTER SOURCE CODE (ZIP) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🗂️</span>
              <div className="font-extrabold text-sm sm:text-base text-slate-900">
                2. Full Flutter Source Code (ZIP)
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Includes complete Dart codebase (<code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">pubspec.yaml</code>, <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">AndroidManifest.xml</code>, <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">build.gradle</code>, Flutter FFmpeg engine, screens).
            </p>

            <button
              id="zipBtn"
              onClick={handleDownloadZIP}
              disabled={isBuildingZip}
              className="w-full py-3 px-4 bg-[#0f172a] hover:bg-slate-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <FolderArchive className="w-4 h-4" />
              <span>
                {isBuildingZip
                  ? 'Archiving Source ZIP...'
                  : '⬇️ Download Flutter Source ZIP'}
              </span>
            </button>
          </div>

          {/* CARD 3: HOW TO INSTALL & ADMOB BANNER */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#00b050]" />
              <span>📱 How to Install Standalone APK on Android:</span>
            </div>

            <ol className="text-xs text-slate-600 list-decimal list-inside space-y-1.5 leading-relaxed pl-1">
              <li>
                Click <b>Download pak-copyright-fixer.apk</b> above.
              </li>
              <li>
                Transfer the file to your Android phone or download directly in phone browser.
              </li>
              <li>
                Tap the downloaded file and select <b>Install</b> (allow Unknown Sources if prompted).
              </li>
            </ol>

            {/* AdMob Banner Placeholder Requested by User */}
            <div className="mt-2 bg-slate-100 border border-dashed border-slate-300 rounded-xl p-3 text-center text-xs text-slate-500 font-medium">
              Advertisement - یہاں آپ کا AdMob لگے گا (AdMob Banner Placement Slot)
            </div>
          </div>

          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              onClose();
              if (onOpenAdminPanel) onOpenAdminPanel();
            }}
            className="text-slate-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>ایڈمن پینل (Admin Panel - Umar Iltaf)</span>
          </button>

          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            بند کریں (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
