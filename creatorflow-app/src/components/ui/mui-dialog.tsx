import * as React from "react";
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  DialogContentText,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled MUI Dialog
const StyledDialog = styled(MuiDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    boxShadow: theme.palette.mode === 'light'
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
  },
}));

// Styled Dialog Title
const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
}));

// Styled Dialog Content
const StyledDialogContent = styled(MuiDialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
}));

// Styled Dialog Actions
const StyledDialogActions = styled(MuiDialogActions)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
}));

export interface DialogProps extends Omit<MuiDialogProps, 'open'> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Dialog({
  children,
  open = false,
  onOpenChange,
  onClose,
  ...props
}: DialogProps) {
  const handleClose = (event: any, reason: 'backdropClick' | 'escapeKeyDown') => {
    onClose?.(event, reason);
    onOpenChange?.(false);
  };

  return (
    <StyledDialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      {...props}
    >
      {children}
    </StyledDialog>
  );
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <StyledDialogContent className={className}>
      {children}
    </StyledDialogContent>
  );
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
  _onClose?: () => void;
}

export function DialogHeader({ children, className, _onClose }: DialogHeaderProps) {
  return (
    <Box sx={{ position: 'relative' }}>
      <StyledDialogTitle className={className}>
        {children}
      </StyledDialogTitle>
      {_onClose && (
        <IconButton
          aria-label="close"
          onClick={_onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <Close />
        </IconButton>
      )}
    </Box>
  );
}

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className }: DialogFooterProps) {
  return (
    <StyledDialogActions className={className}>
      {children}
    </StyledDialogActions>
  );
}

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
  return (
    <Typography variant="h6" component="h2" className={className}>
      {children}
    </Typography>
  );
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({ children, className }: DialogDescriptionProps) {
  return (
    <DialogContentText className={className}>
      {children}
    </DialogContentText>
  );
}

// Export individual components for complex dialog structures
export function DialogTrigger({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function DialogPortal({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function DialogClose({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function DialogOverlay({ ...props }: { [key: string]: any }) {
  return <div {...props} />;
} 