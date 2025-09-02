'use client';

import * as React from 'react';
import { createContext, useContext, useRef, useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ChevronDown, Check, Circle } from 'lucide-react';

// Context for menu state management
interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentRef: React.RefObject<HTMLDivElement>;
}

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within a Menu');
  }
  return context;
};

// Menu Root Component
interface MenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export function Menu({ children, open: controlledOpen, onOpenChange, modal = true }: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Close menu when clicking outside
  useEffect(() => {
    if (!open || !modal) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, modal, setOpen]);

  // Focus management
  useEffect(() => {
    if (open && contentRef.current) {
      const firstFocusable = contentRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [open]);

  const contextValue: MenuContextValue = {
    open,
    setOpen,
    triggerRef,
    contentRef,
  };

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
}

// Menu Trigger Component
interface MenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

export function MenuTrigger({ children, asChild = false, className, disabled }: MenuTriggerProps) {
  const { open, setOpen, triggerRef } = useMenuContext();

  const handleClick = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setOpen(!open);
        break;
      case 'ArrowDown':
        event.preventDefault();
        setOpen(true);
        break;
    }
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      'aria-expanded': open,
      'aria-haspopup': 'menu',
      'aria-controls': 'menu-content',
      disabled,
      sx: { ...(className && { className }), ...(children.props.className && { className: children.props.className }) },
    });
  }

  return (
    <Button
      ref={triggerRef}
      variant="outlined"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={open}
      aria-haspopup="menu"
      aria-controls="menu-content"
      disabled={disabled}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        borderRadius: '6px',
        px: 1.5,
        py: 1,
        fontSize: '0.875rem',
        fontWeight: 500,
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: 1,
        border: 1,
        borderColor: 'grey.300',
        '&:hover': { bgcolor: 'grey.50' },
        '&:focus': { outline: 'none', ring: 2, ringColor: 'primary.500', ringOffset: 2 },
        '&.Mui-disabled': { opacity: 0.5, cursor: 'not-allowed' },
        transition: 'color 0.2s',
        ...(className && { className })
      }}
    >
      {children}
      <ChevronDown style={{ 
        height: 16, 
        width: 16, 
        transition: 'transform 0.2s',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
      }} />
    </Button>
  );
}

// Menu Content Component
interface MenuContentProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
}

export function MenuContent({
  children,
  className,
  align = 'start',
  side = 'bottom',
}: MenuContentProps) {
  const { open, contentRef } = useMenuContext();

  if (!open) return null;

  return (
    <Box
      ref={contentRef}
      role="menu"
      id="menu-content"
      aria-orientation="vertical"
      sx={{
        zIndex: 50,
        minWidth: '8rem',
        overflow: 'hidden',
        borderRadius: '6px',
        border: 1,
        borderColor: 'grey.200',
        bgcolor: 'white',
        p: 0.5,
        boxShadow: 3,
        ...(className && { className })
      }}
      style={{
        '--radix-menu-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-menu-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-menu-content-available-height': 'var(--radix-popper-available-height)',
        '--radix-menu-trigger-width': 'var(--radix-popper-trigger-width)',
        '--radix-menu-trigger-height': 'var(--radix-popper-trigger-height)',
      } as React.CSSProperties}
      data-side={side}
      data-align={align}
    >
      {children}
    </Box>
  );
}

// Menu Item Component
interface MenuItemProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  onSelect?: () => void;
  inset?: boolean;
}

export function MenuItem({
  children,
  className,
  disabled = false,
  onClick,
  onSelect,
  inset = false,
}: MenuItemProps) {
  const { setOpen } = useMenuContext();

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
      onSelect?.();
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleClick();
        break;
      case 'ArrowDown':
        event.preventDefault();
        // Focus next item
        break;
      case 'ArrowUp':
        event.preventDefault();
        // Focus previous item
        break;
    }
  };

  return (
    <Button
      variant="text"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={{
        position: 'relative',
        display: 'flex',
        cursor: 'default',
        userSelect: 'none',
        alignItems: 'center',
        borderRadius: '2px',
        px: 1,
        py: 0.75,
        fontSize: '0.875rem',
        outline: 'none',
        '&:focus': { bgcolor: 'grey.100', color: 'grey.900' },
        '&.Mui-disabled': { pointerEvents: 'none', opacity: 0.5 },
        transition: 'color 0.15s',
        ...(inset && { pl: 4 }),
        ...(className && { className })
      }}
    >
      {children}
    </Button>
  );
}

// Menu Checkbox Item Component
interface MenuCheckboxItemProps {
  children: React.ReactNode;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  inset?: boolean;
}

export function MenuCheckboxItem({
  children,
  className,
  checked = false,
  disabled = false,
  onCheckedChange,
  inset = false,
}: MenuCheckboxItemProps) {
  const { setOpen } = useMenuContext();

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange?.(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleClick();
        break;
    }
  };

  return (
    <Button
      variant="text"
      role="menuitemcheckbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={{
        position: 'relative',
        display: 'flex',
        cursor: 'default',
        userSelect: 'none',
        alignItems: 'center',
        borderRadius: '2px',
        px: 1,
        py: 0.75,
        fontSize: '0.875rem',
        outline: 'none',
        '&:focus': { bgcolor: 'grey.100', color: 'grey.900' },
        '&.Mui-disabled': { pointerEvents: 'none', opacity: 0.5 },
        transition: 'color 0.15s',
        ...(inset && { pl: 4 }),
        ...(className && { className })
      }}
    >
      <Box sx={{ position: 'absolute', left: 1, display: 'flex', height: 14, width: 14, alignItems: 'center', justifyContent: 'center' }}>
        {checked && <Check style={{ height: 12, width: 12 }} />}
      </Box>
      {children}
    </Button>
  );
}

// Menu Radio Item Component
interface MenuRadioItemProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  checked?: boolean;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  inset?: boolean;
}

export function MenuRadioItem({
  children,
  className,
  value,
  checked = false,
  disabled = false,
  onSelect,
  inset = false,
}: MenuRadioItemProps) {
  const { setOpen } = useMenuContext();

  const handleClick = () => {
    if (!disabled) {
      onSelect?.(value);
      setOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleClick();
        break;
    }
  };

  return (
    <Button
      variant="text"
      role="menuitemradio"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={{
        position: 'relative',
        display: 'flex',
        cursor: 'default',
        userSelect: 'none',
        alignItems: 'center',
        borderRadius: '2px',
        px: 1,
        py: 0.75,
        fontSize: '0.875rem',
        outline: 'none',
        '&:focus': { bgcolor: 'grey.100', color: 'grey.900' },
        '&.Mui-disabled': { pointerEvents: 'none', opacity: 0.5 },
        transition: 'color 0.15s',
        ...(inset && { pl: 4 }),
        ...(className && { className })
      }}
    >
      <Box sx={{ position: 'absolute', left: 1, display: 'flex', height: 14, width: 14, alignItems: 'center', justifyContent: 'center' }}>
        {checked && <Circle style={{ height: 8, width: 8, fill: 'currentColor' }} />}
      </Box>
      {children}
    </Button>
  );
}

// Menu Separator Component
interface MenuSeparatorProps {
  className?: string;
}

export function MenuSeparator({ className }: MenuSeparatorProps) {
  return (
    <Box
      role="separator"
      sx={{
        my: 0.5,
        height: '1px',
        bgcolor: 'grey.200',
        ...(className && { className })
      }}
    />
  );
}

// Menu Label Component
interface MenuLabelProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

export function MenuLabel({ children, className, inset = false }: MenuLabelProps) {
  return (
    <Box
      sx={{
        px: 1,
        py: 0.75,
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'grey.900',
        ...(inset && { pl: 4 }),
        ...(className && { className })
      }}
    >
      {children}
    </Box>
  );
}

// Menu Group Component
interface MenuGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function MenuGroup({ children, className }: MenuGroupProps) {
  return (
    <Box role="group" sx={{ ...(className && { className }) }}>
      {children}
    </Box>
  );
}

// Menu Sub Component
interface MenuSubProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MenuSub({ children, open: controlledOpen, onOpenChange }: MenuSubProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  return (
    <Menu open={open} onOpenChange={setOpen}>
      {children}
    </Menu>
  );
}

// Menu Sub Trigger Component
interface MenuSubTriggerProps {
  children: React.ReactNode;
  className?: string;
  inset?: boolean;
}

export function MenuSubTrigger({ children, className, inset = false }: MenuSubTriggerProps) {
  const { open, setOpen } = useMenuContext();

  return (
    <Button
      variant="text"
      role="menuitem"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      sx={{
        position: 'relative',
        display: 'flex',
        cursor: 'default',
        userSelect: 'none',
        alignItems: 'center',
        borderRadius: '2px',
        px: 1,
        py: 0.75,
        fontSize: '0.875rem',
        outline: 'none',
        '&:focus': { bgcolor: 'grey.100', color: 'grey.900' },
        transition: 'color 0.15s',
        ...(inset && { pl: 4 }),
        ...(className && { className })
      }}
    >
      {children}
      <ChevronDown style={{ marginLeft: 'auto', height: 16, width: 16 }} />
    </Button>
  );
}

// Menu Sub Content Component
interface MenuSubContentProps {
  children: React.ReactNode;
  className?: string;
  sideOffset?: number;
  alignOffset?: number;
}

export function MenuSubContent({
  children,
  className,
}: MenuSubContentProps) {
  const { open } = useMenuContext();

  if (!open) return null;

  return (
    <Box
      role="menu"
      sx={{
        zIndex: 50,
        minWidth: '8rem',
        overflow: 'hidden',
        borderRadius: '6px',
        border: 1,
        borderColor: 'grey.200',
        bgcolor: 'white',
        p: 0.5,
        boxShadow: 3,
        ...(className && { className })
      }}
      style={{
        '--radix-menu-sub-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-menu-sub-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-menu-sub-content-available-height': 'var(--radix-popper-available-height)',
        '--radix-menu-sub-content-trigger-width': 'var(--radix-popper-trigger-width)',
        '--radix-menu-sub-content-trigger-height': 'var(--radix-popper-trigger-height)',
      } as React.CSSProperties}
    >
      {children}
    </Box>
  );
}

// Export all components
export {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuSeparator,
  MenuLabel,
  MenuGroup,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
};
