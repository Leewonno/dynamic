import React from "react"
import styled from "styled-components"

type ComponentProps = {
  children: React.ReactNode
}

const Component = styled.button`
  
`

export function Button({ children }: ComponentProps) {
  return (
    <Component>
      {children}
    </Component>
  )
}