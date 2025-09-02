"use client"

import * as React from "react"
import { Divider, Box } from "@mui/material"

// MUI-based Separator component
const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical"; decorative?: boolean }
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <Divider
      ref={ref}
      orientation={orientation}
      className={className}
      sx={{
        flexShrink: 0,
        backgroundColor: 'divider',
        ...(orientation === "horizontal" 
          ? { height: '1px', width: '100%' } 
          : { height: '100%', width: '1px' }
        )
      }}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

export { Separator }
