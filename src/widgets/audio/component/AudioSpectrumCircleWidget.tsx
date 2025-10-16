'use client'

import { useEffect, useRef } from "react";
import styled from "styled-components";

type ComponentType = {
  audioCtxRef: React.RefObject<AudioContext | null>;
  animationRef: React.MutableRefObject<number | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlay: boolean;
}

const Canvas = styled.canvas`
`

export function AudioSpectrumCircleWidget({ audioCtxRef, animationRef, analyserRef, isPlay }: ComponentType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const centerX = WIDTH / 2;
    const centerY = HEIGHT / 2;
    const radius = 100; // 중심에서부터 기본 반지름

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      const bars = bufferLength;
      const step = (Math.PI * 100) / bars;
      for (let i = 0; i < bars; i++) {
        const barHeight = dataArray[i] * 0.3; // 세기 조절
        const angle = i * step; // 각도
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        // 선 색상
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, "#00f6ff");
        gradient.addColorStop(1, "#00a2ff");

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

  useEffect(() => {
    handleAudioPlay()
  }, [isPlay])

  const handleAudioPlay = () => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume();
    draw();
  };

  return (
    <Canvas
      ref={canvasRef}
      width={600}
      height={400}
    />
  );
}