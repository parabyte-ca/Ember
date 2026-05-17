import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SettingsScreen() {
  const handleSignOut = async () => {
    Alert.alert('Sign out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out', style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 16 }}>
      <View className="space-y-6 pt-4">
        <Text className="text-foreground font-bold text-2xl">Settings</Text>
        <View className="rounded-xl bg-card border border-border overflow-hidden">
          {[
            { label: 'Edit profile', onPress: () => {} },
            { label: 'Notification preferences', onPress: () => {} },
            { label: 'Subscription', onPress: () => {} },
            { label: 'Privacy & data', onPress: () => {} },
          ].map((item) => (
            <TouchableOpacity key={item.label} onPress={item.onPress}
              className="flex-row justify-between items-center p-4 border-b border-border last:border-0">
              <Text className="text-foreground">{item.label}</Text>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={handleSignOut} className="border border-red-500/50 rounded-xl p-4 items-center">
          <Text className="text-red-400 font-medium">Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
