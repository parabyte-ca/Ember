'use client';
import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Prompt } from '@ember/db';
import { interpolatePrompt } from '@ember/lib';
import type { GroupContext } from '@ember/lib';

interface Props {
  initialPrompts: Prompt[];
  categories: Array<{ id: string; name: string }>;
}

const SAMPLE_GROUP: GroupContext = {
  id: 'preview',
  members: [
    { id: 'u1', display_name: 'Alex', pronouns: 'they/them' },
    { id: 'u2', display_name: 'Sam', pronouns: 'she/her' },
  ],
  max_tier: 'explicit',
  blocked_categories: [],
  relationship_structure: null,
  lifestyle_interests: null,
};

export default function PromptsTable({ initialPrompts, categories }: Props) {
  const [prompts, setPrompts] = useState(initialPrompts);
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const supabase = createClient();

  const filtered = prompts.filter((p) => {
    const matchSearch = !search || p.body.toLowerCase().includes(search.toLowerCase());
    const matchTier = !tierFilter || p.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const handleEdit = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setEditBody(prompt.body);
  };

  const handleSave = async (id: string) => {
    const { data } = await supabase.from('prompts').update({ body: editBody, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (data) {
      setPrompts((prev) => prev.map((p) => p.id === id ? data as Prompt : p));
    }
    setEditingId(null);
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    await supabase.from('prompts').update({ published: !published }).eq('id', id);
    setPrompts((prev) => prev.map((p) => p.id === id ? { ...p, published: !published } : p));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text" placeholder="Search prompts…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="">All tiers</option>
          <option value="mild">Mild</option>
          <option value="spicy">Spicy</option>
          <option value="explicit">Explicit</option>
        </select>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Body / Preview</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">Tier</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">Category</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">Published</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((prompt) => (
              <tr key={prompt.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingId === prompt.id ? (
                    <div className="space-y-2">
                      <textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                      <div className="text-xs text-gray-500">
                        Preview: <span className="italic text-gray-700">{interpolatePrompt(editBody, SAMPLE_GROUP)}</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-mono text-xs text-gray-700 truncate max-w-xl">{prompt.body}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xl">→ {interpolatePrompt(prompt.body, SAMPLE_GROUP)}</div>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prompt.tier === 'mild' ? 'bg-green-100 text-green-700' : prompt.tier === 'spicy' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                    {prompt.tier}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{(prompt as Prompt & { categories?: { name: string } }).categories?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleTogglePublished(prompt.id, prompt.published)}
                    className={`text-xs px-2 py-0.5 rounded-full ${prompt.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {prompt.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {editingId === prompt.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(prompt.id)} className="text-xs text-primary font-medium hover:underline">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => handleEdit(prompt)} className="text-xs text-primary font-medium hover:underline">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm">No prompts found.</div>
        )}
      </div>
    </div>
  );
}
