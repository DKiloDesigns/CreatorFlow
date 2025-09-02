"use client"

import * as React from "react"
import { Switch as MuiSwitch, Box } from "@mui/material"

// MUI-based Switch component
const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof MuiSwitch>
>(({ className, ...props }, ref) => (
  <MuiSwitch
    ref={ref}
    className={className}
    sx={{
      height: 24,
      width: 44,
      '& .MuiSwitch-thumb': {
        height: 20,
        width: 20,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      },
      '& .MuiSwitch-track': {
        borderRadius: '50px'
      }
    }}
    {...props}
  />
))
Switch.displayName = "Switch"

export { Switch }
