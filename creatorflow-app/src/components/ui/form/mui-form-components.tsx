'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  FormLabel as MuiFormLabel,
  Select as MuiSelect,
  MenuItem,
  Checkbox as MuiCheckbox,
  Radio as MuiRadio,
  RadioGroup,
  Switch as MuiSwitch,
  TextField,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { designTokens } from '@/lib/design-system';

// Select Component
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
}

export interface SelectProps {
  label: string;
  value: string | number | string[] | number[];
  onChange: (value: string | number | string[] | number[]) => void;
  options: SelectOption[];
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  variant?: 'outlined' | 'filled' | 'standard';
  renderValue?: (selected: any) => React.ReactNode;
  sx?: any;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  multiple = false,
  disabled = false,
  required = false,
  error,
  helperText,
  placeholder,
  size = 'medium',
  fullWidth = true,
  variant = 'outlined',
  renderValue,
  sx,
}) => {
  const handleChange = (event: SelectChangeEvent<any>) => {
    onChange(event.target.value);
  };

  const renderSelectedValue = (selected: any) => {
    if (renderValue) {
      return renderValue(selected);
    }

    if (multiple && Array.isArray(selected)) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((val) => {
            const option = options.find(opt => opt.value === val);
            return option ? (
              <Chip
                key={val}
                label={option.label}
                size="small"
                color={option.color || 'default'}
                icon={option.icon}
              />
            ) : null;
          })}
        </Box>
      );
    }

    const option = options.find(opt => opt.value === selected);
    return option ? option.label : '';
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      error={!!error}
      required={required}
      disabled={disabled}
      size={size}
      sx={{ mb: 2, ...sx }}
    >
      <InputLabel id={`select-label-${label}`}>{label}</InputLabel>
      <MuiSelect
        labelId={`select-label-${label}`}
        value={value}
        onChange={handleChange}
        label={label}
        multiple={multiple}
        renderValue={renderSelectedValue}
        input={<OutlinedInput label={label} />}
        sx={{
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          },
        }}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {option.icon}
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && (
        <FormHelperText sx={{ color: 'error.main', fontWeight: 500 }}>
          {error}
        </FormHelperText>
      )}
      {helperText && !error && (
        <FormHelperText sx={{ color: 'text.secondary' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// Checkbox Component
export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  indeterminate?: boolean;
  sx?: any;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  color = 'primary',
  size = 'medium',
  indeterminate = false,
  sx,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <FormControl
      error={!!error}
      required={required}
      disabled={disabled}
      sx={{ mb: 2, ...sx }}
    >
      <FormControlLabel
        control={
          <MuiCheckbox
            checked={checked}
            onChange={handleChange}
            color={color}
            size={size}
            indeterminate={indeterminate}
            sx={{
              '&.Mui-checked': {
                color: designTokens.colors[color][600],
              },
            }}
          />
        }
        label={
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: error ? 'error.main' : 'text.primary',
                fontWeight: 500,
              }}
            >
              {label}
              {required && (
                <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
            {helperText && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {helperText}
              </Typography>
            )}
          </Box>
        }
        sx={{ alignItems: 'flex-start' }}
      />
      {error && (
        <FormHelperText sx={{ color: 'error.main', fontWeight: 500, ml: 4 }}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// Checkbox Group Component
export interface CheckboxGroupProps {
  label: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  sx?: any;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  color = 'primary',
  size = 'medium',
  sx,
}) => {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <FormControl
      error={!!error}
      required={required}
      disabled={disabled}
      sx={{ mb: 2, ...sx }}
    >
      <FormLabel
        sx={{
          color: error ? 'error.main' : 'text.primary',
          fontWeight: 600,
          mb: 1,
        }}
      >
        {label}
        {required && (
          <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Typography>
        )}
      </FormLabel>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <MuiCheckbox
                checked={value.includes(option.value)}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                color={color}
                size={size}
                disabled={option.disabled || disabled}
                sx={{
                  '&.Mui-checked': {
                    color: designTokens.colors[color][600],
                  },
                }}
              />
            }
            label={option.label}
            disabled={option.disabled || disabled}
          />
        ))}
      </FormGroup>
      {error && (
        <FormHelperText sx={{ color: 'error.main', fontWeight: 500 }}>
          {error}
        </FormHelperText>
      )}
      {helperText && !error && (
        <FormHelperText sx={{ color: 'text.secondary' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// Radio Component
export interface RadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  sx?: any;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  value,
  checked,
  onChange,
  disabled = false,
  color = 'primary',
  size = 'medium',
  sx,
}) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <FormControlLabel
      control={
        <MuiRadio
          checked={checked}
          onChange={handleChange}
          color={color}
          size={size}
          disabled={disabled}
          sx={{
            '&.Mui-checked': {
              color: designTokens.colors[color][600],
            },
          }}
        />
      }
      label={label}
      disabled={disabled}
      sx={sx}
    />
  );
};

// Radio Group Component
export interface RadioGroupProps {
  label: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  row?: boolean;
  sx?: any;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  color = 'primary',
  size = 'medium',
  row = false,
  sx,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      error={!!error}
      required={required}
      disabled={disabled}
      sx={{ mb: 2, ...sx }}
    >
      <FormLabel
        sx={{
          color: error ? 'error.main' : 'text.primary',
          fontWeight: 600,
          mb: 1,
        }}
      >
        {label}
        {required && (
          <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
            *
          </Typography>
        )}
      </FormLabel>
      <MuiRadioGroup
        value={value}
        onChange={handleChange}
        row={row}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <MuiRadio
                color={color}
                size={size}
                disabled={option.disabled || disabled}
                sx={{
                  '&.Mui-checked': {
                    color: designTokens.colors[color][600],
                  },
                }}
              />
            }
            label={option.label}
            disabled={option.disabled || disabled}
          />
        ))}
      </MuiRadioGroup>
      {error && (
        <FormHelperText sx={{ color: 'error.main', fontWeight: 500 }}>
          {error}
        </FormHelperText>
      )}
      {helperText && !error && (
        <FormHelperText sx={{ color: 'text.secondary' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// Switch Component
export interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' | 'default';
  size?: 'small' | 'medium';
  sx?: any;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  color = 'primary',
  size = 'medium',
  sx,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <FormControl
      error={!!error}
      required={required}
      disabled={disabled}
      sx={{ mb: 2, ...sx }}
    >
      <FormControlLabel
        control={
          <MuiSwitch
            checked={checked}
            onChange={handleChange}
            color={color}
            size={size}
            sx={{
              '&.Mui-checked': {
                color: designTokens.colors[color][600],
                '& + .MuiSwitch-track': {
                  backgroundColor: designTokens.colors[color][600],
                },
              },
            }}
          />
        }
        label={
          <Box>
            <Typography
              variant="body1"
              sx={{
                color: error ? 'error.main' : 'text.primary',
                fontWeight: 500,
              }}
            >
              {label}
              {required && (
                <Typography component="span" sx={{ color: 'error.main', ml: 0.5 }}>
                  *
                </Typography>
              )}
            </Typography>
            {helperText && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {helperText}
              </Typography>
            )}
          </Box>
        }
        sx={{ alignItems: 'flex-start' }}
      />
      {error && (
        <FormHelperText sx={{ color: 'error.main', fontWeight: 500, ml: 4 }}>
          {error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// Export individual components
export {
  FormControl,
  FormLabel,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  MuiFormLabel,
  MuiSelect,
  MenuItem,
  MuiCheckbox,
  MuiRadio,
  RadioGroup as MuiRadioGroup,
  MuiSwitch,
  TextField,
  Box,
  Typography,
  Chip,
  OutlinedInput,
  InputLabel,
};
