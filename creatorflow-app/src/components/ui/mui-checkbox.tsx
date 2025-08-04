import * as React from "react";
import { Checkbox as MuiCheckbox, CheckboxProps as MuiCheckboxProps, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI Checkbox
const StyledCheckbox = styled(MuiCheckbox)(({ theme }) => ({
  '&.MuiCheckbox-root': {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
  '&.Mui-checked': {
    color: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    color: theme.palette.action.disabled,
  },
}));

export interface CheckboxProps extends Omit<MuiCheckboxProps, 'size'> {
  size?: 'sm' | 'default';
  label?: string;
}

export function Checkbox({
  className,
  size = 'default',
  label,
  ...props
}: CheckboxProps) {
  const checkboxElement = (
    <StyledCheckbox
      className={className}
      size={size === 'sm' ? 'small' : 'medium'}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={checkboxElement}
        label={label}
        sx={{
          margin: 0,
          '& .MuiFormControlLabel-label': {
            fontSize: '0.875rem',
          },
        }}
      />
    );
  }

  return checkboxElement;
} 