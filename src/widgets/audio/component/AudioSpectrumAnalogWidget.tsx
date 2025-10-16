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

export function AudioSpectrumAnalogWidget({ audioCtxRef, animationRef, analyserRef, isPlay }: ComponentType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      ctx.strokeStyle = "#00a2ff";
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
