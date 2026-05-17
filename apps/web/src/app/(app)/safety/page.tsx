'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-lg mx-auto space-y-6 pt-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Safety &amp; Support</h1>
          <p className="text-muted-foreground text-sm mt-1">Your wellbeing comes first.</p>
        </div>
        <div className="rounded-xl bg-white border border-border p-5 space-y-4">
          <h2 className="font-semibold">Consent check-in</h2>
          <p className="text-sm text-muted-foreground">
            You can pause your group&#39;s activity at any time. No explanation required.
          </p>
          <PauseButton />
        </div>
        <div className="rounded-xl bg-white border border-border p-5 space-y-3">
          <h2 className="font-semibold">Support resources</h2>
          <p className="text-sm text-muted-foreground">
            If you need support, these organisations are here for you.
          </p>
          <ul className="space-y-3">
            {[
              { name: 'RAINN', detail: 'Sexual assault support', contact: '1-800-656-HOPE', url: 'https://rainn.org' },
              { name: 'loveisrespect', detail: 'Relationship abuse support', contact: '1-866-331-9474', url: 'https://loveisrespect.org' },
              { name: 'Crisis Text Line', detail: 'Text HOME to 741741', contact: 'Free, 24/7', url: 'https://crisistextline.org' },
              { name: 'The Trevor Project', detail: 'LGBTQ+ crisis support', contact: '1-866-488-7386', url: 'https://thetrevorproject.org' },
            ].map((r) => (
              <li key={r.name}>
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="block rounded-lg border border-border p-3 hover:border-primary transition-colors">
                  <div className="font-medium text-sm">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.detail} · {r.contact}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-white border border-border p-5">
          <h2 className="font-semibold mb-2">Block &amp; report</h2>
          <p className="text-sm text-muted-foreground">
            Every prompt card and message has a block/report option. Your safety is always the priority.
          </p>
        </div>
      </div>
    </div>
  );
}

function PauseButton() {
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handlePause = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: membership } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id)
        .single();
      if (membership) {
        const pausedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        await supabase
          .from('group_settings')
          .update({ paused_until: pausedUntil })
          .eq('group_id', membership.group_id);
      }
      setPaused(true);
    } finally {
      setLoading(false);
    }
  };

  if (paused) {
    return (
      <div className="rounded-lg bg-muted p-3 text-center">
        <p className="text-sm font-medium">Group activity paused for 24 hours.</p>
        <p className="text-xs text-muted-foreground mt-1">You don&#39;t need to explain why.</p>
      </div>
    );
  }

  return (
    <button
      onClick={handlePause}
      disabled={loading}
      className="w-full rounded-lg border border-destructive text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive/10 transition-colors disabled:opacity-50"
    >
      {loading ? 'Pausing…' : 'Pause group activity for 24 hours'}
    </button>
  );
}
