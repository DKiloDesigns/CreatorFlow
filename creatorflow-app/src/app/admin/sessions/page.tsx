'use client';

import React, { useEffect, useState } from 'react';
import { NotificationToast } from '@/components/ui/notification-badge';
import { Loader2, LogOut, Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface Session {
  id: string;
  sessionToken: string;
  expires: string;
  user: { id: string; name: string | null; email: string | null; role?: string };
}

type UserOption = { id: string; name: string | null; email: string | null };

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<null | { title: string; message?: string; variant?: 'success' | 'error' | 'info' }>(null);
  const [error, setError] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [userFilter, setUserFilter] = useState('');
  const [search, setSearch] = useState('');
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [details, setDetails] = useState<Session | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [currentSessionToken, setCurrentSessionToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const params = new URLSearchParams();
        if (userFilter) params.append('user', userFilter);
        const res = await fetch(`/api/admin/sessions?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data: Session[] = await res.json();
        setSessions(data);
        // Populate user options for filter
        if (!userOptions.length) {
          const allUsers: UserOption[] = Array.from(new Map(data.map((s: Session) => [s.user.id, s.user])).values());
          setUserOptions(allUsers);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, [userFilter]);

  useEffect(() => {
    // Try to get current session token from cookies (NextAuth default)
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/next-auth.session-token=([^;]+)/);
      if (match) setCurrentSessionToken(match[1]);
    }
  }, []);

  // Filter by search
  const filteredSessions = sessions.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (s.user.name && s.user.name.toLowerCase().includes(q)) ||
      (s.user.email && s.user.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Active Sessions</h1>
      <div className="mb-4 flex gap-2">
        <a href="/api/admin/export?type=sessions&format=csv" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export CSV</a>
        <a href="/api/admin/export?type=sessions&format=json" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export JSON</a>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded px-2 py-1"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-2 py-1"
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
        >
          <option value="">All Users</option>
          {userOptions.map(u => (
            <option key={u.id} value={u.id}>{u.name || u.email || u.id}</option>
          ))}
        </select>
        <button className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => { setUserFilter(''); setSearch(''); }}>Clear</button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">User</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Session Token</th>
              <th className="p-2 border">Expires</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400"><Info className="inline-block mr-2 align-text-bottom" /> No sessions found.</td></tr>
            ) : filteredSessions.map(s => (
              <tr
                key={s.id}
                className={`transition-colors hover:bg-gray-50 ${currentSessionToken && s.sessionToken === currentSessionToken ? 'bg-blue-50 border-l-4 border-blue-400' : ''}`}
              >
                <td className="p-2 border cursor-pointer underline" tabIndex={0} onClick={() => { setDetailsId(s.id); setDetailsLoading(true); setDetailsError(null); setDetails(null); fetch(`/api/admin/sessions`).then(res => res.json()).then(data => { const found = data.find((sess: Session) => sess.id === s.id); setDetails(found); setDetailsLoading(false); }).catch(e => { setDetailsError('Failed to load session details'); setDetailsLoading(false); }); }} aria-label="Show session details">{s.user.name || s.user.id}</td>
                <td className="p-2 border">{s.user.email}</td>
                <td className="p-2 border text-xs">{s.sessionToken.slice(0, 8)}...{s.sessionToken.slice(-4)}</td>
                <td className="p-2 border text-xs">{new Date(s.expires).toLocaleString()}</td>
                <td className="p-2 border">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className="px-2 py-1 bg-red-100 rounded text-xs hover:bg-red-200 focus:ring-2 focus:ring-red-400 flex items-center gap-1"
                          aria-label="Force logout"
                          disabled={actionLoading === s.id}
                          onClick={async () => {
                            setActionLoading(s.id);
                            try {
                              const res = await fetch(`/api/admin/sessions/${s.id}/revoke`, { method: 'POST' });
                              if (!res.ok) throw new Error('Failed to revoke session');
                              setSessions(prev => prev.filter(sess => sess.id !== s.id));
                              setToast({ title: 'Session revoked', variant: 'success' });
                            } catch (e) {
                              setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                            } finally {
                              setActionLoading(null);
                            }
                          }}
                        >{actionLoading === s.id ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : <><LogOut className="w-4 h-4 inline-block" /> Force Logout</>}</button>
                      </TooltipTrigger>
                      <TooltipContent>Force logout this session</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {toast && (
        <NotificationToast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
      {/* Session Details Modal (focus trap, Esc to close) */}
      {detailsId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" tabIndex={-1} onKeyDown={e => { if (e.key === 'Escape') setDetailsId(null); }}>
          <div
            className="bg-white rounded shadow-lg p-6 max-w-md w-full relative"
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-details-title"
            tabIndex={0}
            onFocus={e => { e.currentTarget.focus(); }}
          >
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" aria-label="Close session details" onClick={() => setDetailsId(null)}>&times;</button>
            {detailsLoading ? (
              <div>Loading...</div>
            ) : detailsError ? (
              <div className="text-red-500">{detailsError}</div>
            ) : details ? (
              <div>
                <h3 id="session-details-title" className="text-xl font-bold mb-2">Session Details</h3>
                <div className="mb-2"><b>User:</b> {details.user.name || <span className="text-gray-400">(none)</span>}</div>
                <div className="mb-2"><b>Email:</b> {details.user.email || <span className="text-gray-400">(none)</span>}</div>
                <div className="mb-2"><b>Admin:</b> {details.user.role === 'ADMIN' || details.user.role === 'SUPERADMIN' ? 'Yes' : 'No'}</div>
                <div className="mb-2"><b>Session Token:</b> <span className="font-mono break-all">{details.sessionToken}</span></div>
                <div className="mb-2"><b>Expires:</b> {new Date(details.expires).toLocaleString()}</div>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={async () => {
                      setActionLoading(details.id);
                      try {
                        const res = await fetch(`/api/admin/sessions/${details.id}/revoke`, { method: 'POST' });
                        if (!res.ok) throw new Error('Failed to revoke session');
                        setSessions(prev => prev.filter(sess => sess.id !== details.id));
                        setToast({ title: 'Session revoked', variant: 'success' });
                        setDetailsId(null);
                      } catch (e) {
                        setToast({ title: 'Error', message: (e as Error).message, variant: 'error' });
                      } finally {
                        setActionLoading(null);
                      }
                    }}
                    disabled={actionLoading === details.id}
                  >{actionLoading === details.id ? <Loader2 className="w-4 h-4 animate-spin inline-block" /> : 'Force Logout'}</button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
} 