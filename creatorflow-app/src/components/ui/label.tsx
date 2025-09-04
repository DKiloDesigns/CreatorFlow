"use client"

import * as React from "react"
import { Typography } from "@mui/material"

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { className?: string }
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={className}
    style={{
      fontWeight: 500,
      lineHeight: 1,
      fontSize: '0.875rem',
      color: 'inherit',
      display: 'block',
      marginBottom: '4px',
      cursor: 'pointer'
    }}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
