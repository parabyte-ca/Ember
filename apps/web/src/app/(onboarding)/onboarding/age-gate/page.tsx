'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AgeGateSchema } from '@ember/lib';
import { APP_NAME } from '@ember/lib';

export default function AgeGatePage() {
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = AgeGateSchema.safeParse({ dob });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Invalid date');
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }

    await supabase.from('profiles').update({
      dob,
      age_verified_at: new Date().toISOString(),
    }).eq('id', user.id);

    router.push('/onboarding/profile');
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔞</div>
          <h1 className="font-display text-2xl font-bold">First, let's confirm your age</h1>
          <p className="mt-2 text-muted-foreground text-sm">
            {APP_NAME} contains mature content. You must be 18 or older to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="dob" className="block text-sm font-medium mb-1">Date of birth</label>
            <input
              id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              required
              className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Verifying…' : 'Continue'}
          </button>
        </form>
        {/* TODO: Apple Declared Age Range API stub (iOS 17+) */}
        {/* TODO: Google Age Assurance API stub (Android) */}
      </div>
    </div>
  );
}
