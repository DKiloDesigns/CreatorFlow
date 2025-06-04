import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export const COMMON_VARIABLES = [
  { key: 'username', label: 'Username' },
  { key: 'date', label: 'Date' },
  { key: 'platform', label: 'Platform' },
  { key: 'brand', label: 'Brand' },
  { key: 'cta', label: 'Call to Action' },
];

export default function SnippetManager({ open, onOpenChange, onInsert }: { open: boolean; onOpenChange: (v: boolean) => void; onInsert: (text: string) => void }) {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/template-snippets')
      .then(res => res.json())
      .then(data => { setSnippets(data); setLoading(false); })
      .catch(() => { setError('Failed to load snippets'); setLoading(false); });
  }, [open]);

  const handleAdd = async () => {
    if (!newName.trim() || !newContent.trim()) return;
    setLoading(true);
    const res = await fetch('/api/template-snippets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, content: newContent })
    });
    if (res.ok) {
      const created = await res.json();
      setSnippets(s => [...s, created]);
      setNewName('');
      setNewContent('');
    }
    setLoading(false);
  };
  const handleEdit = (id: string, name: string, content: string) => {
    setEditingId(id);
    setEditingName(name);
    setEditingContent(content);
  };
  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim() || !editingContent.trim()) return;
    setLoading(true);
    const res = await fetch('/api/template-snippets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name: editingName, content: editingContent })
    });
    if (res.ok) {
      const updated = await res.json();
      setSnippets(s => s.map(sn => sn.id === editingId ? updated : sn));
      setEditingId(null);
      setEditingName('');
      setEditingContent('');
    }
    setLoading(false);
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    await fetch('/api/template-snippets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setSnippets(s => s.filter(sn => sn.id !== id));
    setLoading(false);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 ${open ? '' : 'hidden'}`} role="dialog" aria-modal="true">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Snippet Manager</h2>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
        <div className="mb-4">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Snippet name" className="border rounded px-2 py-1 mr-2" />
          <input value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Snippet content" className="border rounded px-2 py-1 mr-2 w-48" />
          <Button onClick={handleAdd} disabled={loading}>Add</Button>
        </div>
        {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
          <ul className="mb-4 max-h-40 overflow-y-auto">
            {snippets.map(sn => (
              <li key={sn.id} className="flex items-center gap-2 mb-1">
                {editingId === sn.id ? (
                  <>
                    <input value={editingName} onChange={e => setEditingName(e.target.value)} className="border rounded px-2 py-1 w-24" />
                    <input value={editingContent} onChange={e => setEditingContent(e.target.value)} className="border rounded px-2 py-1 w-48" />
                    <Button size="sm" onClick={handleSaveEdit}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <span className="w-24 truncate font-semibold">{sn.name}</span>
                    <span className="w-48 truncate">{sn.content}</span>
                    <Button size="sm" onClick={() => onInsert(sn.content)}>Insert</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(sn.id, sn.name, sn.content)}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(sn.id)}>Delete</Button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mb-2">
          <h3 className="font-semibold mb-1">Insert Variable</h3>
          <div className="flex gap-2 flex-wrap">
            {COMMON_VARIABLES.map(v => (
              <Button key={v.key} size="sm" variant="outline" onClick={() => onInsert(`{${v.key}}`)}>{v.label}</Button>
            ))}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">Use <code>{'{variable}'}</code> in your templates. Snippets can be inserted anywhere in your template content.</div>
      </div>
    </div>
  );
} 