import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
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

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
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
    const ariaProps: Record<string, any> = {};
    if (ariaLabel) ariaProps['aria-label'] = ariaLabel;
    if (ariaDescribedBy) ariaProps['aria-describedby'] = ariaDescribedBy;
    if (ariaInvalid !== undefined) ariaProps['aria-invalid'] = ariaInvalid;
    if (ariaRequired !== undefined) ariaProps['aria-required'] = ariaRequired;
    if (errorMessage) ariaProps['aria-errormessage'] = generatedErrorId;
    if (helperText) ariaProps['aria-describedby'] = `${ariaDescribedBy ? ariaDescribedBy + ' ' : ''}${generatedHelperId}`;

    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            // SACA: Enhanced focus styles for better visibility
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            // SACA: Ensure sufficient touch target size
            "min-h-[44px]",
            // SACA: Error state styling
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          role="textbox"
          tabIndex={0}
          {...ariaProps}
          {...props}
        />
        
        {/* SACA: Error message for screen readers */}
        {errorMessage && (
          <div
            id={generatedErrorId}
            className="sr-only"
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
        
        {/* SACA: Helper text for screen readers */}
        {helperText && (
          <div
            id={generatedHelperId}
            className="sr-only"
          >
            {helperText}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
