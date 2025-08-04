import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled MUI TextField
const StyledTextField = styled(TextField)(({ theme }) => ({
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
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiInputBase-input': {
    padding: '8px 12px',
    height: '40px',
    boxSizing: 'border-box',
  },
}));

export interface InputProps extends Omit<TextFieldProps, 'variant'> {
  type?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <StyledTextField
        variant="outlined"
        size="small"
        className={className}
        inputRef={ref}
        inputProps={{
          type,
          ...props.inputProps,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input }; 