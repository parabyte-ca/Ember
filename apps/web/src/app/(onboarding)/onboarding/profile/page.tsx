'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { COMMON_PRONOUN_SUGGESTIONS, GENDER_SUGGESTIONS } from '@ember/lib';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    await supabase.from('profiles').update({ display_name: displayName, pronouns: pronouns || null, gender: gender || null }).eq('id', user.id);
    router.push('/onboarding/orientation');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Tell us about you</h1>
          <p className="text-muted-foreground text-sm mt-1">This helps us personalise your experience.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Display name</label>
            <input
              type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              required placeholder="What should we call you?"
              className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pronouns <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              type="text" value={pronouns} onChange={(e) => setPronouns(e.target.value)}
              placeholder="e.g. they/them, she/her, he/him"
              className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_PRONOUN_SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setPronouns(s)}
                  className={`rounded-full px-3 py-1 text-xs border transition-colors ${pronouns === s ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              type="text" value={gender} onChange={(e) => setGender(e.target.value)}
              placeholder="e.g. non-binary, woman, man, or custom"
              className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {GENDER_SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setGender(s)}
                  className={`rounded-full px-3 py-1 text-xs border transition-colors ${gender === s ? 'bg-primary text-white border-primary' : 'border-border hover:border-primary'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" disabled={loading || !displayName}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
            {loading ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
