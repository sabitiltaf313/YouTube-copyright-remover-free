/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType = 'home' | 'editor' | 'fixer' | 'subscription' | 'about' | 'export' | 'apk' | 'sfx';

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '4:5';

export type VideoFilterType =
  | 'none'
  | 'vivid'
  | 'cinematic'
  | 'warm'
  | 'bw'
  | 'cyber'
  | 'vintage'
  | 'contrast'
  | 'teal_orange'
  | 'vhs'
  | 'neon'
  | 'dream';

export interface FilterOption {
  id: VideoFilterType;
  name: string;
  category: 'Cinematic' | 'Viral Social' | 'Vintage' | 'Creative';
  cssFilter: string;
  ffmpegFilter: string;
}

export type MusicCategory = 'Viral TikTok' | 'NCS Electro' | 'Lo-Fi Chill' | 'Cinematic' | 'Gaming Phonk' | 'Pak Acoustic';

export interface NcsTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  category: MusicCategory;
  bpm: number;
  duration: number; // in seconds
  description: string;
  mood: string;
  freqPattern: number[]; // frequencies for audio synth
}

export interface SoundEffectItem {
  id: string;
  name: string;
  category: 'Meme' | 'Transition' | 'Reaction' | 'Gaming' | 'Ambience';
  icon: string;
  durationSec: number;
  type: 'synth_boom' | 'synth_horn' | 'synth_scratch' | 'synth_ding' | 'synth_kaching' | 'synth_punch' | 'synth_swoosh' | 'synth_glitch' | 'synth_violin' | 'synth_dramatic';
}

export interface VoiceOverConfig {
  enabled: boolean;
  text: string;
  voiceStyle: 'host' | 'tech' | 'motivational' | 'storyteller';
  rate: number;
  pitch: number;
  volume: number;
}

export interface VideoProject {
  id: string;
  title: string;
  videoUrl: string;
  videoFile?: File;
  duration: number;
  width: number;
  height: number;
  // Edit parameters
  startTime: number;
  endTime: number;
  aspectRatio: AspectRatioType;
  isMuted: boolean;
  speed: number;
  filter: VideoFilterType;
  overlayText: string;
  textColor: string;
  textPosition: 'top' | 'center' | 'bottom';
  textSize: number;
  // Copyright & Audio parameters
  isCopyrightDetected: boolean;
  detectedSongName: string;
  claimant: string;
  riskLevel: 'high' | 'medium' | 'low';
  selectedNcsTrackId: string | null;
  musicVolume: number;
  originalAudioVolume: number;
  voiceOver: VoiceOverConfig;
  selectedSfxIds: string[];
}

export type PlanIdType = 'free' | 'pro_500' | 'weekly' | 'monthly' | 'six_months' | 'yearly';

export interface SubscriptionPlan {
  id: PlanIdType;
  name: string;
  pricePKR: number;
  durationDays: number;
  badge?: string;
  features: string[];
}

export interface SubscriptionState {
  planId: PlanIdType;
  isPremium: boolean;
  freeExportsRemaining: number;
  trialStartTime?: number; // timestamp ms
  trialExpiresAt?: number; // timestamp ms (24 hours after start)
  transactionId?: string;
  userEmail?: string;
  deviceFingerprint?: string;
  paymentMethod?: 'jazzcash' | 'easypaisa';
  activatedAt?: string;
  expiresAt?: string;
}

export interface PendingUserRequest {
  email: string;
  planId: PlanIdType;
  planName: string;
  amountPKR: number;
  paymentMethod: 'jazzcash' | 'easypaisa';
  tid?: string;
  deviceFingerprint?: string;
  timestamp: string;
}
