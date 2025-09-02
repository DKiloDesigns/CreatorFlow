"use client"

import * as React from "react"
import { LinearProgress, Box } from "@mui/material"

// MUI-based Progress component
const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof LinearProgress> & { value?: number }
>(({ className, value = 0, ...props }, ref) => (
  <Box
    ref={ref}
    className={className}
    sx={{
      position: 'relative',
      width: '100%'
    }}
  >
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 16,
        borderRadius: '8px',
        backgroundColor: 'secondary.main',
        '& .MuiLinearProgress-bar': {
          backgroundColor: 'primary.main',
          borderRadius: '8px'
        }
      }}
      {...props}
    />
  </Box>
))
Progress.displayName = "Progress"

export { Progress }
