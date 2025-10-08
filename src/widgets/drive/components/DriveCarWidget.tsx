'use client'

import { DriveCar } from "@/features"
import styled from "styled-components"

const Widget = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #a6a6a6;
  position: absolute;
  top: 0;
`

export function DriveCarWidget() {
  return (
    <Widget>
      <DriveCar />
    </Widget>
  )
}