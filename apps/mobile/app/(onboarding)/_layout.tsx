import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1B1233' } }}>
      <Stack.Screen name="age-gate" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="orientation" />
      <Stack.Screen name="relationship-structure" />
      <Stack.Screen name="lifestyle-interests" />
      <Stack.Screen name="reveal" />
      <Stack.Screen name="paywall" />
      <Stack.Screen name="invite" />
    </Stack>
  );
}
