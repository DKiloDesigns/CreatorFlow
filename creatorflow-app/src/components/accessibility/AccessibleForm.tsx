'use client';

import React, { useState, useRef, ReactNode } from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { useAccessibilityAnnouncements } from './ARIALiveRegion';

interface AccessibleFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  autoComplete?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
}

export const AccessibleFormField: React.FC<AccessibleFormFieldProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  type = 'text',
  placeholder,
  disabled = false,
  multiline = false,
  rows,
  maxLength,
  minLength,
  pattern,
  autoComplete,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { announceFormError, announceFormSuccess } = useAccessibilityAnnouncements();
  const fieldId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  // Generate aria-describedby
  const describedBy = [
    error && errorId,
    helperText && helperId,
    ariaDescribedBy,
  ].filter(Boolean).join(' ');

  // Handle validation and announcements
  const handleBlur = () => {
    setIsFocused(false);
    
    if (required && !value.trim()) {
      announceFormError(label, 'This field is required');
    } else if (error) {
      announceFormError(label, error);
    } else if (value.trim() && !error) {
      announceFormSuccess(`${label} is valid`);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    
    // Clear error when user starts typing
    if (error && newValue.trim()) {
      // This would need to be handled by parent component
    }
  };

  return (
    <FormControl
      fullWidth
      error={!!error}
      required={required}
      disabled={disabled}
      sx={{ mb: 2 }}
    >
      <FormLabel
        htmlFor={fieldId}
        sx={{
          mb: 1,
          fontWeight: 600,
          color: error ? 'error.main' : 'text.primary',
          '&:focus-within': {
            color: 'primary.main',
          },
        }}
      >
        {label}
        {required && (
          <Typography
            component="span"
            sx={{ color: 'error.main', ml: 0.5 }}
            aria-label="required"
          >
            *
          </Typography>
        )}
      </FormLabel>
      
      <TextField
        id={fieldId}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        inputProps={{
          maxLength,
          minLength,
          pattern,
          autoComplete,
          'aria-describedby': describedBy || undefined,
          'aria-invalid': ariaInvalid ?? !!error,
          'aria-required': ariaRequired ?? required,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&:focus-within': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                borderColor: error ? 'error.main' : 'primary.main',
              },
            },
            '&.Mui-error': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error.main',
                borderWidth: 2,
              },
            },
          },
        }}
      />

      {/* Error message */}
      {error && (
        <FormHelperText
          id={errorId}
          sx={{
            color: 'error.main',
            fontWeight: 500,
            mt: 0.5,
            '&:focus': {
              outline: '2px solid',
              outlineColor: 'error.main',
              outlineOffset: 2,
              borderRadius: 1,
            },
          }}
          role="alert"
          aria-live="polite"
        >
          {error}
        </FormHelperText>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <FormHelperText
          id={helperId}
          sx={{
            color: 'text.secondary',
            mt: 0.5,
          }}
        >
          {helperText}
        </FormHelperText>
      )}

      {/* Character count */}
      {maxLength && (
        <Typography
          variant="caption"
          sx={{
            color: value.length > maxLength * 0.9 ? 'warning.main' : 'text.secondary',
            mt: 0.5,
            textAlign: 'right',
            display: 'block',
          }}
        >
          {value.length}/{maxLength}
        </Typography>
      )}
    </FormControl>
  );
};

// Hook for form validation
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { announceFormError, announceFormSuccess } = useAccessibilityAnnouncements();

  const validateField = (
    fieldName: string,
    value: string,
    rules: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      custom?: (value: string) => string | null;
    }
  ): boolean => {
    let error = '';

    if (rules.required && !value.trim()) {
      error = 'This field is required';
    } else if (rules.minLength && value.length < rules.minLength) {
      error = `Must be at least ${rules.minLength} characters`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = `Must be no more than ${rules.maxLength} characters`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      error = 'Invalid format';
    } else if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        error = customError;
      }
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));

    if (error) {
      announceFormError(fieldName, error);
      return false;
    } else if (value.trim()) {
      announceFormSuccess(`${fieldName} is valid`);
      return true;
    }

    return true;
  };

  const clearError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasErrors = Object.values(errors).some(error => error !== '');
  const getError = (fieldName: string) => errors[fieldName] || '';

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors,
    getError,
  };
};
