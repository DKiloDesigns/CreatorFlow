'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { NotificationToast } from '@/components/ui/notification-badge';
import { Info, Loader2, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN' | 'SUPPORT';
  deactivated: boolean;
}

interface Feedback {
  id: string;
  user: { id: string; name: string | null; email: string | null };
  message: string;
  createdAt: string;
  resolved: boolean;
  reply?: string | null;
  repliedAt?: string | null;
}

interface UserDetails {
  id: string;
  name: string | null;
  email: string | null;
  role: 'USER' | 'ADMIN' | 'SUPERADMIN' | 'SUPPORT';
  deactivated: boolean;
  createdAt: string;
  feedback: { id: string; message: string; createdAt: string }[];
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<null | { title: string; message?: string; variant?: 'success' | 'error' | 'info' }>(null);
  const [confirm, setConfirm] = useState<null | { action: () => void; message: string }>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [feedbackFilters, setFeedbackFilters] = useState({ user: '', status: '', q: '' });
  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const replyTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { user: currentUser } = useUserProfile();
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [bulkFeedbackAction, setBulkFeedbackAction] = useState('');
  const [feedbackPage, setFeedbackPage] = useState(0);
  const [feedbackPageSize, setFeedbackPageSize] = useState(20);
  const [feedbackTotal, setFeedbackTotal] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (feedbackFilters.user) params.append('user', feedbackFilters.user);
      if (feedbackFilters.status) params.append('status', feedbackFilters.status);
      if (feedbackFilters.q) params.append('q', feedbackFilters.q);
      params.append('limit', String(pageSize));
      params.append('offset', String(page * pageSize));
      const usersRes = await fetch(`/api/admin/users?${params.toString()}`);
      const usersData = await usersRes.json();
      setUsers(usersData.users || usersData);
      setTotal(usersData.total || usersData.users?.length || 0);
      // Feedback pagination
      const feedbackParams = new URLSearchParams(params);
      feedbackParams.set('limit', String(feedbackPageSize));
      feedbackParams.set('offset', String(feedbackPage * feedbackPageSize));
      const feedbackRes = await fetch(`/api/admin/feedback?${feedbackParams.toString()}`);
      const feedbackData = await feedbackRes.json();
      setFeedback(feedbackData.feedback || feedbackData);
      setFeedbackTotal(feedbackData.total || feedbackData.feedback?.length || 0);
    } catch (err: any) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, [feedbackFilters, page, pageSize, feedbackPage, feedbackPageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!detailsId) return;
    setDetails(null);
    setDetailsLoading(true);
    setDetailsError(null);
    fetch(`/api/admin/users/${detailsId}/details`).then(async (res) => {
      if (!res.ok) {
        setDetailsError('Failed to load user details');
        setDetailsLoading(false);
        return;
      }
      const data = await res.json();
      setDetails(data);
      setDetailsLoading(false);
    }).catch((e) => {
      setDetailsError(e.message);
      setDetailsLoading(false);
    });
  }, [detailsId]);

  useEffect(() => {
    // Check for impersonate_user_id cookie
    const match = document.cookie.match(/impersonate_user_id=([^;]+)/);
    if (match) setImpersonating(match[1]);
    else setImpersonating(null);
  }, []);

  React.useEffect(() => {
    if (replyId && replyTextareaRef.current) {
      replyTextareaRef.current.focus();
    }
  }, [replyId]);

  async function handleBulkAction() {
    if (!bulkAction || selected.length === 0) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: bulkAction, ids: selected }),
      });
      if (!res.ok) throw new Error('Bulk action failed');
      setToast({ title: 'Bulk action complete', variant: 'success' });
      setSelected([]);
      fetchData();
    } catch (e) {
      setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
    }
  }

  async function handleBulkFeedbackAction() {
    if (!bulkFeedbackAction || selectedFeedback.length === 0) return;
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: bulkFeedbackAction, ids: selectedFeedback }),
      });
      if (!res.ok) throw new Error('Bulk feedback action failed');
      setToast({ title: 'Bulk feedback action complete', variant: 'success' });
      setSelectedFeedback([]);
      fetchData();
    } catch (e) {
      setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
    }
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-2 flex gap-2 items-center">
        <a href="/api/admin/export?type=users&format=csv" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export CSV</a>
        <a href="/api/admin/export?type=users&format=json" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export JSON</a>
        <select className="ml-2 px-2 py-1 border rounded text-xs" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
          <option value="">Bulk Action</option>
          <option value="promote">Promote</option>
          <option value="demote">Demote</option>
          <option value="deactivate">Deactivate</option>
          <option value="reactivate">Reactivate</option>
          <option value="delete">Delete</option>
        </select>
        <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={handleBulkAction} disabled={!bulkAction || selected.length === 0}>Apply</button>
        <span className="ml-4 text-xs text-gray-500">{selected.length} selected</span>
      </div>
      <table className="w-full border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border"><input type="checkbox" checked={selected.length === users.length && users.length > 0} onChange={e => setSelected(e.target.checked ? users.map(u => u.id) : [])} /></th>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border text-xs"><input type="checkbox" checked={selected.includes(u.id)} onChange={e => setSelected(e.target.checked ? [...selected, u.id] : selected.filter(id => id !== u.id))} /></td>
              <td className="p-2 border text-xs">{u.id}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border text-center">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${u.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' : u.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : u.role === 'SUPPORT' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{u.role}</span>
              </td>
              <td className="p-2 border text-center">{u.deactivated ? 'Deactivated' : 'Active'}</td>
              <td className="p-2 border space-x-2">
                {currentUser?.role === 'SUPERADMIN' && u.role !== 'SUPERADMIN' && (
                  <select
                    className="px-2 py-1 border rounded text-xs"
                    value={u.role}
                    onChange={async e => {
                      const newRole = e.target.value;
                      try {
                        const res = await fetch(`/api/admin/users/${u.id}/role`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ role: newRole }),
                        });
                        if (!res.ok) throw new Error('Failed to update role');
                        setUsers(prev => prev.map(user => user.id === u.id ? { ...user, role: newRole as User['role'] } : user));
                        setToast({ title: 'Role updated', variant: 'success' });
                      } catch (e) {
                        setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                      }
                    }}
                  >
                    {['USER', 'ADMIN', 'SUPPORT'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
                {currentUser?.role === 'SUPERADMIN' && u.role !== 'SUPERADMIN' && (
                  <>
                    {u.role === 'ADMIN' ? (
                      <button className="px-2 py-1 bg-yellow-200 rounded text-xs" onClick={() => setConfirm({ action: async () => { try { const res = await fetch(`/api/admin/users/${u.id}/demote`, { method: 'POST' }); if (!res.ok) throw new Error('Failed to demote user'); setUsers(prev => prev.map(user => user.id === u.id ? { ...user, role: 'USER' } : user)); setToast({ title: 'User demoted', variant: 'success' }); } catch (e) { setToast({ title: 'Error', message: (e as Error).message, variant: 'error' }); } }, message: `Are you sure you want to demote ${u.name || u.email || u.id}?` })}>Demote</button>
                    ) : (
                      <button className="px-2 py-1 bg-green-200 rounded text-xs" onClick={async () => { try { const res = await fetch(`/api/admin/users/${u.id}/promote`, { method: 'POST' }); if (!res.ok) throw new Error('Failed to promote user'); setUsers(prev => prev.map(user => user.id === u.id ? { ...user, role: 'ADMIN' } : user)); setToast({ title: 'User promoted', variant: 'success' }); } catch (e) { setToast({ title: 'Error', message: (e as Error).message, variant: 'error' }); } }}>Promote</button>
                    )}
                  </>
                )}
                {u.deactivated ? (
                  <button
                    className="px-2 py-1 bg-blue-200 rounded text-xs"
                    onClick={() => setConfirm({
                      action: async () => {
                        try {
                          const res = await fetch(`/api/admin/users/${u.id}/reactivate`, { method: 'POST' });
                          if (!res.ok) throw new Error('Failed to reactivate user');
                          setUsers((prev) => prev.map((user) => user.id === u.id ? { ...user, deactivated: false } : user));
                          setToast({ title: 'User reactivated', variant: 'success' });
                        } catch (e) {
                          setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                        }
                      },
                      message: `Are you sure you want to reactivate ${u.name || u.email || u.id}?`
                    })}
                  >Reactivate</button>
                ) : (
                  <button
                    className="px-2 py-1 bg-red-200 rounded text-xs"
                    onClick={() => setConfirm({
                      action: async () => {
                        try {
                          const res = await fetch(`/api/admin/users/${u.id}/deactivate`, { method: 'POST' });
                          if (!res.ok) throw new Error('Failed to deactivate user');
                          setUsers((prev) => prev.map((user) => user.id === u.id ? { ...user, deactivated: true } : user));
                          setToast({ title: 'User deactivated', variant: 'success' });
                        } catch (e) {
                          setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                        }
                      },
                      message: `Are you sure you want to deactivate ${u.name || u.email || u.id}?`
                    })}
                  >Deactivate</button>
                )}
                <button
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                  onClick={() => setDetailsId(u.id)}
                >Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-gray-500">Total: {total}</div>
        <div className="flex gap-2 items-center">
          <button className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
          <span className="text-xs">Page {page + 1} of {Math.ceil(total / pageSize) || 1}</span>
          <button className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => setPage(p => (p + 1 < Math.ceil(total / pageSize)) ? p + 1 : p)} disabled={page + 1 >= Math.ceil(total / pageSize)}>Next</button>
          <select className="ml-2 px-2 py-1 border rounded text-xs" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}>
            {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size} / page</option>)}
          </select>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>
        <div className="mb-2 flex gap-2 items-center">
          <a href="/api/admin/export?type=feedback&format=csv" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export CSV</a>
          <a href="/api/admin/export?type=feedback&format=json" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export JSON</a>
          <select className="ml-2 px-2 py-1 border rounded text-xs" value={bulkFeedbackAction} onChange={e => setBulkFeedbackAction(e.target.value)}>
            <option value="">Bulk Action</option>
            <option value="resolve">Resolve</option>
            <option value="unresolve">Unresolve</option>
            <option value="delete">Delete</option>
          </select>
          <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={handleBulkFeedbackAction} disabled={!bulkFeedbackAction || selectedFeedback.length === 0}>Apply</button>
          <span className="ml-4 text-xs text-gray-500">{selectedFeedback.length} selected</span>
        </div>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border"><input type="checkbox" checked={selectedFeedback.length === feedback.length && feedback.length > 0} onChange={e => setSelectedFeedback(e.target.checked ? feedback.map(f => f.id) : [])} /></th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Reply</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedback.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400">
                  <Info className="inline-block mr-2 align-text-bottom" /> No feedback found.
                </td>
              </tr>
            ) : feedback.map((f) => (
              <tr key={f.id} className="transition-colors hover:bg-gray-50 focus-within:bg-gray-100">
                <td className="p-2 border text-xs"><input type="checkbox" checked={selectedFeedback.includes(f.id)} onChange={e => setSelectedFeedback(e.target.checked ? [...selectedFeedback, f.id] : selectedFeedback.filter(id => id !== f.id))} /></td>
                <td className="p-2 border">{f.user.name || f.user.id}</td>
                <td className="p-2 border">{f.user.email}</td>
                <td className="p-2 border">{f.message}</td>
                <td className="p-2 border text-xs">{new Date(f.createdAt).toLocaleString()}</td>
                <td className="p-2 border text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${f.resolved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        aria-label={f.resolved ? 'Resolved' : 'Unresolved'}>
                    {f.resolved ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {f.resolved ? 'Resolved' : 'Unresolved'}
                  </span>
                </td>
                <td className="p-2 border text-xs">
                  {f.reply ? (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 flex items-start gap-2">
                      <Mail className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <div className="text-blue-800 font-medium">{f.reply}</div>
                        <div className="text-gray-400 text-xs">{f.repliedAt ? new Date(f.repliedAt).toLocaleString() : ''}</div>
                      </div>
                    </div>
                  ) : <span className="text-gray-400">No reply</span>}
                </td>
                <td className="p-2 border space-x-2">
                  {f.resolved ? (
                    <button
                      className="px-2 py-1 bg-yellow-100 rounded text-xs hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400"
                      aria-label="Mark as unresolved"
                      disabled={actionLoading === f.id}
                      onClick={async () => {
                        setActionLoading(f.id);
                        await fetch(`/api/admin/feedback/${f.id}/unresolve`, { method: 'POST' });
                        setFeedback(prev => prev.map(fb => fb.id === f.id ? { ...fb, resolved: false } : fb));
                        setToast({ title: 'Marked as unresolved', variant: 'success' });
                        setActionLoading(null);
                      }}
                    >{actionLoading === f.id ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : 'Unresolve'}</button>
                  ) : (
                    <button
                      className="px-2 py-1 bg-green-100 rounded text-xs hover:bg-green-200 focus:ring-2 focus:ring-green-400"
                      aria-label="Mark as resolved"
                      disabled={actionLoading === f.id}
                      onClick={async () => {
                        setActionLoading(f.id);
                        await fetch(`/api/admin/feedback/${f.id}/resolve`, { method: 'POST' });
                        setFeedback(prev => prev.map(fb => fb.id === f.id ? { ...fb, resolved: true } : fb));
                        setToast({ title: 'Marked as resolved', variant: 'success' });
                        setActionLoading(null);
                      }}
                    >{actionLoading === f.id ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : 'Resolve'}</button>
                  )}
                  <button
                    className="px-2 py-1 bg-blue-100 rounded text-xs hover:bg-blue-200 focus:ring-2 focus:ring-blue-400"
                    aria-label="Reply to feedback"
                    onClick={() => { setReplyId(f.id); setReplyText(f.reply || ''); }}
                  >Reply</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">Total: {feedbackTotal}</div>
          <div className="flex gap-2 items-center">
            <button className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => setFeedbackPage(p => Math.max(0, p - 1))} disabled={feedbackPage === 0}>Prev</button>
            <span className="text-xs">Page {feedbackPage + 1} of {Math.ceil(feedbackTotal / feedbackPageSize) || 1}</span>
            <button className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => setFeedbackPage(p => (p + 1 < Math.ceil(feedbackTotal / feedbackPageSize)) ? p + 1 : p)} disabled={feedbackPage + 1 >= Math.ceil(feedbackTotal / feedbackPageSize)}>Next</button>
            <select className="ml-2 px-2 py-1 border rounded text-xs" value={feedbackPageSize} onChange={e => { setFeedbackPageSize(Number(e.target.value)); setFeedbackPage(0); }}>
              {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size} / page</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Confirmation Dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
            <div className="mb-4">{confirm.message}</div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={async () => { await confirm.action(); setConfirm(null); }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <NotificationToast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      {/* User Details Modal */}
      {detailsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded shadow-lg p-6 max-w-md w-full relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setDetailsId(null)}>&times;</button>
            {detailsLoading ? (
              <div>Loading...</div>
            ) : detailsError ? (
              <div className="text-red-500">{detailsError}</div>
            ) : details ? (
              <div>
                <h3 className="text-xl font-bold mb-2">User Details</h3>
                <div className="mb-2"><b>Name:</b> {details.name || <span className="text-gray-400">(none)</span>}</div>
                <div className="mb-2"><b>Email:</b> {details.email || <span className="text-gray-400">(none)</span>}</div>
                <div className="mb-2"><b>Status:</b> {details.deactivated ? 'Deactivated' : 'Active'}</div>
                <div className="mb-2"><b>Role:</b> <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${details.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' : details.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : details.role === 'SUPPORT' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{details.role}</span></div>
                <div className="mb-2"><b>Signup:</b> {new Date(details.createdAt).toLocaleString()}</div>
                {/* Impersonation controls */}
                {currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'SUPERADMIN') && details.id !== currentUser.id && !impersonating && (
                  <button
                    className="px-3 py-1 bg-purple-600 text-white rounded mt-2"
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/admin/impersonate/${details.id}`, { method: 'POST' });
                        if (!res.ok) {
                          const err = await res.json();
                          throw new Error(err.error || 'Failed to impersonate');
                        }
                        setToast({ title: 'Impersonation started', variant: 'success' });
                        setTimeout(() => window.location.reload(), 1000);
                      } catch (e) {
                        setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                      }
                    }}
                  >Login as this user</button>
                )}
                {impersonating && (
                  <button
                    className="px-3 py-1 bg-gray-600 text-white rounded mt-2 ml-2"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/admin/impersonate/revert', { method: 'POST' });
                        if (!res.ok) throw new Error('Failed to revert impersonation');
                        setToast({ title: 'Impersonation reverted', variant: 'success' });
                        setTimeout(() => window.location.reload(), 1000);
                      } catch (e) {
                        setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                      }
                    }}
                  >Revert impersonation</button>
                )}
                {currentUser?.role === 'SUPERADMIN' && details.role !== 'SUPERADMIN' && (
                  <select
                    className="px-2 py-1 border rounded text-xs mt-2"
                    value={details.role}
                    onChange={async e => {
                      const newRole = e.target.value;
                      try {
                        const res = await fetch(`/api/admin/users/${details.id}/role`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ role: newRole }),
                        });
                        if (!res.ok) throw new Error('Failed to update role');
                        setDetails(prev => prev ? { ...prev, role: newRole as UserDetails['role'] } : prev);
                        setToast({ title: 'Role updated', variant: 'success' });
                      } catch (e) {
                        setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                      }
                    }}
                  >
                    {['USER', 'ADMIN', 'SUPPORT'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
                <div className="mt-4">
                  <b>Recent Feedback:</b>
                  {details.feedback.length === 0 ? (
                    <div className="text-gray-400">No feedback found.</div>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {details.feedback.map(f => (
                        <li key={f.id} className="border rounded p-2">
                          <div className="text-sm text-gray-700">{f.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{new Date(f.createdAt).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
      {/* Reply Modal (animated, accessible) */}
      {replyId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full relative animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="reply-modal-title">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" aria-label="Close reply modal" onClick={() => setReplyId(null)}>&times;</button>
            <h3 id="reply-modal-title" className="text-lg font-bold mb-2">Reply to Feedback</h3>
            <textarea
              ref={replyTextareaRef}
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              disabled={replyLoading}
              aria-label="Reply message"
              onKeyDown={e => {
                if (e.key === 'Escape') setReplyId(null);
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && replyText.trim()) {
                  e.preventDefault();
                  document.getElementById('send-reply-btn')?.click();
                }
              }}
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setReplyId(null)} disabled={replyLoading}>Cancel</button>
              <button
                id="send-reply-btn"
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-60"
                disabled={replyLoading || !replyText.trim()}
                onClick={async () => {
                  setReplyLoading(true);
                  try {
                    const res = await fetch(`/api/admin/feedback/${replyId}/reply`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ reply: replyText })
                    });
                    if (!res.ok) throw new Error('Failed to send reply');
                    setFeedback(prev => prev.map(fb => fb.id === replyId ? { ...fb, reply: replyText, repliedAt: new Date().toISOString() } : fb));
                    setToast({ title: 'Reply sent', variant: 'success' });
                    setReplyId(null);
                  } catch (e) {
                    setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                  } finally {
                    setReplyLoading(false);
                  }
                }}
              >{replyLoading ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : 'Send Reply'}</button>
            </div>
          </div>
        </div>
      )}
      {/* Animations */}
      <style jsx global>{`
        .animate-fade-in { animation: fadeIn 0.2s; }
        .animate-slide-up { animation: slideUp 0.2s; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
} 