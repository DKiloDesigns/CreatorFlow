import { Home as HomeIcon } from '@mui/icons-material';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AppBar, Toolbar, Container, Typography, Box } from '@mui/material';
import Image from 'next/image';
import { useMinimalTheme } from '@/contexts/MinimalThemeContext';

// Dynamically import ThemeToggle with ssr: false
const ThemeToggle = dynamic(() => import('@/components/theme-toggle').then(mod => mod.ThemeToggle), { ssr: false });

export function PublicHeader() {
  const { isDark } = useMinimalTheme();
  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, sm: 3, lg: 4 }, flexGrow: 1, justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Image
                src="/logo-light.png"
                alt="floai.studio logo"
                width={82} /* Set initial width for Next/Image optimization */
                height={82}
                style={{ height: '82px', width: 'auto', borderRadius: '4px' }}
              />
              {/* <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary',
                  cursor: 'pointer'
                }}
              >
                floai.studio
              </Typography> */}
            </Box>
          </Link>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeToggle />
            <Link 
              href="/auth" 
              style={{ textDecoration: 'none' }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500, 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main'
                  },
                  cursor: 'pointer'
                }}
              >
                Sign In
              </Typography>
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 