import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { COMMON_PRONOUN_SUGGESTIONS, GENDER_SUGGESTIONS } from '@ember/lib';

export default function ProfileScreen() {
  const [displayName, setDisplayName] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!displayName.trim()) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    await supabase.from('profiles').update({ display_name: displayName.trim(), pronouns: pronouns || null, gender: gender || null }).eq('id', user.id);
    router.push('/(onboarding)/orientation');
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 24 }}>
      <View className="space-y-6 pt-8">
        <View>
          <Text className="text-foreground font-bold text-2xl">Tell us about you</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Personalises your experience.</Text>
        </View>
        <View className="space-y-4">
          <View>
            <Text className="text-foreground font-medium mb-2">Display name</Text>
            <TextInput value={displayName} onChangeText={setDisplayName} placeholder="What should we call you?" placeholderTextColor="#9CA3AF"
              className="bg-muted rounded-xl px-4 py-4 text-foreground border border-border" />
          </View>
          <View>
            <Text className="text-foreground font-medium mb-2">Pronouns <Text className="text-muted-foreground font-normal">(optional)</Text></Text>
            <TextInput value={pronouns} onChangeText={setPronouns} placeholder="e.g. they/them, she/her" placeholderTextColor="#9CA3AF"
              className="bg-muted rounded-xl px-4 py-4 text-foreground border border-border mb-2" />
            <View className="flex-row flex-wrap gap-2">
              {COMMON_PRONOUN_SUGGESTIONS.map((s) => (
                <TouchableOpacity key={s} onPress={() => setPronouns(s)}
                  className={`rounded-full px-3 py-1.5 border ${pronouns === s ? 'bg-primary border-primary' : 'border-border'}`}>
                  <Text className={`text-xs ${pronouns === s ? 'text-white' : 'text-foreground'}`}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View>
            <Text className="text-foreground font-medium mb-2">Gender <Text className="text-muted-foreground font-normal">(optional)</Text></Text>
            <TextInput value={gender} onChangeText={setGender} placeholder="e.g. non-binary, woman, or custom" placeholderTextColor="#9CA3AF"
              className="bg-muted rounded-xl px-4 py-4 text-foreground border border-border mb-2" />
            <View className="flex-row flex-wrap gap-2">
              {GENDER_SUGGESTIONS.slice(0, 5).map((s) => (
                <TouchableOpacity key={s} onPress={() => setGender(s)}
                  className={`rounded-full px-3 py-1.5 border ${gender === s ? 'bg-primary border-primary' : 'border-border'}`}>
                  <Text className={`text-xs ${gender === s ? 'text-white' : 'text-foreground'}`}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={handleContinue} disabled={!displayName.trim() || loading}
          className={`rounded-xl py-4 items-center ${!displayName.trim() || loading ? 'bg-primary/50' : 'bg-primary'}`}>
          <Text className="text-white font-semibold text-base">{loading ? 'Saving…' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
