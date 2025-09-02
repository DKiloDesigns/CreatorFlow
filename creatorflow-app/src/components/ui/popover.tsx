"use client"

import * as React from "react"
import {
  Popover as MuiPopover,
  Box
} from "@mui/material"

// MUI-based Popover components
const Popover = MuiPopover

const PopoverTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      className={className}
      sx={{
        zIndex: 50,
        width: '18rem',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        padding: '16px',
        color: 'text.primary',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        outline: 'none'
      }}
      {...props}
    />
  )
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
