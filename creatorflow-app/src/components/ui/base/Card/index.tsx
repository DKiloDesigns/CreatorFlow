'use client';

import React, { forwardRef } from 'react';
import { 
  Card as MuiCard, 
  CardProps as MuiCardProps,
  CardContent,
  CardHeader,
  CardActions,
  Box,
  Skeleton,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  loading?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  image?: {
    src: string;
    alt: string;
    position?: 'top' | 'bottom';
  };
}

// Custom styled MUI Card
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => !['variant', 'hover', 'clickable', 'loading'].includes(prop as string),
})<CardProps>(({ theme, variant = 'default', hover = false, clickable = false, loading = false }) => ({
  transition: 'all 0.2s ease-in-out',
  
  // Variant styles
  ...(variant === 'default' && {
    boxShadow: theme.shadows[1],
  }),
  ...(variant === 'elevated' && {
    boxShadow: theme.shadows[8],
  }),
  ...(variant === 'outlined' && {
    boxShadow: 'none',
    border: `2px solid ${theme.palette.divider}`,
  }),
  ...(variant === 'interactive' && {
    boxShadow: theme.shadows[1],
    cursor: 'pointer',
    '&:hover': {
      boxShadow: theme.shadows[4],
      borderColor: theme.palette.primary.main + '33',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}40`,
    },
  }),
  ...(variant === 'highlight' && {
    boxShadow: theme.shadows[4],
    border: `2px solid ${theme.palette.primary.main}4D`,
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 'inherit',
      border: `2px solid ${theme.palette.primary.main}33`,
      pointerEvents: 'none',
    },
  }),
  
  // Hover effects
  ...(hover && {
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'scale(1.02)',
    },
  }),
  
  // Clickable state
  ...(clickable && {
    cursor: 'pointer',
    userSelect: 'none',
  }),
  
  // Loading state
  ...(loading && {
    '& .MuiCardContent-root': {
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  }),
  
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
}));

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      clickable = false,
      loading = false,
      header,
      footer,
      image,
      children,
      ...props
    },
    ref
  ) => {
    // Map custom variant to MUI variant
    const muiVariant = variant === 'outlined' ? 'outlined' : 'elevation';
    
    // Map custom padding to MUI spacing
    const paddingMap = {
      none: 0,
      sm: 1.5,
      md: 3,
      lg: 4,
      xl: 5,
    };

    return (
      <StyledCard
        ref={ref}
        variant={muiVariant}
        hover={hover}
        clickable={clickable}
        loading={loading}
        {...props}
      >
        {/* Top Image */}
        {image?.position !== 'bottom' && image && (
          <Box
            component="img"
            src={image.src}
            alt={image.alt}
            sx={{
              width: '100%',
              height: 192,
              objectFit: 'cover',
              borderTopLeftRadius: (theme) => theme.shape.borderRadius,
              borderTopRightRadius: (theme) => theme.shape.borderRadius,
            }}
          />
        )}
        
        {/* Header */}
        {header && (
          <CardHeader
            title={header}
            sx={{
              px: 3,
              pt: 3,
              pb: 0,
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          />
        )}
        
        {/* Content */}
        <CardContent
          sx={{
            p: paddingMap[padding],
            pt: header ? 0 : paddingMap[padding],
          }}
        >
          {loading ? (
            <Box>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          ) : (
            children
          )}
        </CardContent>
        
        {/* Bottom Image */}
        {image?.position === 'bottom' && image && (
          <Box
            component="img"
            src={image.src}
            alt={image.alt}
            sx={{
              width: '100%',
              height: 192,
              objectFit: 'cover',
              borderBottomLeftRadius: (theme) => theme.shape.borderRadius,
              borderBottomRightRadius: (theme) => theme.shape.borderRadius,
            }}
          />
        )}
        
        {/* Footer */}
        {footer && (
          <CardActions
            sx={{
              px: 3,
              pb: 3,
              pt: 0,
              borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            {footer}
          </CardActions>
        )}
      </StyledCard>
    );
  }
);

Card.displayName = 'Card';

// Card sub-components for better composition
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 0.75,
    }}
    className={className}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="h6"
    component="h3"
    sx={{
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '-0.025em',
    }}
    className={className}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    variant="body2"
    color="text.secondary"
    className={className}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box ref={ref} sx={{ pt: 0 }} className={className} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box
    ref={ref}
    sx={{
      display: 'flex',
      alignItems: 'center',
      pt: 0,
    }}
    className={className}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card };
