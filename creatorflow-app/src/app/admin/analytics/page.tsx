'use client';

import React, { useEffect, useState } from 'react';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
  totalUsers: number;
  newUsersThisWeek: number;
  totalFeedback: number;
  newFeedbackThisWeek: number;
}

const RANGE_OPTIONS = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/analytics?range=${range}`);
        if (!res.ok) throw new Error('Failed to fetch analytics');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [range]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return <div className="p-8">No analytics data.</div>;

  // Prepare chart data
  const toChartData = (series: any[], labelKey = 'day', valueKey = 'count') =>
    series.map((d: any) => ({ label: d[labelKey]?.toString().slice(0, 10), value: Number(d[valueKey]) }));
  const toPieData = (series: any[], labelKey = 'platform', valueKey = 'count') =>
    series.map((d: any) => ({ label: d[labelKey], value: Number(d[valueKey]) }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Analytics</h1>
      <div className="mb-4 flex gap-2 items-center">
        <a href={`/api/admin/export?type=analytics&format=csv`} className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export CSV</a>
        <a href={`/api/admin/export?type=analytics&format=json`} className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export JSON</a>
        <span className="ml-4 text-xs font-medium">Range:</span>
        <select className="px-2 py-1 border rounded text-xs" value={range} onChange={e => setRange(e.target.value)}>
          {RANGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card><CardHeader><CardTitle>Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.totalUsers}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>New Users (7d)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.newUsersThisWeek}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Feedback</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.totalFeedback}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>New Feedback (7d)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.newFeedbackThisWeek}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Total Posts</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.totalPosts}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>New Posts (7d)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{data.newPostsThisWeek}</div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <AnalyticsChart title="User Signups" data={toChartData(data.userSeries)} type="line" loading={loading} />
        <AnalyticsChart title="Feedback Submitted" data={toChartData(data.feedbackSeries)} type="line" loading={loading} />
        <AnalyticsChart title="Posts Created" data={toChartData(data.postSeries)} type="line" loading={loading} />
        <AnalyticsChart title="Audience Growth (Followers)" data={data.audienceSeries?.map((d: any) => ({ label: d.date?.toString().slice(0, 10), value: d._sum.followers })) || []} type="line" loading={loading} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <AnalyticsChart title="Posts by Platform" data={toPieData(data.platformBreakdown)} type="pie" loading={loading} />
        <Card>
          <CardHeader><CardTitle>Top Users by Posts</CardTitle></CardHeader>
          <CardContent>
            <ol className="list-decimal ml-6 space-y-1">
              {data.topUsers.map((u: any) => (
                <li key={u.id}><span className="font-medium">{u.name || u.email || u.id}</span> <span className="text-xs text-gray-500">({u.posts.length} posts)</span></li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Top Users by Engagement</CardTitle></CardHeader>
          <CardContent>
            <ol className="list-decimal ml-6 space-y-1">
              {data.topEngagementUsers.map((u: any) => (
                <li key={u.id}><span className="font-medium">{u.name || u.email || u.id}</span> <span className="text-xs text-gray-500">({u.engagement} engagement)</span></li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 