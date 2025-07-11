import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function PublicHeader() {
  return (
    <header className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-gray-900 dark:text-white">
            CreatorFlow
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle isLandingPage={true} />
            <Link 
              href="/auth" 
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 