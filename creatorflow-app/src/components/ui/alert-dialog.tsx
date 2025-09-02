"use client"

import * as React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from "@mui/material"

// Simple MUI-based AlertDialog components
const AlertDialog = Dialog

const AlertDialogTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogPortal = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <Box ref={ref} {...props}>
      {children}
    </Box>
  )
)
AlertDialogPortal.displayName = "AlertDialogPortal"

const AlertDialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => (
    <Box ref={ref} {...props} />
  )
)
AlertDialogOverlay.displayName = "AlertDialogOverlay"

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, ...props }, ref) => (
    <DialogContent ref={ref} {...props}>
      {children}
    </DialogContent>
  )
)
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      textAlign: 'center',
      '@media (min-width: 640px)': {
        textAlign: 'left'
      }
    }}
    className={className}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column-reverse',
      gap: 2,
      justifyContent: 'end',
      '@media (min-width: 640px)': {
        flexDirection: 'row'
      }
    }}
    className={className}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => (
  <DialogTitle
    ref={ref}
    className={className}
    {...props}
  />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof Typography>,
  React.ComponentPropsWithoutRef<typeof Typography>
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="body2"
    color="text.secondary"
    className={className}
    {...props}
  />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outlined"
    className={className}
    {...props}
  />
))
AlertDialogCancel.displayName = "AlertDialogCancel"

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="contained"
    className={className}
    {...props}
  />
))
AlertDialogAction.displayName = "AlertDialogAction"

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
}
