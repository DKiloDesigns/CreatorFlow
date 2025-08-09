'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Button,
  Typography,
  Tabs
} from '@mui/material';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface CampaignData {
  campaign: {
    totalUses: number;
    maxUses: number;
    remainingUses: number;
    usagePercentage: string;
    isActive: boolean;
    validFrom: string;
    validUntil: string;
  };
  trialUsers: {
    total: number;
    active: number;
    expired: number;
    list: any[];
  };
  conversions: {
    total: number;
    rate: string;
    list: any[];
  };
  trends: {
    dailySignups: any[];
    platformUsage: any[];
    trialUserPosts: number;
    monthlyRevenue: any[];
  };
  lastUpdated: string;
}

export default function CampaignDashboard() {
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCampaignData();
  }, [timeRange]);

  const fetchCampaignData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/campaign-analytics?range=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch campaign data');
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchCampaignData();
    setRefreshing(false);
  };

  const exportData = () => {
    if (!data) return;
    
    const csvData = [
      ['Metric', 'Value'],
      ['Total Uses', data.campaign.totalUses],
      ['Max Uses', data.campaign.maxUses],
      ['Remaining Uses', data.campaign.remainingUses],
      ['Usage Percentage', data.campaign.usagePercentage + '%'],
      ['Active Trial Users', data.trialUsers.active],
      ['Expired Trial Users', data.trialUsers.expired],
      ['Conversions', data.conversions.total],
      ['Conversion Rate', data.conversions.rate + '%'],
      ['Trial User Posts', data.trends.trialUserPosts],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) return <div className="p-8">Loading campaign data...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No campaign data available.</div>;

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">EARLYBIRD100 Campaign Dashboard</h1>
          <p className="text-muted-foreground">Marketing campaign performance for Renee</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={refreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Campaign Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Campaign Usage</Typography>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.campaign.totalUses}/{data.campaign.maxUses}</div>
            <p className="text-xs text-muted-foreground">
              {data.campaign.usagePercentage}% used
            </p>
            <div className="mt-2">
              <Badge variant={data.campaign.isActive ? "default" : "secondary"}>
                {data.campaign.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Trial Users</Typography>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trialUsers.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.trialUsers.active} active, {data.trialUsers.expired} expired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">Conversions</Typography>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.conversions.total}</div>
            <p className="text-xs text-muted-foreground">
              {data.conversions.rate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Typography variant="h6" className="text-sm font-medium">User Engagement</Typography>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trends.trialUserPosts}</div>
            <p className="text-xs text-muted-foreground">
              Posts created by trial users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Trial Users</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Typography variant="h6">Campaign Status</Typography>
                <Typography variant="body2" color="text.secondary">EARLYBIRD100 campaign details</Typography>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Valid From:</span>
                  <span>{new Date(data.campaign.validFrom).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Valid Until:</span>
                  <span>{data.campaign.validUntil ? new Date(data.campaign.validUntil).toLocaleDateString() : 'No expiry'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Uses:</span>
                  <span>{data.campaign.remainingUses}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${data.campaign.usagePercentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6">Platform Usage</Typography>
                <Typography variant="body2" color="text.secondary">Social accounts connected by trial users</Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.trends.platformUsage.map((platform: any) => (
                    <div key={platform.platform} className="flex justify-between">
                      <span className="capitalize">{platform.platform}</span>
                      <Badge variant="secondary">{platform._count.platform}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6">Trial Users ({data.trialUsers.total})</Typography>
                              <Typography variant="body2" color="text.secondary">Users who signed up with EARLYBIRD100</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.trialUsers.list.map((user: any) => (
                  <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{user.name || user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        Started: {new Date(user.trialStartDate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={user.trialEndDate && new Date() < user.trialEndDate ? "default" : "secondary"}>
                      {user.trialEndDate && new Date() < user.trialEndDate ? "Active" : "Expired"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <Typography variant="h6">Converted Users ({data.conversions.total})</Typography>
                              <Typography variant="body2" color="text.secondary">Users who upgraded from trial to paid</Typography>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.conversions.list.map((user: any) => (
                  <div key={user.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{user.name || user.email}</div>
                      <div className="text-sm text-muted-foreground">
                        Plan: {user.plan}
                      </div>
                    </div>
                    <Badge variant="default">{user.plan}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Typography variant="h6">Daily Signups</Typography>
                <Typography variant="body2" color="text.secondary">New trial users per day</Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.trends.dailySignups.map((day: any) => (
                    <div key={day.date} className="flex justify-between">
                      <span>{new Date(day.date).toLocaleDateString()}</span>
                      <Badge variant="secondary">{day.signups}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography variant="h6">Monthly Revenue</Typography>
                <Typography variant="body2" color="text.secondary">Estimated revenue from conversions</Typography>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.trends.monthlyRevenue.map((month: any) => (
                    <div key={month.month} className="flex justify-between">
                      <span>{new Date(month.month).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      <div className="text-right">
                        <div className="font-medium">${month.estimated_revenue}</div>
                        <div className="text-xs text-muted-foreground">{month.conversions} conversions</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground text-center">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
} 