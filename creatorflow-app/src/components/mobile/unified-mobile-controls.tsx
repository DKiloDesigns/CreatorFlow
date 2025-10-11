'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Tooltip,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  BatteryFull as BatteryIcon,
  BatteryAlert as BatteryLowIcon,
  ExpandMore as ChevronDownIcon,
  ExpandLess as ChevronUpIcon,
  Smartphone as SmartphoneIcon,
  TouchApp as HandIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface PerformanceMetrics {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  batteryLevel?: number;
  batteryCharging?: boolean;
}

interface UnifiedMobileControlsProps {
  onConnectionChange?: (type: string) => void;
  onBatteryChange?: (level: number) => void;
}

export function UnifiedMobileControls({ 
  onConnectionChange, 
  onBatteryChange 
}: UnifiedMobileControlsProps) {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    effectiveType: '4g',
    downlink: 1.75,
    rtt: 50,
    saveData: false,
    batteryLevel: 100,
    batteryCharging: false,
  });
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined' && 'connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        const updateConnection = () => {
          setPerformanceMetrics(prev => ({
            ...prev,
            effectiveType: connection.effectiveType || '4g',
            downlink: connection.downlink || 1.75,
            rtt: connection.rtt || 50,
            saveData: connection.saveData || false,
          }));
          
          if (onConnectionChange) {
            onConnectionChange(connection.effectiveType || '4g');
          }
        };

        updateConnection();
        connection.addEventListener('change', updateConnection);
        
        return () => connection.removeEventListener('change', updateConnection);
      }
    }

    // Battery API
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setPerformanceMetrics(prev => ({
            ...prev,
            batteryLevel: Math.round(battery.level * 100),
            batteryCharging: battery.charging,
          }));
          
          if (onBatteryChange) {
            onBatteryChange(Math.round(battery.level * 100));
          }
        };

        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }
  }, [onConnectionChange, onBatteryChange]);

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

  const getBatteryIcon = useCallback(() => {
    const level = performanceMetrics.batteryLevel || 0;
    if (level < 25) return <BatteryLowIcon />;
    return <BatteryIcon />;
  }, [performanceMetrics.batteryLevel]);

  const getConnectionColor = useCallback(() => {
    switch (performanceMetrics.effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'error';
      case '3g':
        return 'warning';
      case '4g':
      case '5g':
        return 'success';
      default:
        return 'default';
    }
  }, [performanceMetrics.effectiveType]);

  const getBatteryColor = useCallback(() => {
    const level = performanceMetrics.batteryLevel || 0;
    if (level < 25) return 'error';
    if (level < 50) return 'warning';
    return 'success';
  }, [performanceMetrics.batteryLevel]);

  if (!isClient || !isMobile) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80, // Move to bottom right, above bottom nav
        right: 16,
        zIndex: 1200,
      }}
    >
      <Card
        sx={{
          minWidth: 200,
          maxWidth: 300,
          boxShadow: theme.shadows[4],
          borderRadius: 2,
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          {/* Header with expand/collapse */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: isExpanded ? 1 : 0,
              cursor: 'pointer',
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartphoneIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight="medium">
                Mobile Controls
              </Typography>
              <Badge
                badgeContent={3}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.6rem',
                    height: 16,
                    minWidth: 16,
                  },
                }}
              />
            </Box>
            <IconButton size="small" sx={{ p: 0.5 }}>
              {isExpanded ? <ChevronUpIcon sx={{ fontSize: 16 }} /> : <ChevronDownIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Box>

          {/* Collapsible Content */}
          <Collapse in={isExpanded}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Connection Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={`Connection: ${performanceMetrics.effectiveType} (${performanceMetrics.downlink}Mbps)`}>
                  <Chip
                    icon={getConnectionIcon()}
                    label={performanceMetrics.effectiveType}
                    size="small"
                    color={getConnectionColor() as any}
                    variant="filled"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Tooltip>
              </Box>

              {/* Battery Status */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title={`Battery: ${performanceMetrics.batteryLevel}%${performanceMetrics.batteryCharging ? ' (Charging)' : ''}`}>
                  <Chip
                    icon={getBatteryIcon()}
                    label={`${performanceMetrics.batteryLevel}%`}
                    size="small"
                    color={getBatteryColor() as any}
                    variant="filled"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Tooltip>
              </Box>

              {/* Touch Gestures Indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title="Touch gestures enabled - swipe, pull-to-refresh, and more">
                  <Chip
                    icon={<HandIcon sx={{ fontSize: 14 }} />}
                    label="Touch Gestures"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem' }}
                  />
                </Tooltip>
              </Box>

              {/* Performance Info */}
              <Box sx={{ mt: 1, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  RTT: {performanceMetrics.rtt}ms
                  {performanceMetrics.saveData && ' • Data Saver'}
                </Typography>
              </Box>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
}
