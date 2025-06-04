import React, { useEffect, useState } from 'react';
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const PERMISSIONS = [
  { key: 'view', label: 'View' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

export default function ShareModal({ open, onOpenChange, template, type, onUpdated }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: any;
  type: 'captions' | 'hashtags';
  onUpdated?: () => void;
}) {
  const [shares, setShares] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['view']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch shares for this template
  useEffect(() => {
    if (!open) return;
    const fetchShares = async () => {
      setLoading(true);
      setError('');
      let url = type === 'captions'
        ? `/api/caption-templates/shares?templateId=${template.id}&type=caption`
        : `/api/hashtag-groups/shares?groupId=${template.id}&type=hashtag`;
      const res = await fetch(url);
      if (res.ok) setShares(await res.json());
      else setError('Failed to load shares');
      setLoading(false);
    };
    fetchShares();
  }, [open, template, type]);

  // Add new share
  const handleAdd = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    let url = type === 'captions' ? '/api/caption-templates/shares' : '/api/hashtag-groups/shares';
    const body = type === 'captions'
      ? { templateId: template.id, type: 'caption', sharedWithEmail: email, permissions }
      : { groupId: template.id, type: 'hashtag', sharedWithEmail: email, permissions };
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setEmail('');
      setPermissions(['view']);
      if (onUpdated) onUpdated();
      // Refresh shares
      const updated = await res.json();
      setShares(s => [...s, updated]);
    } else {
      setError('Failed to add share');
    }
    setLoading(false);
  };

  // Update permissions
  const handleUpdate = async (share: any, newPerms: string[]) => {
    setLoading(true);
    setError('');
    let url = type === 'captions' ? '/api/caption-templates/shares' : '/api/hashtag-groups/shares';
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: share.id, permissions: newPerms }),
    });
    if (res.ok) {
      setShares(shares.map(s => s.id === share.id ? { ...s, permissions: newPerms } : s));
      if (onUpdated) onUpdated();
    } else {
      setError('Failed to update permissions');
    }
    setLoading(false);
  };

  // Remove share
  const handleRemove = async (share: any) => {
    if (!window.confirm('Remove this share?')) return;
    setLoading(true);
    setError('');
    let url = type === 'captions' ? '/api/caption-templates/shares' : '/api/hashtag-groups/shares';
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: share.id }),
    });
    if (res.ok) {
      setShares(shares.filter(s => s.id !== share.id));
      if (onUpdated) onUpdated();
    } else {
      setError('Failed to remove share');
    }
    setLoading(false);
  };

  return (
    <AlertDialogContent aria-modal="true" role="dialog" aria-labelledby="share-modal-title">
      <AlertDialogHeader>
        <AlertDialogTitle id="share-modal-title">Share {type === 'captions' ? 'Caption Template' : 'Hashtag Group'}</AlertDialogTitle>
        <AlertDialogDescription>Share with teammates by email and set permissions.</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="mb-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="User email"
          aria-label="User email"
          className="border rounded px-2 py-1 mr-2"
          disabled={loading}
        />
        {PERMISSIONS.map(p => (
          <label key={p.key} className="mr-2">
            <input
              type="checkbox"
              checked={permissions.includes(p.key)}
              onChange={e => setPermissions(perms => e.target.checked ? [...perms, p.key] : perms.filter(k => k !== p.key))}
              disabled={loading}
            /> {p.label}
          </label>
        ))}
        <Button onClick={handleAdd} disabled={loading || !email.trim()} aria-label="Add share">Add</Button>
      </div>
      <div>
        <h4 className="font-semibold mb-1">Current Shares</h4>
        {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
          <ul>
            {shares.length === 0 && <li className="text-muted-foreground">No shares yet.</li>}
            {shares.map(share => (
              <li key={share.id} className="flex items-center gap-2 mb-1">
                <span className="w-48 truncate" title={share.sharedWithEmail}>{share.sharedWithEmail}</span>
                {PERMISSIONS.map(p => (
                  <label key={p.key} className="mr-1 text-xs">
                    <input
                      type="checkbox"
                      checked={share.permissions.includes(p.key)}
                      onChange={e => handleUpdate(share, e.target.checked ? [...share.permissions, p.key] : share.permissions.filter((k: string) => k !== p.key))}
                      disabled={loading}
                    /> {p.label}
                  </label>
                ))}
                <Button size="sm" variant="ghost" onClick={() => handleRemove(share)} aria-label="Remove share" disabled={loading}>Remove</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <AlertDialogCancel asChild>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </AlertDialogCancel>
      </div>
    </AlertDialogContent>
  );
} 