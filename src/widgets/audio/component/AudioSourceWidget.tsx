'use client'

import { useEffect, useRef } from "react";

export function AudioSourceWidget() {

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256; // 스펙트럼 세밀도
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const draw = () => {
      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, '#00f6ff');
        gradient.addColorStop(1, '#001eff');
        ctx.fillStyle = gradient;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }
    };

    draw();
  }, []);

  return (
    <div style={{ textAlign: 'center', background: '#000', padding: 20 }}>
      <audio
        ref={audioRef}
        controls
        autoPlay
        src='audio/Blue Valentine.mp3'
        onPlay={() => {
          // 자동 재생 시 AudioContext가 resume 되어야 함 (브라우저 정책 때문)
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtx.resume();
        }}
      />
      <canvas ref={canvasRef} width={600} height={200} style={{ display: 'block', margin: '20px auto' }} />
    </div>
  )
}