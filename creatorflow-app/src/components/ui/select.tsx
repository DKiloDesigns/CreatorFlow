"use client"

import * as React from "react"
import {
  Select as MuiSelect,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip
} from "@mui/material"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

// Simplified MUI-based Select components
const Select = MuiSelect

const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
SelectGroup.displayName = "SelectGroup"

const SelectValue = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
SelectValue.displayName = "SelectValue"

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <Box ref={ref} {...props}>
      <ChevronUp style={{ width: 16, height: 16 }} aria-hidden="true" />
    </Box>
  )
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <Box ref={ref} {...props}>
      <ChevronDown style={{ width: 16, height: 16 }} aria-hidden="true" />
    </Box>
  )
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
SelectContent.displayName = "SelectContent"

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Typography ref={ref} variant="body2" {...props}>
      {children}
    </Typography>
  )
)
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ children, ...props }, ref) => (
    <MenuItem ref={ref} {...props}>
      {children}
    </MenuItem>
  )
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <Box 
      ref={ref} 
      sx={{ 
        height: 1, 
        backgroundColor: 'divider',
        margin: '4px 0'
      }} 
      {...props} 
    />
  )
)
SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
