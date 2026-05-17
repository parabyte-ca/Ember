'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateInviteCode } from '@ember/lib';
import QRCode from 'qrcode.react';

export default function InvitePage() {
  const [step, setStep] = useState<'choose' | 'create' | 'join'>('choose');
  const [maxMembers, setMaxMembers] = useState(2);
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ember.app';

  const handleCreate = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth/login'); return; }
    const code = generateInviteCode();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: group } = await supabase.from('groups').insert({
      created_by: user.id, max_members: maxMembers, invite_code: code,
      invite_expires_at: expiresAt, status: 'pending', name: null, dissolved_at: null,
    }).select().single();
    if (!group) { setLoading(false); return; }
    const now = new Date().toISOString();
    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id, role: 'creator', joined_at: now });
    await supabase.from('group_settings').insert({ group_id: group.id, max_tier: 'mild', blocked_categories: [], explicit_consent: {}, theme: null, paused_until: null });
    await supabase.from('streaks').insert({ group_id: group.id, current_count: 0, longest: 0, last_active_date: new Date().toISOString().split('T')[0], last_saved_by: user.id });
    // ROADMAP-B: joinCommunityRoom stub — create Matrix private room when feature ships
    setInviteCode(code);
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
    setLoading(false);
  };

  const handleJoin = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/group-invite-redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ invite_code: joinCode.toUpperCase() }),
    });
    const data = await response.json();
    if (data.group_id) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
      }
      router.push('/dashboard');
    }
    setLoading(false);
  };

  if (inviteCode) {
    const deepLink = `${appUrl}/join/${inviteCode}`;
    const waitingMsg = maxMembers === 2
      ? 'Waiting for 1 more person…'
      : `Waiting for ${maxMembers - 1} more people…`;

    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-display text-2xl font-bold">Share your invite</h1>
          <p className="text-muted-foreground text-sm">{waitingMsg}</p>
          <div className="rounded-xl border border-border p-6 space-y-4">
            <div className="font-mono text-3xl font-bold tracking-widest text-primary">{inviteCode}</div>
            <div className="flex justify-center"><QRCode value={deepLink} size={150} /></div>
            <p className="text-xs text-muted-foreground break-all">{deepLink}</p>
          </div>
          <button onClick={() => navigator.share?.({ title: 'Join me on Ember', url: deepLink })}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90">
            Share invite link
          </button>
          <button onClick={() => router.push('/dashboard')}
            className="w-full rounded-lg border border-border px-4 py-3 text-sm hover:border-primary">
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Invite your partner(s)</h1>
          <p className="text-muted-foreground text-sm mt-1">Create a group or join an existing one.</p>
        </div>
        {step === 'choose' && (
          <div className="space-y-3">
            <button onClick={() => setStep('create')}
              className="w-full rounded-xl border-2 border-primary bg-primary/5 p-4 text-left">
              <div className="font-semibold">Create a group</div>
              <div className="text-sm text-muted-foreground mt-0.5">Generate an invite code and share it</div>
            </button>
            <button onClick={() => setStep('join')}
              className="w-full rounded-xl border border-border p-4 text-left hover:border-primary">
              <div className="font-semibold">Join a group</div>
              <div className="text-sm text-muted-foreground mt-0.5">Enter a code from your partner</div>
            </button>
            <button onClick={() => router.push('/dashboard')}
              className="w-full text-sm text-muted-foreground py-2 hover:text-foreground">
              Skip for now
            </button>
          </div>
        )}
        {step === 'create' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Group size</label>
              {[
                { size: 2, label: 'Just us two', description: 'Perfect for a pair' },
                { size: 3, label: "We're a trio", description: 'Perfect for thruples and triads' },
                { size: 4, label: 'Four of us', description: 'For quads and beyond' },
                { size: 6, label: 'Five or six', description: 'For constellations and large groups' },
              ].map(({ size, label, description }) => (
                <button key={size} type="button" onClick={() => setMaxMembers(size)}
                  className={`w-full rounded-xl border p-3 text-left mb-2 ${maxMembers === size ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </button>
              ))}
            </div>
            <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name (optional)"
              className="w-full rounded-lg border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={handleCreate} disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
              {loading ? 'Creating…' : 'Create group'}
            </button>
          </div>
        )}
        {step === 'join' && (
          <div className="space-y-4">
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code" maxLength={6}
              className="w-full rounded-lg border border-input px-4 py-3 text-sm font-mono text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={handleJoin} disabled={loading || joinCode.length !== 6}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
              {loading ? 'Joining…' : 'Join group'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
