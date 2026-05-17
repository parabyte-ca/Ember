import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { AgeGateSchema, APP_NAME } from '@ember/lib';
import * as Haptics from 'expo-haptics';

export default function AgeGateScreen() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    const dob = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const result = AgeGateSchema.safeParse({ dob });
    if (!result.success) {
      Alert.alert('Age requirement', result.error.errors[0]?.message ?? 'You must be 18 or older.');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace('/(auth)/login'); return; }
    await supabase.from('profiles').update({ dob, age_verified_at: new Date().toISOString() }).eq('id', user.id);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(onboarding)/profile');
    setLoading(false);
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
      <View className="space-y-6">
        <View className="items-center">
          <Text className="text-5xl mb-4">🔞</Text>
          <Text className="text-foreground font-bold text-2xl text-center">Confirm your age</Text>
          <Text className="text-muted-foreground text-center mt-2 text-sm">
            {APP_NAME} contains mature content. You must be 18 or older.
          </Text>
        </View>
        <View className="space-y-3">
          <Text className="text-foreground font-medium">Date of birth</Text>
          <View className="flex-row gap-3">
            {[
              { placeholder: 'DD', value: day, setter: setDay, maxLen: 2 },
              { placeholder: 'MM', value: month, setter: setMonth, maxLen: 2 },
              { placeholder: 'YYYY', value: year, setter: setYear, maxLen: 4 },
            ].map(({ placeholder, value, setter, maxLen }) => (
              <View key={placeholder} className="flex-1">
                <Text className="text-muted-foreground text-xs mb-1">{placeholder}</Text>
                <View className="bg-muted rounded-xl border border-border px-4 py-3 items-center">
                  <Text className="text-foreground text-center text-base">{value || placeholder}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* TODO: Apple Declared Age Range API stub (iOS 17+) */}
        {/* TODO: Google Age Assurance API stub (Android) */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={loading || !year || !month || !day}
          className={`rounded-xl py-4 items-center ${loading || !year || !month || !day ? 'bg-primary/50' : 'bg-primary'}`}
        >
          <Text className="text-white font-semibold text-base">{loading ? 'Verifying…' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
