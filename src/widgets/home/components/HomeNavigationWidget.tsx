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
`

export function HomeNavigationWidget() {
  return (
    <Widget>
      <LinkButton href="/drive">드라이브</LinkButton>
    </Widget>
  )
}