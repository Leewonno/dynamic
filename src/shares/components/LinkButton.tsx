import Link from "next/link"
import React from "react"
import styled from "styled-components"

type ComponentProps = {
  children: React.ReactNode;
  href: string;
}

const Component = styled(Link)`
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #000;
  border-radius: 5px;
  user-select: none;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 0;
    top: 0;
    right: 0;
    z-index: -1;
    background-color: #000;
    transition: all 0.3s ease-in-out;
    border-radius: 5px;
  }

  &:hover {
    color: #fff;
    border: 1px solid #fff;
  }

  &:hover::after {
    height: 100%;
    opacity: 1;
  }
`

export function LinkButton({ children, href }: ComponentProps) {
  return (
    <Component href={href}>
      {children}
    </Component>
  )
}