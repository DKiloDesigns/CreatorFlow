'use client';

import * as React from 'react';
import { createContext, useContext, useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
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
      className: cn(className, children.props.className),
    });
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-expanded={open}
      aria-haspopup="menu"
      aria-controls="menu-content"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
        'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
        'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
    </button>
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
  _sideOffset = 4,
  _alignOffset = 0,
  _avoidCollisions = true,
}: MenuContentProps) {
  const { open, contentRef } = useMenuContext();

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="menu"
      id="menu-content"
      aria-orientation="vertical"
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-lg',
        'animate-in fade-in-0 zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
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
    </div>
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
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-gray-100 focus:text-gray-900',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors duration-150',
        inset && 'pl-8',
        className
      )}
    >
      {children}
    </button>
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
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-gray-100 focus:text-gray-900',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors duration-150',
        inset && 'pl-8',
        className
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-3 w-3" />}
      </span>
      {children}
    </button>
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
    <button
      type="button"
      role="menuitemradio"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-gray-100 focus:text-gray-900',
        'disabled:pointer-events-none disabled:opacity-50',
        'transition-colors duration-150',
        inset && 'pl-8',
        className
      )}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Circle className="h-2 w-2 fill-current" />}
      </span>
      {children}
    </button>
  );
}

// Menu Separator Component
interface MenuSeparatorProps {
  className?: string;
}

export function MenuSeparator({ className }: MenuSeparatorProps) {
  return (
    <div
      role="separator"
      className={cn('my-1 h-px bg-gray-200', className)}
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
    <div
      className={cn(
        'px-2 py-1.5 text-sm font-semibold text-gray-900',
        inset && 'pl-8',
        className
      )}
    >
      {children}
    </div>
  );
}

// Menu Group Component
interface MenuGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function MenuGroup({ children, className }: MenuGroupProps) {
  return (
    <div role="group" className={cn('', className)}>
      {children}
    </div>
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
    <button
      type="button"
      role="menuitem"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
        'focus:bg-gray-100 focus:text-gray-900',
        'transition-colors duration-150',
        inset && 'pl-8',
        className
      )}
    >
      {children}
      <ChevronDown className="ml-auto h-4 w-4" />
    </button>
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
  _sideOffset = 4,
  _alignOffset = 0,
}: MenuSubContentProps) {
  const { open } = useMenuContext();

  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 shadow-lg',
        'animate-in fade-in-0 zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      style={{
        '--radix-menu-sub-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-menu-sub-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-menu-sub-content-available-height': 'var(--radix-popper-available-height)',
        '--radix-menu-sub-content-trigger-width': 'var(--radix-popper-trigger-width)',
        '--radix-menu-sub-content-trigger-height': 'var(--radix-popper-trigger-height)',
      } as React.CSSProperties}
    >
      {children}
    </div>
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
