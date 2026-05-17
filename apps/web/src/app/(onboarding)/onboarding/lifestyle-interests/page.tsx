'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LIFESTYLE_INTEREST_OPTIONS } from '@ember/lib';

const INTEREST_LABELS: Record<string, string> = {
  soft_swap: 'Soft swap', full_swap: 'Full swap', unicorn_friendly: 'Unicorn-friendly',
  kink: 'Kink', BDSM: 'BDSM', tantra: 'Tantra', exhibitionism: 'Exhibitionism', voyeurism: 'Voyeurism',
};

export default function LifestyleInterestsPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggle = (val: string) => {
    setSelected((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    await supabase.from('profiles').update({ lifestyle_interests: selected }).eq('id', user.id);
    router.push('/onboarding/reveal');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Lifestyle interests</h1>
          <p className="text-muted-foreground text-sm mt-1">Optional — helps us weight your prompts. This is private.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {LIFESTYLE_INTEREST_OPTIONS.map((opt) => (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className={`rounded-full px-4 py-2 text-sm border transition-colors ${selected.includes(opt) ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'}`}>
              {INTEREST_LABELS[opt] ?? opt}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.push('/onboarding/reveal')}
            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm hover:border-primary">Skip</button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {loading ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
