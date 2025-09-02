"use client"

import * as React from "react"
import { Typography } from "@mui/material"

const Label = React.forwardRef<
  React.ElementRef<typeof Typography>,
  React.ComponentPropsWithoutRef<typeof Typography>
>(({ className, ...props }, ref) => (
  <Typography
    ref={ref}
    component="label"
    variant="body2"
    className={className}
    sx={{
      fontWeight: 500,
      lineHeight: 1,
      cursor: 'pointer',
      '&.peer-disabled': {
        cursor: 'not-allowed',
        opacity: 0.7
      }
    }}
    {...props}
  />
))
Label.displayName = "Label"

export { Label }
