'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { ChatBubbleOutline as ChatBubbleOutlineIcon, Star as StarIcon, Refresh as RefreshIcon, Download as DownloadIcon, FilterList as FilterListIcon, People as PeopleIcon, BarChart as BarChartIcon } from '@mui/icons-material';


interface FeedbackData {
  feedback: Array<{
    id: string;
    category: string;
    rating: number;
    feedback: string;
    feature: string | null;
    source: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      isTrialUser: boolean;
      promoCodeUsed: string | null;
      plan: string;
    };
  }>;
  analytics: {
    byRating: Array<{
      category: string;
      rating: number;
      _count: { rating: number };
    }>;
    avgRatings: Array<{
      category: string;
      _avg: { rating: number | null };
      _count: { rating: number };
    }>;
    total: number;
  };
}

export default function FeedbackDashboard() {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    source: '',
    isTrialUser: '',
  });
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchFeedbackData();
  }, [filters]);

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.source) params.append('source', filters.source);
      if (filters.isTrialUser) params.append('isTrialUser', filters.isTrialUser);

      const response = await fetch(`/api/feedback?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch feedback data');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchFeedbackData();
    setRefreshing(false);
  };

  const exportData = () => {
    if (!data) return;
    
    const csvData = [
      ['Date', 'User', 'Category', 'Rating', 'Feature', 'Feedback', 'Trial User', 'Plan'],
      ...data.feedback.map(f => [
        new Date(f.createdAt).toLocaleDateString(),
        f.user.name || f.user.email,
        f.category,
        f.rating,
        f.feature || '',
        f.feedback.replace(/"/g, '""'),
        f.user.isTrialUser ? 'Yes' : 'No',
        f.user.plan,
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating >= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      general: 'General Feedback',
      ui_ux: 'User Interface',
      features: 'Features',
      performance: 'Performance',
      pricing: 'Pricing',
      support: 'Support',
      campaign: 'Campaign Experience',
    };
    return labels[category] || category;
  };

  if (loading) return <div className="p-8">Loading feedback data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No feedback data available.</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Feedback Dashboard</h1>
          <p className="text-muted-foreground">Analyze user feedback and insights</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} disabled={refreshing} variant="outlined" size="small">
            <RefreshIcon sx={{ width: 16, height: 16 }} className={`${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportData} variant="outlined" size="small">
            <DownloadIcon sx={{ width: 16, height: 16 }} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <Typography variant="h6" className="flex items-center gap-2">
            <FilterListIcon sx={{ width: 20, height: 20 }} />
            Filters
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}>
                  <MenuItem value="">All categories</MenuItem>
                  <MenuItem value="general">General Feedback</MenuItem>
                  <MenuItem value="ui_ux">User Interface</MenuItem>
                  <MenuItem value="features">Features</MenuItem>
                  <MenuItem value="performance">Performance</MenuItem>
                  <MenuItem value="pricing">Pricing</MenuItem>
                  <MenuItem value="support">Support</MenuItem>
                  <MenuItem value="campaign">Campaign Experience</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <label className="text-sm font-medium">Source</label>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select value={filters.source} onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}>
                  <MenuItem value="">All sources</MenuItem>
                  <MenuItem value="web">Web</MenuItem>
                  <MenuItem value="mobile">Mobile</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <label className="text-sm font-medium">User Type</label>
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select value={filters.isTrialUser} onChange={(e) => setFilters(prev => ({ ...prev, isTrialUser: e.target.value }))}>
                  <MenuItem value="">All users</MenuItem>
                  <MenuItem value="true">Trial users only</MenuItem>
                  <MenuItem value="false">Paid users only</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Total Feedback</Typography>
            <ChatBubbleOutlineIcon sx={{ width: 16, height: 16 }} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.analytics.total}</div>
            <p className="text-xs text-muted-foreground">
              All time feedback submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Average Rating</Typography>
            <StarIcon sx={{ width: 16, height: 16 }} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(data.analytics.avgRatings.reduce((sum, item) => sum + (item._avg.rating || 0), 0) / data.analytics.avgRatings.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5 stars
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Trial Users</Typography>
            <PeopleIcon sx={{ width: 16, height: 16 }} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.feedback.filter(f => f.user.isTrialUser).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Trial user feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Top Category</Typography>
            <BarChartIcon sx={{ width: 16, height: 16 }} className="text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.analytics.avgRatings.length > 0 
                ? getCategoryLabel(data.analytics.avgRatings[0].category)
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Most feedback category
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Feedback */}
      <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)} sx={{ mb: 3 }}>
        <Tab label="All Feedback" value="all" />
        <Tab label="Trial Users" value="trial" />
        <Tab label="Analytics" value="analytics" />
      </Tabs>

        {activeTab === 'all' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Recent Feedback</Typography>
                              <Typography variant="body2" color="text.secondary">Latest user feedback submissions</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.feedback.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{item.user.name || item.user.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()} • {getCategoryLabel(item.category)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip 
                          label={`${item.rating}/5`}
                          color={item.rating >= 4 ? "success" : item.rating >= 3 ? "warning" : "error"}
                          size="small"
                        />
                        {item.user.isTrialUser && (
                          <Chip label="Trial" variant="outlined" size="small" />
                        )}
                      </div>
                    </div>
                    {item.feature && (
                      <div className="text-sm">
                        <span className="font-medium">Feature:</span> {item.feature}
                      </div>
                    )}
                    <div className="text-sm">{item.feedback}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 'trial' && (
          <Box sx={{ mt: 3 }}>
          <Card>
            <CardHeader>
              <Typography variant="h6">Trial User Feedback</Typography>
                              <Typography variant="body2" color="text.secondary">Feedback from EARLYBIRD100 campaign users</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.feedback.filter(f => f.user.isTrialUser).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{item.user.name || item.user.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()} • {getCategoryLabel(item.category)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip 
                          label={`${item.rating}/5`}
                          color={item.rating >= 4 ? "success" : item.rating >= 3 ? "warning" : "error"}
                          size="small"
                        />
                        <Chip label={item.user.plan} variant="outlined" size="small" />
                      </div>
                    </div>
                    {item.feature && (
                      <div className="text-sm">
                        <span className="font-medium">Feature:</span> {item.feature}
                      </div>
                    )}
                    <div className="text-sm">{item.feedback}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </Box>
        )}

        {activeTab === 'analytics' && (
          <Box sx={{ mt: 3 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Typography variant="h6">Average Ratings by Category</Typography>
                <Typography variant="body2" color="text.secondary">User satisfaction across different areas</Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.analytics.avgRatings.map((item) => (
                    <div key={item.category} className="flex justify-between items-center">
                      <span className="text-sm">{getCategoryLabel(item.category)}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {item._avg.rating ? item._avg.rating.toFixed(1) : 'N/A'}
                        </span>
                        <Chip label={item._count.rating.toString()} variant="outlined" size="small" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6">Rating Distribution</Typography>
                <Typography variant="body2" color="text.secondary">How users are rating their experience</Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = data.analytics.byRating
                      .filter(item => item.rating === rating)
                      .reduce((sum, item) => sum + item._count.rating, 0);
                    const percentage = data.analytics.total > 0 ? (count / data.analytics.total * 100).toFixed(1) : '0';
                    
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-8">
                          <span className="text-sm">{rating}</span>
                          <StarIcon sx={{ width: 12, height: 12 }} className="fill-current text-yellow-500" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          </Box>
        )}
    </div>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 