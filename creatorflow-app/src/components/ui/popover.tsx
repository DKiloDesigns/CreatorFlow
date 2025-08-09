"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      onOpenAutoFocus={(e) => {
        // Prevent default focus behavior to allow custom focus management
        e.preventDefault();
        // Find the first focusable element within the popover content
        const content = e.currentTarget as HTMLElement;
        if (content) {
          const focusableElements = content.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstFocusable = focusableElements[0] as HTMLElement;
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }}
      onCloseAutoFocus={(e) => {
        // Prevent default focus behavior to allow custom focus management
        e.preventDefault();
        // Return focus to the trigger element
        const trigger = document.querySelector('[data-radix-popover-trigger][data-state="open"]') as HTMLElement;
        if (trigger) {
          trigger.focus();
        }
      }}
      onEscapeKeyDown={(e) => {
        // Allow escape key to close popover
        e.preventDefault();
        const trigger = document.querySelector('[data-radix-popover-trigger][data-state="open"]') as HTMLElement;
        if (trigger) {
          trigger.click();
        }
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
