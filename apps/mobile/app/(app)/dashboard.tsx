import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { APP_NAME, resolveGroupLabel } from '@ember/lib';
import type { Profile, GroupMember, Streak } from '@ember/db';
import DailyPromptCard from '@/components/DailyPromptCard';
import SafetyFAB from '@/components/SafetyFAB';

export default function DashboardScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [membership, setMembership] = useState<GroupMember | null>(null);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [memberCount, setMemberCount] = useState(2);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    const [{ data: prof }, { data: mem }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('group_members').select('*').eq('user_id', user.id).single(),
    ]);
    if (prof) setProfile(prof as Profile);
    if (mem) {
      setMembership(mem as GroupMember);
      const { count } = await supabase.from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', (mem as GroupMember).group_id);
      setMemberCount(count ?? 2);
      const { data: streakData } = await supabase.from('streaks').select('*').eq('group_id', (mem as GroupMember).group_id).single();
      if (streakData) setStreak(streakData as Streak);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 bg-secondary">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E85A6B" />}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-primary font-bold text-3xl">{APP_NAME}</Text>
          {streak && streak.current_count > 0 && (
            <View className="flex-row items-center gap-1 bg-card rounded-full px-3 py-1.5">
              <Text className="text-base">🔥</Text>
              <Text className="text-foreground font-bold text-sm">{streak.current_count}</Text>
            </View>
          )}
        </View>

        {profile && (
          <Text className="text-foreground text-lg mb-4">
            Hey, {profile.display_name} 👋
          </Text>
        )}

        {membership ? (
          <DailyPromptCard
            groupId={membership.group_id}
            userId={profile?.id ?? ''}
            groupLabel={resolveGroupLabel(memberCount)}
          />
        ) : (
          <View className="rounded-xl bg-card border border-border p-6 items-center">
            <Text className="text-foreground text-base text-center mb-4">You're not in a group yet.</Text>
            <TouchableOpacity onPress={() => router.push('/(onboarding)/invite')} className="bg-primary rounded-xl px-6 py-3">
              <Text className="text-white font-semibold">Create or join a group</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <SafetyFAB />
    </View>
  );
}
