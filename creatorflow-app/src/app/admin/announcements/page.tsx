'use client';

import React, { useEffect, useState } from 'react';
import { NotificationToast } from '@/components/ui/notification-badge';

interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string | null; email: string | null };
  published: boolean;
  publishedAt: string | null;
  audience?: string | null;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<null | { title: string; message?: string; variant?: 'success' | 'error' | 'info' }>(null);
  const [form, setForm] = useState<Partial<Announcement> & { id?: string; customUserId?: string }>({});
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function fetchAnnouncements() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data = await res.json();
      setAnnouncements(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  }

  function startNew() {
    setForm({ title: '', body: '', audience: '' });
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(a: Announcement) {
    setForm({ ...a });
    setEditing(a);
    setShowForm(true);
  }

  async function saveAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/announcements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save announcement');
      setToast({ title: editing ? 'Announcement updated' : 'Announcement created', variant: 'success' });
      setShowForm(false);
      setForm({});
      setEditing(null);
      fetchAnnouncements();
    } catch (e: any) {
      setToast({ title: 'Error', message: e.message, variant: 'error' });
    }
  }

  async function publishAnnouncement(id: string, published: boolean) {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, published }),
      });
      if (!res.ok) throw new Error('Failed to update announcement');
      setToast({ title: published ? 'Announcement published' : 'Announcement unpublished', variant: 'success' });
      fetchAnnouncements();
    } catch (e: any) {
      setToast({ title: 'Error', message: e.message, variant: 'error' });
    }
  }

  async function deleteAnnouncement(id: string) {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete announcement');
      setToast({ title: 'Announcement deleted', variant: 'success' });
      fetchAnnouncements();
    } catch (e: any) {
      setToast({ title: 'Error', message: e.message, variant: 'error' });
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Announcements</h1>
      <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={startNew}>New Announcement</button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="w-full border mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Created By</th>
              <th className="p-2 border">Published At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id}>
                <td className="p-2 border">{a.title}</td>
                <td className="p-2 border">{a.published ? 'Published' : 'Draft'}</td>
                <td className="p-2 border">{a.createdBy?.name || a.createdBy?.email || a.createdBy?.id}</td>
                <td className="p-2 border text-xs">{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : '-'}</td>
                <td className="p-2 border space-x-2">
                  <button className="px-2 py-1 bg-gray-200 rounded text-xs" onClick={() => startEdit(a)}>Edit</button>
                  <button className={`px-2 py-1 rounded text-xs ${a.published ? 'bg-yellow-200' : 'bg-green-200'}`} onClick={() => publishAnnouncement(a.id, !a.published)}>{a.published ? 'Unpublish' : 'Publish'}</button>
                  <button className="px-2 py-1 bg-red-200 rounded text-xs" onClick={() => deleteAnnouncement(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form className="bg-white rounded shadow-lg p-6 max-w-md w-full relative" onSubmit={saveAnnouncement}>
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" type="button" onClick={() => setShowForm(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">{editing ? 'Edit Announcement' : 'New Announcement'}</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Title</label>
              <input className="w-full border rounded px-2 py-1" value={form.title || ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Body</label>
              <textarea className="w-full border rounded px-2 py-1" rows={5} value={form.body || ''} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} required />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Audience</label>
              <select className="w-full border rounded px-2 py-1" value={form.audience || 'all'} onChange={e => setForm(f => ({ ...f, audience: e.target.value }))}>
                <option value="all">All Users</option>
                <option value="admins">Admins Only</option>
                <option value="custom">Custom (user id)</option>
              </select>
              {form.audience === 'custom' && (
                <input className="w-full border rounded px-2 py-1 mt-2" placeholder="Enter user id" value={form.customUserId || ''} onChange={e => setForm(f => ({ ...f, customUserId: e.target.value, audience: 'user:' + e.target.value }))} />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
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