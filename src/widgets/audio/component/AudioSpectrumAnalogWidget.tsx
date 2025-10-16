'use client'

import { useEffect, useRef } from "react";

export function AudioSpectrumAnalogWidget() {
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

    analyser.fftSize = 1024; // 파형은 이게 적당함
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

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteTimeDomainData(dataArray); // 🎯 파형용 데이터

      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#006eff";
      ctx.beginPath();

      const sliceWidth = WIDTH / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 128 기준으로 위아래 진동
        const y = (v * HEIGHT) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(WIDTH, HEIGHT / 2);
      ctx.stroke();
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
        height={200}
        style={{
          display: "block",
          margin: "20px auto",
          background: "#000",
          borderRadius: "8px",
        }}
      />
    </div>
  );
}
