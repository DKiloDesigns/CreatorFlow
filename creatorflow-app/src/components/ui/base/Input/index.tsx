'use client';

import React, { forwardRef, useState } from 'react';
import { 
  TextField, 
  TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
  FormHelperText,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Visibility, 
  VisibilityOff, 
  Search, 
  Clear 
} from '@/lib/mui-optimized-imports';

export interface InputProps extends Omit<MuiTextFieldProps, 'variant' | 'size' | 'color'> {
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  state?: 'default' | 'success' | 'warning' | 'error';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  searchable?: boolean;
  password?: boolean;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
}

// Custom styled MUI TextField
const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => !['variant', 'state', 'size'].includes(prop as string),
})<InputProps>(({ theme, variant = 'default', state = 'default', size = 'md' }) => ({
  // Size variants
  ...(size === 'sm' && {
    '& .MuiInputBase-root': {
      fontSize: theme.typography.body2.fontSize,
      padding: theme.spacing(1, 1.5),
    },
  }),
  ...(size === 'md' && {
    '& .MuiInputBase-root': {
      fontSize: theme.typography.body2.fontSize,
      padding: theme.spacing(1.5, 2),
    },
  }),
  ...(size === 'lg' && {
    '& .MuiInputBase-root': {
      fontSize: theme.typography.body1.fontSize,
      padding: theme.spacing(2, 2.5),
    },
  }),
  ...(size === 'xl' && {
    '& .MuiInputBase-root': {
      fontSize: theme.typography.h6.fontSize,
      padding: theme.spacing(2.5, 3),
    },
  }),
  
  // Variant styles
  ...(variant === 'default' && {
    '& .MuiOutlinedInput-root': {
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main + '80',
      },
    },
  }),
  ...(variant === 'outlined' && {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main + '80',
      },
    },
  }),
  ...(variant === 'filled' && {
    '& .MuiFilledInput-root': {
      backgroundColor: theme.palette.action.hover,
      '&:hover': {
        backgroundColor: theme.palette.action.hover + 'CC',
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
      },
    },
  }),
  ...(variant === 'minimal' && {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      border: 'none',
      borderBottom: `2px solid ${theme.palette.divider}`,
      '&:hover': {
        borderBottomColor: theme.palette.primary.main + '80',
      },
      '&.Mui-focused': {
        borderBottomColor: theme.palette.primary.main,
        boxShadow: 'none',
      },
    },
  }),
  
  // State styles
  ...(state === 'success' && {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.success.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.success.main,
      },
    },
  }),
  ...(state === 'warning' && {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.warning.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.warning.main,
      },
    },
  }),
  ...(state === 'error' && {
    '& .MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
    },
  }),
}));

const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      state = 'default',
      leftIcon,
      rightIcon,
      clearable = false,
      searchable = false,
      password = false,
      fullWidth = false,
      label,
      helperText,
      errorText,
      type,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInputValue('');
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
    };

    // Map custom variant to MUI variant
    const muiVariant = variant === 'filled' ? 'filled' : 'outlined';
    
    // Map custom size to MUI size
    const muiSize = size === 'sm' ? 'small' : 
                    size === 'md' ? 'medium' : 'large';

    // Determine input type
    const inputType = password && showPassword ? 'text' : type || 'text';

    // Build start adornment (left icon)
    const startAdornment = leftIcon ? (
      <InputAdornment position="start">
        {leftIcon}
      </InputAdornment>
    ) : undefined;

    // Build end adornment (right icons)
    const endAdornment = (
      <InputAdornment position="end">
        {searchable && <Search color="action" />}
        {password && (
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            size="small"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )}
        {clearable && inputValue && (
          <IconButton
            onClick={handleClear}
            edge="end"
            size="small"
          >
            <Clear />
          </IconButton>
        )}
        {rightIcon && !clearable && !password && !searchable && rightIcon}
      </InputAdornment>
    );

    return (
      <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
        <StyledTextField
          ref={ref}
          variant={muiVariant as any}
          size={muiSize as any}
          fullWidth={fullWidth}
          label={label}
          value={inputValue}
          onChange={handleChange}
          type={inputType}
          error={state === 'error' || !!errorText}
          InputProps={{
            startAdornment,
            endAdornment,
          }}
          state={state}
          {...props}
        />
        {(helperText || errorText) && (
          <FormHelperText 
            error={!!errorText}
            sx={{ mt: 0.5 }}
          >
            {errorText || helperText}
          </FormHelperText>
        )}
      </Box>
    );
  }
);

Input.displayName = 'Input';

export { Input };
