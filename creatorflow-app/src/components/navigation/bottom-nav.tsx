'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  Home, 
  PenTool, 
  BarChart3, 
  DollarSign, 
  User,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef } from 'react';

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

function ProfilePicture({ session, isActive }: { session: any; isActive: boolean }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userImage = session?.user?.image;
  const userName = session?.user?.name || 'User';
  
  // Helper for initials if no image
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      // Refresh the session to get the new image
      window.location.reload();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      <button
        onClick={handleImageClick}
        disabled={isUploading}
        className={cn(
          "flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] relative group",
          isActive 
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
      >
        {userImage ? (
          <div className="relative">
            <img 
              src={userImage} 
              alt={userName}
              className="w-8 h-8 rounded-full object-cover border-2 border-current"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}
            {/* Upload indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-current",
              isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
            )}>
              {getInitials(userName)}
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Upload className="w-4 h-4 text-white animate-pulse" />
              </div>
            )}
            {/* Upload indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        )}
        
        <span className={cn(
          "text-xs mt-1 font-medium transition-colors duration-200",
          isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
        )}>
          Profile
        </span>
      </button>
    </div>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden shadow-lg">
      <div className="flex items-center justify-around px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname ? item.activePattern.test(pathname) : false;
          
          // Special handling for Profile item
          if (item.label === 'Profile') {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block"
              >
                <ProfilePicture session={session} isActive={isActive} />
              </Link>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-20 h-16 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px]",
                isActive 
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
            >
              <Icon 
                size={22} 
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