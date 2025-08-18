'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Typography
} from '@mui/material';
import { MessageSquare, Star, RefreshCw, Download, Filter, Users, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportData} variant="outlined" size="small">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <Typography variant="h6" className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="ui_ux">User Interface</SelectItem>
                  <SelectItem value="features">Features</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="campaign">Campaign Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Source</label>
              <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All sources</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">User Type</label>
              <Select value={filters.isTrialUser} onValueChange={(value) => setFilters(prev => ({ ...prev, isTrialUser: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All users</SelectItem>
                  <SelectItem value="true">Trial users only</SelectItem>
                  <SelectItem value="false">Paid users only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Total Feedback</Typography>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
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
            <Star className="h-4 w-4 text-muted-foreground" />
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
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
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
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Feedback</TabsTrigger>
          <TabsTrigger value="trial">Trial Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
                        <Badge className={getRatingColor(item.rating)}>
                          {item.rating}/5
                        </Badge>
                        {item.user.isTrialUser && (
                          <Badge variant="secondary">Trial</Badge>
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
        </TabsContent>

        <TabsContent value="trial" className="space-y-4">
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
                        <Badge className={getRatingColor(item.rating)}>
                          {item.rating}/5
                        </Badge>
                        <Badge variant="outline">{item.user.plan}</Badge>
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
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
                        <Badge variant="secondary">{item._count.rating}</Badge>
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
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
{/* Bottom Spacer to Clear Bottom Navigation */}
      <Box sx={{
        height: { xs: '120px', sm: '40px' },
        width: '100%'
      }} />
} 