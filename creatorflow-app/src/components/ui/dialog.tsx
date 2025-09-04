"use client"

import * as React from "react"
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  DialogContentText as MuiDialogContentText,
  IconButton,
  Box,
  Typography
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

// MUI Dialog wrapper with consistent styling
const Dialog = React.forwardRef<HTMLDivElement, MuiDialogProps>(
  ({ children, ...props }, ref) => (
    <MuiDialog
      ref={ref}
      {...props}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '32rem',
          width: '100%',
          m: 2
        }
      }}
    >
      {children}
    </MuiDialog>
  )
)
Dialog.displayName = "Dialog"

// Dialog Trigger - just a div that can be styled
const DialogTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
DialogTrigger.displayName = "DialogTrigger"

// Dialog Portal - not needed with MUI, but keeping for compatibility
const DialogPortal = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
DialogPortal.displayName = "DialogPortal"

// Dialog Close button
const DialogClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      style={{
        position: 'absolute',
        right: 16,
        top: 16,
        color: 'grey.500',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 8,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...props.style
      }}
    >
      {children || <CloseIcon />}
    </button>
  )
)
DialogClose.displayName = "DialogClose"

// Dialog Overlay - not needed with MUI, but keeping for compatibility
const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <Box ref={ref} {...props} />
  )
)
DialogOverlay.displayName = "DialogOverlay"

// Dialog Content wrapper
const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <MuiDialogContent ref={ref} {...props}>
      {children}
    </MuiDialogContent>
  )
)
DialogContent.displayName = "DialogContent"

// Dialog Header
const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mb: 2
      }}
    >
      {children}
    </Box>
  )
)
DialogHeader.displayName = "DialogHeader"

// Dialog Footer
const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box
      ref={ref}
      {...props}
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 1,
        mt: 2
      }}
    >
      {children}
    </Box>
  )
)
DialogFooter.displayName = "DialogFooter"

// Dialog Description
const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ children, ...props }, ref) => (
    <Typography
      ref={ref}
      variant="body2"
      color="text.secondary"
      {...props}
      sx={{
        mb: 2,
        ...props.sx
      }}
    >
      {children}
    </Typography>
  )
)
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogDescription,
  MuiDialogTitle as DialogTitle,
  MuiDialogActions as DialogActions,
  MuiDialogContentText as DialogContentText
}
