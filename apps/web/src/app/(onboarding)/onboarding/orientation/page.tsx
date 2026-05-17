'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ORIENTATION_OPTIONS } from '@ember/lib';

export default function OrientationPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const toggle = (val: string) => {
    setSelected((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    const orientation = [...selected, ...(custom ? [custom] : [])];
    await supabase.from('profiles').update({ orientation }).eq('id', user.id);
    router.push('/onboarding/relationship-structure');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Your orientation</h1>
          <p className="text-muted-foreground text-sm mt-1">Select all that apply — or skip.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {ORIENTATION_OPTIONS.map((opt) => (
              <button key={opt} type="button" onClick={() => toggle(opt)}
                className={`rounded-full px-4 py-2 text-sm border transition-colors ${selected.includes(opt) ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'}`}>
                {opt}
              </button>
            ))}
          </div>
          <input type="text" value={custom} onChange={(e) => setCustom(e.target.value)}
            placeholder="Add your own…"
            className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          <div className="flex gap-3">
            <button type="button" onClick={() => router.push('/onboarding/relationship-structure')}
              className="flex-1 rounded-lg border border-border px-4 py-3 text-sm hover:border-primary">
              Skip
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
              {loading ? 'Saving…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
