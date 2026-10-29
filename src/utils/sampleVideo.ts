/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Generate a synthetic WebM video with animated elements, timer, and audio
export async function createDemoVideoBlob(title: string, durationSec: number = 8): Promise<string> {
  const width = 640;
  const height = 360;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const fps = 25;
  const totalFrames = durationSec * fps;

  // Web Audio synth for the demo video sound
  const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtxClass();
  const dest = audioCtx.createMediaStreamDestination();

  // Create background tone
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 220; // 220Hz test frequency simulating background song
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(dest);
  osc.start();

  const videoStream = canvas.captureStream(fps);
  const combinedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  let mimeType = 'video/webm;codecs=vp8,opus';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const recorder = new MediaRecorder(combinedStream, { mimeType });
  const chunks: Blob[] = [];
  recorder.ondataavailable = e => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  return new Promise((resolve) => {
    recorder.onstop = () => {
      try {
        osc.stop();
        audioCtx.close();
      } catch {}
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(URL.createObjectURL(blob));
    };

    recorder.start();

    let frame = 0;
    const interval = setInterval(() => {
      if (frame >= totalFrames) {
        clearInterval(interval);
        recorder.stop();
        return;
      }

      const progress = frame / totalFrames;
      const t = (frame / fps).toFixed(1);

      // Render gradient background
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(0.5, '#047857');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Animated wave lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const y = height / 2 + Math.sin((x + frame * 5) * 0.03) * 35;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Floating circle
      const cx = width * 0.2 + (width * 0.6) * Math.sin(progress * Math.PI);
      const cy = height * 0.45;
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();

      // Overlay text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, width / 2, height / 2 - 20);

      ctx.fillStyle = '#a7f3d0';
      ctx.font = '16px monospace';
      ctx.fillText(`Timestamp: 00:0${t} / 00:0${durationSec}.0 · Sample Video`, width / 2, height / 2 + 25);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('Contains Copyrighted Background Track (Simulated Match)', width / 2, height / 2 + 55);

      frame++;
    }, 1000 / fps);
  });
}
