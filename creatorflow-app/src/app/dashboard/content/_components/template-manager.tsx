import React, { useState, useEffect, useRef } from 'react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Star, Pin, Eye, Share2, Users } from 'lucide-react';
import ShareModal from './share-modal';
import AiSuggestModal from './ai-suggest-modal';
import UsageModal from './usage-modal';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SnippetManager, { COMMON_VARIABLES } from './snippet-manager';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'hi', label: 'Hindi' },
  { code: 'ar', label: 'Arabic' },
];

export default function TemplateManager({ onInsert }: { onInsert?: (text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'captions' | 'hashtags'>('captions');
  const [captions, setCaptions] = useState<any[]>([]);
  const [hashtags, setHashtags] = useState<any[]>([]);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');
  const [newTags, setNewTags] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingText, setEditingText] = useState('');
  const [editingTags, setEditingTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [versionHistory, setVersionHistory] = useState<any[] | null>(null);
  const [historyForId, setHistoryForId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareTarget, setShareTarget] = useState<any>(null);
  const [shareType, setShareType] = useState<'captions' | 'hashtags'>('captions');
  const [sharedIds, setSharedIds] = useState<string[]>([]);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [usageTarget, setUsageTarget] = useState<any>(null);
  const [usageType, setUsageType] = useState<'captions' | 'hashtags'>('captions');
  const [newActiveFrom, setNewActiveFrom] = useState('');
  const [newActiveTo, setNewActiveTo] = useState('');
  const [newUsageLimit, setNewUsageLimit] = useState('');
  const [editingActiveFrom, setEditingActiveFrom] = useState('');
  const [editingActiveTo, setEditingActiveTo] = useState('');
  const [editingUsageLimit, setEditingUsageLimit] = useState('');
  const [language, setLanguage] = useState('en');
  const [editingLanguage, setEditingLanguage] = useState('en');
  const [snippetModalOpen, setSnippetModalOpen] = useState(false);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState('');
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [suggested, setSuggested] = useState<any[]>([]);
  const [suggestedLoading, setSuggestedLoading] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  // Fetch templates/groups on open or tab change
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    if (tab === 'captions') {
      fetch('/api/caption-templates')
        .then(res => res.json())
        .then(data => {
          setCaptions(data);
          setLoading(false);
        })
        .catch(e => { setError('Failed to load captions'); setLoading(false); });
    } else {
      fetch('/api/hashtag-groups')
        .then(res => res.json())
        .then(data => {
          setHashtags(data);
          setLoading(false);
        })
        .catch(e => { setError('Failed to load hashtags'); setLoading(false); });
    }
  }, [open, tab]);

  // Fetch shares for all templates on open or tab change
  useEffect(() => {
    if (!open) return;
    const fetchShares = async () => {
      let url = tab === 'captions' ? '/api/caption-templates/shares?type=caption' : '/api/hashtag-groups/shares?type=hashtag';
      const res = await fetch(url);
      if (res.ok) {
        const shares = await res.json();
        setSharedIds(shares.map((s: any) => s.captionTemplateId || s.hashtagGroupId));
      }
    };
    fetchShares();
  }, [open, tab, captions, hashtags]);

  // Fetch folders on open
  useEffect(() => {
    if (!open) return;
    fetch('/api/template-folders')
      .then(res => res.json())
      .then(setFolders);
  }, [open]);

  // Fetch suggestions on open or category change
  useEffect(() => {
    if (!open) return;
    setSuggestedLoading(true);
    fetch(`/api/templates-suggestions?recent=true${category && category !== 'All' ? `&category=${encodeURIComponent(category)}` : ''}`)
      .then(res => res.json())
      .then(data => { setSuggested(data); setSuggestedLoading(false); })
      .catch(() => setSuggestedLoading(false));
  }, [open, category]);

  // Add new template/group
  const handleAdd = async () => {
    if (!newName.trim() || !newText.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (tab === 'captions') {
        const res = await fetch('/api/caption-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, content: newText, category, tags: newTags.split(/[ ,]+/).filter(Boolean), activeFrom: newActiveFrom, activeTo: newActiveTo, usageLimit: newUsageLimit, language })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to add caption');
        const created = await res.json();
        setCaptions(c => [...c, created]);
        toast.success('Caption template added!');
      } else {
        const res = await fetch('/api/hashtag-groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, hashtags: newText.split(/\s+/).filter(Boolean), category, tags: newTags.split(/[ ,]+/).filter(Boolean), activeFrom: newActiveFrom, activeTo: newActiveTo, usageLimit: newUsageLimit, language })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to add hashtag group');
        const created = await res.json();
        setHashtags(h => [...h, created]);
        toast.success('Hashtag group added!');
      }
      setNewName('');
      setNewText('');
      setNewTags('');
      setNewActiveFrom('');
      setNewActiveTo('');
      setNewUsageLimit('');
      setLanguage('en');
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (id: string, name: string, text: string, category: string, tags: string[]) => {
    setEditingId(id);
    setEditingName(name);
    setEditingText(text);
    setCategory(category || 'Uncategorized');
    setEditingTags(tags?.join(', ') || '');
    setEditingActiveFrom('');
    setEditingActiveTo('');
    setEditingUsageLimit('');
    setEditingLanguage('en');
  };
  const handleSaveEdit = async () => {
    if (!editingText.trim() || !editingId || !editingName.trim()) return;
    setLoading(true);
    setError('');
    try {
      if (tab === 'captions') {
        const res = await fetch('/api/caption-templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, name: editingName, content: editingText, category, tags: editingTags.split(/[ ,]+/).filter(Boolean), activeFrom: editingActiveFrom, activeTo: editingActiveTo, usageLimit: editingUsageLimit, language: editingLanguage })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update caption');
        const updated = await res.json();
        setCaptions(c => c.map(t => t.id === editingId ? updated : t));
        toast.success('Caption updated!');
      } else {
        const res = await fetch('/api/hashtag-groups', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, name: editingName, hashtags: editingText.split(/\s+/).filter(Boolean), category, tags: editingTags.split(/[ ,]+/).filter(Boolean), activeFrom: editingActiveFrom, activeTo: editingActiveTo, usageLimit: editingUsageLimit, language: editingLanguage })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update hashtag group');
        const updated = await res.json();
        setHashtags(h => h.map(t => t.id === editingId ? updated : t));
        toast.success('Hashtag group updated!');
      }
      setEditingId(null);
      setEditingName('');
      setEditingText('');
      setEditingTags('');
      setEditingActiveFrom('');
      setEditingActiveTo('');
      setEditingUsageLimit('');
      setLanguage('en');
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  // Delete
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      if (tab === 'captions') {
        const res = await fetch('/api/caption-templates', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete caption');
        setCaptions(c => c.filter(t => t.id !== id));
        toast.success('Caption deleted!');
      } else {
        const res = await fetch('/api/hashtag-groups', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete hashtag group');
        setHashtags(h => h.filter(t => t.id !== id));
        toast.success('Hashtag group deleted!');
      }
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };
  // Insert
  const handleInsert = (text: string) => {
    if (onInsert) onInsert(text);
    toast.success('Template inserted!');
    setOpen(false);
  };

  // Folder CRUD handlers
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const res = await fetch('/api/template-folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFolderName })
    });
    if (res.ok) {
      const created = await res.json();
      setFolders(f => [...f, created]);
      setNewFolderName('');
    }
  };
  const handleRenameFolder = async (id: string) => {
    if (!renamingFolderName.trim()) return;
    const res = await fetch('/api/template-folders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name: renamingFolderName })
    });
    if (res.ok) {
      const updated = await res.json();
      setFolders(f => f.map(folder => folder.id === id ? updated : folder));
      setRenamingFolderId(null);
      setRenamingFolderName('');
    }
  };
  const handleDeleteFolder = async (id: string) => {
    if (!window.confirm('Delete this folder?')) return;
    await fetch('/api/template-folders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    setFolders(f => f.filter(folder => folder.id !== id));
    if (selectedFolderId === id) setSelectedFolderId(null);
  };

  // Move template to folder
  const handleMoveToFolder = async (templateId: string, type: 'captions' | 'hashtags', folderId: string | null) => {
    const url = type === 'captions' ? '/api/caption-templates' : '/api/hashtag-groups';
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: templateId, folderId })
    });
    if (res.ok) {
      const updated = await res.json();
      if (type === 'captions') setCaptions(c => c.map(t => t.id === templateId ? updated : t));
      else setHashtags(h => h.map(t => t.id === templateId ? updated : t));
    }
  };

  // Filtered templates
  const filteredCaptions = captions.filter(t =>
    (!selectedFolderId || t.folderId === selectedFolderId) &&
    (category === 'All' || t.category === category) &&
    (language === 'all' || t.language === language) &&
    (t.name?.toLowerCase().includes(search.toLowerCase()) || t.content?.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredHashtags = hashtags.filter(t =>
    (!selectedFolderId || t.folderId === selectedFolderId) &&
    (category === 'All' || t.category === category) &&
    (language === 'all' || t.language === language) &&
    (t.name?.toLowerCase().includes(search.toLowerCase()) || (Array.isArray(t.hashtags) ? t.hashtags.join(' ').toLowerCase().includes(search.toLowerCase()) : t.hashtags?.toLowerCase().includes(search.toLowerCase())))
  );

  const sortTemplates = (arr: any[]) => [
    ...arr.filter(t => t.isPinned).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    ...arr.filter(t => !t.isPinned).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  ];

  // Define handleToggleFavorite and handleTogglePinned
  const handleToggleFavorite = async (id: string, isFavorite: boolean, type: 'captions' | 'hashtags') => {
    const url = type === 'captions' ? '/api/caption-templates' : '/api/hashtag-groups';
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isFavorite: !isFavorite })
    });
    if (res.ok) {
      const updated = await res.json();
      if (type === 'captions') setCaptions(c => c.map(t => t.id === id ? updated : t));
      else setHashtags(h => h.map(t => t.id === id ? updated : t));
    }
  };
  const handleTogglePinned = async (id: string, isPinned: boolean, type: 'captions' | 'hashtags') => {
    const url = type === 'captions' ? '/api/caption-templates' : '/api/hashtag-groups';
    const res = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isPinned: !isPinned })
    });
    if (res.ok) {
      const updated = await res.json();
      if (type === 'captions') setCaptions(c => c.map(t => t.id === id ? updated : t));
      else setHashtags(h => h.map(t => t.id === id ? updated : t));
    }
  };

  // Helper to render rich text (basic markdown)
  function renderRichText(text: string) {
    if (!text) return null;
    // Simple markdown: *italic*, **bold**, emojis, line breaks
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\n/g, '<br />');
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }

  // Bulk actions
  const handleSelectAll = (templates: any[], checked: boolean) => {
    setSelectedIds(checked ? templates.map(t => t.id) : []);
  };
  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds(ids => checked ? [...ids, id] : ids.filter(i => i !== id));
  };
  const handleBulkDelete = async (type: 'captions' | 'hashtags') => {
    if (!selectedIds.length) return;
    if (!window.confirm('Delete selected templates?')) return;
    for (const id of selectedIds) {
      await (type === 'captions' ? handleDelete(id) : handleDelete(id));
    }
    setSelectedIds([]);
  };
  const handleBulkFavorite = async (type: 'captions' | 'hashtags') => {
    for (const id of selectedIds) {
      const arr = type === 'captions' ? captions : hashtags;
      const t = arr.find(t => t.id === id);
      if (t) await handleToggleFavorite(id, t.isFavorite, type);
    }
  };
  const handleBulkPin = async (type: 'captions' | 'hashtags') => {
    for (const id of selectedIds) {
      const arr = type === 'captions' ? captions : hashtags;
      const t = arr.find(t => t.id === id);
      if (t) await handleTogglePinned(id, t.isPinned, type);
    }
  };
  const handleExport = (type: 'captions' | 'hashtags') => {
    const arr = type === 'captions' ? captions : hashtags;
    const toExport = arr.filter(t => selectedIds.includes(t.id));
    const blob = new Blob([JSON.stringify(toExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-templates-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>, type: 'captions' | 'hashtags') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      for (const t of data) {
        if (type === 'captions') {
          await fetch('/api/caption-templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
          });
        } else {
          await fetch('/api/hashtag-groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
          });
        }
      }
      toast.success('Import complete!');
    } catch (e) {
      toast.error('Import failed. Invalid file.');
    } finally {
      setImporting(false);
    }
  };
  // Version history
  const handleShowHistory = async (id: string, type: 'captions' | 'hashtags') => {
    setHistoryForId(id);
    const res = await fetch(`/api/template-versions?templateId=${id}&type=${type}`);
    if (res.ok) setVersionHistory(await res.json());
  };
  const handleRevertVersion = async (version: any, type: 'captions' | 'hashtags') => {
    if (!window.confirm('Revert to this version?')) return;
    if (type === 'captions') {
      await fetch('/api/caption-templates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: version.captionTemplateId, name: version.name, content: version.content, category: version.category, tags: version.tags })
      });
    } else {
      await fetch('/api/hashtag-groups', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: version.hashtagGroupId, name: version.name, hashtags: version.hashtags, category: version.category, tags: version.tags })
      });
    }
    setVersionHistory(null);
    setHistoryForId(null);
    toast.success('Reverted!');
  };
  // On edit, save a version
  const saveVersion = async (template: any, type: 'captions' | 'hashtags') => {
    await fetch('/api/template-versions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...template, type })
    });
  };

  // Helper: getTemplateStatus
  function getTemplateStatus(t: any) {
    const now = new Date();
    if (t.activeTo && new Date(t.activeTo) < now) return 'expired';
    if (t.activeFrom && new Date(t.activeFrom) > now) return 'scheduled';
    if (t.usageLimit && t.usageCount >= t.usageLimit) return 'limit reached';
    return 'active';
  }

  function DragHandle() {
    return <span className="cursor-grab mr-2" aria-label="Drag handle">⋮⋮</span>;
  }

  function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    return (
      <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }} {...attributes} {...listeners}>
        {children}
      </li>
    );
  }

  function handleDragEndCaptions(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredCaptions.findIndex(t => t.id === active.id);
    const newIndex = filteredCaptions.findIndex(t => t.id === over.id);
    const newArr = arrayMove(filteredCaptions, oldIndex, newIndex);
    setCaptions(newArr);
    // Persist order
    newArr.forEach((t, i) => {
      fetch('/api/caption-templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, order: i })
      });
    });
  }

  function handleDragEndHashtags(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = filteredHashtags.findIndex(t => t.id === active.id);
    const newIndex = filteredHashtags.findIndex(t => t.id === over.id);
    const newArr = arrayMove(filteredHashtags, oldIndex, newIndex);
    setHashtags(newArr);
    // Persist order
    newArr.forEach((t, i) => {
      fetch('/api/hashtag-groups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: t.id, order: i })
      });
    });
  }

  // Helper: Insert snippet/variable into newText or editingText
  function handleInsertSnippet(text: string) {
    if (editingId) setEditingText(et => (et || '') + text);
    else setNewText(nt => (nt || '') + text);
  }

  // Helper: Live preview with variable replacement
  function renderPreview(text: string) {
    if (!text) return null;
    let replaced = text;
    COMMON_VARIABLES.forEach(v => {
      replaced = replaced.replaceAll(`{${v.key}}`, `[${v.label}]`);
    });
    return <span className="block bg-gray-50 border rounded p-2 mt-1 text-sm text-gray-700">{replaced}</span>;
  }

  // Render
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="mb-2" aria-label="Manage Templates">Manage Templates</Button>
      </AlertDialogTrigger>
      <AlertDialogContent aria-modal="true" role="dialog" aria-labelledby="template-manager-title" className="max-w-lg w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl max-w-[95vw] p-2 sm:p-6">
        <div className="flex justify-between items-center mb-2">
          <AlertDialogHeader>
            <AlertDialogTitle id="template-manager-title">Template Manager</AlertDialogTitle>
            <AlertDialogDescription>Manage your caption and hashtag templates.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel asChild>
            <Button variant="ghost" size="icon" aria-label="Close" className="ml-2">✕</Button>
          </AlertDialogCancel>
        </div>
        <div className="flex gap-4">
          {/* Folder Sidebar */}
          <div className="w-48 border-r pr-2">
            <div className="flex items-center mb-2">
              <span className="font-semibold flex-1">Folders</span>
              <button onClick={() => setSelectedFolderId(null)} className={`ml-2 text-xs ${!selectedFolderId ? 'font-bold underline' : ''}`}>All</button>
            </div>
            <ul className="mb-2">
              {folders.map(folder => (
                <li key={folder.id} className={`flex items-center gap-1 mb-1 ${selectedFolderId === folder.id ? 'bg-blue-100 rounded' : ''}`}> 
                  <button className="flex-1 text-left truncate" onClick={() => setSelectedFolderId(folder.id)}>{folder.name}</button>
                  <button className="text-xs text-gray-500" onClick={() => { setRenamingFolderId(folder.id); setRenamingFolderName(folder.name); }}>✏️</button>
                  <button className="text-xs text-red-500" onClick={() => handleDeleteFolder(folder.id)}>🗑️</button>
                </li>
              ))}
            </ul>
            {renamingFolderId ? (
              <div className="mb-2 flex gap-1">
                <input ref={folderInputRef} value={renamingFolderName} onChange={e => setRenamingFolderName(e.target.value)} className="border rounded px-1 py-0.5 flex-1" />
                <Button size="sm" onClick={() => handleRenameFolder(renamingFolderId)}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setRenamingFolderId(null)}>Cancel</Button>
              </div>
            ) : (
              <div className="mb-2 flex gap-1">
                <input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="New folder" className="border rounded px-1 py-0.5 flex-1" />
                <Button size="sm" onClick={handleCreateFolder}>Add</Button>
              </div>
            )}
          </div>
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search templates..."
                aria-label="Search templates"
                className="border rounded px-2 py-1 flex-1"
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="border rounded px-2 py-1"
              >
                {/* Add category options here */}
              </select>
              <select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Filter by language" className="border rounded px-2 py-1">
                <option value="all">All Languages</option>
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </div>
            <div className="flex justify-between items-center mb-2">
              <div></div>
              <Button variant="secondary" onClick={() => setAiModalOpen(true)} aria-label="AI Suggestion">AI Suggest</Button>
            </div>
            {tab === 'captions' && (
              <div className="mb-4">
                <h3 className="font-semibold mb-1">Suggested for you</h3>
                {suggestedLoading ? <div>Loading suggestions...</div> : (
                  suggested.length ? (
                    <ul className="flex flex-col gap-1">
                      {suggested.map(s => (
                        <li key={s.id} className="flex items-center gap-2 bg-yellow-50 border rounded px-2 py-1">
                          <span className="flex-1 truncate font-medium">{s.name}</span>
                          <span className="flex-1 truncate text-gray-600">{s.content}</span>
                          <Button size="sm" onClick={() => handleInsert(s.content)}>Insert</Button>
                        </li>
                      ))}
                    </ul>
                  ) : <div className="text-xs text-gray-400">No suggestions yet.</div>
                )}
              </div>
            )}
            <Tabs value={tab} onValueChange={(v: string) => setTab(v as 'captions' | 'hashtags')}>
              <TabsList aria-label="Template type tabs">
                <TabsTrigger value="captions">Captions</TabsTrigger>
                <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
              </TabsList>
              <TabsContent value="captions">
                {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                  <>
                    <div className="flex gap-2 mb-2">
                      <input type="checkbox" checked={selectedIds.length === filteredCaptions.length} onChange={e => handleSelectAll(filteredCaptions, e.target.checked)} aria-label="Select all captions" />
                      <Button onClick={() => handleBulkDelete('captions')} disabled={!selectedIds.length}>Delete</Button>
                      <Button onClick={() => handleBulkFavorite('captions')} disabled={!selectedIds.length}>Favorite</Button>
                      <Button onClick={() => handleBulkPin('captions')} disabled={!selectedIds.length}>Pin</Button>
                      <Button onClick={() => handleExport('captions')} disabled={!selectedIds.length}>Export</Button>
                      <label className="inline-block">
                        <span className="sr-only">Import</span>
                        <input type="file" accept="application/json" onChange={e => handleImport(e, 'captions')} className="hidden" disabled={importing} />
                        <Button asChild disabled={importing}>Import</Button>
                      </label>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndCaptions}>
                      <SortableContext items={filteredCaptions.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {sortTemplates(filteredCaptions).map(t => (
                          <SortableItem key={t.id} id={t.id}>
                            <div className="flex items-center gap-2 mb-1">
                              <DragHandle />
                              <input type="checkbox" checked={selectedIds.includes(t.id)} onChange={e => handleSelectOne(t.id, e.target.checked)} aria-label="Select caption template" />
                              {/* Favorite/Pin Buttons */}
                              <button onClick={() => handleToggleFavorite(t.id, t.isFavorite, 'captions')} aria-label={t.isFavorite ? 'Unfavorite' : 'Favorite'} className={t.isFavorite ? 'text-yellow-500' : 'text-gray-400'} style={t.isFavorite ? { background: 'none' } : {}}>
                                <Star className="h-4 w-4" fill={t.isFavorite ? 'currentColor' : 'none'} />
                              </button>
                              <button onClick={() => handleTogglePinned(t.id, t.isPinned, 'captions')} aria-label={t.isPinned ? 'Unpin' : 'Pin'} className={t.isPinned ? 'text-blue-500' : 'text-gray-400'} style={t.isPinned ? { background: 'none' } : {}}>
                                <Pin className="h-4 w-4" fill={t.isPinned ? 'currentColor' : 'none'} />
                              </button>
                              {/* Preview Button */}
                              <button onClick={() => setPreviewContent(t.content)} aria-label="Preview" className="text-gray-500 focus:outline-none">
                                <Eye className="h-4 w-4" />
                              </button>
                              {editingId === t.id ? (
                                <>
                                  <input value={editingName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingName(e.target.value)} aria-label="Edit caption name" className="border rounded px-2 py-1 w-32" placeholder="Name" />
                                  <input value={editingText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)} aria-label="Edit caption content" className="border rounded px-2 py-1 flex-1" placeholder="Content" />
                                  <Button size="sm" variant="outline" onClick={() => setSnippetModalOpen(true)} aria-label="Insert snippet or variable">Snippets/Vars</Button>
                                  <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Edit category" className="border rounded px-2 py-1">
                                    {/* Add category options here */}
                                  </select>
                                  <input value={editingTags} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTags(e.target.value)} aria-label="Edit tags" className="border rounded px-2 py-1 w-32" placeholder="Tags (comma or space separated)" />
                                  <input type="datetime-local" value={editingActiveFrom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingActiveFrom(e.target.value)} aria-label="Edit active from" className="border rounded px-2 py-1 w-40" />
                                  <input type="datetime-local" value={editingActiveTo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingActiveTo(e.target.value)} aria-label="Edit active to" className="border rounded px-2 py-1 w-40" />
                                  <input type="number" min="1" value={editingUsageLimit} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingUsageLimit(e.target.value)} aria-label="Edit usage limit" className="border rounded px-2 py-1 w-24" />
                                  <select value={editingLanguage} onChange={e => setEditingLanguage(e.target.value)} aria-label="Edit language" className="border rounded px-2 py-1 w-32">
                                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                                  </select>
                                  <select value={editingId ? (captions.find(t => t.id === editingId)?.folderId || '') : (newName ? '' : '')} onChange={e => editingId ? setCaptions(c => c.map(t => t.id === editingId ? { ...t, folderId: e.target.value } : t)) : setNewName(newName)} aria-label="Folder" className="border rounded px-2 py-1 w-32">
                                    <option value="">No Folder</option>
                                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                  </select>
                                  <Button size="sm" onClick={handleSaveEdit} aria-label="Save caption">Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} aria-label="Cancel edit">Cancel</Button>
                                </>
                              ) : (
                                <>
                                  <span className="w-32 truncate font-semibold" tabIndex={0}>{t.name}</span>
                                  <span className="flex-1 truncate" tabIndex={0}>{t.content}</span>
                                  <span className="text-xs text-muted-foreground" tabIndex={0}>{t.category || 'Uncategorized'}</span>
                                  <span className="text-xs text-blue-600" tabIndex={0}>{Array.isArray(t.tags) ? t.tags.join(', ') : ''}</span>
                                  <span className="text-xs bg-gray-200 rounded px-1 ml-1">{t.language || 'en'}</span>
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit(t.id, t.name, t.content, t.category, t.tags)} aria-label="Edit caption">Edit</Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} aria-label="Delete caption">Delete</Button>
                                  <Button size="sm" onClick={() => handleInsert(t.content)} aria-label="Insert caption">Insert</Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleShowHistory(t.id, 'captions')} aria-label="Show version history">History</Button>
                                  <Button size="sm" variant="ghost" onClick={() => { setShareModalOpen(true); setShareTarget(t); setShareType('captions'); }} aria-label="Share caption template"><Share2 className="h-4 w-4" /></Button>
                                  {sharedIds.includes(t.id) && <Users className="h-4 w-4 text-green-500" aria-label="Shared" />}
                                  <Button size="sm" variant="ghost" onClick={() => { setUsageModalOpen(true); setUsageTarget(t); setUsageType('captions'); }} aria-label="Usage analytics">Usage</Button>
                                  <span className="text-xs text-gray-500 ml-1">{t.usageCount || 0} uses</span>
                                  <span className="text-xs text-gray-400 ml-1">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : ''}</span>
                                  {getTemplateStatus(t) && <span className={`text-xs ml-1 ${getTemplateStatus(t) === 'expired' ? 'text-red-500' : getTemplateStatus(t) === 'scheduled' ? 'text-blue-500' : 'text-green-600'}`}>{getTemplateStatus(t)}</span>}
                                  <select value={t.folderId || ''} onChange={e => handleMoveToFolder(t.id, 'captions', e.target.value || null)} className="border rounded px-1 py-0.5 text-xs">
                                    <option value="">No Folder</option>
                                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                  </select>
                                </>
                              )}
                            </div>
                          </SortableItem>
                        ))}
                      </SortableContext>
                    </DndContext>
                  </>
                )}
                <div className="flex gap-2 mt-2">
                  <input value={newName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)} placeholder="Name" aria-label="New caption name" className="border rounded px-2 py-1 w-32" />
                  <input value={newText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)} placeholder="Content" aria-label="New caption content" className="border rounded px-2 py-1 flex-1" />
                  <Button size="sm" variant="outline" onClick={() => setSnippetModalOpen(true)} aria-label="Insert snippet or variable">Snippets/Vars</Button>
                  <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category" className="border rounded px-2 py-1">
                    {/* Add category options here */}
                  </select>
                  <input value={newTags} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTags(e.target.value)} placeholder="Tags (comma or space separated)" aria-label="New tags" className="border rounded px-2 py-1 w-32" />
                  <input type="datetime-local" value={newActiveFrom} onChange={e => setNewActiveFrom(e.target.value)} aria-label="Active From" className="border rounded px-2 py-1 w-40" />
                  <input type="datetime-local" value={newActiveTo} onChange={e => setNewActiveTo(e.target.value)} aria-label="Active To" className="border rounded px-2 py-1 w-40" />
                  <input type="number" min="1" value={newUsageLimit} onChange={e => setNewUsageLimit(e.target.value)} aria-label="Usage Limit" className="border rounded px-2 py-1 w-24" />
                  <select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language" className="border rounded px-2 py-1 w-32">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                  <select value={newName ? '' : (captions.find(t => t.id === newName)?.folderId || '')} onChange={e => newName ? setCaptions(c => c.map(t => t.id === newName ? { ...t, folderId: e.target.value } : t)) : setNewName(newName)} aria-label="Folder" className="border rounded px-2 py-1 w-32">
                    <option value="">No Folder</option>
                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                  <Button onClick={handleAdd} aria-label="Add caption template" disabled={loading}>Add</Button>
                </div>
                {renderPreview(newText)}
              </TabsContent>
              <TabsContent value="hashtags">
                {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
                  <>
                    <div className="flex gap-2 mb-2">
                      <input type="checkbox" checked={selectedIds.length === filteredHashtags.length} onChange={e => handleSelectAll(filteredHashtags, e.target.checked)} aria-label="Select all hashtags" />
                      <Button onClick={() => handleBulkDelete('hashtags')} disabled={!selectedIds.length}>Delete</Button>
                      <Button onClick={() => handleBulkFavorite('hashtags')} disabled={!selectedIds.length}>Favorite</Button>
                      <Button onClick={() => handleBulkPin('hashtags')} disabled={!selectedIds.length}>Pin</Button>
                      <Button onClick={() => handleExport('hashtags')} disabled={!selectedIds.length}>Export</Button>
                      <label className="inline-block">
                        <span className="sr-only">Import</span>
                        <input type="file" accept="application/json" onChange={e => handleImport(e, 'hashtags')} className="hidden" disabled={importing} />
                        <Button asChild disabled={importing}>Import</Button>
                      </label>
                    </div>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndHashtags}>
                      <SortableContext items={filteredHashtags.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        {sortTemplates(filteredHashtags).map(t => (
                          <SortableItem key={t.id} id={t.id}>
                            <div className="flex items-center gap-2 mb-1">
                              <DragHandle />
                              <input type="checkbox" checked={selectedIds.includes(t.id)} onChange={e => handleSelectOne(t.id, e.target.checked)} aria-label="Select hashtag group" />
                              {/* Favorite/Pin Buttons */}
                              <button onClick={() => handleToggleFavorite(t.id, t.isFavorite, 'hashtags')} aria-label={t.isFavorite ? 'Unfavorite' : 'Favorite'} className={t.isFavorite ? 'text-yellow-500' : 'text-gray-400'} style={t.isFavorite ? { background: 'none' } : {}}>
                                <Star className="h-4 w-4" fill={t.isFavorite ? 'currentColor' : 'none'} />
                              </button>
                              <button onClick={() => handleTogglePinned(t.id, t.isPinned, 'hashtags')} aria-label={t.isPinned ? 'Unpin' : 'Pin'} className={t.isPinned ? 'text-blue-500' : 'text-gray-400'} style={t.isPinned ? { background: 'none' } : {}}>
                                <Pin className="h-4 w-4" fill={t.isPinned ? 'currentColor' : 'none'} />
                              </button>
                              {/* Preview Button */}
                              <button onClick={() => setPreviewContent(t.hashtags?.join(' ') || '')} aria-label="Preview" className="text-gray-500 focus:outline-none">
                                <Eye className="h-4 w-4" />
                              </button>
                              {editingId === t.id ? (
                                <>
                                  <input value={editingName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingName(e.target.value)} aria-label="Edit hashtag group name" className="border rounded px-2 py-1 w-32" placeholder="Name" />
                                  <input value={editingText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)} aria-label="Edit hashtags" className="border rounded px-2 py-1 flex-1" placeholder="Hashtags (space separated)" />
                                  <Button size="sm" variant="outline" onClick={() => setSnippetModalOpen(true)} aria-label="Insert snippet or variable">Snippets/Vars</Button>
                                  <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Edit category" className="border rounded px-2 py-1">
                                    {/* Add category options here */}
                                  </select>
                                  <input value={editingTags} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingTags(e.target.value)} aria-label="Edit tags" className="border rounded px-2 py-1 w-32" placeholder="Tags (comma or space separated)" />
                                  <input type="datetime-local" value={editingActiveFrom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingActiveFrom(e.target.value)} aria-label="Edit active from" className="border rounded px-2 py-1 w-40" />
                                  <input type="datetime-local" value={editingActiveTo} onChange={e => setEditingActiveTo(e.target.value)} aria-label="Edit active to" className="border rounded px-2 py-1 w-40" />
                                  <input type="number" min="1" value={editingUsageLimit} onChange={e => setEditingUsageLimit(e.target.value)} aria-label="Edit usage limit" className="border rounded px-2 py-1 w-24" />
                                  <select value={editingLanguage} onChange={e => setEditingLanguage(e.target.value)} aria-label="Edit language" className="border rounded px-2 py-1 w-32">
                                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                                  </select>
                                  <Button size="sm" onClick={handleSaveEdit} aria-label="Save hashtag group">Save</Button>
                                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} aria-label="Cancel edit">Cancel</Button>
                                </>
                              ) : (
                                <>
                                  <span className="w-32 truncate font-semibold" tabIndex={0}>{t.name}</span>
                                  <span className="flex-1 truncate" tabIndex={0}>{Array.isArray(t.hashtags) ? t.hashtags.join(' ') : t.hashtags}</span>
                                  <span className="text-xs text-muted-foreground" tabIndex={0}>{t.category || 'Uncategorized'}</span>
                                  <span className="text-xs text-blue-600" tabIndex={0}>{Array.isArray(t.tags) ? t.tags.join(', ') : ''}</span>
                                  <span className="text-xs bg-gray-200 rounded px-1 ml-1">{t.language || 'en'}</span>
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit(t.id, t.name, Array.isArray(t.hashtags) ? t.hashtags.join(' ') : t.hashtags, t.category, t.tags)} aria-label="Edit hashtag group">Edit</Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} aria-label="Delete hashtag group">Delete</Button>
                                  <Button size="sm" onClick={() => handleInsert(Array.isArray(t.hashtags) ? t.hashtags.join(' ') : t.hashtags)} aria-label="Insert hashtags">Insert</Button>
                                  <Button size="sm" variant="ghost" onClick={() => { setShareModalOpen(true); setShareTarget(t); setShareType('hashtags'); }} aria-label="Share hashtag group"><Share2 className="h-4 w-4" /></Button>
                                  {sharedIds.includes(t.id) && <Users className="h-4 w-4 text-green-500" aria-label="Shared" />}
                                  <Button size="sm" variant="ghost" onClick={() => { setUsageModalOpen(true); setUsageTarget(t); setUsageType('hashtags'); }} aria-label="Usage analytics">Usage</Button>
                                  <span className="text-xs text-gray-500 ml-1">{t.usageCount || 0} uses</span>
                                  <span className="text-xs text-gray-400 ml-1">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : ''}</span>
                                  {getTemplateStatus(t) && <span className={`text-xs ml-1 ${getTemplateStatus(t) === 'expired' ? 'text-red-500' : getTemplateStatus(t) === 'scheduled' ? 'text-blue-500' : 'text-green-600'}`}>{getTemplateStatus(t)}</span>}
                                  <select value={t.folderId || ''} onChange={e => handleMoveToFolder(t.id, 'hashtags', e.target.value || null)} className="border rounded px-1 py-0.5 text-xs">
                                    <option value="">No Folder</option>
                                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                  </select>
                                </>
                              )}
                            </div>
                          </SortableItem>
                        ))}
                      </SortableContext>
                    </DndContext>
                  </>
                )}
                <div className="flex gap-2 mt-2">
                  <input value={newName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)} placeholder="Name" aria-label="New hashtag group name" className="border rounded px-2 py-1 w-32" />
                  <input value={newText} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)} placeholder="Hashtags (space separated)" aria-label="New hashtags" className="border rounded px-2 py-1 flex-1" />
                  <Button size="sm" variant="outline" onClick={() => setSnippetModalOpen(true)} aria-label="Insert snippet or variable">Snippets/Vars</Button>
                  <select value={category} onChange={e => setCategory(e.target.value)} aria-label="Category" className="border rounded px-2 py-1">
                    {/* Add category options here */}
                  </select>
                  <input value={newTags} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTags(e.target.value)} placeholder="Tags (comma or space separated)" aria-label="New tags" className="border rounded px-2 py-1 w-32" />
                  <input type="datetime-local" value={newActiveFrom} onChange={e => setNewActiveFrom(e.target.value)} aria-label="Active From" className="border rounded px-2 py-1 w-40" />
                  <input type="datetime-local" value={newActiveTo} onChange={e => setNewActiveTo(e.target.value)} aria-label="Active To" className="border rounded px-2 py-1 w-40" />
                  <input type="number" min="1" value={newUsageLimit} onChange={e => setNewUsageLimit(e.target.value)} aria-label="Usage Limit" className="border rounded px-2 py-1 w-24" />
                  <select value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language" className="border rounded px-2 py-1 w-32">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                  <select value={newName ? '' : (hashtags.find(t => t.id === newName)?.folderId || '')} onChange={e => newName ? setHashtags(h => h.map(t => t.id === newName ? { ...t, folderId: e.target.value } : t)) : setNewName(newName)} aria-label="Folder" className="border rounded px-2 py-1 w-32">
                    <option value="">No Folder</option>
                    {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                  <Button onClick={handleAdd} aria-label="Add hashtag group" disabled={loading}>Add</Button>
                </div>
                {renderPreview(newText)}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <AlertDialogCancel asChild>
            <Button variant="ghost">Close</Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
      {shareModalOpen && shareTarget && (
        <ShareModal
          open={shareModalOpen}
          onOpenChange={v => {
            setShareModalOpen(v);
            if (!v) setShareTarget(null);
          }}
          template={shareTarget}
          type={shareType}
          onUpdated={() => {
            // Refresh shares after modal closes
            setShareModalOpen(false);
            setShareTarget(null);
          }}
        />
      )}
      {aiModalOpen && (
        <AiSuggestModal
          open={aiModalOpen}
          onOpenChange={setAiModalOpen}
          type={tab}
          onInsert={text => {
            if (tab === 'captions') setNewText(text);
            else setNewText(text);
            setAiModalOpen(false);
          }}
          onSave={(name, text) => {
            if (tab === 'captions') {
              setNewName(name);
              setNewText(text);
            } else {
              setNewName(name);
              setNewText(text);
            }
            setAiModalOpen(false);
          }}
        />
      )}
      {usageModalOpen && usageTarget && (
        <UsageModal
          open={usageModalOpen}
          onOpenChange={v => {
            setUsageModalOpen(v);
            if (!v) setUsageTarget(null);
          }}
          template={usageTarget}
          type={usageType}
        />
      )}
      {snippetModalOpen && (
        <SnippetManager open={snippetModalOpen} onOpenChange={setSnippetModalOpen} onInsert={handleInsertSnippet} />
      )}
    </AlertDialog>
  );
} 