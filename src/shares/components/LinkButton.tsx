import Link from "next/link"
import React from "react"
import styled from "styled-components"

type ComponentProps = {
  children: React.ReactNode;
  href: string;
}

const Component = styled(Link)`
  text-decoration: none;
`

export function LinkButton({ children, href }: ComponentProps) {
  return (
    <Component href={href}>
      {children}
    </Component>
  )
}