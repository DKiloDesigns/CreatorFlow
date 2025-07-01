'use client';

import React, { useEffect, useState } from 'react';
import { NotificationToast } from '@/components/ui/notification-badge';
import { Loader2, Info, User, UserCheck } from 'lucide-react';

interface AuditLogEntry {
  id: string;
  action: string;
  actor: { id: string; name: string | null; email: string | null } | null;
  targetId: string | null;
  targetType: string | null;
  details: any;
  createdAt: string;
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [toast, setToast] = useState<null | { title: string; message?: string; variant?: 'success' | 'error' | 'info' }>(null);
  const [impersonationOnly, setImpersonationOnly] = useState(false);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (actorFilter) params.append('actor', actorFilter);
        if (actionFilter) params.append('action', actionFilter);
        if (dateFilter) params.append('date', dateFilter);
        if (impersonationOnly) params.append('action', 'impersonate.start');
        const res = await fetch(`/api/admin/audit-log?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch audit log');
        const data = await res.json();
        setLogs(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load audit log');
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [actorFilter, actionFilter, dateFilter, impersonationOnly]);

  const uniqueActors = Array.from(new Map(logs.filter(l => l.actor).map(l => [l.actor!.id, l.actor!])).values());
  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Audit Log</h1>
      <div className="mb-4 flex gap-2">
        <a href="/api/admin/export?type=audit-log&format=csv" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export CSV</a>
        <a href="/api/admin/export?type=audit-log&format=json" className="px-2 py-1 bg-gray-100 rounded text-xs" download>Export JSON</a>
        <button className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${impersonationOnly ? 'bg-yellow-300' : 'bg-gray-100'}`} onClick={() => setImpersonationOnly(v => !v)}>
          <UserCheck className="w-4 h-4" /> Impersonation Events
        </button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select
          className="border rounded px-2 py-1"
          value={actorFilter}
          onChange={e => setActorFilter(e.target.value)}
        >
          <option value="">All Actors</option>
          {uniqueActors.map(a => (
            <option key={a.id} value={a.id}>{a.name || a.email || a.id}</option>
          ))}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
        >
          <option value="">All Actions</option>
          {uniqueActions.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <input
          type="date"
          className="border rounded px-2 py-1"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
        <button className="px-2 py-1 bg-gray-100 rounded text-xs" onClick={() => { setActorFilter(''); setActionFilter(''); setDateFilter(''); }}>Clear</button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Actor</th>
              <th className="p-2 border">Target</th>
              <th className="p-2 border">Details</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400"><Info className="inline-block mr-2 align-text-bottom" /> No audit log entries found.</td></tr>
            ) : logs.map(l => (
              <tr key={l.id} className="transition-colors hover:bg-gray-50">
                <td className={`p-2 border font-mono text-xs ${l.action.startsWith('impersonate.') ? 'bg-yellow-100 text-yellow-800 font-bold' : ''}`}>
                  {l.action.startsWith('impersonate.') && <UserCheck className="inline w-4 h-4 mr-1 align-text-bottom text-yellow-600" />}
                  {l.action}
                </td>
                <td className="p-2 border">{l.actor ? (l.actor.name || l.actor.email || l.actor.id) : <span className="text-gray-400">(system)</span>}</td>
                <td className="p-2 border">{l.targetType ? `${l.targetType} (${l.targetId})` : l.targetId}</td>
                <td className="p-2 border text-xs">
                  {l.details ? <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(l.details, null, 2)}</pre> : <span className="text-gray-400">-</span>}
                </td>
                <td className="p-2 border text-xs">{new Date(l.createdAt).toLocaleString()}</td>
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
    </div>
  );
} 