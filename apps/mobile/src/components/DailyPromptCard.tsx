import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { supabase } from '@/lib/supabase';
import { interpolatePrompt } from '@ember/lib';
import type { GroupContext } from '@ember/lib';
import type { Prompt, SessionCard } from '@ember/db';

interface Props {
  groupId: string;
  userId: string;
  groupLabel: string;
}

export default function DailyPromptCard({ groupId, userId, groupLabel }: Props) {
  const [card, setCard] = useState<SessionCard | null>(null);
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [groupContext, setGroupContext] = useState<GroupContext | null>(null);
  const [myResponse, setMyResponse] = useState<string | null>(null);
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  useEffect(() => {
    loadDailyPrompt();
    const channel = supabase.channel(`mobile-session-cards-${groupId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'session_cards' }, loadDailyPrompt)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [groupId]);

  const loadDailyPrompt = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data: sessions } = await supabase.from('sessions').select('id').eq('group_id', groupId).eq('mode', 'daily').gte('started_at', `${today}T00:00:00`).limit(1);
    if (!sessions?.length) return;
    const { data: cards } = await supabase.from('session_cards').select('*').eq('session_id', sessions[0].id).limit(1);
    if (!cards?.length) return;
    const cardData = cards[0] as SessionCard;
    setCard(cardData);
    if ((cardData.responses as Record<string, string>)[userId]) {
      setMyResponse((cardData.responses as Record<string, string>)[userId]);
    }
    const { data: promptData } = await supabase.from('prompts').select('*').eq('id', cardData.prompt_id).single();
    if (promptData) setPrompt(promptData as Prompt);
    const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', groupId);
    const { data: profiles } = await supabase.from('profiles').select('id, display_name, pronouns').in('id', (members ?? []).map((m: { user_id: string }) => m.user_id));
    const { data: settings } = await supabase.from('group_settings').select('*').eq('group_id', groupId).single();
    setGroupContext({
      id: groupId,
      members: (profiles ?? []).map((p: { id: string; display_name: string; pronouns: string | null }) => ({ id: p.id, display_name: p.display_name, pronouns: p.pronouns })),
      max_tier: settings?.max_tier ?? 'mild',
      blocked_categories: settings?.blocked_categories ?? [],
      relationship_structure: null,
      lifestyle_interests: null,
    });
  };

  const handleResponse = async (response: 'yes' | 'maybe' | 'no' | 'skip') => {
    if (!card || !groupContext) return;
    await Haptics.impactAsync(response === 'yes' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
    const updatedResponses: Record<string, 'yes' | 'maybe' | 'no' | 'skip' | 'done'> = { ...(card.responses as Record<string, 'yes' | 'maybe' | 'no' | 'skip' | 'done'>), [userId]: response };
    const allResponded = groupContext.members.every((m) => updatedResponses[m.id] != null);
    const isMatch = allResponded && Object.values(updatedResponses).every((r) => r === 'yes');
    await supabase.from('session_cards').update({
      responses: updatedResponses,
      ...(allResponded ? { revealed_at: new Date().toISOString(), is_match: isMatch } : {}),
    }).eq('id', card.id);
    setMyResponse(response);
    if (isMatch) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // ROADMAP-D TODO: dispatch toy pattern on full match
    }
  };

  if (!card || !prompt || !groupContext) {
    return (
      <View className="rounded-xl bg-card border border-border p-6 items-center">
        <Text className="text-muted-foreground">Today's prompt is loading…</Text>
      </View>
    );
  }

  const interpolated = interpolatePrompt(prompt.body, groupContext);
  const responses = card.responses as Record<string, string>;
  const respondedCount = Object.values(responses).filter(Boolean).length;
  const totalCount = groupContext.members.length;
  const isRevealed = !!card.revealed_at;

  return (
    <Animated.View style={animStyle} className="rounded-xl bg-card border border-border overflow-hidden">
      <View className="bg-secondary/80 px-4 py-2 flex-row justify-between items-center">
        <Text className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Today's question</Text>
        <View className={`px-2 py-0.5 rounded-full ${prompt.tier === 'mild' ? 'bg-green-500/20' : prompt.tier === 'spicy' ? 'bg-orange-500/20' : 'bg-red-500/20'}`}>
          <Text className={`text-xs font-medium ${prompt.tier === 'mild' ? 'text-green-400' : prompt.tier === 'spicy' ? 'text-orange-400' : 'text-red-400'}`}>{prompt.tier}</Text>
        </View>
      </View>
      <View className="p-5 space-y-5">
        <Text className="text-foreground text-xl leading-relaxed">{interpolated}</Text>
        {!myResponse ? (
          <View className="flex-row flex-wrap gap-2">
            {(['yes', 'maybe', 'no', 'skip'] as const).map((r) => (
              <TouchableOpacity key={r} onPress={() => handleResponse(r)}
                className={`flex-1 rounded-xl py-3 items-center min-w-[70px] ${r === 'yes' ? 'bg-primary' : r === 'maybe' ? 'bg-accent' : 'border border-border'}`}>
                <Text className={`font-semibold text-sm ${r === 'yes' ? 'text-white' : r === 'maybe' ? 'text-secondary' : 'text-foreground'}`}>
                  {r === 'yes' ? '✓ Yes' : r === 'maybe' ? '~ Maybe' : r === 'no' ? '✗ No' : 'Skip'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="rounded-xl bg-secondary/50 p-3 items-center">
            <Text className="text-foreground text-sm">Your answer: <Text className="text-primary font-semibold capitalize">{myResponse}</Text></Text>
            <Text className="text-muted-foreground text-xs mt-1">
              {respondedCount < totalCount ? `Waiting for ${totalCount - respondedCount} more…` : 'Everyone has answered!'}
            </Text>
          </View>
        )}
        {isRevealed && (
          <View className={`rounded-xl p-4 items-center ${card.is_match ? 'bg-primary/20 border border-primary/40' : 'bg-card'}`}>
            {card.is_match ? (
              <>
                <Text className="text-2xl">✨</Text>
                <Text className="text-primary font-bold mt-1">Full match! Everyone said yes.</Text>
              </>
            ) : (
              <Text className="text-muted-foreground text-sm">All answered — no full match this time.</Text>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}
