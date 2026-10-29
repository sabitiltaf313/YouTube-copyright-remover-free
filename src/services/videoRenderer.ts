/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoProject, VideoFilterType, AspectRatioType } from '../types';
import { NCS_TRACKS, VIRAL_SOUND_EFFECTS } from './audioEngine';

export const VIDEO_FILTERS: { id: VideoFilterType; name: string; category: string; cssFilter: string; ffmpegFilter: string }[] = [
  { id: 'none', name: 'Original / Clean', category: 'Standard', cssFilter: 'none', ffmpegFilter: '' },
  { id: 'vivid', name: 'Vivid Emerald', category: 'Viral Social', cssFilter: 'saturate(1.45) contrast(1.15) hue-rotate(-5deg)', ffmpegFilter: 'eq=saturation=1.45:contrast=1.15' },
  { id: 'cinematic', name: 'Cinematic Warm', category: 'Cinematic', cssFilter: 'sepia(0.25) contrast(1.1) brightness(0.95)', ffmpegFilter: 'colorbalance=rs=0.1:gs=0.05:bs=-0.1' },
  { id: 'warm', name: 'Golden Hour Sunset', category: 'Cinematic', cssFilter: 'brightness(1.05) saturate(1.25) sepia(0.35)', ffmpegFilter: 'eq=gamma_r=1.2:gamma_b=0.85' },
  { id: 'teal_orange', name: 'Moody Teal & Orange', category: 'Viral Social', cssFilter: 'contrast(1.25) saturate(1.3) hue-rotate(15deg)', ffmpegFilter: 'colorbalance=rs=0.15:gs=0:bs=-0.15:rm=-0.1:gm=0.05:bm=0.15' },
  { id: 'bw', name: 'Dramatic B&W Noir', category: 'Creative', cssFilter: 'grayscale(1) contrast(1.35) brightness(0.95)', ffmpegFilter: 'hue=s=0,eq=contrast=1.35' },
  { id: 'cyber', name: 'Cyberpunk Teal', category: 'Creative', cssFilter: 'contrast(1.2) hue-rotate(170deg) saturate(1.35)', ffmpegFilter: 'hue=h=170:s=1.35' },
  { id: 'neon', name: 'Neon Purple Glow', category: 'Viral Social', cssFilter: 'contrast(1.2) hue-rotate(240deg) saturate(1.4)', ffmpegFilter: 'hue=h=240:s=1.4' },
  { id: 'vintage', name: 'Vintage 90s VHS', category: 'Vintage', cssFilter: 'sepia(0.4) contrast(0.9) brightness(1.1) saturate(0.85)', ffmpegFilter: 'curves=vintage' },
  { id: 'vhs', name: 'Retro Camcorder', category: 'Vintage', cssFilter: 'contrast(1.15) saturate(0.8) sepia(0.25) hue-rotate(-10deg)', ffmpegFilter: 'eq=saturation=0.8:contrast=1.15' },
  { id: 'dream', name: 'Soft Dream Glow', category: 'Creative', cssFilter: 'brightness(1.12) contrast(0.95) saturate(1.15)', ffmpegFilter: 'eq=brightness=0.06:saturation=1.15' },
  { id: 'contrast', name: 'Punchy Pop Contrast', category: 'Viral Social', cssFilter: 'contrast(1.45) brightness(0.98) saturate(1.2)', ffmpegFilter: 'eq=contrast=1.45:saturation=1.2' },
];

export function getResolutionDimensions(resolution: '720p' | '1080p', aspect: AspectRatioType): { width: number; height: number } {
  const base = resolution === '1080p' ? 1080 : 720;
  switch (aspect) {
    case '16:9':
      return { width: Math.round(base * (16 / 9)), height: base };
    case '9:16':
      return { width: base, height: Math.round(base * (16 / 9)) };
    case '1:1':
      return { width: base, height: base };
    case '4:5':
      return { width: base, height: Math.round(base * (5 / 4)) };
    default:
      return { width: 1280, height: 720 };
  }
}

export function generateFFmpegCommand(project: VideoProject, resolution: '720p' | '1080p'): string {
  const dims = getResolutionDimensions(resolution, project.aspectRatio);
  const startSec = project.startTime.toFixed(2);
  const durationSec = Math.max(0.1, project.endTime - project.startTime).toFixed(2);

  const filterItem = VIDEO_FILTERS.find(f => f.id === project.filter);
  const filterPart = filterItem && filterItem.ffmpegFilter ? `,${filterItem.ffmpegFilter}` : '';
  const speedPart = project.speed !== 1 ? `,setpts=${(1 / project.speed).toFixed(2)}*PTS` : '';
  const scalePart = `scale=${dims.width}:${dims.height}:force_original_aspect_ratio=decrease,pad=${dims.width}:${dims.height}:(ow-iw)/2:(oh-ih)/2`;

  let audioInputs = '';
  let audioFilter = '';

  if (project.selectedNcsTrackId) {
    const track = NCS_TRACKS.find(t => t.id === project.selectedNcsTrackId);
    audioInputs = ` -i "assets/ncs/${track?.id || 'track'}.mp3"`;
    if (project.isMuted) {
      audioFilter = ` -map 0:v -map 1:a -c:a aac -b:a 192k`;
    } else {
      audioFilter = ` -filter_complex "[0:a]volume=${project.originalAudioVolume}[a0];[1:a]volume=${project.musicVolume}[a1];[a0][a1]amix=inputs=2:duration=first[aout]" -map 0:v -map "[aout]" -c:a aac -b:a 192k`;
    }
  } else if (project.isMuted) {
    audioFilter = ` -an`; // Audio completely stripped/removed
  } else {
    audioFilter = ` -c:a aac -b:a 192k`;
  }

  let textOverlay = '';
  if (project.overlayText && project.overlayText.trim()) {
    const cleanText = project.overlayText.replace(/'/g, "\\'");
    let yPos = 'h-th-40';
    if (project.textPosition === 'top') yPos = '40';
    if (project.textPosition === 'center') yPos = '(h-text_h)/2';
    textOverlay = `,drawtext=text='${cleanText}':fontcolor=white:fontsize=36:box=1:boxcolor=black@0.5:boxborderw=10:x=(w-text_w)/2:y=${yPos}`;
  }

  return `ffmpeg -ss ${startSec} -t ${durationSec} -i input.mp4${audioInputs} -vf "${scalePart}${speedPart}${filterPart}${textOverlay}"${audioFilter} -c:v libx264 -preset fast -crf 22 output_${resolution}.mp4`;
}

export interface RenderProgress {
  percent: number;
  stage: string;
  frame: number;
  totalFrames: number;
}

export async function renderAndExportVideo(
  videoElement: HTMLVideoElement,
  project: VideoProject,
  resolution: '720p' | '1080p',
  onProgress: (progress: RenderProgress) => void
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const dims = getResolutionDimensions(resolution, project.aspectRatio);
      const canvas = document.createElement('canvas');
      canvas.width = dims.width;
      canvas.height = dims.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D context is not available');
      }

      const duration = Math.max(1, project.endTime - project.startTime);
      const fps = 30;
      const totalFrames = Math.floor(duration * fps);

      onProgress({ percent: 5, stage: 'Preparing audio stems & video pipeline...', frame: 0, totalFrames });

      // Audio setup
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      const audioDest = audioCtx.createMediaStreamDestination();

      // Original audio track from video if not muted
      try {
        if (!project.isMuted) {
          const videoSourceNode = audioCtx.createMediaElementSource(videoElement);
          const origGain = audioCtx.createGain();
          origGain.gain.value = project.originalAudioVolume;
          videoSourceNode.connect(origGain);
          origGain.connect(audioDest);
        }
      } catch {
        // MediaElementAudioSource may already be attached or cross-origin
      }

      // NCS track audio synthesizer if selected
      let ncsOscillatorNode: OscillatorNode | null = null;
      let ncsGainNode: GainNode | null = null;
      if (project.selectedNcsTrackId) {
        const track = NCS_TRACKS.find(t => t.id === project.selectedNcsTrackId);
        if (track) {
          ncsOscillatorNode = audioCtx.createOscillator();
          ncsGainNode = audioCtx.createGain();
          ncsOscillatorNode.type = track.category === 'Lo-Fi Chill' ? 'sine' : 'sawtooth';
          ncsOscillatorNode.frequency.value = track.freqPattern[0] || 220;
          ncsGainNode.gain.value = (project.musicVolume || 0.8) * 0.15;
          ncsOscillatorNode.connect(ncsGainNode);
          ncsGainNode.connect(audioDest);
          ncsOscillatorNode.start();
        }
      }

      // Stream mixing
      const videoStream = canvas.captureStream(fps);
      const combinedStream = new MediaStream();

      videoStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
      audioDest.stream.getAudioTracks().forEach(track => combinedStream.addTrack(track));

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/mp4';
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
        videoBitsPerSecond: resolution === '1080p' ? 6000000 : 3500000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        if (ncsOscillatorNode) {
          try { ncsOscillatorNode.stop(); } catch {}
        }
        audioCtx.close();
        const outputBlob = new Blob(chunks, { type: mimeType });
        resolve(outputBlob);
      };

      recorder.start(100);

      // Render frames
      videoElement.currentTime = project.startTime;
      videoElement.playbackRate = project.speed;

      const activeFilter = VIDEO_FILTERS.find(f => f.id === project.filter);

      let currentFrame = 0;
      const frameInterval = 1000 / fps;

      const renderLoop = () => {
        if (videoElement.currentTime >= project.endTime || currentFrame >= totalFrames) {
          recorder.stop();
          onProgress({ percent: 100, stage: 'Finalizing clean video output...', frame: totalFrames, totalFrames });
          return;
        }

        // Draw background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, dims.width, dims.height);

        // Apply filters
        ctx.save();
        if (activeFilter && activeFilter.cssFilter !== 'none') {
          ctx.filter = activeFilter.cssFilter;
        }

        // Calculate aspect fit/crop
        const videoRatio = (videoElement.videoWidth || 16) / (videoElement.videoHeight || 9);
        const canvasRatio = dims.width / dims.height;

        let drawW = dims.width;
        let drawH = dims.height;
        let offsetX = 0;
        let offsetY = 0;

        if (videoRatio > canvasRatio) {
          drawW = dims.height * videoRatio;
          offsetX = (dims.width - drawW) / 2;
        } else {
          drawH = dims.width / videoRatio;
          offsetY = (dims.height - drawH) / 2;
        }

        ctx.drawImage(videoElement, offsetX, offsetY, drawW, drawH);
        ctx.restore();

        // Render text overlay if present
        if (project.overlayText && project.overlayText.trim()) {
          ctx.save();
          const fontSize = Math.round((dims.height / 720) * (project.textSize || 32));
          ctx.font = `bold ${fontSize}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          let textY = dims.height - 60;
          if (project.textPosition === 'top') textY = 60;
          if (project.textPosition === 'center') textY = dims.height / 2;

          const textMetrics = ctx.measureText(project.overlayText);
          const boxPadding = 16;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          ctx.beginPath();
          ctx.roundRect(
            dims.width / 2 - textMetrics.width / 2 - boxPadding,
            textY - fontSize / 2 - boxPadding / 2,
            textMetrics.width + boxPadding * 2,
            fontSize + boxPadding,
            8
          );
          ctx.fill();

          ctx.fillStyle = project.textColor || '#ffffff';
          ctx.fillText(project.overlayText, dims.width / 2, textY);
          ctx.restore();
        }

        currentFrame++;
        const percent = Math.min(99, Math.round((currentFrame / totalFrames) * 95));
        onProgress({
          percent,
          stage: `Encoding frame ${currentFrame} / ${totalFrames} (${percent}%)`,
          frame: currentFrame,
          totalFrames,
        });

        setTimeout(renderLoop, frameInterval / project.speed);
      };

      videoElement.play().then(() => {
        renderLoop();
      }).catch(() => {
        renderLoop();
      });
    } catch (err) {
      reject(err);
    }
  });
}
