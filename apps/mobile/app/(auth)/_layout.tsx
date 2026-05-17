import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1B1233' } }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
