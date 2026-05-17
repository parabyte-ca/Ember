import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { isENMAdjacent } from '@ember/lib';
import type { RelationshipStructure } from '@ember/db';
import * as Haptics from 'expo-haptics';

const STRUCTURE_OPTIONS: Array<{ value: RelationshipStructure; label: string; description: string }> = [
  { value: 'monogamous', label: 'Just us two', description: 'A committed partnership between two people' },
  { value: 'open', label: 'Open relationship', description: 'Two primary partners who may connect with others' },
  { value: 'polyamorous', label: 'Polyamorous', description: 'Multiple loving relationships with everyone\'s knowledge' },
  { value: 'swinger', label: 'Swinger / Lifestyle', description: 'Recreational connections shared with a partner' },
  { value: 'thruple', label: 'Thruple or more', description: 'Three or more people in a committed relationship' },
  { value: 'exploring', label: 'Still figuring it out', description: 'Exploring what works for your connection' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say', description: 'That\'s your business, not ours' },
];

export default function RelationshipStructureScreen() {
  const [selected, setSelected] = useState<RelationshipStructure | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (value: RelationshipStructure) => {
    setSelected(value);
    await Haptics.selectionAsync();
  };

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    await supabase.from('profiles').update({ relationship_structure: selected }).eq('id', user.id);
    router.push(isENMAdjacent(selected) ? '/(onboarding)/lifestyle-interests' : '/(onboarding)/reveal');
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 24 }}>
      <View className="space-y-6 pt-8">
        <View>
          <Text className="text-foreground font-bold text-2xl">Your relationship style</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Shapes the prompts you receive.</Text>
        </View>
        <View className="space-y-2">
          {STRUCTURE_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.value} onPress={() => handleSelect(opt.value)}
              className={`rounded-xl border p-4 ${selected === opt.value ? 'border-primary bg-primary/10' : 'border-border'}`}>
              <Text className="text-foreground font-medium">{opt.label}</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">{opt.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={handleContinue} disabled={!selected || loading}
          className={`rounded-xl py-4 items-center ${!selected || loading ? 'bg-primary/50' : 'bg-primary'}`}>
          <Text className="text-white font-semibold text-base">{loading ? 'Saving…' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
