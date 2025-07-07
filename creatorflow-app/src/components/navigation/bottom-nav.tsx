'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  PenTool, 
  BarChart3, 
  DollarSign, 
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/dashboard',
    icon: Home,
    label: 'Home',
    activePattern: /^\/dashboard$/
  },
  {
    href: '/dashboard/content',
    icon: PenTool,
    label: 'Create',
    activePattern: /^\/dashboard\/content/
  },
  {
    href: '/dashboard/analytics',
    icon: BarChart3,
    label: 'Analytics',
    activePattern: /^\/dashboard\/analytics/
  },
  {
    href: '/dashboard/billing',
    icon: DollarSign,
    label: 'Money',
    activePattern: /^\/dashboard\/billing/
  },
  {
    href: '/dashboard/profile',
    icon: User,
    label: 'Profile',
    activePattern: /^\/dashboard\/(profile|security|collabs|ai-tools|accounts|teams|settings|notifications|support)$/
  }
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden shadow-lg">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname ? item.activePattern.test(pathname) : false;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-14 rounded-lg transition-all duration-200",
                isActive 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                )} 
              />
              <span className={cn(
                "text-xs mt-1 font-medium transition-colors duration-200",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 