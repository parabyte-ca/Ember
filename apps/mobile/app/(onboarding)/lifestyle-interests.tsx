import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { LIFESTYLE_INTEREST_OPTIONS } from '@ember/lib';

const INTEREST_LABELS: Record<string, string> = {
  soft_swap: 'Soft swap', full_swap: 'Full swap', unicorn_friendly: 'Unicorn-friendly',
  kink: 'Kink', BDSM: 'BDSM', tantra: 'Tantra', exhibitionism: 'Exhibitionism', voyeurism: 'Voyeurism',
};

export default function LifestyleInterestsScreen() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (val: string) => {
    setSelected((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  };

  const handleContinue = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    await supabase.from('profiles').update({ lifestyle_interests: selected }).eq('id', user.id);
    router.push('/(onboarding)/reveal');
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 24 }}>
      <View className="space-y-6 pt-8">
        <View>
          <Text className="text-foreground font-bold text-2xl">Lifestyle interests</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Optional — helps us weight your prompts. Private.</Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {LIFESTYLE_INTEREST_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt} onPress={() => toggle(opt)}
              className={`rounded-full px-4 py-2 border ${selected.includes(opt) ? 'bg-primary border-primary' : 'border-border'}`}>
              <Text className={`text-sm ${selected.includes(opt) ? 'text-white' : 'text-foreground'}`}>{INTEREST_LABELS[opt] ?? opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => router.push('/(onboarding)/reveal')} className="flex-1 border border-border rounded-xl py-4 items-center">
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
