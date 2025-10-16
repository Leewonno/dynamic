'use client'

import { useEffect, useRef } from "react";

export function AudioSpectrumCircleWidget() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioCtxRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    return () => {
      cancelAnimationFrame(animationRef.current!);
      audioContext.close();
    };
  }, []);

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    analyser.fftSize = 64;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;
    const radius = 60; // 중심에서부터 기본 반지름

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const bars = bufferLength;
      const step = (Math.PI * 100) / bars;
      console.log(bars)
      for (let i = 0; i < bars; i++) {
        const barHeight = dataArray[i] * 0.25; // 세기 조절
        const angle = i * step; // 각도
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        // 선 색상
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "#00f6ff");
        gradient.addColorStop(1, "#0084ff");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    render();
  };

  const handleAudioPlay = () => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume();
    draw();
  };

  return (
    <div style={{ textAlign: "center", background: "#000", padding: 20 }}>
      <audio
        ref={audioRef}
        onPlay={handleAudioPlay}
        controls
        src="audio/Shape of Love.mp3"
      />
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{ display: "block", margin: "20px auto", background: "#000" }}
      />
    </div>
  );
}