'use client'

import { useEffect, useRef } from "react";
import styled from "styled-components";

const Canvas = styled.canvas`
`

type ComponentType = {
  audioCtxRef: React.RefObject<AudioContext | null>;
  animationRef: React.MutableRefObject<number | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
  isPlay: boolean;
}

export function AudioSpectrumTopWidget({ audioCtxRef, animationRef, analyserRef, isPlay }: ComponentType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef?.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT * 2);

      const barWidth = (WIDTH / bufferLength) * 3;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i];
        const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
        gradient.addColorStop(0, "#00f6ff");
        gradient.addColorStop(1, "#00a2ff");
        ctx.fillStyle = gradient;
        // ctx.fillRect(x - 210, HEIGHT / 2, barWidth, barHeight / 4);
        ctx.fillRect(x - 210, HEIGHT / 2, barWidth, -(barHeight / 4));
        x += barWidth + 1;
      }
    };

    render();
  };

  useEffect(() => {
    handleAudioPlay()
  }, [isPlay])

  // 오디오 재생 시 시각화 시작
  const handleAudioPlay = () => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume(); // 일부 브라우저는 사용자 상호작용 후 resume 필요
    }
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