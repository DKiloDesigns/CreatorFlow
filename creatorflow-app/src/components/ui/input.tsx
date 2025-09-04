import * as React from "react"
import { Box, TextField } from "@mui/material"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** SACA: ARIA label for screen readers */
  ariaLabel?: string;
  /** SACA: ARIA describedby for additional context */
  ariaDescribedBy?: string;
  /** SACA: ARIA invalid state */
  ariaInvalid?: boolean;
  /** SACA: ARIA required state */
  ariaRequired?: boolean;
  /** SACA: Error message for screen readers */
  errorMessage?: string;
  /** SACA: Helper text for screen readers */
  helperText?: string;
  /** SACA: Error state for visual feedback */
  hasError?: boolean;
  /** SACA: Error ID for ARIA association */
  errorId?: string;
  /** SACA: Helper text ID for ARIA association */
  helperId?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    _type, 
    ariaLabel,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
    errorMessage,
    helperText,
    hasError = false,
    errorId,
    helperId,
    ...props 
  }, ref) => {
    // SACA: Generate unique IDs if not provided
    const generatedErrorId = errorId || `error-${Math.random().toString(36).substr(2, 9)}`;
    const generatedHelperId = helperId || `helper-${Math.random().toString(36).substr(2, 9)}`;
    
    // SACA: Prepare ARIA attributes
    const ariaProps: Record<string, string | boolean> = {};
    if (ariaLabel) ariaProps['aria-label'] = ariaLabel;
    if (ariaDescribedBy) ariaProps['aria-describedby'] = ariaDescribedBy;
    if (ariaInvalid !== undefined) ariaProps['aria-invalid'] = ariaInvalid;
    if (ariaRequired !== undefined) ariaProps['aria-required'] = ariaRequired;
    if (errorMessage) ariaProps['aria-errormessage'] = generatedErrorId;
    if (helperText) ariaProps['aria-describedby'] = `${ariaDescribedBy ? ariaDescribedBy + ' ' : ''}${generatedHelperId}`;

    return (
      <Box sx={{ position: 'relative' }}>
        <TextField
          type={type}
          fullWidth
          variant="outlined"
          size={"small" as any}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: 40,
              minHeight: 44,
              fontSize: '0.875rem',
              '&.Mui-focused': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: hasError ? 'error.main' : 'primary.main',
                  borderWidth: 2
                }
              },
              '&.Mui-error': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'error.main'
                }
              }
            }
          }}
          inputRef={ref}
          error={hasError}
          {...ariaProps}
          {...(props as any)}
        />
        
        {/* SACA: Error message for screen readers */}
        {errorMessage && (
          <Box
            id={generatedErrorId}
            sx={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0
            }}
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </Box>
        )}
        
        {/* SACA: Helper text for screen readers */}
        {helperText && (
          <Box
            id={generatedHelperId}
            sx={{ 
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0
            }}
          >
            {helperText}
          </Box>
        )}
      </Box>
    )
  }
)
Input.displayName = "Input"

export { Input }
