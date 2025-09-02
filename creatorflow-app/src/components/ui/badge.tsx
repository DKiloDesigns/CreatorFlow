import * as React from "react"
import { Chip } from "@mui/material"

export interface BadgeProps
  extends React.ComponentProps<typeof Chip> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const getVariantProps = () => {
    switch (variant) {
      case 'default':
        return {
          color: 'primary' as const,
          variant: 'filled' as const
        }
      case 'secondary':
        return {
          color: 'secondary' as const,
          variant: 'filled' as const
        }
      case 'destructive':
        return {
          color: 'error' as const,
          variant: 'filled' as const
        }
      case 'outline':
        return {
          variant: 'outlined' as const
        }
      default:
        return {
          color: 'primary' as const,
          variant: 'filled' as const
        }
    }
  }

  return (
    <Chip
      className={className}
      size="small"
      {...getVariantProps()}
      {...props}
    />
  )
}

export { Badge }
