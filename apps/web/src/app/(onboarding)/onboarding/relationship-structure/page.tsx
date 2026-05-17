'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { isENMAdjacent } from '@ember/lib';
import type { RelationshipStructure } from '@ember/db';

const STRUCTURE_OPTIONS: Array<{ value: RelationshipStructure; label: string; description: string }> = [
  { value: 'monogamous', label: 'Just us two', description: 'A committed partnership between two people' },
  { value: 'open', label: 'Open relationship', description: 'Two primary partners who may connect with others' },
  { value: 'polyamorous', label: 'Polyamorous', description: 'Multiple loving relationships with everyone\'s knowledge' },
  { value: 'swinger', label: 'Swinger / Lifestyle', description: 'Recreational connections shared with a partner' },
  { value: 'thruple', label: 'Thruple or more', description: 'Three or more people in a committed relationship' },
  { value: 'exploring', label: 'Still figuring it out', description: 'Exploring what works for your connection' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', description: 'That\'s your business, not ours' },
];

export default function RelationshipStructurePage() {
  const [selected, setSelected] = useState<RelationshipStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    await supabase.from('profiles').update({ relationship_structure: selected }).eq('id', user.id);
    router.push(isENMAdjacent(selected) ? '/onboarding/lifestyle-interests' : '/onboarding/reveal');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Your relationship style</h1>
          <p className="text-muted-foreground text-sm mt-1">This shapes the prompts you'll receive.</p>
        </div>
        <div className="space-y-2">
          {STRUCTURE_OPTIONS.map((opt) => (
            <button key={opt.value} type="button" onClick={() => setSelected(opt.value)}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${selected === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{opt.description}</div>
            </button>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={!selected || loading}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
          {loading ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
