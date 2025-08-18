import * as React from "react";
import { Select as MuiSelect, SelectProps as MuiSelectProps, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI Select
const StyledSelect = styled(MuiSelect)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    fontSize: '0.875rem',
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiSelect-select': {
    padding: '8px 12px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
  },
}));

// Styled Form Control
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
}));

// Styled Menu Item
const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  fontSize: '0.875rem',
  padding: '8px 12px',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export interface SelectProps extends Omit<MuiSelectProps, 'variant'> {
  placeholder?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  size?: 'sm' | 'default';
}

export function Select({
  className,
  placeholder,
  options = [],
  size = 'default',
  children,
  ...props
}: SelectProps) {
  const [value, setValue] = React.useState<string>('');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <StyledFormControl
      fullWidth={props.fullWidth}
      size={size === 'sm' ? 'small' : 'medium'}
      className={className}
    >
      {props.label && (
        <InputLabel>{props.label}</InputLabel>
      )}
      <StyledSelect
        value={value}
        onChange={handleChange}
        displayEmpty
        {...props}
      >
        {placeholder && (
          <StyledMenuItem value="" disabled>
            {placeholder}
          </StyledMenuItem>
        )}
        {options.map((option) => (
          <StyledMenuItem
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </StyledMenuItem>
        ))}
        {children}
      </StyledSelect>
    </StyledFormControl>
  );
}

// Export individual components for complex select structures
export function SelectGroup({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function SelectValue({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <span {...props}>{children}</span>;
}

export function SelectTrigger({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function SelectContent({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function SelectLabel({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return <div {...props}>{children}</div>;
}

export function SelectItem({ children, value, ...props }: { children: React.ReactNode; value: string; [key: string]: any }) {
  return (
    <StyledMenuItem value={value} {...props}>
      {children}
    </StyledMenuItem>
  );
}

export function SelectSeparator({ ...props }: { [key: string]: any }) {
  return <div {...props} />;
}

export function SelectScrollUpButton({ ...props }: { [key: string]: any }) {
  return <div {...props} />;
}

export function SelectScrollDownButton({ ...props }: { [key: string]: any }) {
  return <div {...props} />;
} 