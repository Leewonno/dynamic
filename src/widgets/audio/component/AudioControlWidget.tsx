'use client'

import { useEffect, useRef, useState } from "react";
import { AudioSpectrumTopDownWidget } from "./AudioSpectrumTopDownWidget";
import { AudioSpectrumCircleWidget } from "./AudioSpectrumCircleWidget";
import { AudioSpectrumAnalogWidget } from "./AudioSpectrumAnalogWidget";
import styled from "styled-components";
import { AudioSpectrumTopWidget } from "./AudioSpectrumTopWidget";

const Box = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  padding: 20px;
`

const InnerBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

export function AudioControlWidget() {
  // 재생
  const [isPlay, setIsPlay] = useState<boolean>(false);

  // 오디오
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 이미 연결된 경우 처리
    if (sourceRef.current) return;

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

  const handleAudioPlay = () => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") setIsPlay(false);
    setIsPlay(true);
  };

  return (
    <Box>
      <audio
        ref={audioRef}
        onPlay={handleAudioPlay}
        controls
        src="audio/Shape of Love.mp3"
        // src="audio/Blue Valentine.mp3"
      />
      <InnerBox>
        <AudioSpectrumTopWidget analyserRef={analyserRef} audioCtxRef={audioCtxRef} animationRef={animationRef} isPlay={isPlay} />
        <AudioSpectrumTopDownWidget analyserRef={analyserRef} audioCtxRef={audioCtxRef} animationRef={animationRef} isPlay={isPlay} />
      </InnerBox>
      <InnerBox>
        <AudioSpectrumCircleWidget analyserRef={analyserRef} audioCtxRef={audioCtxRef} animationRef={animationRef} isPlay={isPlay} />
        <AudioSpectrumAnalogWidget analyserRef={analyserRef} audioCtxRef={audioCtxRef} animationRef={animationRef} isPlay={isPlay} />
      </InnerBox>
    </Box>
  );
}