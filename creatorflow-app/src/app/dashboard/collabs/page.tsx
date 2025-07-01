"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import Avatar from 'react-avatar';
import { PieChart, Pie, Cell } from 'recharts';
import { UserIcon, FileTextIcon } from 'lucide-react';
import { BarChart, Bar } from 'recharts';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="bg-gray-100 dark:bg-white rounded shadow p-3 sm:p-4 min-h-[100px]">{children}</div>
    </div>
  );
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export default function CollabsPage() {
  const [collabs, setCollabs] = useState<any>(null);
  const [collabsError, setCollabsError] = useState<any>(null);
  const [collabsLoading, setCollabsLoading] = useState<boolean>(true);
  
  const [report, setReport] = useState<any>(null);
  const [reportError, setReportError] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState<boolean>(true);
  
  const firstCollabId = collabs && collabs.length > 0 ? collabs[0].id : null;
  const [selectedCollabId, setSelectedCollabId] = React.useState(firstCollabId);
  
  // Equivalent to mutate function
  const mutate = async () => {
    setCollabsLoading(true);
    try {
      const data = await fetcher('/api/collabs');
      setCollabs(data);
    } catch (err) {
      setCollabsError(err);
    } finally {
      setCollabsLoading(false);
    }
  };
  
  // Equivalent to mutateReport function
  const mutateReport = async () => {
    if (!selectedCollabId) return;
    setReportLoading(true);
    try {
      const data = await fetcher(`/api/collabs/${selectedCollabId}/report`);
      setReport(data);
    } catch (err) {
      setReportError(err);
    } finally {
      setReportLoading(false);
    }
  };
  
  // Initial data fetch
  useEffect(() => {
    mutate();
  }, []);
  
  // Update selectedCollabId when firstCollabId changes
  React.useEffect(() => { 
    setSelectedCollabId(firstCollabId); 
  }, [firstCollabId]);
  
  // Fetch report when selectedCollabId changes
  useEffect(() => {
    if (selectedCollabId) {
      mutateReport();
    }
  }, [selectedCollabId]);

  // Modal state
  const [showCreate, setShowCreate] = React.useState(false);
  const [showUpdate, setShowUpdate] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', brandName: '', startDate: '', endDate: '' });
  const [loading, setLoading] = React.useState(false);

  // Link post state
  const [linkPostId, setLinkPostId] = React.useState('');

  // Chart data for selected collab
  const [chartData, setChartData] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (!selectedCollabId || !collabs) return setChartData([]);
    const collab = collabs.find((c: any) => c.id === selectedCollabId);
    if (!collab || !collab.posts) return setChartData([]);
    // Group by post date
    const data = collab.posts
      .filter((p: any) => p.publishedAt)
      .map((p: any) => ({
        date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '-',
        views: p.views || 0,
        engagements: (p.likes || 0) + (p.comments || 0) + (p.shares || 0),
        postId: p.id,
      }));
    setChartData(data);
  }, [selectedCollabId, collabs]);

  // Delete confirmation dialog
  const [showDelete, setShowDelete] = React.useState(false);

  // Form error state
  const [formError, setFormError] = React.useState('');

  // Handlers
  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to create collab');
      toast.success('Collab created!');
      setShowCreate(false);
      setForm({ name: '', brandName: '', startDate: '', endDate: '' });
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async () => {
    if (!selectedCollabId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/collabs/${selectedCollabId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to update collab');
      toast.success('Collab updated!');
      setShowUpdate(false);
      setForm({ name: '', brandName: '', startDate: '', endDate: '' });
      mutate();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!selectedCollabId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/collabs/${selectedCollabId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete collab');
      toast.success('Collab deleted!');
      mutate();
      setSelectedCollabId(null);
      mutateReport();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLinkPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!selectedCollabId || !linkPostId) {
      setFormError('Select a collab and enter a Post ID');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/collabs/${selectedCollabId}/link-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: linkPostId }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to link post');
      toast.success('Post linked!');
      setLinkPostId('');
      mutate();
      mutateReport();
    } catch (e: any) {
      setFormError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fill update form with selected collab
  React.useEffect(() => {
    if (showUpdate && selectedCollabId && collabs) {
      const c = collabs.find((c: any) => c.id === selectedCollabId);
      if (c) setForm({
        name: c.name || '',
        brandName: c.brandName || '',
        startDate: c.startDate ? c.startDate.slice(0, 10) : '',
        endDate: c.endDate ? c.endDate.slice(0, 10) : '',
      });
    }
  }, [showUpdate, selectedCollabId, collabs]);

  const [ariaMessage, setAriaMessage] = React.useState('');

  React.useEffect(() => {
    if (collabsError) setAriaMessage('Error loading collabs.');
    else if (reportError) setAriaMessage('Error loading collab report.');
    else setAriaMessage('');
  }, [collabsError, reportError]);

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto py-8">
        <h2 className="sr-only" id="collabs-dashboard-heading">Brand Collaborations Dashboard</h2>
        <h1 className="text-2xl font-bold mb-6">Brand Collaborations</h1>
        <Section title="Your Collabs">
          {collabsLoading ? (
            <div>Loading...</div>
          ) : collabsError ? (
            <div className="text-red-500" aria-live="polite">Error loading collabs.</div>
          ) : collabs && collabs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">Brand</th>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Start</th>
                    <th className="text-left p-2">End</th>
                    <th className="text-left p-2">Posts</th>
                  </tr>
                </thead>
                <tbody>
                  {collabs.map((collab: any) => (
                    <tr key={collab.id} className={selectedCollabId === collab.id ? 'bg-primary/10' : 'hover:bg-muted transition-colors'} tabIndex={0} role="row">
                      <td className="p-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary" role="button">
                              <Avatar name={collab.brandName} size="28" round className="border" />
                              <BuildingStorefrontIcon className="h-5 w-5 text-primary" />
                              {collab.brandName}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Brand: {collab.brandName}</TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="p-2 font-medium cursor-pointer" onClick={() => setSelectedCollabId(collab.id)} role="button">{collab.name}</td>
                      <td className="p-2">{collab.startDate ? new Date(collab.startDate).toLocaleDateString() : '-'}</td>
                      <td className="p-2">{collab.endDate ? new Date(collab.endDate).toLocaleDateString() : '-'}</td>
                      <td className="p-2">
                        {collab.posts?.length ?? 0}
                        {collab.posts && collab.posts.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {collab.posts.slice(0, 3).map((post: any) => (
                              <Tooltip key={post.id}>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-0.5 text-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-primary" role="button">
                                    <FileTextIcon className="h-3 w-3 text-muted-foreground" />
                                    {post.id.slice(0, 4)}
                                    {post.user && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="ml-1">
                                            <Avatar name={post.user.name || 'User'} src={post.user.image} size="18" round className="border" />
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent>User: {post.user.name || 'User'}</TooltipContent>
                                      </Tooltip>
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Post ID: {post.id}</TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-muted-foreground">No collabs found.</div>
          )}
        </Section>
        <Section title="Link Post to Collab">
          <form className="flex items-center gap-2" onSubmit={handleLinkPost}>
            <input type="text" placeholder="Post ID" className="border rounded px-2 py-1" value={linkPostId} onChange={e => { setLinkPostId(e.target.value); setFormError(''); }} />
            <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit" disabled={loading}>Link Post</button>
          </form>
          {formError && <div className="text-red-500 text-sm mt-1">{formError}</div>}
        </Section>
        <Section title="Collab Report">
          {collabs && collabs.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Collab:</label>
              <select
                className="border rounded px-2 py-1"
                value={selectedCollabId || ''}
                onChange={e => setSelectedCollabId(e.target.value)}
              >
                {collabs.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name || c.id}</option>
                ))}
              </select>
            </div>
          )}
          {reportLoading ? (
            <div>Loading...</div>
          ) : reportError ? (
            <div className="text-red-500">Error loading report.</div>
          ) : report ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Total Posts</div>
                <div className="text-2xl font-bold">{report.totalPosts}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Views</div>
                <div className="text-2xl font-bold">{report.totalViews}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Engagements</div>
                <div className="text-2xl font-bold">{report.totalEngagements}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Avg. Engagement Rate</div>
                <div className="text-2xl font-bold">{(report.avgEngagementRate * 100).toFixed(1)}%</div>
              </div>
            </div>
          ) : (
            <div>Select a collab to view report.</div>
          )}
        </Section>
        <Section title="Collab Performance Over Time">
          {chartData.length > 0 ? (
            <>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-2 rounded shadow text-xs">
                          <div className="font-semibold mb-1">{d.date}</div>
                          <div>Views: {d.views}</div>
                          <div>Engagements: {d.engagements}</div>
                          <div>Post ID: {d.postId?.slice(0, 8)}</div>
                          {d.user && (
                            <div className="flex items-center gap-1 mt-1">
                              <Avatar name={d.user.name || 'User'} src={d.user.image} size="18" round className="border" />
                              <span>{d.user.name || 'User'}</span>
                            </div>
                          )}
                        </div>
                      );
                    }} />
                    <RechartsLegend />
                    <Line type="monotone" dataKey="views" stroke="#6366f1" name="Views" />
                    <Line type="monotone" dataKey="engagements" stroke="#10b981" name="Engagements" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="views"
                      nameKey="postId"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name?.slice(0, 4) ?? ''}… (${(percent * 100).toFixed(0)}%)`}
                    >
                      {chartData.map((_: any, i: number) => (
                        <Cell key={i} fill={["#6366f1","#10b981","#f59e42","#ef4444","#a21caf"][i%5]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-2 rounded shadow text-xs">
                          <div className="font-semibold mb-1">Post ID: {d.postId?.slice(0, 8)}</div>
                          <div>Views: {d.views}</div>
                          {d.user && (
                            <div className="flex items-center gap-1 mt-1">
                              <Avatar name={d.user.name || 'User'} src={d.user.image} size="18" round className="border" />
                              <span>{d.user.name || 'User'}</span>
                            </div>
                          )}
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="postId" tickFormatter={id => id?.slice(0, 4) ?? ''} />
                    <YAxis allowDecimals={false} />
                    <RechartsTooltip content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                      if (!active || !payload || !payload.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-2 rounded shadow text-xs">
                          <div className="font-semibold mb-1">Post ID: {d.postId?.slice(0, 8)}</div>
                          <div>Likes: {d.likes}</div>
                          <div>Comments: {d.comments}</div>
                          <div>Shares: {d.shares}</div>
                          {d.user && (
                            <div className="flex items-center gap-1 mt-1">
                              <Avatar name={d.user.name || 'User'} src={d.user.image} size="18" round className="border" />
                              <span>{d.user.name || 'User'}</span>
                            </div>
                          )}
                        </div>
                      );
                    }} />
                    <RechartsLegend />
                    <Bar dataKey="likes" fill="#6366f1" name="Likes" />
                    <Bar dataKey="comments" fill="#10b981" name="Comments" />
                    <Bar dataKey="shares" fill="#f59e42" name="Shares" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-gray-400">No post data for this collab yet.</div>
          )}
        </Section>
        <Section title="Manage Collabs">
          <div className="mb-4 flex gap-2">
            <AlertDialog open={showCreate} onOpenChange={setShowCreate}>
              <AlertDialogTrigger asChild>
                <button className="bg-primary text-white px-4 py-2 rounded">Create Collab</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Create Collab</AlertDialogTitle>
                  <AlertDialogDescription>Fill out the form to create a new collab.</AlertDialogDescription>
                </AlertDialogHeader>
                <form className="space-y-2" onSubmit={e => { e.preventDefault(); handleCreate(); }}>
                  <input className="border rounded px-2 py-1 w-full" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  <input className="border rounded px-2 py-1 w-full" placeholder="Brand Name" value={form.brandName} onChange={e => setForm(f => ({ ...f, brandName: e.target.value }))} required />
                  <input className="border rounded px-2 py-1 w-full" type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                  <input className="border rounded px-2 py-1 w-full" type="date" placeholder="End Date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit" disabled={loading}>Create</AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showUpdate} onOpenChange={setShowUpdate}>
              <AlertDialogTrigger asChild>
                <button className="bg-black text-white px-4 py-2 rounded" disabled={!selectedCollabId}>Update Collab</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Update Collab</AlertDialogTitle>
                  <AlertDialogDescription>Update the selected collab.</AlertDialogDescription>
                </AlertDialogHeader>
                <form className="space-y-2" onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                  <input className="border rounded px-2 py-1 w-full" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  <input className="border rounded px-2 py-1 w-full" placeholder="Brand Name" value={form.brandName} onChange={e => setForm(f => ({ ...f, brandName: e.target.value }))} required />
                  <input className="border rounded px-2 py-1 w-full" type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                  <input className="border rounded px-2 py-1 w-full" type="date" placeholder="End Date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                  <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit" disabled={loading}>Update</AlertDialogAction>
                  </AlertDialogFooter>
                </form>
              </AlertDialogContent>
            </AlertDialog>
            <button className="bg-red-600 text-white px-4 py-2 rounded" disabled={!selectedCollabId || loading} onClick={handleDelete}>Delete Collab</button>
          </div>
        </Section>
        <div aria-live="polite" className="sr-only" id="collabs-dashboard-aria-live">{ariaMessage}</div>
      </div>
    </TooltipProvider>
  );
} 