'use client';

import React, { useEffect, useState } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Add type for settings
interface Settings {
  theme: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: string;
  connected: {
    google: boolean;
    twitter: boolean;
  };
}

const defaultSettings: Settings = {
  theme: 'System',
  language: 'English',
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  dashboard: 'Main',
  connected: {
    google: false,
    twitter: false,
  },
};

const NOTIF_TYPES = [
  { key: 'announcement', label: 'Announcements' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'security', label: 'Security Alerts' },
];
const NOTIF_CHANNELS = [
  { key: 'inApp', label: 'In-App' },
  { key: 'email', label: 'Email' },
];

export default function SettingsPage() {
  const { settings, isLoading, error, updating, updateError, updateSettings } = useUserSettings();
  const [form, setForm] = useState<Settings>(defaultSettings);
  const [success, setSuccess] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<any>({});
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [notifSuccess, setNotifSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({ ...defaultSettings, ...settings });
    }
  }, [settings]);

  useEffect(() => {
    async function fetchNotifPrefs() {
      setNotifLoading(true);
      setNotifError(null);
      try {
        const res = await fetch('/api/user');
        if (!res.ok) throw new Error('Failed to fetch notification preferences');
        const user = await res.json();
        setNotifPrefs(user.notificationPreferences || {});
      } catch (e: any) {
        setNotifError(e.message || 'Failed to load notification preferences');
      } finally {
        setNotifLoading(false);
      }
    }
    fetchNotifPrefs();
  }, []);

  const handleChange = (field: keyof Settings, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotifChange = (type: keyof Settings['notifications'], value: boolean) => {
    setForm((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: value },
    }));
  };

  const handleConnect = (provider: keyof Settings['connected']) => {
    setForm((prev) => ({
      ...prev,
      connected: { ...prev.connected, [provider]: !prev.connected[provider] },
    }));
  };

  const handleNotifPrefChange = (type: string, channel: string, value: boolean) => {
    setNotifPrefs((prev: any) => ({
      ...prev,
      [type]: { ...(prev[type] || {}), [channel]: value },
    }));
  };

  const handleNotifPrefSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSuccess(false);
    setNotifError(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationPreferences: notifPrefs }),
      });
      if (!res.ok) throw new Error('Failed to update notification preferences');
      setNotifSuccess(true);
    } catch (e: any) {
      setNotifError(e.message || 'Failed to update notification preferences');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    await updateSettings(form);
    setSuccess(true);
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">{error.message || 'Error loading settings.'}</div>;

  return (
    <div className="p-4 sm:p-8 max-w-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 break-words">Settings</h1>
      {/* Notification Preferences Section */}
      <form className="mb-8" onSubmit={handleNotifPrefSave}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Notification Preferences</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="email-notifications"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="email-notifications" className="text-sm">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="in-app-notifications"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="in-app-notifications" className="text-sm">In-App</Label>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600"
          >
            Save Notification Preferences
          </Button>
        </div>
        {notifSuccess && <div className="text-green-600 mt-2 break-words">Preferences saved!</div>}
        {notifError && <div className="text-red-500 mt-2 break-words">{notifError}</div>}
      </form>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-2 break-words">Theme</label>
          <select
            className="w-full border rounded px-3 py-2 min-h-[44px]"
            value={form.theme}
            onChange={e => handleChange('theme', e.target.value)}
          >
            <option>System</option>
            <option>Light</option>
            <option>Dark</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2 break-words">Language</label>
          <select
            className="w-full border rounded px-3 py-2 min-h-[44px]"
            value={form.language}
            onChange={e => handleChange('language', e.target.value)}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2 break-words">Notification Preferences</label>
          <div className="flex flex-col gap-3">
            <label className="flex items-center min-h-[44px]">
              <input 
                type="checkbox" 
                className="mr-3 min-w-[44px] min-h-[44px]" 
                checked={form.notifications.email} 
                onChange={e => handleNotifChange('email', e.target.checked)} 
              /> 
              <span className="break-words">Email</span>
            </label>
            <label className="flex items-center min-h-[44px]">
              <input 
                type="checkbox" 
                className="mr-3 min-w-[44px] min-h-[44px]" 
                checked={form.notifications.push} 
                onChange={e => handleNotifChange('push', e.target.checked)} 
              /> 
              <span className="break-words">Push</span>
            </label>
            <label className="flex items-center min-h-[44px]">
              <input 
                type="checkbox" 
                className="mr-3 min-w-[44px] min-h-[44px]" 
                checked={form.notifications.sms} 
                onChange={e => handleNotifChange('sms', e.target.checked)} 
              /> 
              <span className="break-words">SMS</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-2 break-words">Default Dashboard</label>
          <select
            className="w-full border rounded px-3 py-2 min-h-[44px]"
            value={form.dashboard}
            onChange={e => handleChange('dashboard', e.target.value)}
          >
            <option>Main</option>
            <option>Content</option>
            <option>AI Tools</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2 break-words">Connected Accounts</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              className={`px-4 py-2 rounded min-h-[44px] break-words bg-gray-600 dark:bg-gray-800 text-white dark:text-white border border-gray-600 dark:border-gray-700 ${form.connected.google ? 'bg-green-600 dark:bg-green-700' : ''}`} 
              onClick={() => handleConnect('google')}
            >
              {form.connected.google ? 'Google Connected' : 'Connect Google'}
            </button>
            <button 
              type="button" 
              className={`px-4 py-2 rounded min-h-[44px] break-words bg-gray-600 dark:bg-gray-800 text-white dark:text-white border border-gray-600 dark:border-gray-700 ${form.connected.twitter ? 'bg-green-600 dark:bg-green-700' : ''}`} 
              onClick={() => handleConnect('twitter')}
            >
              {form.connected.twitter ? 'Twitter Connected' : 'Connect Twitter'}
            </button>
          </div>
        </div>
        <button 
          type="submit" 
          className="bg-primary text-white px-4 py-2 rounded w-full sm:w-auto min-w-[44px] min-h-[44px]" 
          disabled={updating}
        >
          {updating ? 'Saving...' : 'Save'}
        </button>
        {updateError && <div className="text-red-500 break-words">{updateError}</div>}
        {success && !updateError && <div className="text-green-600 break-words">Settings saved!</div>}
      </form>
    </div>
  );
} 