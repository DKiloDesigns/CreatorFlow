import * as React from "react";
import { Card as MuiCard, CardProps as MuiCardProps } from "@mui/material";
import { CardContent as MuiCardContent, CardContentProps } from "@mui/material";
import { CardHeader as MuiCardHeader, CardHeaderProps } from "@mui/material";
import { CardActions as MuiCardActions, CardActionsProps } from "@mui/material";
import { Typography, TypographyProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI Card
const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.palette.mode === 'light' 
    ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
    : '0 1px 3px rgba(0, 0, 0, 0.3)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.palette.mode === 'light'
      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(0, 0, 0, 0.4)',
  },
}));

// Styled Card Content
const StyledCardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:last-child': {
    paddingBottom: theme.spacing(3),
  },
}));

// Styled Card Header
const StyledCardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
}));

// Styled Card Actions
const StyledCardActions = styled(MuiCardActions)(({ theme }) => ({
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
}));



// Styled Typography for descriptions
const StyledCardDescription = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  lineHeight: 1.5,
}));

export interface CardProps extends MuiCardProps {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <StyledCard className={className} {...props}>
      {children}
    </StyledCard>
  );
}

export interface CardHeaderProps extends Omit<CardHeaderProps, 'title' | 'subheader'> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <StyledCardHeader className={className} {...props}>
      {children}
    </StyledCardHeader>
  );
}



export function CardDescription({ className, children, ...props }: TypographyProps) {
  return (
    <StyledCardDescription variant="body2" className={className} {...props}>
      {children}
    </StyledCardDescription>
  );
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <StyledCardContent className={className} {...props}>
      {children}
    </StyledCardContent>
  );
}

export function CardFooter({ className, children, ...props }: CardActionsProps) {
  return (
    <StyledCardActions className={className} {...props}>
      {children}
    </StyledCardActions>
  );
}

// Alias for backward compatibility
export const CardAction = CardFooter; 