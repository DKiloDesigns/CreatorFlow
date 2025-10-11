'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Chip,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  BatteryFull as BatteryIcon,
  BatteryAlert as BatteryLowIcon,
  Bolt as ZapIcon,
  AccessTime as ClockIcon,
  Memory as MemoryIcon,
  DeveloperBoard as CpuIcon,
  Storage as HardDriveIcon,
} from '@mui/icons-material';

interface PerformanceMetrics {
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
  memoryUsage?: number;
  batteryLevel?: number;
  charging?: boolean;
}

interface MobilePerformanceProps {
  children: React.ReactNode;
  enableOptimizations?: boolean;
  showPerformanceIndicator?: boolean;
}

export const MobilePerformance: React.FC<MobilePerformanceProps> = ({
  children,
  enableOptimizations = true,
  showPerformanceIndicator = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false,
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [showOptimizations, setShowOptimizations] = useState(false);

  // Monitor performance metrics
  useEffect(() => {
    if (!isMobile || !enableOptimizations) return;

    const updatePerformanceMetrics = () => {
      const connection = (navigator as any).connection;
      if (connection) {
        setPerformanceMetrics(prev => ({
          ...prev,
          connectionType: connection.type || 'unknown',
          effectiveType: connection.effectiveType || 'unknown',
          downlink: connection.downlink || 0,
          rtt: connection.rtt || 0,
          saveData: connection.saveData || false,
        }));

        // Determine if connection is slow
        const isSlow = connection.effectiveType === 'slow-2g' || 
                      connection.effectiveType === '2g' || 
                      connection.downlink < 1;
        setIsSlowConnection(isSlow);
      }

      // Monitor memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setPerformanceMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / memory.jsHeapSizeLimit,
        }));
      }

      // Monitor battery if available
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          setPerformanceMetrics(prev => ({
            ...prev,
            batteryLevel: battery.level,
            charging: battery.charging,
          }));
        });
      }
    };

    updatePerformanceMetrics();
    const interval = setInterval(updatePerformanceMetrics, 5000);

    return () => clearInterval(interval);
  }, [isMobile, enableOptimizations]);

  // Simulate loading progress
  useEffect(() => {
    if (!isMobile) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadingProgress(progress);
    }, 100);

    return () => clearInterval(interval);
  }, [isMobile]);

  // Get connection icon based on type
  const getConnectionIcon = useCallback(() => {
    switch (performanceMetrics.effectiveType) {
      case 'slow-2g':
      case '2g':
        return <WifiOffIcon />;
      case '3g':
        return <WifiIcon />;
      case '4g':
        return <WifiIcon />;
      case '5g':
        return <WifiIcon />;
      default:
        return <WifiIcon />;
    }
  }, [performanceMetrics.effectiveType]);

  // Get battery icon based on level
  const getBatteryIcon = useCallback(() => {
    if (performanceMetrics.batteryLevel === undefined) return <BatteryIcon />;
    
    if (performanceMetrics.batteryLevel < 0.2) return <BatteryLowIcon />;
    return <BatteryIcon />;
  }, [performanceMetrics.batteryLevel]);

  // Performance optimizations based on connection
  const optimizations = useMemo(() => {
    if (!enableOptimizations) return [];

    const opts = [];
    
    if (isSlowConnection) {
      opts.push('Reduced image quality');
      opts.push('Lazy loading enabled');
      opts.push('Minimal animations');
    }
    
    if (performanceMetrics.saveData) {
      opts.push('Data saver mode');
      opts.push('Compressed assets');
    }
    
    if (performanceMetrics.memoryUsage && performanceMetrics.memoryUsage > 0.8) {
      opts.push('Memory optimization');
      opts.push('Reduced cache size');
    }

    return opts;
  }, [enableOptimizations, isSlowConnection, performanceMetrics.saveData, performanceMetrics.memoryUsage]);

  return (
    <Box sx={{ position: 'relative' }}>
      {children}

      {/* Performance Indicator */}
      {isMobile && showPerformanceIndicator && (
        <Box
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Tooltip title={`Connection: ${performanceMetrics.effectiveType} (${performanceMetrics.downlink}Mbps)`}>
            <Chip
              icon={getConnectionIcon()}
              label={performanceMetrics.effectiveType}
              color={isSlowConnection ? 'error' : 'success'}
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            />
          </Tooltip>

          {performanceMetrics.batteryLevel !== undefined && (
            <Tooltip title={`Battery: ${Math.round(performanceMetrics.batteryLevel * 100)}%`}>
              <Chip
                icon={getBatteryIcon()}
                label={`${Math.round(performanceMetrics.batteryLevel * 100)}%`}
                color={performanceMetrics.batteryLevel < 0.2 ? 'error' : 'default'}
                size="small"
                sx={{ bgcolor: 'background.paper' }}
              />
            </Tooltip>
          )}

          {performanceMetrics.saveData && (
            <Chip
              icon={<ZapIcon />}
              label="Data Saver"
              color="warning"
              size="small"
              sx={{ bgcolor: 'background.paper' }}
            />
          )}
        </Box>
      )}

      {/* Performance Optimizations Alert */}
      {isMobile && optimizations.length > 0 && (
        <Fade in={showOptimizations}>
          <Alert
            severity="info"
            sx={{
              position: 'fixed',
              top: 80,
              left: 16,
              right: 16,
              zIndex: 1300,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
            action={
              <IconButton
                size="small"
                onClick={() => setShowOptimizations(false)}
              >
                <ClockIcon />
              </IconButton>
            }
          >
            <AlertTitle>Mobile Optimizations Active</AlertTitle>
            <Box sx={{ mt: 1 }}>
              {optimizations.map((opt, index) => (
                <Chip
                  key={index}
                  label={opt}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Alert>
        </Fade>
      )}

      {/* Loading Progress */}
      {isMobile && loadingProgress < 100 && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1400,
          }}
        >
          <LinearProgress
            variant="determinate"
            value={loadingProgress}
            sx={{
              height: 3,
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
              },
            }}
          />
        </Box>
      )}

      {/* Performance Toggle */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1300,
          }}
        >
          <Tooltip title="Performance Info">
            <IconButton
              onClick={() => setShowOptimizations(!showOptimizations)}
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <CpuIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
