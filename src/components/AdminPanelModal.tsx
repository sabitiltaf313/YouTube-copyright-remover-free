/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService, ADMIN_CONFIG } from '../services/storageService';
import { PendingUserRequest, SubscriptionState } from '../types';
import confetti from 'canvas-confetti';
import {
  Shield,
  Lock,
  UserCheck,
  Clock,
  Check,
  X,
  Trash2,
  UserPlus,
  Phone,
  Search,
  AlertCircle,
  Coins,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionUpdated: (newSub: SubscriptionState) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionUpdated,
}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');

  const [pendingRequests, setPendingRequests] = useState<PendingUserRequest[]>([]);
  const [pendingEmails, setPendingEmails] = useState<string[]>([]);
  const [proUsers, setProUsers] = useState<string[]>([]);
  const [manualEmail, setManualEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setPendingRequests(StorageService.getPendingRequests());
    setPendingEmails(StorageService.getPendingUsers());
    setProUsers(StorageService.getProUsers());
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadData();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (StorageService.verifyAdminPassword(password)) {
      setIsAuthenticated(true);
      setErrorMsg('');
      loadData();
    } else {
      setErrorMsg('غلط پاس ورڈ (Invalid password. Please enter correct admin password)');
    }
  };

  const handleActivatePro = (email: string) => {
    StorageService.activateProUser(email);
    loadData();
    onSubscriptionUpdated(StorageService.getSubscription());

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}
    alert(email + ' Pro کر دیا گیا (User activated as Pro successfully)');
  };

  const handleDeactivatePro = (email: string) => {
    StorageService.deactivateProUser(email);
    loadData();
    onSubscriptionUpdated(StorageService.getSubscription());
  };

  const handleAddManualPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail || !manualEmail.trim() || !manualEmail.includes('@')) {
      alert('Please enter a valid email address (ای میل لکھیں)');
      return;
    }
    StorageService.activateProUser(manualEmail.trim());
    setManualEmail('');
    loadData();
    onSubscriptionUpdated(StorageService.getSubscription());
    alert(manualEmail + ' Pro کر دیا گیا');
  };

  const totalEarnings = proUsers.length * 500;

  const filteredProUsers = proUsers.filter((u) =>
    u.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00b050] flex items-center justify-center text-white font-black text-xl">
              P
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                ایڈمن پینل - عمر بھائی ({ADMIN_CONFIG.accountNumber})
              </h2>
              <p className="text-xs text-slate-400">
                Admin Panel — {ADMIN_CONFIG.name} · JazzCash / Easypaisa Approvals
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

        {/* Content: Auth Gate or Admin Dashboard */}
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-4">
            <div className="text-center max-w-sm mx-auto space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                ایڈمن لاگ ان (Admin Login)
              </h3>
              <p className="text-xs text-slate-500">
                پاس ورڈ درج کریں (Enter password: <strong>umar123</strong>)
              </p>
            </div>

            <div className="max-w-sm mx-auto space-y-3">
              <input
                id="adminPass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="پاس ورڈ لکھیں (e.g. umar123)"
                className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b050]"
                autoFocus
              />

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#00b050] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                لاگ ان کریں (Sign In)
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Urdu / English KPI Summary Strip requested by user */}
            <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-700">پینڈنگ (Pending):</span>
                <span id="pCount" className="font-mono bg-white px-2 py-0.5 rounded-lg border text-amber-900">
                  {pendingEmails.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-emerald-700">Pro یوزرز:</span>
                <span id="proCount" className="font-mono bg-white px-2 py-0.5 rounded-lg border text-emerald-900">
                  {proUsers.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-900">کمائی (Earnings):</span>
                <span id="earn" className="font-mono bg-emerald-600 text-white px-2.5 py-0.5 rounded-lg font-extrabold">
                  {totalEarnings.toLocaleString()} Rs
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'pending'
                    ? 'border-[#00b050] text-[#00b050]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>پینڈنگ لسٹ (Pending Approvals) ({pendingEmails.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('active')}
                className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'active'
                    ? 'border-[#00b050] text-[#00b050]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Pro یوزرز لسٹ (Active Pro) ({proUsers.length})</span>
              </button>
            </div>

            {/* Tab 1: Pending Requests */}
            {activeTab === 'pending' && (
              <div id="pendingList" className="space-y-3">
                {pendingEmails.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">
                    کوئی پینڈنگ نہیں (No pending user requests)
                  </div>
                ) : (
                  pendingEmails.map((emailItem, idx) => {
                    const detail = pendingRequests.find((r) => r.email === emailItem);
                    return (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {emailItem}
                            </span>
                            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                              500 PKR Pro
                            </span>
                          </div>
                          {detail && (
                            <div className="text-[11px] text-slate-500 flex items-center gap-2">
                              <span>Method: {detail.paymentMethod.toUpperCase()}</span>
                              {detail.tid && <span>· TID: {detail.tid}</span>}
                              <span>· {detail.timestamp}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <a
                            href={`https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=Assalam-o-Alaikum! Verifying payment for ${emailItem}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            onClick={() => handleActivatePro(emailItem)}
                            className="px-3.5 py-1.5 bg-[#00b050] hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Pro کرو (Activate Pro)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Tab 2: Active Pro Users */}
            {activeTab === 'active' && (
              <div id="proList" className="space-y-4">
                {/* Manual Add Pro User Form */}
                <form onSubmit={handleAddManualPro} className="flex gap-2">
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="کسی بھی Gmail کو Pro کریں..."
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b050]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00b050] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Pro</span>
                  </button>
                </form>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search pro emails..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00b050]"
                  />
                </div>

                <div className="space-y-2">
                  {filteredProUsers.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No active Pro subscribers found.
                    </div>
                  ) : (
                    filteredProUsers.map((emailItem, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                            ✓
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block font-mono">
                              {emailItem}
                            </span>
                            <span className="text-[10px] text-emerald-700">
                              Pro Active · 500 PKR Paid
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeactivatePro(emailItem)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Revoke Pro Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Umar Iltaf · 03105423365 · Pak Copyright Fixer</span>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
              onClose();
            }}
            className="font-semibold text-slate-700 hover:text-slate-900"
          >
            Exit Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
};
