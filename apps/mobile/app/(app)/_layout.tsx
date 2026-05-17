import { Tabs } from 'expo-router';
import { Home, Settings } from 'lucide-react-native';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#1B1233', borderTopColor: '#2D2050' },
        tabBarActiveTintColor: '#E85A6B',
        tabBarInactiveTintColor: '#9CA3AF',
        headerStyle: { backgroundColor: '#1B1233' },
        headerTintColor: '#FBF7F4',
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={22} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color }) => <Settings size={22} color={color} /> }} />
      {/* ROADMAP-B: Community tab will appear here when Matrix integration ships */}
    </Tabs>
  );
}
