'use client'

import Image from "next/image";
import React from "react";
import styled from "styled-components";
import wiper from "@/assets/imgs/wiper.png"
import wiperBottom from "@/assets/imgs/wiper_bottom.png"


type ComponentProps = {
};

const Component = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 9999;
`

const WiperBottom = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
`

const Wiper = styled(Image)`
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
`

export function DriveCar({ }: ComponentProps) {
  return (
    <Component>
      <Wiper src={wiper} alt=""/>
      <WiperBottom src={wiperBottom} alt=""/>
    </Component>
  );
}