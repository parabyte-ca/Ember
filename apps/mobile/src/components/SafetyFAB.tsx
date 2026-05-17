import { TouchableOpacity, Text } from 'react-native';
import { router } from 'expo-router';

export default function SafetyFAB() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/(app)/safety')}
      className="absolute bottom-6 right-6 bg-muted rounded-full px-4 py-2 shadow-lg"
      style={{ elevation: 4 }}
    >
      <Text className="text-foreground text-xs font-medium">Safety</Text>
    </TouchableOpacity>
  );
}
