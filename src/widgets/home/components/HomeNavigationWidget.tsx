'use client'

import { HomeDynamicText } from "@/features"
import { LinkButton } from "@/shares"
import styled from "styled-components"

const Widget = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

export function HomeNavigationWidget() {
  return (
    <Widget>
      <LinkButton href="/drive">드라이브</LinkButton>
      <LinkButton href="/worldcup">이상형월드컵</LinkButton>
      <LinkButton href="/audio">오디오</LinkButton>
    </Widget>
  )
}