'use client'

import { useEffect, useRef } from "react";
import styled from "styled-components";

const Box = styled.div`
  text-align: center;
  background-color: #000;
  padding: 20;
`

const Canvas = styled.canvas`
  display: block;
  margin: 20px auto;
`

export function AudioSpectrumTopDownWidget() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // 오디오 초기 연결 (단 한 번만)
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
      // 클린업
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
        ctx.fillRect(x - 210, HEIGHT / 2, barWidth, barHeight / 4);
        ctx.fillRect(x - 210, HEIGHT / 2, barWidth, -(barHeight / 4));
        x += barWidth + 1;
      }
    };

    render();
  };

  // 오디오 재생 시 시각화 시작
  const handleAudioPlay = () => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume(); // 일부 브라우저는 사용자 상호작용 후 resume 필요
    }
    draw();
  };

  return (
    <Box>
      <audio
        ref={audioRef}
        onPlay={handleAudioPlay}
        controls
        src="audio/Blue Valentine.mp3"
      />
      <Canvas
        ref={canvasRef}
        width={600}
        height={600}
      />
    </Box>
  );
}