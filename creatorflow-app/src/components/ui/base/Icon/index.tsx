'use client';

import React, { forwardRef } from 'react';
import { 
  Icon as MuiIcon, 
  IconProps as MuiIconProps,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  Box,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as LucideIcons from 'lucide-react';

export interface IconProps extends Omit<MuiIconProps, 'color'> {
  name: keyof typeof LucideIcons;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inherit';
  weight?: 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

// Custom styled MUI Icon
const StyledIcon = styled(MuiIcon, {
  shouldForwardProp: (prop) => !['size', 'color', 'weight'].includes(prop as string),
})<IconProps>(({ theme, size = 'md', color = 'default', weight = 'normal' }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s ease-in-out',
  
  // Size variants
  ...(size === 'xs' && {
    fontSize: '0.75rem', // 12px
    width: '0.75rem',
    height: '0.75rem',
  }),
  ...(size === 'sm' && {
    fontSize: '1rem', // 16px
    width: '1rem',
    height: '1rem',
  }),
  ...(size === 'md' && {
    fontSize: '1.25rem', // 20px
    width: '1.25rem',
    height: '1.25rem',
  }),
  ...(size === 'lg' && {
    fontSize: '1.5rem', // 24px
    width: '1.5rem',
    height: '1.5rem',
  }),
  ...(size === 'xl' && {
    fontSize: '2rem', // 32px
    width: '2rem',
    height: '2rem',
  }),
  ...(size === '2xl' && {
    fontSize: '2.5rem', // 40px
    width: '2.5rem',
    height: '2.5rem',
  }),
  ...(size === '3xl' && {
    fontSize: '3rem', // 48px
    width: '3rem',
    height: '3rem',
  }),
  ...(size === '4xl' && {
    fontSize: '4rem', // 64px
    width: '4rem',
    height: '4rem',
  }),
  
  // Color variants
  ...(color === 'default' && {
    color: theme.palette.text.primary,
  }),
  ...(color === 'muted' && {
    color: theme.palette.text.secondary,
  }),
  ...(color === 'primary' && {
    color: theme.palette.primary.main,
  }),
  ...(color === 'secondary' && {
    color: theme.palette.secondary.main,
  }),
  ...(color === 'success' && {
    color: theme.palette.success.main,
  }),
  ...(color === 'warning' && {
    color: theme.palette.warning.main,
  }),
  ...(color === 'error' && {
    color: theme.palette.error.main,
  }),
  ...(color === 'info' && {
    color: theme.palette.info.main,
  }),
  ...(color === 'inherit' && {
    color: 'inherit',
  }),
  
  // Weight variants (stroke width for Lucide icons)
  ...(weight === 'thin' && {
    strokeWidth: 1,
  }),
  ...(weight === 'light' && {
    strokeWidth: 1.5,
  }),
  ...(weight === 'normal' && {
    strokeWidth: 2,
  }),
  ...(weight === 'medium' && {
    strokeWidth: 2.5,
  }),
  ...(weight === 'semibold' && {
    strokeWidth: 3,
  }),
  ...(weight === 'bold' && {
    strokeWidth: 3.5,
  }),
}));

const Icon = forwardRef<HTMLSpanElement, IconProps>(
  (
    {
      name,
      size = 'md',
      color = 'default',
      weight = 'normal',
      className,
      ...props
    },
    ref
  ) => {
    const LucideIcon = LucideIcons[name];

    if (!LucideIcon) {
      console.warn(`Icon "${name}" not found in lucide-react`);
      return null;
    }

    return (
      <StyledIcon
        ref={ref}
        size={size}
        color={color as 'error' | 'success' | 'info' | 'warning' | 'primary' | 'secondary' | 'inherit' | undefined}
        weight={weight}
        className={className}
        {...props}
      >
        <LucideIcon />
      </StyledIcon>
    );
  }
);

Icon.displayName = 'Icon';

// Icon Button component
export const IconButton = forwardRef<
  HTMLButtonElement,
  IconProps & Omit<MuiIconButtonProps, 'color'> & {
    variant?: 'ghost' | 'outline' | 'solid';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
  }
>(
  (
    {
      name,
      size = 'md',
      color = 'default',
      variant = 'ghost',
      rounded = 'md',
      className,
      ...props
    },
    ref
  ) => {
    // Map custom size to MUI size
    const muiSize = size === 'xs' ? 'small' : 
                    size === 'sm' ? 'small' : 
                    size === 'md' ? 'medium' : 'large';

    // Map custom rounded to MUI rounded
    const muiRounded = rounded === 'sm' ? 'small' : 
                       rounded === 'md' ? 'medium' : 
                       rounded === 'lg' ? 'large' : 'large';

    // Custom styled IconButton
    const StyledIconButton = styled(MuiIconButton, {
      shouldForwardProp: (prop) => !['variant', 'rounded'].includes(prop as string),
    })<{ variant: string; rounded: string }>(({ theme, variant, rounded }) => ({
      // Variant styles
      ...(variant === 'ghost' && {
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.action.active,
        },
      }),
      ...(variant === 'outline' && {
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
          borderColor: theme.palette.primary.main,
        },
      }),
      ...(variant === 'solid' && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      }),
      
      // Rounded styles
      ...(rounded === 'sm' && {
        borderRadius: theme.shape.borderRadius * 0.5,
      }),
      ...(rounded === 'md' && {
        borderRadius: theme.shape.borderRadius,
      }),
      ...(rounded === 'lg' && {
        borderRadius: theme.shape.borderRadius * 1.5,
      }),
      ...(rounded === 'full' && {
        borderRadius: '50%',
      }),
    }));

    return (
      <StyledIconButton
        ref={ref}
        size={muiSize}
        variant={variant}
        rounded={muiRounded}
        className={className}
        {...props}
      >
        <Icon name={name} size={size as 'sm' | 'md' | 'lg' | 'xl' | 'xs' | '2xl' | '3xl' | '4xl' | undefined} color={color} />
      </StyledIconButton>
    );
  }
);

IconButton.displayName = 'IconButton';

// Icon with text component
export const IconText = forwardRef<
  HTMLSpanElement,
  IconProps & {
    text: string;
    position?: 'left' | 'right';
    spacing?: 'sm' | 'md' | 'lg';
  }
>(
  (
    {
      name,
      size = 'md',
      color = 'default',
      text,
      position = 'left',
      spacing = 'md',
      className,
      ...props
    },
    ref
  ) => {
    // Map custom spacing to MUI spacing
    const spacingMap = {
      sm: 0.5,
      md: 1,
      lg: 1.5,
    };

    return (
      <Box
        ref={ref}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacingMap[spacing],
        }}
        className={className}
        {...props}
      >
        {position === 'left' && (
          <Icon name={name} size={size} color={color} />
        )}
        <Typography variant="body2">{text}</Typography>
        {position === 'right' && (
          <Icon name={name} size={size} color={color} />
        )}
      </Box>
    );
  }
);

IconText.displayName = 'IconText';

export { Icon };
