'use client'

import { HomeDynamicText } from "@/features"
import styled from "styled-components"

const Widget = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export function HomeWelcomeWidget() {
  return (
    <Widget>
      <HomeDynamicText content="안녕하세요 Pretendard" />
    </Widget>
  )
}