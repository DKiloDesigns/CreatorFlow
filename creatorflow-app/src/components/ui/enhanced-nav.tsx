import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  BarChart2, 
  Users, 
  FileText, 
  Handshake, 
  CreditCard, 
  Menu, 
  X, 
  ChevronDown,
  Settings,
  LogOut,
  User,
  Bell,
  Brain
} from 'lucide-react';
import { NotificationBadge } from './notification-badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { useSession, signOut } from 'next-auth/react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { href: '/dashboard/content', label: 'Content', icon: FileText },
  { href: '/dashboard/ai-tools', label: 'AI Tools', icon: Brain },
  { href: '/dashboard/accounts', label: 'Accounts', icon: Users },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/collabs', label: 'Brand Collabs', icon: Handshake },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
];

export function EnhancedNavigation() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { data: session } = useSession();

  const isActive = (href: string) => {
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {item.badge && (
                <NotificationBadge count={item.badge} size="sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation Toggle */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileNavOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                    {item.badge && (
                      <NotificationBadge count={item.badge} size="sm" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function UserMenu() {
  const { data: session } = useSession();
  const userImage = session?.user?.image;
  const userName = session?.user?.name || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-2">
            {userImage ? (
              <img src={userImage} alt={userName} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
            <span className="text-sm font-medium">{userName}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing" className="flex items-center w-full">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Breadcrumbs() {
  const pathname = usePathname();
  
  if (!pathname) return null;

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: '/' + array.slice(0, index + 1).join('/'),
      isLast: index === array.length - 1
    }));

  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {segments.map((segment, index) => (
        <React.Fragment key={segment.href}>
          {index > 0 && <span>/</span>}
          {segment.isLast ? (
            <span className="text-foreground font-medium">{segment.label}</span>
          ) : (
            <Link
              href={segment.href}
              className="hover:text-foreground transition-colors"
            >
              {segment.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 