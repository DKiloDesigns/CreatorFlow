'use client';

import React, { useEffect, useState } from 'react';
import { useUserNotifications } from '@/hooks/useUserNotifications';

interface NotifPrefs {
  mentions: boolean;
  comments: boolean;
  system: boolean;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  publishedAt: string | null;
  readBy: { id: string }[];
}

const defaultPrefs: NotifPrefs = {
  mentions: true,
  comments: true,
  system: true,
};

export default function NotificationsPage() {
  const { notifications, isLoading, error, updating, updateError, updatePrefs, markAllRead } = useUserNotifications();
  const [prefs, setPrefs] = useState<NotifPrefs>(defaultPrefs);
  const [success, setSuccess] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annLoading, setAnnLoading] = useState(true);
  const [annError, setAnnError] = useState<string | null>(null);
  const [marking, setMarking] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (notifications?.prefs) {
      setPrefs({ ...defaultPrefs, ...notifications.prefs });
    }
  }, [notifications]);

  useEffect(() => {
    // Fetch announcements and user id
    async function fetchAnnouncements() {
      setAnnLoading(true);
      try {
        const res = await fetch('/api/announcements');
        if (!res.ok) throw new Error('Failed to fetch announcements');
        const data = await res.json();
        setAnnouncements(data);
        // Try to get user id from first readBy or from session
        if (data.length > 0 && data[0].readBy) {
          // Assume current user is not in readBy if unread
          const allIds = data.flatMap((a: Announcement) => a.readBy.map(u => u.id));
          if (allIds.length > 0) setUserId(allIds[0]);
        }
      } catch (e: any) {
        setAnnError(e.message || 'Failed to load announcements');
      } finally {
        setAnnLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  const handlePrefChange = (type: keyof NotifPrefs, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [type]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    await updatePrefs(prefs);
    setSuccess(true);
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  async function markAnnouncementRead(id: string) {
    setMarking(id);
    await fetch('/api/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setAnnouncements(a => a.map(an => an.id === id ? { ...an, readBy: [...an.readBy, { id: userId || 'me' }] } : an));
    setMarking(null);
  }

  const unreadAnnouncements = announcements.filter(a => !a.readBy.some(u => u.id === userId));

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error.message || 'Error loading notifications.'}</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {annLoading ? <div>Loading announcements...</div> : annError ? <div className="text-red-500">{annError}</div> : (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Admin Announcements {unreadAnnouncements.length > 0 && <span className="ml-2 bg-yellow-400 text-white px-2 py-0.5 rounded-full text-xs">{unreadAnnouncements.length} unread</span>}</h2>
          {announcements.length === 0 ? <div className="text-gray-400">No announcements</div> : (
            <ul className="space-y-4">
              {announcements.map(a => (
                <li key={a.id} className={`border rounded p-3 ${a.readBy.some(u => u.id === userId) ? 'bg-gray-50 text-gray-400' : 'bg-yellow-50'}`}>
                  <div className="font-bold text-lg mb-1">{a.title}</div>
                  <div className="mb-2 whitespace-pre-line">{a.body}</div>
                  <div className="text-xs text-gray-500 mb-2">{a.publishedAt ? new Date(a.publishedAt).toLocaleString() : ''}</div>
                  {!a.readBy.some(u => u.id === userId) && (
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded text-xs" disabled={marking === a.id} onClick={() => markAnnouncementRead(a.id)}>{marking === a.id ? 'Marking...' : 'Mark as read'}</button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <label className="block font-medium mb-1">Notification Preferences</label>
          <div className="flex flex-col gap-2">
            <label><input type="checkbox" className="mr-2" checked={prefs.mentions} onChange={e => handlePrefChange('mentions', e.target.checked)} /> Mentions</label>
            <label><input type="checkbox" className="mr-2" checked={prefs.comments} onChange={e => handlePrefChange('comments', e.target.checked)} /> Comments</label>
            <label><input type="checkbox" className="mr-2" checked={prefs.system} onChange={e => handlePrefChange('system', e.target.checked)} /> System Alerts</label>
          </div>
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded" disabled={updating}>{updating ? 'Saving...' : 'Save'}</button>
        {updateError && <div className="text-red-500">{updateError}</div>}
        {success && !updateError && <div className="text-green-600">Preferences saved!</div>}
        <div>
          <label className="block font-medium mb-1">Recent Notifications</label>
          <ul className="list-disc ml-6 text-sm">
            {notifications?.list && notifications.list.length > 0 ? notifications.list.map((n: any) => (
              <li key={n.id} className={n.read ? 'text-gray-400' : ''}>{n.text}</li>
            )) : <li className="text-gray-400">No notifications</li>}
          </ul>
          <button type="button" className="bg-primary text-white px-4 py-2 rounded mt-2" onClick={handleMarkAllRead} disabled={updating}>Mark All as Read</button>
        </div>
      </form>
    </div>
  );
} 