/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from 'react';
// Use a different approach for data fetching
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Loader2 } from 'lucide-react';

// If process.env.NEXT_PUBLIC_MOCK_ANALYTICS is set, use mock analytics data (append ?mock=1 to API requests)
const useMockAnalytics = process.env.NEXT_PUBLIC_MOCK_ANALYTICS === '1';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="bg-white rounded shadow p-4 min-h-[100px]">{children}</div>
    </div>
  );
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

// Add safe number and string helpers
function safeNumber(val: any, digits: number = 0, fallback: string = '-') {
  if (typeof val === 'number' && !isNaN(val)) {
    return digits > 0 ? val.toFixed(digits) : val;
  }
  return fallback;
}
function safeString(val: any, fallback: string = '-') {
  return typeof val === 'string' && val.length > 0 ? val : fallback;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [growthData, setGrowthData] = useState<any>(null);
  const [growthError, setGrowthError] = useState<any>(null);
  const [growthLoading, setGrowthLoading] = useState<boolean>(true);
  
  const [topPosts, setTopPosts] = useState<any>(null);
  const [topPostsError, setTopPostsError] = useState<any>(null);
  const [topPostsLoading, setTopPostsLoading] = useState<boolean>(true);
  
  const [platformData, setPlatformData] = useState<any>(null);
  const [platformError, setPlatformError] = useState<any>(null);
  const [platformLoading, setPlatformLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const overview = await fetcher(`/api/analytics/overview${useMockAnalytics ? '?mock=1' : ''}`);
        setData(overview);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
      
      try {
        const growth = await fetcher(`/api/analytics/growth${useMockAnalytics ? '?mock=1' : ''}`);
        setGrowthData(growth);
      } catch (err) {
        setGrowthError(err);
      } finally {
        setGrowthLoading(false);
      }
      
      try {
        const posts = await fetcher(`/api/analytics/top-posts${useMockAnalytics ? '?mock=1' : ''}`);
        setTopPosts(posts);
      } catch (err) {
        setTopPostsError(err);
      } finally {
        setTopPostsLoading(false);
      }
      
      try {
        const platform = await fetcher(`/api/analytics/platform-breakdown${useMockAnalytics ? '?mock=1' : ''}`);
        setPlatformData(platform);
      } catch (err) {
        setPlatformError(err);
      } finally {
        setPlatformLoading(false);
      }
    };
    
    fetchData();
  }, []);
  const [ariaMessage, setAriaMessage] = React.useState('');

  React.useEffect(() => {
    if (error) setAriaMessage('Error loading analytics data.');
    else if (growthError) setAriaMessage('Error loading growth data.');
    else if (platformError) setAriaMessage('Error loading platform breakdown.');
    else setAriaMessage('');
  }, [error, growthError, platformError]);

  return (
    <TooltipProvider>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Analytics</h1>
        <h2 className="sr-only" id="analytics-dashboard-heading">Analytics Dashboard</h2>
        <Section title="Overview">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading overview...</span>
            </div>
          ) : error ? (
            <div className="text-red-500" aria-live="polite">Error loading analytics data.</div>
          ) : data && (data.totalPosts || data.totalViews || data.totalEngagements || data.avgEngagementRate) ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded shadow p-4 flex flex-col items-center focus-visible:ring-2 focus-visible:ring-primary transition-shadow" tabIndex={0} aria-label="Total Posts">
                    <span className="text-2xl font-bold">{safeNumber(data.totalPosts)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Total Posts</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Total number of posts published</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded shadow p-4 flex flex-col items-center focus-visible:ring-2 focus-visible:ring-primary transition-shadow" tabIndex={0} aria-label="Total Views">
                    <span className="text-2xl font-bold">{safeNumber(data.totalViews)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Total Views</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Total number of views across all posts</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded shadow p-4 flex flex-col items-center focus-visible:ring-2 focus-visible:ring-primary transition-shadow" tabIndex={0} aria-label="Total Engagements">
                    <span className="text-2xl font-bold">{safeNumber(data.totalEngagements)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Total Engagements</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Total likes, comments, and shares</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-white rounded shadow p-4 flex flex-col items-center focus-visible:ring-2 focus-visible:ring-primary transition-shadow" tabIndex={0} aria-label="Avg Engagement Rate">
                    <span className="text-2xl font-bold">{safeNumber(data.avgEngagementRate, 2)}</span>
                    <span className="text-xs text-muted-foreground mt-1">Avg Engagement Rate</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>Average engagement per post</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No analytics data yet. Start posting to see your stats!</div>
          )}
        </Section>
        <Section title="Growth">
          {growthLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading growth data...</span>
            </div>
          ) : growthError ? (
            <div className="text-red-500" aria-live="polite">Error loading growth data.</div>
          ) : growthData && Object.keys(growthData).length > 0 ? (
            <div className="w-full h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={(() => {
                  // Flatten and group by date for multi-line chart
                  const allDates = new Set<string>();
                  Object.values(growthData).forEach((entries: any) => entries.forEach((e: any) => allDates.add(e.date)));
                  const sortedDates = Array.from(allDates).sort();
                  return sortedDates.map(date => {
                    const row: any = { date: new Date(date).toLocaleDateString() };
                    for (const [platform, entries] of Object.entries(growthData)) {
                      const found = (entries as any[]).find(e => e.date === date);
                      row[platform] = found ? found.followers : null;
                    }
                    return row;
                  });
                })()} aria-label="Growth chart">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-2 rounded shadow text-xs">
                        <div className="font-semibold mb-1">Date: {d.date}</div>
                        {Object.keys(growthData).map((platform, i) => (
                          <div key={platform} className="flex items-center gap-1">
                            <span className="font-semibold" style={{ color: ['#6366f1','#10b981','#f59e42','#ef4444'][i%4] }}>{platform}:</span>
                            <span>{d[platform] ?? '-'}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }} />
                  <RechartsLegend content={({ payload }: { payload?: any[] }) => (
                    <div className="flex gap-4">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {payload?.map((entry: any, i: number) => (
                        <span
                          key={entry.value}
                          className="flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
                          tabIndex={0}
                          aria-label={entry.value}
                          title={`${entry.value} growth`}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </span>
                      ))}
                    </div>
                  )} />
                  {Object.keys(growthData).map((platform, i) => (
                    <Line key={platform} type="monotone" dataKey={platform} stroke={['#6366f1','#10b981','#f59e42','#ef4444'][i%4]} dot={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No growth data yet. Your follower growth will appear here once you start posting.</div>
          )}
        </Section>
        <Section title="Top Posts">
          {topPostsLoading ? (
            <div>Loading...</div>
          ) : topPostsError ? (
            <div className="text-red-500">Error loading top posts.</div>
          ) : Array.isArray(topPosts) && topPosts.length > 0 ? (
            <>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Array.isArray(topPosts) ? topPosts : []}
                      dataKey="views"
                      nameKey="id"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${safeString(name).slice(0, 4)}… (${safeNumber(percent * 100, 0)}%)`}
                    >
                      {(Array.isArray(topPosts) ? topPosts : []).map((_: any, i: number) => (
                        <Cell key={i} fill={["#6366f1","#10b981","#f59e42","#ef4444","#a21caf"][i%5]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Post ID</th>
                      <th className="text-left p-2">Platforms</th>
                      <th className="text-left p-2">Views</th>
                      <th className="text-left p-2">Likes</th>
                      <th className="text-left p-2">Comments</th>
                      <th className="text-left p-2">Shares</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(topPosts) ? topPosts : []).map((post: any) => (
                      <tr key={safeString(post.id)}>
                        <td className="p-2 font-mono">{safeString(post.id).slice(0, 8)}…</td>
                        <td className="p-2">{Array.isArray(post.platforms) ? post.platforms.join(', ') : '-'}</td>
                        <td className="p-2">{safeNumber(post.views)}</td>
                        <td className="p-2">{safeNumber(post.likes)}</td>
                        <td className="p-2">{safeNumber(post.comments)}</td>
                        <td className="p-2">{safeNumber(post.shares)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">No top posts yet. Your most popular content will show up here.</div>
          )}
        </Section>
        <Section title="Platform Breakdown">
          {platformLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading platform breakdown...</span>
            </div>
          ) : platformError ? (
            <div className="text-red-500" aria-live="polite">Error loading platform breakdown.</div>
          ) : Array.isArray(platformData) && platformData.length > 0 ? (
            <div className="w-full h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart aria-label="Platform breakdown chart">
                  <RechartsTooltip content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="bg-white p-2 rounded shadow text-xs">
                        <div className="font-semibold mb-1">{d.name}</div>
                        <div>Posts: {d.value}</div>
                      </div>
                    );
                  }} />
                  <RechartsLegend content={({ payload }: { payload?: any[] }) => (
                    <div className="flex gap-4">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {payload?.map((entry: any, i: number) => (
                        <span
                          key={entry.value}
                          className="flex items-center gap-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary transition-shadow"
                          tabIndex={0}
                          aria-label={entry.value}
                          title={`${entry.value} posts`}
                        >
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span>{entry.value}</span>
                        </span>
                      ))}
                    </div>
                  )} />
                  {Array.isArray(platformData) ? platformData.map((entry: any, i: number) => (
                    <Pie key={entry.name} dataKey="value" nameKey="name" data={platformData} cx="50%" cy="50%" outerRadius={80} fill={['#6366f1','#10b981','#f59e42','#ef4444'][i%4]} label />
                  )) : null}
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No platform data yet. Connect your accounts and publish content to see platform analytics.</div>
          )}
        </Section>
        <div aria-live="polite" className="sr-only" id="analytics-dashboard-aria-live">{ariaMessage}</div>
      </div>
    </TooltipProvider>
  );
} 