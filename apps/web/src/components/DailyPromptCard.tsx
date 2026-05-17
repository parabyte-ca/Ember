'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { interpolatePrompt } from '@ember/lib';
import type { GroupContext } from '@ember/lib';
import type { Prompt, SessionCard } from '@ember/db';

interface Props {
  groupId: string;
  userId: string;
}

export default function DailyPromptCard({ groupId, userId }: Props) {
  const [card, setCard] = useState<SessionCard | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [groupContext, setGroupContext] = useState<GroupContext | null>(null);
  const [responding, setResponding] = useState(false);
  const [myResponse, setMyResponse] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadDailyPrompt();
    // Subscribe to realtime updates
    const channel = supabase
      .channel(`session-cards-${groupId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'session_cards' }, () => {
        loadDailyPrompt();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const loadDailyPrompt = async () => {
    // Get today's session
    const today = new Date().toISOString().split('T')[0];
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id')
      .eq('group_id', groupId)
      .eq('mode', 'daily')
      .gte('started_at', `${today}T00:00:00`)
      .limit(1);

    if (!sessions?.length) return;

    const { data: cards } = await supabase
      .from('session_cards')
      .select('*')
      .eq('session_id', sessions[0].id)
      .limit(1);

    if (!cards?.length) return;
    setCard(cards[0] as SessionCard);

    if ((cards[0] as SessionCard).responses[userId]) {
      setMyResponse((cards[0] as SessionCard).responses[userId]);
    }

    const { data: promptData } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', (cards[0] as SessionCard).prompt_id)
      .single();
    if (promptData) setPrompt(promptData as Prompt);

    // Build group context
    const { data: members } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', groupId);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, pronouns')
      .in('id', (members ?? []).map((m: { user_id: string }) => m.user_id));
    const { data: settings } = await supabase
      .from('group_settings')
      .select('*')
      .eq('group_id', groupId)
      .single();

    setGroupContext({
      id: groupId,
      members: (profiles ?? []).map((p: { id: string; display_name: string; pronouns: string | null }) => ({
        id: p.id,
        display_name: p.display_name,
        pronouns: p.pronouns,
      })),
      max_tier: settings?.max_tier ?? 'mild',
      blocked_categories: settings?.blocked_categories ?? [],
      relationship_structure: null,
      lifestyle_interests: null,
    });
  };

  const handleResponse = async (response: 'yes' | 'maybe' | 'no' | 'skip') => {
    if (!card) return;
    setResponding(true);
    const updatedResponses = { ...(card.responses as Record<string, string>), [userId]: response };
    const allResponded = groupContext?.members.every((m) => updatedResponses[m.id] !== undefined && updatedResponses[m.id] !== null);
    const isMatch = allResponded && Object.values(updatedResponses).every((r) => r === 'yes');
    await supabase.from('session_cards').update({
      responses: updatedResponses,
      ...(allResponded ? { revealed_at: new Date().toISOString(), is_match: isMatch } : {}),
    }).eq('id', card.id);
    setMyResponse(response);
    // ROADMAP-D TODO: dispatch toy pattern on full match
    setResponding(false);
  };

  if (!card || !prompt || !groupContext) {
    return (
      <div className="rounded-xl bg-white border border-border p-6 text-center">
        <p className="text-muted-foreground text-sm">Today&#39;s prompt is loading…</p>
      </div>
    );
  }

  const interpolated = interpolatePrompt(prompt.body, groupContext);
  const responses = card.responses as Record<string, string>;
  const respondedCount = Object.values(responses).filter(Boolean).length;
  const totalCount = groupContext.members.length;
  const isRevealed = !!card.revealed_at;

  return (
    <div className="rounded-xl bg-white border border-border overflow-hidden">
      <div className="bg-secondary px-4 py-2 flex justify-between items-center">
        <span className="text-white/70 text-xs font-medium uppercase tracking-wide">Today&#39;s question</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          prompt.tier === 'mild' ? 'bg-green-500/20 text-green-300' :
          prompt.tier === 'spicy' ? 'bg-orange-500/20 text-orange-300' :
          'bg-red-500/20 text-red-300'
        }`}>
          {prompt.tier}
        </span>
      </div>
      <div className="p-6 space-y-6">
        <p className="font-display text-xl leading-relaxed">{interpolated}</p>
        {prompt.follow_up && (
          <p className="text-sm text-muted-foreground italic">
            Follow-up: {interpolatePrompt(prompt.follow_up, groupContext)}
          </p>
        )}
        {!myResponse ? (
          <div className="grid grid-cols-2 gap-2">
            {(['yes', 'maybe', 'no', 'skip'] as const).map((r) => (
              <button key={r} onClick={() => handleResponse(r)} disabled={responding}
                className={`rounded-lg py-3 text-sm font-semibold capitalize transition-colors disabled:opacity-50 ${
                  r === 'yes' ? 'bg-primary text-white hover:opacity-90' :
                  r === 'maybe' ? 'bg-accent text-secondary hover:opacity-90' :
                  r === 'no' ? 'border border-border hover:border-primary' :
                  'text-muted-foreground hover:text-foreground'
                }`}>
                {r === 'yes' ? '✓ Yes' : r === 'maybe' ? '~ Maybe' : r === 'no' ? '✗ No' : 'Skip'}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-sm font-medium">
              Your answer: <span className="text-primary capitalize">{myResponse}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {respondedCount < totalCount
                ? `Waiting for ${totalCount - respondedCount} more ${totalCount - respondedCount === 1 ? 'person' : 'people'}…`
                : 'Everyone has answered!'}
            </p>
          </div>
        )}
        {isRevealed && (
          <div className={`rounded-lg p-4 text-center ${card.is_match ? 'bg-primary/10 border border-primary/30' : 'bg-muted'}`}>
            {card.is_match ? (
              <div className="space-y-1">
                <div className="text-2xl">✨</div>
                <p className="font-semibold text-primary">Full match! Everyone said yes.</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">All answered — no full match this time.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
