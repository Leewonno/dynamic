'use client'

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

type ComponentProps = {
  dropCount?: number;   // 빗방울 개수
};

const fall = keyframes`
  0%   { transform: translateY(-120vh); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(120vh); opacity: 0; }
`;

const Component = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1000;
`;

const Drop = styled.span<{
  left: number;
  duration: number;
  delay: number;
  thickness: number;
  length: number;
  tilt: number;
}>`
  position: absolute;
  top: -10vh;
  left: ${({ left }) => left}%;
  display: block;
  width: ${({ thickness }) => thickness}px;
  height: ${({ length }) => length}vh;
  transform: translateY(-120vh) rotate(${({ tilt }) => tilt}deg);
  background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.05));
  opacity: 0.6;
  animation: ${fall} ${({ duration }) => duration}s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  will-change: transform, opacity;
  filter: blur(2px);
`;

export function DriveBackground({ dropCount = 10 }: ComponentProps) {
  const [drops, setDrops] = useState<any[]>([]);

  useEffect(() => {
    const arr = Array.from({ length: dropCount }, () => ({
      left: Math.random() * 100, // 위치
      duration: 2 + Math.random() * 4, // 재생 시간
      delay: Math.random() * -5, // 시작 타이밍
      thickness: 1 + Math.random() * 2, // 굵기
      length: 10 + Math.random() * 80, // 길이
      tilt: 1 * Math.random() * 10, // 각도
    }));
    setDrops(arr);
  }, []);

  return (
    <Component aria-hidden>
      {drops.map((d, i) => (
        <Drop
          key={i}
          left={d.left}
          duration={d.duration}
          delay={d.delay}
          thickness={d.thickness}
          length={d.length}
          tilt={d.tilt}
        />
      ))}
    </Component>
  );
}