import React, { useEffect, useState } from 'react';
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function UsageModal({ open, onOpenChange, template, type }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  template: any;
  type: 'captions' | 'hashtags';
}) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    let url = type === 'captions'
      ? `/api/caption-templates/usage?templateId=${template.id}`
      : `/api/hashtag-groups/usage?groupId=${template.id}`;
    fetch(url)
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => { setError('Failed to load usage'); setLoading(false); });
  }, [open, template, type]);

  return (
    <AlertDialogContent aria-modal="true" role="dialog" aria-labelledby="usage-modal-title">
      <AlertDialogHeader>
        <AlertDialogTitle id="usage-modal-title">Usage Analytics</AlertDialogTitle>
        <AlertDialogDescription>See how this template has been used.</AlertDialogDescription>
      </AlertDialogHeader>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : stats && (
        <div>
          <div className="mb-2">
            <b>Total Uses:</b> {stats.count}<br />
            <b>Last Used:</b> {stats.lastUsed ? new Date(stats.lastUsed).toLocaleString() : 'Never'}
          </div>
          <div className="mb-2">
            <b>Per User:</b>
            <ul className="ml-4">
              {Object.entries(stats.perUser || {}).map(([user, count]) => (
                <li key={user}>{user}: {count as number}</li>
              ))}
            </ul>
          </div>
          <div>
            <b>Usage History:</b>
            <ul className="ml-4 max-h-40 overflow-y-auto">
              {stats.history.map((u: any) => (
                <li key={u.id}>{u.action} by {u.userId} at {new Date(u.usedAt).toLocaleString()}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <AlertDialogCancel asChild>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </AlertDialogCancel>
      </div>
    </AlertDialogContent>
  );
} 