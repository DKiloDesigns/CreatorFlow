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
import { 
  Box, 
  Paper, 
  IconButton, 
  Typography, 
  Button,
  Avatar,
  Badge
} from '@mui/material';
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
    <Box sx={{ position: 'relative' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <Button
        onClick={handleImageClick}
        disabled={isUploading}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 64,
          borderRadius: 2,
          minWidth: 44,
          minHeight: 44,
          position: 'relative',
          color: isActive ? 'primary.main' : 'text.secondary',
          bgcolor: isActive ? 'primary.50' : 'transparent',
          '&:hover': {
            bgcolor: isActive ? 'primary.100' : 'action.hover'
          },
          '&:disabled': {
            opacity: 0.6
          }
        }}
      >
        {userImage ? (
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={userImage} 
              alt={userName}
              sx={{ 
                width: 32, 
                height: 32, 
                border: 2, 
                borderColor: 'currentColor' 
              }}
            />
            {isUploading && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Upload size={16} style={{ color: 'white' }} />
              </Box>
            )}
            {/* Upload indicator */}
            <Box sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              '&:hover': { opacity: 1 },
              transition: 'opacity 0.2s'
            }}>
              <Upload size={10} style={{ color: 'white' }} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: 'transparent',
              border: 2, 
              borderColor: 'currentColor',
              color: 'inherit',
              fontSize: '0.875rem',
              fontWeight: 'bold'
            }}>
              {getInitials(userName)}
            </Avatar>
            {isUploading && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Upload size={16} style={{ color: 'white' }} />
              </Box>
            )}
            {/* Upload indicator */}
            <Box sx={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 16,
              height: 16,
              bgcolor: 'primary.main',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              '&:hover': { opacity: 1 },
              transition: 'opacity 0.2s'
            }}>
              <Upload size={10} style={{ color: 'white' }} />
            </Box>
          </Box>
        )}
        
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 0.5, 
            fontWeight: 500,
            color: 'inherit'
          }}
        >
          Profile
        </Typography>
      </Button>
    </Box>
  );
}

export function BottomNavigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <Paper
      component="nav"
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: { xs: 'block', md: 'none' }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-around', 
        px: 2, 
        py: 2 
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname ? item.activePattern.test(pathname) : false;
          
          // Special handling for Profile item
          if (item.label === 'Profile') {
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <ProfilePicture session={session} isActive={isActive} />
              </Link>
            );
          }
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none' }}
            >
              <Button
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 64,
                  borderRadius: 2,
                  minWidth: 44,
                  minHeight: 44,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  bgcolor: isActive ? 'primary.50' : 'transparent',
                  '&:hover': {
                    bgcolor: isActive ? 'primary.100' : 'action.hover'
                  }
                }}
              >
                <Icon 
                  size={22} 
                  style={{ 
                    color: 'inherit',
                    transition: 'color 0.2s'
                  }} 
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5, 
                    fontWeight: 500,
                    color: 'inherit',
                    transition: 'color 0.2s'
                  }}
                >
                  {item.label}
                </Typography>
              </Button>
            </Link>
          );
        })}
      </Box>
    </Paper>
  );
} 