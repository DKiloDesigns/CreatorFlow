import * as React from "react";
import { Switch as MuiSwitch, SwitchProps as MuiSwitchProps, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI Switch
const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    margin: 2,
    padding: 0,
    transform: 'translateX(2px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(20px)',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300],
    boxSizing: 'border-box',
  },
}));

export interface SwitchProps extends Omit<MuiSwitchProps, 'size'> {
  size?: 'sm' | 'default';
  label?: string;
}

export function Switch({
  className,
  size = 'default',
  label,
  ...props
}: SwitchProps) {
  const switchElement = (
    <StyledSwitch
      className={className}
      size={size === 'sm' ? 'small' : 'medium'}
      {...props}
    />
  );

  if (label) {
    return (
      <FormControlLabel
        control={switchElement}
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

  return switchElement;
} 