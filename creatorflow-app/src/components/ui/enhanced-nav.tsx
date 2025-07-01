import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  BarChart2, 
  Users, 
  Users2,
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
  Brain,
  LifeBuoy,
  Shield
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
  { href: '/dashboard/teams', label: 'Teams', icon: Users2 },
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
  const userName = session?.user?.name || 'Account';
  // Helper for initials if no image and no name
  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    alert('Profile image upload coming soon!');
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full px-3 py-1 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        >
          {userImage ? (
            <img src={userImage} alt={userName} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {getInitials(userName)}
            </div>
          )}
          <span className="font-medium text-sm max-w-[120px] truncate">{userName}</span>
          <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center w-full">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/security" className="flex items-center w-full">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/notifications" className="flex items-center w-full">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/support" className="flex items-center w-full">
            <LifeBuoy className="mr-2 h-4 w-4" />
            Support / Help
          </Link>
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