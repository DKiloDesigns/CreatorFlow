/**
 * Dashboard Builder Component
 * Drag & drop dashboard builder with customizable widgets
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  Chip,
  Tooltip,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Dashboard as DashboardIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  TableChart as TableChartIcon,
  Speed as GaugeIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'gauge' | 'trend';
  title: string;
  description?: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
  refreshInterval?: number;
  filters?: Record<string, any>;
}

interface DashboardBuilderProps {
  dashboardId?: string;
  onSave?: (dashboard: any) => void;
  onCancel?: () => void;
}

export default function DashboardBuilder({ dashboardId, onSave, onCancel }: DashboardBuilderProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [showWidgetDialog, setShowWidgetDialog] = useState(false);
  const [editingWidget, setEditingWidget] = useState<DashboardWidget | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Available widget types
  const widgetTypes = [
    { type: 'metric', name: 'Metric Card', icon: <GaugeIcon />, description: 'Display key metrics' },
    { type: 'chart', name: 'Chart', icon: <BarChartIcon />, description: 'Bar, line, or pie charts' },
    { type: 'table', name: 'Data Table', icon: <TableChartIcon />, description: 'Tabular data display' },
    { type: 'gauge', name: 'Gauge', icon: <GaugeIcon />, description: 'Progress and gauge displays' },
    { type: 'trend', name: 'Trend Line', icon: <TrendingUpIcon />, description: 'Trend analysis charts' },
  ];

  useEffect(() => {
    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/dashboards/${dashboardId}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardName(data.dashboard.name);
        setDashboardDescription(data.dashboard.description);
        setWidgets(data.dashboard.widgets || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWidget = (type: string) => {
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      type: type as any,
      title: `New ${type} Widget`,
      description: '',
      config: getDefaultConfig(type),
      position: { x: 0, y: 0, w: 4, h: 3 },
      refreshInterval: 300, // 5 minutes
    };

    setEditingWidget(newWidget);
    setShowWidgetDialog(true);
  };

  const handleEditWidget = (widget: DashboardWidget) => {
    setEditingWidget(widget);
    setShowWidgetDialog(true);
  };

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const handleSaveWidget = (widget: DashboardWidget) => {
    if (editingWidget) {
      setWidgets(prev => prev.map(w => w.id === widget.id ? widget : w));
    } else {
      setWidgets(prev => [...prev, widget]);
    }
    setShowWidgetDialog(false);
    setEditingWidget(null);
  };

  const handleLayoutChange = (layout: any) => {
    setWidgets(prev => prev.map(widget => {
      const layoutItem = layout.find((l: any) => l.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        };
      }
      return widget;
    }));
  };

  const handleSaveDashboard = async () => {
    try {
      setLoading(true);
      
      const dashboardData = {
        name: dashboardName,
        description: dashboardDescription,
        widgets,
      };

      const response = await fetch(
        dashboardId ? `/api/analytics/dashboards/${dashboardId}` : '/api/analytics/dashboards',
        {
          method: dashboardId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dashboardData),
        }
      );

      const data = await response.json();
      
      if (data.success) {
        onSave?.(data.dashboard);
      }
    } catch (error) {
      console.error('Failed to save dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultConfig = (type: string): any => {
    switch (type) {
      case 'metric':
        return {
          metric: 'totalEngagement',
          format: 'number',
          prefix: '',
          suffix: '',
          color: 'primary',
        };
      case 'chart':
        return {
          chartType: 'bar',
          dataSource: 'platformMetrics',
          xAxis: 'platform',
          yAxis: 'engagement',
          colors: ['#1976d2', '#dc004e', '#9c27b0', '#2e7d32'],
        };
      case 'table':
        return {
          dataSource: 'contentPerformance',
          columns: ['content', 'platforms', 'engagement', 'reach'],
          pageSize: 10,
          sortBy: 'engagement',
          sortOrder: 'desc',
        };
      case 'gauge':
        return {
          metric: 'engagementRate',
          min: 0,
          max: 100,
          format: 'percentage',
          color: 'success',
        };
      case 'trend':
        return {
          metric: 'engagement',
          period: 'week',
          chartType: 'line',
          showTrend: true,
        };
      default:
        return {};
    }
  };

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget widget={widget} />;
      case 'chart':
        return <ChartWidget widget={widget} />;
      case 'table':
        return <TableWidget widget={widget} />;
      case 'gauge':
        return <GaugeWidget widget={widget} />;
      case 'trend':
        return <TrendWidget widget={widget} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
          Loading dashboard builder...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {dashboardId ? 'Edit Dashboard' : 'Create Dashboard'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveDashboard}
            disabled={!dashboardName.trim()}
          >
            Save Dashboard
          </Button>
        </Box>
      </Box>

      {/* Dashboard Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Dashboard Name"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={dashboardDescription}
                onChange={(e) => setDashboardDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Widget Palette */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Widgets
          </Typography>
          <Grid container spacing={2}>
            {widgetTypes.map((widgetType) => (
              <Grid item xs={12} sm={6} md={4} key={widgetType.type}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                  onClick={() => handleAddWidget(widgetType.type)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {widgetType.icon}
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>
                      {widgetType.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {widgetType.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Dashboard Grid */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Dashboard Layout
          </Typography>
          
          {widgets.length === 0 ? (
            <Alert severity="info">
              No widgets added yet. Click on a widget type above to add your first widget.
            </Alert>
          ) : (
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: widgets.map(w => ({
                i: w.id,
                x: w.position.x,
                y: w.position.y,
                w: w.position.w,
                h: w.position.h,
              })) }}
              onLayoutChange={handleLayoutChange}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={60}
              isDraggable
              isResizable
            >
              {widgets.map(widget => (
                <div key={widget.id}>
                  <Card sx={{ height: '100%', position: 'relative' }}>
                    <CardContent sx={{ height: '100%', p: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" noWrap>
                          {widget.title}
                        </Typography>
                        <Box>
                          <Tooltip title="Edit Widget">
                            <IconButton
                              size="small"
                              onClick={() => handleEditWidget(widget)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Widget">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteWidget(widget.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box sx={{ height: 'calc(100% - 40px)', overflow: 'hidden' }}>
                        {renderWidget(widget)}
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </ResponsiveGridLayout>
          )}
        </CardContent>
      </Card>

      {/* Widget Configuration Dialog */}
      <WidgetConfigDialog
        open={showWidgetDialog}
        onClose={() => {
          setShowWidgetDialog(false);
          setEditingWidget(null);
        }}
        widget={editingWidget}
        onSave={handleSaveWidget}
      />
    </Box>
  );
}

// Widget Components
function MetricWidget({ widget }: { widget: DashboardWidget }) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setValue(Math.floor(Math.random() * 1000));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [widget.config.metric]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h3" color="primary">
        {widget.config.prefix}{value.toLocaleString()}{widget.config.suffix}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {widget.title}
      </Typography>
    </Box>
  );
}

function ChartWidget({ widget }: { widget: DashboardWidget }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData([
        { platform: 'Instagram', engagement: 150 },
        { platform: 'Twitter', engagement: 120 },
        { platform: 'LinkedIn', engagement: 80 },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [widget.config.dataSource]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {widget.title}
      </Typography>
      <Box sx={{ height: 200, display: 'flex', alignItems: 'end', gap: 1 }}>
        {data.map((item, index) => (
          <Box
            key={item.platform}
            sx={{
              flex: 1,
              backgroundColor: widget.config.colors?.[index] || '#1976d2',
              height: `${(item.engagement / 150) * 100}%`,
              minHeight: 20,
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: 'white', mb: 0.5 }}>
              {item.engagement}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function TableWidget({ widget }: { widget: DashboardWidget }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData([
        { content: 'Post 1', platforms: 'Instagram', engagement: 150, reach: 1000 },
        { content: 'Post 2', platforms: 'Twitter', engagement: 120, reach: 800 },
        { content: 'Post 3', platforms: 'LinkedIn', engagement: 80, reach: 600 },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [widget.config.dataSource]);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {widget.title}
      </Typography>
      <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
        {data.map((row, index) => (
          <Box key={index} sx={{ display: 'flex', p: 0.5, borderBottom: '1px solid #eee' }}>
            <Typography variant="caption" sx={{ flex: 1 }}>
              {row.content}
            </Typography>
            <Typography variant="caption" sx={{ flex: 1 }}>
              {row.platforms}
            </Typography>
            <Typography variant="caption" sx={{ flex: 1 }}>
              {row.engagement}
            </Typography>
            <Typography variant="caption" sx={{ flex: 1 }}>
              {row.reach}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function GaugeWidget({ widget }: { widget: DashboardWidget }) {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setValue(Math.floor(Math.random() * 100));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [widget.config.metric]);

  if (loading) {
    return <LinearProgress />;
  }

  const percentage = (value / 100) * 100;

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          position: 'relative',
          mx: 'auto',
          mb: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(#1976d2 ${percentage * 3.6}deg, #f0f0f0 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {value}%
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary">
        {widget.title}
      </Typography>
    </Box>
  );
}

function TrendWidget({ widget }: { widget: DashboardWidget }) {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData([10, 15, 12, 18, 22, 25, 20]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [widget.config.metric]);

  if (loading) {
    return <LinearProgress />;
  }

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {widget.title}
      </Typography>
      <Box sx={{ height: 100, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 100">
          <polyline
            fill="none"
            stroke="#1976d2"
            strokeWidth="2"
            points={data.map((value, index) => {
              const x = (index / (data.length - 1)) * 200;
              const y = 100 - ((value - minValue) / range) * 100;
              return `${x},${y}`;
            }).join(' ')}
          />
        </svg>
      </Box>
    </Box>
  );
}

// Widget Configuration Dialog
interface WidgetConfigDialogProps {
  open: boolean;
  onClose: () => void;
  widget: DashboardWidget | null;
  onSave: (widget: DashboardWidget) => void;
}

function WidgetConfigDialog({ open, onClose, widget, onSave }: WidgetConfigDialogProps) {
  const [formData, setFormData] = useState<DashboardWidget | null>(null);

  useEffect(() => {
    if (widget) {
      setFormData({ ...widget });
    } else {
      setFormData(null);
    }
  }, [widget]);

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {widget ? 'Edit Widget' : 'Add Widget'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Widget Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => prev ? { ...prev, title: e.target.value } : null)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => prev ? { ...prev, description: e.target.value } : null)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Data Source</InputLabel>
              <Select
                value={formData.config.dataSource || 'platformMetrics'}
                onChange={(e) => setFormData(prev => prev ? { 
                  ...prev, 
                  config: { ...prev.config, dataSource: e.target.value }
                } : null)}
              >
                <MenuItem value="platformMetrics">Platform Metrics</MenuItem>
                <MenuItem value="contentPerformance">Content Performance</MenuItem>
                <MenuItem value="engagementTrends">Engagement Trends</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Refresh Interval (seconds)"
              type="number"
              value={formData.refreshInterval || 300}
              onChange={(e) => setFormData(prev => prev ? { 
                ...prev, 
                refreshInterval: parseInt(e.target.value) 
              } : null)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {widget ? 'Update' : 'Add'} Widget
        </Button>
      </DialogActions>
    </Dialog>
  );
}
