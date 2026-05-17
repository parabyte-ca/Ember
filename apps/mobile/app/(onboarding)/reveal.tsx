import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { APP_NAME } from '@ember/lib';
import * as Haptics from 'expo-haptics';

const UNLOCKED_FEATURES = [
  { icon: '💬', title: 'Prompts just for you', body: 'Questions shaped to your relationship style and identity' },
  { icon: '🎯', title: 'Relevant categories', body: 'Content filtered to what matters to your connection' },
  { icon: '🔒', title: 'Consent-first design', body: 'Every tier upgrade requires your individual consent' },
];

export default function RevealScreen() {
  const handleContinue = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(onboarding)/paywall');
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
      <View className="space-y-8">
        <View className="items-center">
          <Text className="text-4xl mb-3">✨</Text>
          <Text className="text-foreground font-bold text-2xl text-center">Your personalised experience</Text>
          <Text className="text-muted-foreground text-center mt-2 text-sm">Based on your identity, {APP_NAME} has unlocked:</Text>
        </View>
        <View className="space-y-3">
          {UNLOCKED_FEATURES.map((item) => (
            <View key={item.title} className="flex-row gap-4 rounded-xl bg-card p-4">
              <Text className="text-2xl">{item.icon}</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-sm">{item.title}</Text>
                <Text className="text-muted-foreground text-xs mt-0.5">{item.body}</Text>
              </View>
            </View>
          ))}
        </View>
        <TouchableOpacity onPress={handleContinue} className="bg-accent rounded-xl py-4 items-center">
          <Text className="text-secondary font-bold text-base">See your plan options →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
