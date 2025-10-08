'use client'

import { DriveBackground } from "@/features"
import styled from "styled-components"

const Widget = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #a6a6a6;
`

export function DriveBackgroundWidget() {
  return (
    <Widget>
      <DriveBackground dropCount={10}/>
    </Widget>
  )
}