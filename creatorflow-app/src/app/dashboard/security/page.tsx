'use client';

import React, { useState } from 'react';
import { useUserSecurity } from '@/hooks/useUserSecurity';

interface Session {
  id: string;
  device: string;
  current: boolean;
}

const defaultSessions: Session[] = [
  { id: '1', device: 'MacBook Pro (This device)', current: true },
  { id: '2', device: 'iPhone 15', current: false },
];

export default function SecurityPage() {
  const { loading, error, success, changePassword, toggle2FA, deleteAccount, setSuccess, setError } = useUserSecurity();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    await changePassword(password);
    setPassword('');
    setConfirm('');
  };

  const handle2FA = async () => {
    await toggle2FA(!twoFA);
    setTwoFA((prev) => !prev);
  };

  const handleDelete = async () => {
    await deleteAccount();
  };

  // Session revoke is still simulated
  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Security</h1>
      <form className="space-y-6" onSubmit={handlePasswordChange}>
        <div>
          <label className="block font-medium mb-1">Change Password</label>
          <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="password" className="w-full border rounded px-3 py-2" placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded mt-2">Update Password</button>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </div>
        <div>
          <label className="block font-medium mb-1">Two-Factor Authentication (2FA)</label>
          <button type="button" className={`px-3 py-1 rounded ${twoFA ? 'bg-green-200' : 'bg-gray-100'}`} onClick={handle2FA}>{twoFA ? '2FA Enabled' : 'Enable 2FA'}</button>
        </div>
        <div>
          <label className="block font-medium mb-1">Active Sessions / Devices</label>
          <ul className="list-disc ml-6 text-sm">
            {sessions.map((s) => (
              <li key={s.id}>{s.device} {s.current && <span className="text-xs text-blue-500">(Current)</span>} <button type="button" className="text-xs text-red-500 ml-2" onClick={() => handleRevoke(s.id)}>Revoke</button></li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block font-medium mb-1">Recent Security Activity</label>
          <ul className="list-disc ml-6 text-sm">
            <li>Login from new device - 2 hours ago</li>
            <li>Password changed - 3 days ago</li>
          </ul>
        </div>
        <div>
          <label className="block font-medium mb-1 text-red-600">Delete Account</label>
          <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>Delete My Account</button>
        </div>
      </form>
    </div>
  );
} 