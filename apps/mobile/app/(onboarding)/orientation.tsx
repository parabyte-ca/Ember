import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ORIENTATION_OPTIONS } from '@ember/lib';

export default function OrientationScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);

  const toggle = (val: string) => {
    setSelected((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  };

  const handleContinue = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    const orientation = [...selected, ...(custom ? [custom] : [])];
    await supabase.from('profiles').update({ orientation }).eq('id', user.id);
    router.push('/(onboarding)/relationship-structure');
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 24 }}>
      <View className="space-y-6 pt-8">
        <View>
          <Text className="text-foreground font-bold text-2xl">Your orientation</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Select all that apply — or skip.</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {ORIENTATION_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => toggle(opt)}
              className={`rounded-full px-4 py-2 border ${selected.includes(opt) ? 'bg-primary border-primary' : 'border-border'}`}>
              <Text className={`text-sm ${selected.includes(opt) ? 'text-white' : 'text-foreground'}`}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput value={custom} onChangeText={setCustom} placeholder="Add your own…" placeholderTextColor="#9CA3AF"
          className="bg-muted rounded-xl px-4 py-4 text-foreground border border-border" />
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => router.push('/(onboarding)/relationship-structure')} className="flex-1 border border-border rounded-xl py-4 items-center">
            <Text className="text-foreground text-sm">Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleContinue} disabled={loading} className={`flex-1 rounded-xl py-4 items-center ${loading ? 'bg-primary/50' : 'bg-primary'}`}>
            <Text className="text-white font-semibold text-sm">{loading ? 'Saving…' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
