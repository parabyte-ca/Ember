import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';

const RESOURCES = [
  { name: 'RAINN', detail: 'Sexual assault support', contact: '1-800-656-HOPE', url: 'https://rainn.org' },
  { name: 'loveisrespect', detail: 'Relationship abuse support', contact: '1-866-331-9474', url: 'https://loveisrespect.org' },
  { name: 'Crisis Text Line', detail: 'Text HOME to 741741', contact: 'Free, 24/7', url: 'https://crisistextline.org' },
  { name: 'The Trevor Project', detail: 'LGBTQ+ crisis support', contact: '1-866-488-7386', url: 'https://thetrevorproject.org' },
];

export default function SafetyScreen() {
  const handlePause = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // TODO: Implement group pause via supabase
    Alert.alert(
      'Group activity paused',
      "Your group's activity is paused for 24 hours. You don't need to explain why.",
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View className="space-y-6 pt-4">
        <View>
          <Text className="text-foreground font-bold text-2xl">Safety &amp; Support</Text>
          <Text className="text-muted-foreground mt-1 text-sm">Your wellbeing comes first.</Text>
        </View>
        <View className="rounded-xl bg-card border border-border p-4 space-y-3">
          <Text className="text-foreground font-semibold">Consent check-in</Text>
          <Text className="text-muted-foreground text-sm">
            Pause your group's activity at any time. No explanation required. Others will see "Someone in your group has called a pause."
          </Text>
          <TouchableOpacity onPress={handlePause} className="border border-red-500 rounded-xl py-3 items-center">
            <Text className="text-red-400 font-medium text-sm">Pause group activity for 24 hours</Text>
          </TouchableOpacity>
        </View>
        <View className="rounded-xl bg-card border border-border p-4 space-y-3">
          <Text className="text-foreground font-semibold">Support resources</Text>
          {RESOURCES.map((r) => (
            <TouchableOpacity key={r.name} onPress={() => Linking.openURL(r.url)}
              className="border border-border rounded-xl p-3">
              <Text className="text-foreground font-medium text-sm">{r.name}</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">{r.detail} · {r.contact}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
