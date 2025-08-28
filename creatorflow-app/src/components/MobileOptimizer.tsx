'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  LinearProgress
} from '@mui/material';
import { Smartphone, Activity } from 'lucide-react';

interface MobileCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  capabilities: string[];
}

interface ViewportInfo {
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  breakpoint: string;
}

interface PerformanceMetrics {
  imageOptimization: boolean;
  lazyLoading: boolean;
  codeSplitting: boolean;
  caching: boolean;
}

interface TouchOptimization {
  minSize: number;
  spacing: number;
  recommendations: string[];
}

interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: number;
  touchFriendly: boolean;
}

interface NetworkInfo {
  connectionType: string;
  bandwidth: number;
  latency: number;
  recommendations: string[];
}

interface MobileMetrics {
  viewport: {
    width: number;
    height: number;
    orientation: 'portrait' | 'landscape';
  };
  performance: {
    loadTime: number;
    renderTime: number;
    memoryUsage: number;
    batteryLevel: number;
  };
  interaction: {
    touchEvents: number;
    scrollEvents: number;
    gestureEvents: number;
    errors: number;
  };
  network: {
    connectionType: string;
    bandwidth: number;
    latency: number;
    offline: boolean;
  };
}

export default function MobileOptimizer() {
  const [capabilities, setCapabilities] = useState<MobileCapabilities | null>(null);
  const [viewport, setViewport] = useState<ViewportInfo | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [touch, setTouch] = useState<TouchOptimization | null>(null);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings | null>(null);
  const [network, setNetwork] = useState<NetworkInfo | null>(null);
  const [metrics, setMetrics] = useState<MobileMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMobileData();
    const interval = setInterval(fetchMobileData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMobileData = async () => {
    try {
      setLoading(true);
      
      const [
        capabilitiesRes,
        viewportRes,
        performanceRes,
        touchRes,
        accessibilityRes,
        networkRes,
        metricsRes
      ] = await Promise.all([
        fetch('/api/mobile/optimize?type=capabilities'),
        fetch('/api/mobile/optimize?type=viewport'),
        fetch('/api/mobile/optimize?type=performance'),
        fetch('/api/mobile/optimize?type=touch'),
        fetch('/api/mobile/optimize?type=accessibility'),
        fetch('/api/mobile/optimize?type=network'),
        fetch('/api/mobile/optimize?type=metrics'),
      ]);

      if (capabilitiesRes.ok) {
        const data = await capabilitiesRes.json();
        setCapabilities(data.capabilities);
      }

      if (viewportRes.ok) {
        const data = await viewportRes.json();
        setViewport(data.viewport);
      }

      if (performanceRes.ok) {
        const data = await performanceRes.json();
        setPerformance(data.performance);
      }

      if (touchRes.ok) {
        const data = await touchRes.json();
        setTouch(data.touch);
      }

      if (accessibilityRes.ok) {
        const data = await accessibilityRes.json();
        setAccessibility(data.accessibility);
      }

      if (networkRes.ok) {
        const data = await networkRes.json();
        setNetwork(data.network);
      }

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch mobile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDeviceIcon = () => {
    if (!capabilities) return <Smartphone className="h-6 w-6" />;
    if (capabilities.isTablet) return <Smartphone className="h-6 w-6" />;
    if (capabilities.isMobile) return <Smartphone className="h-6 w-6" />;
    return <Smartphone className="h-6 w-6" />;
  };

  const getConnectionIcon = () => {
    if (!network) return <Chip label="No Data" />;
    if (network.connectionType === '4g') return <Chip label="4G" color="success" />;
    if (network.connectionType === '3g') return <Chip label="3G" color="warning" />;
    if (network.connectionType === '2g') return <Chip label="2G" color="error" />;
    return <Chip label="Offline" color="default" />;
  };

  const getBatteryIcon = () => {
    if (!metrics) return <Chip label="No Data" />;
    const level = metrics.performance.batteryLevel;
    if (level > 80) return <Chip label={`${level}%`} color="success" />;
    if (level > 50) return <Chip label={`${level}%`} color="warning" />;
    return <Chip label={`${level}%`} color="error" />;
  };

  if (loading) return <Box sx={{ p: 4 }}>Loading mobile optimization data...</Box>;

  return (
    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Smartphone className="h-8 w-8" />
            Mobile Optimization
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>Real-time device detection and optimization</Typography>
        </Box>
        <Button onClick={fetchMobileData} variant="outlined">
          <Box sx={{ mr: 1 }}>
            <Activity className="h-4 w-4" />
          </Box>
          Refresh
        </Button>
      </Box>

      {/* Device Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Typography variant="subtitle2" component="div">Device Type</Typography>
              {getDeviceIcon()}
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {capabilities?.isMobile ? 'Mobile' : capabilities?.isTablet ? 'Tablet' : 'Desktop'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {capabilities?.capabilities.join(', ')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Typography variant="subtitle2" component="div">Viewport</Typography>
              <Chip label="Viewport" color="info" />
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {viewport?.width} × {viewport?.height}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {viewport?.orientation} • {viewport?.breakpoint}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Typography variant="subtitle2" component="div">Network</Typography>
              {getConnectionIcon()}
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {network?.connectionType.toUpperCase()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {network?.bandwidth} Mbps • {network?.latency}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardHeader sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
              <Typography variant="subtitle2" component="div">Battery</Typography>
              {getBatteryIcon()}
            </CardHeader>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                {metrics?.performance.batteryLevel || 100}%
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {metrics?.performance.memoryUsage ? `${Math.round(metrics.performance.memoryUsage / 1024 / 1024)}MB` : 'Unknown'} memory
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)} aria-label="mobile optimization tabs">
            <Tab label="Overview" />
            <Tab label="Performance" />
            <Tab label="Accessibility" />
            <Tab label="Network" />
            <Tab label="Metrics" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index="overview">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="subtitle2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Smartphone className="h-5 w-5" />
                    Touch Optimization
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Touch-friendly interface settings
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Minimum Touch Size</Typography>
                      <Chip label={touch?.minSize} variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Touch Spacing</Typography>
                      <Chip label={touch?.spacing} variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>Recommendations:</Typography>
                      <Box component="ul" sx={{ fontSize: '0.75rem', color: 'text.secondary', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {touch?.recommendations.map((rec, index) => (
                          <Box component="li" key={index}>• {rec}</Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader>
                  <Typography variant="subtitle2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label="Performance" color="info" />
                    Performance Optimizations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active performance optimizations
                  </Typography>
                </CardHeader>
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Image Optimization</Typography>
                      <Chip label={performance?.imageOptimization ? 'Enabled' : 'Disabled'} variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Lazy Loading</Typography>
                      <Chip label={performance?.lazyLoading ? 'Enabled' : 'Disabled'} variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Code Splitting</Typography>
                      <Chip label={performance?.codeSplitting ? 'Enabled' : 'Disabled'} variant="outlined" />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Caching</Typography>
                      <Chip label={performance?.caching ? 'Enabled' : 'Disabled'} variant="outlined" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index="performance">
          <Card>
            <CardHeader>
              <Typography variant="subtitle2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity className="h-5 w-5" />
                Performance Metrics
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time performance monitoring
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Load Time</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metrics?.performance.loadTime ? `${Math.round(metrics.performance.loadTime)}ms` : 'N/A'}
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min((metrics?.performance.loadTime || 0) / 3000 * 100, 100)} />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Render Time</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metrics?.performance.renderTime ? `${Math.round(metrics.performance.renderTime)}ms` : 'N/A'}
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min((metrics?.performance.renderTime || 0) / 1000 * 100, 100)} />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Memory Usage</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metrics?.performance.memoryUsage ? `${Math.round(metrics.performance.memoryUsage / 1024 / 1024)}MB` : 'N/A'}
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={Math.min((metrics?.performance.memoryUsage || 0) / (100 * 1024 * 1024) * 100, 100)} />
                </Box>

                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>Battery Level</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metrics?.performance.batteryLevel || 100}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={metrics?.performance.batteryLevel || 100} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="accessibility">
          <Card>
            <CardHeader>
              <Typography variant="subtitle2" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Accessibility" color="info" />
                Accessibility Settings
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile accessibility optimizations
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormControlLabel control={<Switch checked={accessibility?.highContrast} />} label="High Contrast" />
                    <Typography variant="body2" color="text.secondary">Enhanced color contrast for better visibility</Typography>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormControlLabel control={<Switch checked={accessibility?.reducedMotion} />} label="Reduced Motion" />
                    <Typography variant="body2" color="text.secondary">Minimize animations for motion sensitivity</Typography>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormControlLabel control={<Switch checked={accessibility?.touchFriendly} />} label="Touch Friendly" />
                    <Typography variant="body2" color="text.secondary">Optimize interface for touch interaction</Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="body2" fontWeight="medium">Font Size</Typography>
                  <div className="flex items-center gap-2 mt-2">
                    <Typography variant="body2" color="text.secondary">Small</Typography>
                    <LinearProgress variant="determinate" value={(accessibility?.fontSize || 16) / 24 * 100} />
                    <Typography variant="body2" color="text.secondary">Large</Typography>
                  </div>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Current: {accessibility?.fontSize}px
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="network">
          <Card>
            <CardHeader>
              <Typography variant="subtitle2" component="div" className="flex items-center gap-2">
                <Chip label="Network" color="info" />
                Network Optimization
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Network performance and recommendations
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="body2" fontWeight="medium">Connection Type</Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>{network?.connectionType.toUpperCase()}</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" fontWeight="medium">Bandwidth</Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>{network?.bandwidth} Mbps</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" fontWeight="medium">Latency</Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>{network?.latency}ms</Typography>
                  </div>
                  <div>
                    <Typography variant="body2" fontWeight="medium">Status</Typography>
                    <Typography variant="h6" sx={{ mt: 0.5 }}>
                      <Chip label={metrics?.network.offline ? 'Offline' : 'Online'} color={metrics?.network.offline ? 'error' : 'success'} />
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="body2" fontWeight="medium">Network Recommendations</Typography>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    {network?.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={activeTab} index="metrics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Typography variant="subtitle2" component="div" className="flex items-center gap-2">
                  <Chip label="Metrics" color="info" />
                  Interaction Metrics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User interaction tracking
                </Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Typography variant="body2">Touch Events</Typography>
                    <Typography variant="h6" fontWeight="semibold">{metrics?.interaction.touchEvents || 0}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2">Scroll Events</Typography>
                    <Typography variant="h6" fontWeight="semibold">{metrics?.interaction.scrollEvents || 0}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2">Gesture Events</Typography>
                    <Typography variant="h6" fontWeight="semibold">{metrics?.interaction.gestureEvents || 0}</Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography variant="body2">Errors</Typography>
                    <Typography variant="h6" color="error">{metrics?.interaction.errors || 0}</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="subtitle2" component="div" className="flex items-center gap-2">
                  <Chip label="Performance" color="info" />
                  Performance Score
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall mobile performance rating
                </Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <Typography variant="h4" fontWeight="bold" color="success">95</Typography>
                    <Typography variant="body2" color="text.secondary">Performance Score</Typography>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <Typography variant="body2">Load Speed</Typography>
                      <Typography variant="body2" color="success">Excellent</Typography>
                    </div>
                    <div className="flex justify-between text-sm">
                      <Typography variant="body2">Touch Response</Typography>
                      <Typography variant="body2" color="success">Excellent</Typography>
                    </div>
                    <div className="flex justify-between text-sm">
                      <Typography variant="body2">Battery Usage</Typography>
                      <Typography variant="body2" color="warning">Good</Typography>
                    </div>
                    <div className="flex justify-between text-sm">
                      <Typography variant="body2">Network</Typography>
                      <Typography variant="body2" color="success">Excellent</Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabPanel>
      </Tabs>
    </Box>
  );
}

function TabPanel(props: { children?: React.ReactNode; index: string; value: string }) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`mobile-optimization-tabpanel-${index}`}
      aria-labelledby={`mobile-optimization-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
} 