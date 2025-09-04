"use client"

import * as React from "react"
import {
  Tabs as MuiTabs,
  Tab as MuiTab,
  Box
} from "@mui/material"

// MUI-based Tabs components
const Tabs = MuiTabs

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof MuiTabsList>
>(({ className, ...props }, ref) => (
  <MuiTabsList
    ref={ref}
    className={className}
    sx={{
      height: '40px',
      borderRadius: '6px',
      backgroundColor: 'action.hover',
      padding: '4px',
      color: 'text.secondary'
    }}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof MuiTab>
>(({ className, ...props }, ref) => (
  <MuiTab
    ref={ref as any}
    sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      borderRadius: '2px',
      padding: '6px 12px',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.2s ease',
      outline: 'none',
      cursor: 'pointer',
      '&:focus-visible': {
        outline: 'none',
        ring: '2px',
        ringColor: 'primary.main',
        ringOffset: '2px',
        ringOffsetColor: 'background.paper'
      },
      '&:disabled': {
        pointerEvents: 'none',
        opacity: 0.5
      },
      '&.Mui-selected': {
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
      }
    }}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box
    ref={ref}
    className={className}
    sx={{
      marginTop: '8px',
      outline: 'none',
      '&:focus-visible': {
        outline: 'none',
        ring: '2px',
        ringColor: 'primary.main',
        ringOffset: '2px',
        ringOffsetColor: 'background.paper'
      }
    }}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
