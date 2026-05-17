import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Share, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { generateInviteCode } from '@ember/lib';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';

export default function InviteScreen() {
  const [step, setStep] = useState<'choose' | 'create' | 'join'>('choose');
  const [maxMembers, setMaxMembers] = useState(2);
  const [inviteCode, setInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const appUrl = process.env.EXPO_PUBLIC_APP_URL ?? 'https://ember.app';

  const handleCreate = async () => {
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    const code = generateInviteCode();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: group } = await supabase.from('groups').insert({
      created_by: user.id, max_members: maxMembers, invite_code: code,
      invite_expires_at: expiresAt, status: 'pending',
    }).select().single();
    if (!group) { setLoading(false); return; }
    await Promise.all([
      supabase.from('group_members').insert({ group_id: group.id, user_id: user.id, role: 'creator' }),
      supabase.from('group_settings').insert({ group_id: group.id, max_tier: 'mild', blocked_categories: [], explicit_consent: {} }),
      supabase.from('streaks').insert({ group_id: group.id, current_count: 0, longest: 0, last_active_date: new Date().toISOString().split('T')[0], last_saved_by: user.id }),
    ]);
    // ROADMAP-B: joinCommunityRoom stub — create Matrix private room when feature ships
    await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);
    setInviteCode(code);
    setLoading(false);
  };

  const handleJoin = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/group-invite-redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ invite_code: joinCode.toUpperCase() }),
    });
    const data = await response.json();
    if (data.group_id) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', (await supabase.auth.getUser()).data.user?.id);
      router.replace('/(app)/dashboard');
    } else {
      Alert.alert('Error', data.error ?? 'Could not join group');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setLoading(false);
  };

  const handleShare = async () => {
    await Share.share({ message: `Join me on Ember! Use code ${inviteCode} or: ${appUrl}/join/${inviteCode}` });
  };

  if (inviteCode) {
    const deepLink = `${appUrl}/join/${inviteCode}`;
    return (
      <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <View className="w-full space-y-6 items-center">
          <Text className="text-foreground font-bold text-2xl text-center">Share your invite</Text>
          <View className="rounded-2xl bg-card p-6 items-center space-y-4 w-full">
            <Text className="text-primary font-bold text-4xl tracking-widest font-mono">{inviteCode}</Text>
            <QRCode value={deepLink} size={180} color="#FBF7F4" backgroundColor="#24194A" />
            <Text className="text-muted-foreground text-xs text-center">{deepLink}</Text>
          </View>
          <TouchableOpacity onPress={handleShare} className="w-full bg-primary rounded-xl py-4 items-center">
            <Text className="text-white font-semibold">Share invite link</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(app)/dashboard')} className="w-full border border-border rounded-xl py-4 items-center">
            <Text className="text-foreground">Go to dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 24 }}>
      <View className="space-y-6 pt-8">
        <View>
          <Text className="text-foreground font-bold text-2xl">Invite your partner(s)</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Create a group or join an existing one.</Text>
        </View>
        {step === 'choose' && (
          <View className="space-y-3">
            <TouchableOpacity onPress={() => setStep('create')} className="border-2 border-primary rounded-xl p-4">
              <Text className="text-foreground font-semibold">Create a group</Text>
              <Text className="text-muted-foreground text-sm mt-0.5">Generate an invite code and share it</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep('join')} className="border border-border rounded-xl p-4">
              <Text className="text-foreground font-semibold">Join a group</Text>
              <Text className="text-muted-foreground text-sm mt-0.5">Enter a code from your partner</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace('/(app)/dashboard')} className="items-center py-3">
              <Text className="text-muted-foreground text-sm">Skip for now</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 'create' && (
          <View className="space-y-4">
            {[
              { size: 2, label: 'Just us two', desc: 'Perfect for a pair' },
              { size: 3, label: "We're a trio", desc: 'Perfect for thruples and triads' },
              { size: 4, label: 'Four of us', desc: 'For quads and beyond' },
              { size: 6, label: 'Five or six', desc: 'For constellations and large groups' },
            ].map(({ size, label, desc }) => (
              <TouchableOpacity key={size} onPress={() => setMaxMembers(size)}
                className={`rounded-xl border p-4 ${maxMembers === size ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <Text className="text-foreground font-medium">{label}</Text>
                <Text className="text-muted-foreground text-xs mt-0.5">{desc}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={handleCreate} disabled={loading}
              className={`rounded-xl py-4 items-center ${loading ? 'bg-primary/50' : 'bg-primary'}`}>
              <Text className="text-white font-semibold">{loading ? 'Creating…' : 'Create group'}</Text>
            </TouchableOpacity>
          </View>
        )}
        {step === 'join' && (
          <View className="space-y-4">
            <TextInput value={joinCode} onChangeText={(t) => setJoinCode(t.toUpperCase())} placeholder="6-CHARACTER CODE"
              placeholderTextColor="#9CA3AF" maxLength={6} autoCapitalize="characters"
              className="bg-muted rounded-xl px-4 py-5 text-foreground text-2xl text-center font-mono tracking-widest border border-border" />
            <TouchableOpacity onPress={handleJoin} disabled={loading || joinCode.length !== 6}
              className={`rounded-xl py-4 items-center ${loading || joinCode.length !== 6 ? 'bg-primary/50' : 'bg-primary'}`}>
              <Text className="text-white font-semibold">{loading ? 'Joining…' : 'Join group'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
