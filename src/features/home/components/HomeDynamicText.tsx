import styled, { keyframes } from "styled-components"

type ComponentProps = {
  content: string;
}

const weightAnimation = keyframes`
  0%, 100% { font-variation-settings: 'wght' 100; };
  50% { font-variation-settings: 'wght' 900; };
`;

const Component = styled.div`
  font-size: 100px;
  font-weight: 100;
  display: flex;
`

const AnimatedText = styled.span<{ delay: number }>`
  animation: ${weightAnimation} 5s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay}s;
`;

export function HomeDynamicText({ content }: ComponentProps) {
  return (
    <Component>
      {
        content.split("").map((char, i) => (
          <AnimatedText key={i} delay={i * 0.2}>{char}</AnimatedText>
        ))
      }
    </Component>
  )
}