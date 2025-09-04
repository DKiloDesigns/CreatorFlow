"use client"

import * as React from "react"
import { Box } from "@mui/material"

// MUI-based ScrollArea component
const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Box
    ref={ref}
    className={className}
    sx={{
      position: 'relative',
      overflow: 'hidden',
      height: '100%',
      width: '100%'
    }}
    {...props}
  >
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'divider',
          borderRadius: '4px',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }
      }}
    >
      {children}
    </Box>
  </Box>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "vertical" | "horizontal" }
>(({ className, orientation = "vertical", ...props }, ref) => (
  <Box
    ref={ref}
    className={className}
    sx={{
      display: 'flex',
      touchAction: 'none',
      userSelect: 'none',
      transition: 'colors 0.2s ease-in-out',
      ...(orientation === "vertical" && {
        height: '100%',
        width: '10px',
        borderLeft: '1px solid transparent',
        padding: '1px'
      }),
      ...(orientation === "horizontal" && {
        height: '10px',
        flexDirection: 'column',
        borderTop: '1px solid transparent',
        padding: '1px'
      })
    }}
    {...props}
  />
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
