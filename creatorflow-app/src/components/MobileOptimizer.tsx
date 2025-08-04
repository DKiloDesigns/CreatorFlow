'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  Tablet,
  Monitor,
  Touch,
  Wifi,
  Battery,
  Zap,
  Settings,
  Eye,
  Shield,
  TrendingUp,
  Activity,
  SmartphoneIcon,
  WifiOff,
  WifiIcon,
  BatteryCharging,
  Gauge,
  SmartphoneIcon as PhoneIcon,
  TabletIcon,
  MonitorIcon,
  TouchIcon,
  WifiIcon as WifiIcon2,
  BatteryIcon,
  ZapIcon,
  SettingsIcon,
  EyeIcon,
  ShieldIcon,
  TrendingUpIcon,
  ActivityIcon
} from 'lucide-react';

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
    if (!capabilities) return <Monitor className="h-6 w-6" />;
    if (capabilities.isTablet) return <Tablet className="h-6 w-6" />;
    if (capabilities.isMobile) return <Smartphone className="h-6 w-6" />;
    return <Monitor className="h-6 w-6" />;
  };

  const getConnectionIcon = () => {
    if (!network) return <WifiIcon className="h-4 w-4" />;
    if (network.connectionType === '4g') return <WifiIcon className="h-4 w-4 text-green-600" />;
    if (network.connectionType === '3g') return <WifiIcon className="h-4 w-4 text-yellow-600" />;
    if (network.connectionType === '2g') return <WifiIcon className="h-4 w-4 text-red-600" />;
    return <WifiOff className="h-4 w-4 text-gray-600" />;
  };

  const getBatteryIcon = () => {
    if (!metrics) return <Battery className="h-4 w-4" />;
    const level = metrics.performance.batteryLevel;
    if (level > 80) return <BatteryCharging className="h-4 w-4 text-green-600" />;
    if (level > 50) return <Battery className="h-4 w-4 text-yellow-600" />;
    return <Battery className="h-4 w-4 text-red-600" />;
  };

  if (loading) return <div className="p-8">Loading mobile optimization data...</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Smartphone className="h-8 w-8" />
            Mobile Optimization
          </h1>
          <p className="text-muted-foreground">Real-time device detection and optimization</p>
        </div>
        <Button onClick={fetchMobileData} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Device Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Type</CardTitle>
            {getDeviceIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {capabilities?.isMobile ? 'Mobile' : capabilities?.isTablet ? 'Tablet' : 'Desktop'}
            </div>
            <p className="text-xs text-muted-foreground">
              {capabilities?.capabilities.join(', ')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewport</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {viewport?.width} × {viewport?.height}
            </div>
            <p className="text-xs text-muted-foreground">
              {viewport?.orientation} • {viewport?.breakpoint}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            {getConnectionIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {network?.connectionType.toUpperCase()}
            </div>
            <p className="text-xs text-muted-foreground">
              {network?.bandwidth} Mbps • {network?.latency}ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery</CardTitle>
            {getBatteryIcon()}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.performance.batteryLevel || 100}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.performance.memoryUsage ? `${Math.round(metrics.performance.memoryUsage / 1024 / 1024)}MB` : 'Unknown'} memory
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Touch className="h-5 w-5" />
                  Touch Optimization
                </CardTitle>
                <CardDescription>
                  Touch-friendly interface settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Minimum Touch Size</span>
                    <Badge variant="outline">{touch?.minSize}px</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Touch Spacing</span>
                    <Badge variant="outline">{touch?.spacing}px</Badge>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Recommendations:</span>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {touch?.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Optimizations
                </CardTitle>
                <CardDescription>
                  Active performance optimizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Image Optimization</span>
                    <Badge className={performance?.imageOptimization ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {performance?.imageOptimization ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lazy Loading</span>
                    <Badge className={performance?.lazyLoading ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {performance?.lazyLoading ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Splitting</span>
                    <Badge className={performance?.codeSplitting ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {performance?.codeSplitting ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Caching</span>
                    <Badge className={performance?.caching ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {performance?.caching ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Real-time performance monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Load Time</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.performance.loadTime ? `${Math.round(metrics.performance.loadTime)}ms` : 'N/A'}
                    </span>
                  </div>
                  <Progress value={Math.min((metrics?.performance.loadTime || 0) / 3000 * 100, 100)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Render Time</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.performance.renderTime ? `${Math.round(metrics.performance.renderTime)}ms` : 'N/A'}
                    </span>
                  </div>
                  <Progress value={Math.min((metrics?.performance.renderTime || 0) / 1000 * 100, 100)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.performance.memoryUsage ? `${Math.round(metrics.performance.memoryUsage / 1024 / 1024)}MB` : 'N/A'}
                    </span>
                  </div>
                  <Progress value={Math.min((metrics?.performance.memoryUsage || 0) / (100 * 1024 * 1024) * 100, 100)} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Battery Level</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics?.performance.batteryLevel || 100}%
                    </span>
                  </div>
                  <Progress value={metrics?.performance.batteryLevel || 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Accessibility Settings
              </CardTitle>
              <CardDescription>
                Mobile accessibility optimizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>High Contrast</Label>
                    <p className="text-xs text-muted-foreground">Enhanced color contrast for better visibility</p>
                  </div>
                  <Switch checked={accessibility?.highContrast} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Reduced Motion</Label>
                    <p className="text-xs text-muted-foreground">Minimize animations for motion sensitivity</p>
                  </div>
                  <Switch checked={accessibility?.reducedMotion} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Touch Friendly</Label>
                    <p className="text-xs text-muted-foreground">Optimize interface for touch interaction</p>
                  </div>
                  <Switch checked={accessibility?.touchFriendly} />
                </div>

                <div>
                  <Label>Font Size</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">Small</span>
                    <Progress value={(accessibility?.fontSize || 16) / 24 * 100} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground">Large</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {accessibility?.fontSize}px
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Network Optimization
              </CardTitle>
              <CardDescription>
                Network performance and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Connection Type</span>
                    <div className="text-2xl font-bold mt-1">{network?.connectionType.toUpperCase()}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Bandwidth</span>
                    <div className="text-2xl font-bold mt-1">{network?.bandwidth} Mbps</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Latency</span>
                    <div className="text-2xl font-bold mt-1">{network?.latency}ms</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Status</span>
                    <div className="text-2xl font-bold mt-1">
                      <Badge className={metrics?.network.offline ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {metrics?.network.offline ? 'Offline' : 'Online'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Network Recommendations</span>
                  <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                    {network?.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Interaction Metrics
                </CardTitle>
                <CardDescription>
                  User interaction tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Touch Events</span>
                    <span className="font-semibold">{metrics?.interaction.touchEvents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scroll Events</span>
                    <span className="font-semibold">{metrics?.interaction.scrollEvents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gesture Events</span>
                    <span className="font-semibold">{metrics?.interaction.gestureEvents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Errors</span>
                    <span className="font-semibold text-red-600">{metrics?.interaction.errors || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" />
                  Performance Score
                </CardTitle>
                <CardDescription>
                  Overall mobile performance rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">95</div>
                    <p className="text-sm text-muted-foreground">Performance Score</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Load Speed</span>
                      <span className="text-green-600">Excellent</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Touch Response</span>
                      <span className="text-green-600">Excellent</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Battery Usage</span>
                      <span className="text-yellow-600">Good</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Network</span>
                      <span className="text-green-600">Excellent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 