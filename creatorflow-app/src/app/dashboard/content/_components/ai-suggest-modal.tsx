import React, { useState } from 'react';
import { AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const USE_CASES = [
  { key: 'promotion', label: 'Promotion' },
  { key: 'evergreen', label: 'Evergreen' },
  { key: 'seasonal', label: 'Seasonal' },
  { key: 'trending', label: 'Trending' },
  { key: 'personal', label: 'Personal' },
];

export default function AiSuggestModal({ open, onOpenChange, type, onInsert, onSave }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  type: 'captions' | 'hashtags';
  onInsert?: (text: string) => void;
  onSave?: (name: string, text: string) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [useCase, setUseCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSuggest = async () => {
    setLoading(true);
    setError('');
    setSuggestions([]);
    let body = { prompt, useCase, type };
    const res = await fetch('/api/ai/suggest-template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } else {
      setError('Failed to get suggestions');
    }
    setLoading(false);
  };

  return (
    <AlertDialogContent aria-modal="true" role="dialog" aria-labelledby="ai-suggest-modal-title">
      <AlertDialogHeader>
        <AlertDialogTitle id="ai-suggest-modal-title">AI Suggestions ({type === 'captions' ? 'Captions' : 'Hashtags'})</AlertDialogTitle>
        <AlertDialogDescription>Get AI-powered {type === 'captions' ? 'caption' : 'hashtag'} suggestions for your content.</AlertDialogDescription>
      </AlertDialogHeader>
      <div className="mb-2">
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder={`Describe what you want (e.g. "${type === 'captions' ? 'Summer sale caption' : 'Travel hashtags'}")`}
          aria-label="Prompt"
          className="border rounded px-2 py-1 w-full mb-2"
          disabled={loading}
        />
        <div className="mb-2 flex flex-wrap gap-2">
          {USE_CASES.map(u => (
            <Button key={u.key} size="sm" variant={useCase === u.key ? 'default' : 'outline'} onClick={() => setUseCase(u.key)} disabled={loading}>{u.label}</Button>
          ))}
        </div>
        <Button onClick={handleSuggest} disabled={loading || (!prompt && !useCase)} aria-label="Get suggestions">Suggest</Button>
      </div>
      <div>
        {loading && <div>Loading suggestions...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {suggestions.length > 0 && (
          <ul className="mt-2">
            {suggestions.map((s, i) => (
              <li key={i} className="mb-2 p-2 border rounded flex flex-col gap-2">
                <span>{s}</span>
                <div className="flex gap-2">
                  {onInsert && <Button size="sm" onClick={() => onInsert(s)} aria-label="Insert">Insert</Button>}
                  {onSave && <Button size="sm" variant="outline" onClick={() => {
                    const name = window.prompt('Template name?', 'AI Suggestion');
                    if (name) onSave(name, s);
                  }} aria-label="Save as template">Save</Button>}
                </div>
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