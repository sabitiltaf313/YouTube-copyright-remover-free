/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlanIdType, SubscriptionState } from '../types';
import { SUBSCRIPTION_PLANS, StorageService, ADMIN_CONFIG } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  Check,
  Crown,
  Sparkles,
  Copy,
  CreditCard,
  ShieldCheck,
  X,
  RotateCcw,
  AlertCircle,
  Smartphone,
  Phone,
  Send,
  Lock,
} from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: SubscriptionState;
  onSubscriptionUpdated: (newSub: SubscriptionState) => void;
  onOpenAdminPanel?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onSubscriptionUpdated,
  onOpenAdminPanel,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanIdType>('pro_500');
  const [paymentMethod, setPaymentMethod] = useState<'jazzcash' | 'easypaisa'>('jazzcash');
  const [userEmail, setUserEmail] = useState(subscription.userEmail || '');
  const [tid, setTid] = useState(subscription.transactionId || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[1];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(ADMIN_CONFIG.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Implements user requested payDone() function logic
  const handlePayDone = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!userEmail || !userEmail.trim() || !userEmail.includes('@')) {
      setErrorMsg('Please enter your email address (اپنا ای میل لکھیں)');
      return;
    }

    // 1. Submit payment request to localStorage 'pending_users' and 'pending_user_details'
    const { whatsappUrl } = StorageService.submitPaymentRequest(
      userEmail,
      selectedPlanId,
      paymentMethod,
      tid
    );

    // 2. Unlock locally so user gets instant access without waiting
    const newSub = StorageService.activatePremium(
      selectedPlanId,
      tid || 'WA-PENDING',
      paymentMethod,
      userEmail
    );
    onSubscriptionUpdated(newSub);

    // 3. Show celebration & success message
    setSuccessNotice(
      'Thank you! Your Pro plan is activated locally and submitted for admin verification. (شکریہ! 10 منٹ میں ایکٹیو ہو جائے گا)'
    );

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00b050', '#10b981', '#fbbf24', '#ffffff'],
      });
    } catch {}

    // 4. Open WhatsApp window with pre-filled message as requested
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  const handleWhatsAppScreenshot = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Umar Iltaf! I have sent ${currentPlan.pricePKR} PKR via ${paymentMethod.toUpperCase()} for Pak Copyright Fixer Pro Plan.\nMy Email: ${userEmail || 'My Email'}\nTransaction ID: ${tid || 'Screenshot attached'}`
    );
    window.open(`https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleResetToTrial = () => {
    const reset = StorageService.resetToFreeTrial();
    onSubscriptionUpdated(reset);
    setTid('');
    setErrorMsg('');
    setSuccessNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                Pak Copyright Fixer — Pro Subscription
              </h2>
              <p className="text-xs text-emerald-100">
                Official Account: {ADMIN_CONFIG.name} · {ADMIN_CONFIG.accountNumber}
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

        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active Subscription Status Banner */}
          {subscription.isPremium ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-extrabold text-emerald-900 block text-sm">
                    Premium Active ({subscription.planId.toUpperCase()})
                  </span>
                  <span className="text-emerald-700">
                    User: <strong className="font-mono">{subscription.userEmail || 'Active User'}</strong> · Method: {subscription.paymentMethod?.toUpperCase()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetToTrial}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1 transition-colors shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Free Trial</span>
              </button>
            </div>
          ) : (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
              <span>
                Free Trial: <strong className="text-emerald-700">{subscription.freeExportsRemaining} video export</strong> remaining
              </span>
              <span className="font-medium text-slate-500">
                Stored in SharedPreferences
              </span>
            </div>
          )}

          {/* Success Notice */}
          {successNotice && (
            <div className="p-4 bg-emerald-50 border-2 border-emerald-500 rounded-2xl text-xs text-emerald-900 flex items-start gap-2.5">
              <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-sm block">Payment Submitted Successfully!</span>
                <p className="leading-relaxed">{successNotice}</p>
              </div>
            </div>
          )}

          {/* Featured Urdu / English Official Payment Card (Matching User Request) */}
          <div className="border-2 border-[#00b050] bg-white rounded-2xl p-5 text-center shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-100/70 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
              <Crown className="w-3.5 h-3.5" />
              <span>Official Account Details</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#00b050] tracking-tight">
                Pro Plan - 500 PKR (500 روپے)
              </h2>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                JazzCash / Easypaisa
              </p>
              <p className="text-xs text-slate-700 mt-0.5">
                Account Name (نام): <b className="text-slate-900 font-bold">{ADMIN_CONFIG.name}</b>
              </p>
            </div>

            <div className="py-2 px-4 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-mono tracking-wider">
                {ADMIN_CONFIG.accountNumber}
              </h1>
              <button
                type="button"
                onClick={handleCopyAccount}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                title="Copy Number"
              >
                {copiedAccount ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Email Input & Payment Action Form */}
            <form onSubmit={handlePayDone} className="space-y-3 pt-2 max-w-md mx-auto text-left">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">
                  Enter Your Email Address (اپنا ای میل لکھیں) *
                </label>
                <input
                  id="uEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b050] bg-white text-left"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Transaction ID / TID (Optional if sending screenshot)
                </label>
                <input
                  type="text"
                  value={tid}
                  onChange={(e) => setTid(e.target.value)}
                  placeholder="e.g. 018492049182"
                  className="w-full px-3.5 py-2 text-xs font-mono border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b050] bg-white"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Button: I Have Sent the Money (میں نے پیسے بھیج دیے) */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#00b050] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>I Have Sent the Money (میں نے پیسے بھیج دیے)</span>
              </button>

              {/* WhatsApp Screenshot Button (واٹس ایپ پر اسکرین شاٹ بھیجیں) */}
              <a
                href={`https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Umar Iltaf! I have sent 500 PKR for Pak Copyright Fixer Pro Plan.\nMy Email: ${userEmail || 'My Email'}\nTransaction ID: ${tid || 'Sending screenshot'}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-green-600 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-center no-underline"
              >
                <Phone className="w-4 h-4" />
                <span>Send Screenshot on WhatsApp (واٹس ایپ پر اسکرین شاٹ بھیجیں)</span>
              </a>
            </form>
          </div>

          {/* All Available Plans Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2.5">
              Or Choose Another Package:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SUBSCRIPTION_PLANS.filter((p) => p.id !== 'free').map((plan) => {
                const isSelected = selectedPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {plan.badge && (
                      <span className="absolute -top-2 right-3 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    )}

                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {plan.name}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {plan.durationDays} Days Duration
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-extrabold text-emerald-700 block leading-tight">
                          {plan.pricePKR.toLocaleString()} PKR
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer with Admin Portal Link */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => {
              onClose();
              if (onOpenAdminPanel) onOpenAdminPanel();
            }}
            className="text-slate-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Portal ({ADMIN_CONFIG.name})</span>
          </button>

          <button
            onClick={onClose}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
