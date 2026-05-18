'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { APP_NAME } from '@ember/lib';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <h1 className="font-display text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground">We sent a sign-in link to <strong>{email}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-primary">{APP_NAME}</h1>
          <p className="mt-2 text-muted-foreground">Deepen your connection, one question at a time.</p>
        </div>
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div suppressHydrationWarning>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email address</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required placeholder="you@example.com"
              className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              suppressHydrationWarning
            />
          </div>
          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you confirm you are 18 or older and agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
