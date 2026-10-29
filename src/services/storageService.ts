/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SubscriptionPlan, SubscriptionState, PlanIdType, PendingUserRequest } from '../types';

export const ADMIN_CONFIG = {
  name: 'Umar Iltaf',
  accountNumber: '03105423365',
  whatsappNumber: '923105423365',
  supportEmail: 'ub514417@gmail.com',
  adminPassword: 'umar123',
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: '24-Hour Free Trial',
    pricePKR: 0,
    durationDays: 1,
    features: [
      'Full 24-Hour Free Access',
      'Basic video editor (Trim, Speed, Mute)',
      'Audio Copyright Scanner & Stem Remover',
      'Standard 720p resolution export',
      '1 Device Trial Protection',
    ],
  },
  {
    id: 'pro_500',
    name: 'Pro Plan (Featured)',
    pricePKR: 500,
    durationDays: 30,
    badge: 'Popular Deal',
    features: [
      'Unlimited 1080p Full HD exports',
      'All 120 Viral & NCS Music Tracks',
      'Viral Soundboard & Meme Effects',
      '12 Cinematic & Social Filters',
      'English AI Voice Over Studio',
      'Direct WhatsApp Activation Verification',
      'Priority Fair-Use clearance certificate',
    ],
  },
  {
    id: 'weekly',
    name: 'Weekly Pass',
    pricePKR: 350,
    durationDays: 7,
    features: [
      'Unlimited exports for 7 days',
      'All 120 NCS Royalty-Free tracks',
      'All 15 Viral Meme Sound Effects',
      'English AI Voice Over Studio',
      'Full HD 1080p export',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly VIP',
    pricePKR: 900,
    durationDays: 30,
    features: [
      'Unlimited exports for 30 days',
      'All 120 tracks + viral soundboard',
      'Full HD 1080p export & 12 filters',
      'No watermark & fast GPU render',
      'Direct YouTube Fair-Use compliant output',
    ],
  },
  {
    id: 'six_months',
    name: '6 Months Pass',
    pricePKR: 4000,
    durationDays: 180,
    features: [
      'Unlimited exports for 6 months',
      'Save PKR 1,400 compared to monthly',
      'All 120 NCS library + future updates',
      'VIP Support via WhatsApp/Email (ub514417@gmail.com)',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly VIP',
    pricePKR: 6500,
    durationDays: 365,
    badge: 'Best Value',
    features: [
      'Full year of unlimited exports',
      'Save PKR 4,300 (Over 40% discount)',
      'All 120 music tracks & viral sound effects',
      'Full HD 1080p & 60fps export',
      'Commercial fair-use clearance certificate',
    ],
  },
];

const PREFS_KEY_SUBSCRIPTION = 'pak_shared_prefs_subscription';
const PREFS_KEY_EXPORTS_COUNT = 'pak_shared_prefs_exports_count';
const KEY_PENDING_USERS = 'pending_users';
const KEY_PENDING_DETAILS = 'pending_user_details';
const KEY_PRO_USERS = 'pro_users';
const KEY_DEVICE_FINGERPRINT = 'pak_device_fingerprint';
const KEY_DEVICE_REGISTRY = 'pak_device_registry_map';

export const StorageService = {
  getDeviceId(): string {
    let deviceId = localStorage.getItem(KEY_DEVICE_FINGERPRINT);
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(KEY_DEVICE_FINGERPRINT, deviceId);
    }
    return deviceId;
  },

  getDeviceRegistry(): Record<string, string> {
    try {
      const data = localStorage.getItem(KEY_DEVICE_REGISTRY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  getSubscription(): SubscriptionState {
    const deviceId = this.getDeviceId();
    try {
      const data = localStorage.getItem(PREFS_KEY_SUBSCRIPTION);
      if (data) {
        const parsed = JSON.parse(data) as SubscriptionState;
        // Verify if user email is in pro_users
        if (parsed.userEmail && this.isEmailPro(parsed.userEmail)) {
          parsed.isPremium = true;
          parsed.freeExportsRemaining = 9999;
        }

        // Initialize 24-hour trial if not present
        if (!parsed.trialStartTime) {
          parsed.trialStartTime = Date.now();
          parsed.trialExpiresAt = parsed.trialStartTime + 24 * 60 * 60 * 1000;
          this.saveSubscription(parsed);
        }
        return parsed;
      }
    } catch {
      // Ignore parse error
    }

    // Default 24-hour free trial
    const now = Date.now();
    const defaultState: SubscriptionState = {
      planId: 'free',
      isPremium: false,
      freeExportsRemaining: 3,
      trialStartTime: now,
      trialExpiresAt: now + 24 * 60 * 60 * 1000,
      deviceFingerprint: deviceId,
    };
    this.saveSubscription(defaultState);
    return defaultState;
  },

  is24HourTrialActive(): boolean {
    const sub = this.getSubscription();
    if (sub.isPremium) return true;
    if (!sub.trialExpiresAt) return true;
    return Date.now() < sub.trialExpiresAt;
  },

  getTrialRemainingFormatted(): { hours: number; minutes: number; isExpired: boolean } {
    const sub = this.getSubscription();
    if (sub.isPremium) {
      return { hours: 999, minutes: 0, isExpired: false };
    }
    const expiresAt = sub.trialExpiresAt || (Date.now() + 24 * 60 * 60 * 1000);
    const diffMs = expiresAt - Date.now();
    if (diffMs <= 0) {
      return { hours: 0, minutes: 0, isExpired: true };
    }
    const totalMinutes = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes, isExpired: false };
  },

  saveSubscription(state: SubscriptionState): void {
    try {
      localStorage.setItem(PREFS_KEY_SUBSCRIPTION, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save to SharedPreferences:', e);
    }
  },

  // Check device restriction: only 1 trial email per device/IP
  checkDeviceEmailEligibility(email: string): { eligible: boolean; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const deviceId = this.getDeviceId();
    const registry = this.getDeviceRegistry();

    // If device is already registered with another email and user is not Pro
    if (registry[deviceId] && registry[deviceId] !== cleanEmail && !this.isEmailPro(cleanEmail)) {
      return {
        eligible: false,
        error: 'You are already taken in account. Only 1 free trial allowed per device. Please activate Pro.',
      };
    }

    // Register email to this device
    if (!registry[deviceId]) {
      registry[deviceId] = cleanEmail;
      localStorage.setItem(KEY_DEVICE_REGISTRY, JSON.stringify(registry));
    }

    return { eligible: true };
  },

  activatePremium(
    planId: PlanIdType,
    tid: string,
    method: 'jazzcash' | 'easypaisa',
    email?: string
  ): SubscriptionState {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[1];
    const now = new Date();
    const expiry = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    const deviceId = this.getDeviceId();

    const newState: SubscriptionState = {
      planId,
      isPremium: true,
      freeExportsRemaining: 9999,
      transactionId: tid.trim(),
      userEmail: email?.trim(),
      deviceFingerprint: deviceId,
      paymentMethod: method,
      activatedAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
    };

    if (email && email.trim()) {
      this.addProUser(email.trim());
      // Bind device to this pro email
      const registry = this.getDeviceRegistry();
      registry[deviceId] = email.trim().toLowerCase();
      localStorage.setItem(KEY_DEVICE_REGISTRY, JSON.stringify(registry));
    }

    this.saveSubscription(newState);
    return newState;
  },

  // Record pending payment in localStorage ('pending_users')
  submitPaymentRequest(
    email: string,
    planId: PlanIdType,
    method: 'jazzcash' | 'easypaisa',
    tid?: string
  ): { whatsappUrl: string; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const deviceCheck = this.checkDeviceEmailEligibility(cleanEmail);
    if (!deviceCheck.eligible && !this.isEmailPro(cleanEmail)) {
      return {
        whatsappUrl: '',
        error: deviceCheck.error || 'You are already taken in account. Only 1 free trial allowed per device.',
      };
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[1];
    const deviceId = this.getDeviceId();

    // 1. Maintain array of emails in 'pending_users'
    const pendingList = this.getPendingUsers();
    if (!pendingList.includes(cleanEmail)) {
      pendingList.push(cleanEmail);
      localStorage.setItem(KEY_PENDING_USERS, JSON.stringify(pendingList));
    }

    // 2. Maintain rich details
    const details = this.getPendingRequests();
    const existingIndex = details.findIndex(d => d.email === cleanEmail);
    const newRecord: PendingUserRequest = {
      email: cleanEmail,
      planId,
      planName: plan.name,
      amountPKR: plan.pricePKR,
      paymentMethod: method,
      tid: tid?.trim(),
      deviceFingerprint: deviceId,
      timestamp: new Date().toLocaleString(),
    };

    if (existingIndex >= 0) {
      details[existingIndex] = newRecord;
    } else {
      details.unshift(newRecord);
    }
    localStorage.setItem(KEY_PENDING_DETAILS, JSON.stringify(details));

    // Save as local current user email
    const currentSub = this.getSubscription();
    this.saveSubscription({
      ...currentSub,
      userEmail: cleanEmail,
      transactionId: tid || currentSub.transactionId,
      paymentMethod: method,
    });

    const msg = encodeURIComponent(
      `Assalam-o-Alaikum Umar Iltaf! I have sent ${plan.pricePKR} PKR via ${method.toUpperCase()} for Pak Copyright Fixer Pro Plan.\nEmail: ${cleanEmail}\nSupport: ${ADMIN_CONFIG.supportEmail}\nTID: ${tid || 'Screenshot attached'}`
    );
    const whatsappUrl = `https://wa.me/${ADMIN_CONFIG.whatsappNumber}?text=${msg}`;

    return { whatsappUrl };
  },

  getPendingUsers(): string[] {
    try {
      const data = localStorage.getItem(KEY_PENDING_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getPendingRequests(): PendingUserRequest[] {
    try {
      const data = localStorage.getItem(KEY_PENDING_DETAILS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getProUsers(): string[] {
    try {
      const data = localStorage.getItem(KEY_PRO_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isEmailPro(email: string): boolean {
    if (!email) return false;
    const proList = this.getProUsers();
    return proList.includes(email.trim().toLowerCase());
  },

  addProUser(email: string): void {
    const cleanEmail = email.trim().toLowerCase();
    const proList = this.getProUsers();
    if (!proList.includes(cleanEmail)) {
      proList.push(cleanEmail);
      localStorage.setItem(KEY_PRO_USERS, JSON.stringify(proList));
    }
  },

  activateProUser(email: string): void {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Remove from pending_users
    let pending = this.getPendingUsers().filter(x => x !== cleanEmail);
    localStorage.setItem(KEY_PENDING_USERS, JSON.stringify(pending));

    let details = this.getPendingRequests().filter(x => x.email !== cleanEmail);
    localStorage.setItem(KEY_PENDING_DETAILS, JSON.stringify(details));

    // 2. Add to pro_users
    this.addProUser(cleanEmail);

    // 3. Update subscription if current user
    const current = this.getSubscription();
    if (current.userEmail?.toLowerCase() === cleanEmail) {
      this.saveSubscription({
        ...current,
        isPremium: true,
        freeExportsRemaining: 9999,
        planId: current.planId === 'free' ? 'pro_500' : current.planId,
      });
    }
  },

  deactivateProUser(email: string): void {
    const cleanEmail = email.trim().toLowerCase();
    let proList = this.getProUsers().filter(x => x !== cleanEmail);
    localStorage.setItem(KEY_PRO_USERS, JSON.stringify(proList));

    const current = this.getSubscription();
    if (current.userEmail?.toLowerCase() === cleanEmail) {
      this.saveSubscription({
        ...current,
        isPremium: false,
        planId: 'free',
        freeExportsRemaining: 0,
      });
    }
  },

  verifyAdminPassword(password: string): boolean {
    return password.trim() === ADMIN_CONFIG.adminPassword;
  },

  decrementExportQuota(): { allowed: boolean; remaining: number } {
    const current = this.getSubscription();
    if (current.isPremium) {
      return { allowed: true, remaining: 9999 };
    }

    // Check if 24-hour trial is active
    if (this.is24HourTrialActive()) {
      return { allowed: true, remaining: Math.max(1, current.freeExportsRemaining) };
    }

    if (current.freeExportsRemaining > 0) {
      const updated: SubscriptionState = {
        ...current,
        freeExportsRemaining: current.freeExportsRemaining - 1,
      };
      this.saveSubscription(updated);
      return { allowed: true, remaining: updated.freeExportsRemaining };
    }

    return { allowed: false, remaining: 0 };
  },

  resetToFreeTrial(): SubscriptionState {
    const now = Date.now();
    const resetState: SubscriptionState = {
      planId: 'free',
      isPremium: false,
      freeExportsRemaining: 3,
      trialStartTime: now,
      trialExpiresAt: now + 24 * 60 * 60 * 1000,
      deviceFingerprint: this.getDeviceId(),
    };
    this.saveSubscription(resetState);
    return resetState;
  },

  getExportsTotal(): number {
    try {
      return parseInt(localStorage.getItem(PREFS_KEY_EXPORTS_COUNT) || '0', 10);
    } catch {
      return 0;
    }
  },

  incrementExportsTotal(): number {
    const current = this.getExportsTotal() + 1;
    localStorage.setItem(PREFS_KEY_EXPORTS_COUNT, current.toString());
    return current;
  },
};
