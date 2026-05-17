import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { APP_NAME } from '@ember/lib';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleMagicLink = async () => {
    if (!email) return;
    setLoading(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: 'ember://auth/callback' },
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary px-6">
        <Text className="text-4xl mb-4">📬</Text>
        <Text className="text-foreground font-bold text-xl text-center">Check your email</Text>
        <Text className="text-muted-foreground text-center mt-2">
          We sent a sign-in link to {email}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-secondary"
    >
      <View className="flex-1 items-center justify-center px-6 space-y-8">
        <View className="items-center">
          <Text className="text-primary font-bold text-5xl">{APP_NAME}</Text>
          <Text className="text-muted-foreground text-center mt-2">Deepen your connection, one question at a time.</Text>
        </View>
        <View className="w-full space-y-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            className="w-full bg-muted rounded-xl px-4 py-4 text-foreground text-base border border-border"
          />
          <TouchableOpacity
            onPress={handleMagicLink}
            disabled={loading || !email}
            className={`w-full rounded-xl py-4 items-center ${loading || !email ? 'bg-primary/50' : 'bg-primary'}`}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? 'Sending…' : 'Send magic link'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-muted-foreground text-xs text-center">
          By continuing, you confirm you are 18 or older.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
