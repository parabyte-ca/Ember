import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { APP_NAME } from '@ember/lib';
import * as Haptics from 'expo-haptics';

const PLANS = [
  {
    id: 'plus_monthly', name: 'Plus', price: '$9.99', period: '/month',
    trial: '7-day free trial',
    features: ['Unlimited prompts', 'All content tiers', 'AI personalisation', 'Groups up to 4', 'Journaling & streaks'],
    highlighted: true,
  },
  {
    id: 'household', name: 'Household', price: '$79.99', period: '/year',
    trial: null,
    features: ['Everything in Plus', 'Groups up to 6', 'Lifestyle & Group Dynamics packs'],
    highlighted: false,
  },
];

export default function PaywallScreen() {
  const handleSelect = async (planId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Integrate with RevenueCat for in-app purchases
    router.push('/(onboarding)/invite');
  };

  return (
    <ScrollView className="flex-1 bg-secondary" contentContainerStyle={{ padding: 24 }}>
      <View className="space-y-6 pt-8">
        <View>
          <Text className="text-foreground font-bold text-2xl">Unlock the full {APP_NAME} experience</Text>
          <Text className="text-muted-foreground mt-1 text-sm">One subscription covers everyone in your group.</Text>
        </View>
        {PLANS.map((plan) => (
          <View key={plan.id} className={`rounded-xl border-2 p-4 ${plan.highlighted ? 'border-primary' : 'border-border'}`}>
            <View className="flex-row justify-between items-start mb-3">
              <View>
                <Text className="text-foreground font-bold text-lg">{plan.name}</Text>
                {plan.trial && <Text className="text-primary text-xs font-medium">{plan.trial}</Text>}
              </View>
              <View className="items-end">
                <Text className="text-foreground font-bold text-xl">{plan.price}</Text>
                <Text className="text-muted-foreground text-sm">{plan.period}</Text>
              </View>
            </View>
            <View className="space-y-1 mb-4">
              {plan.features.map((f) => (
                <View key={f} className="flex-row items-center gap-2">
                  <Text className="text-primary text-xs">✓</Text>
                  <Text className="text-foreground text-sm">{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => handleSelect(plan.id)}
              className={`rounded-xl py-3 items-center ${plan.highlighted ? 'bg-primary' : 'border border-border'}`}>
              <Text className={`font-semibold text-sm ${plan.highlighted ? 'text-white' : 'text-foreground'}`}>
                {plan.trial ? `Start ${plan.trial}` : `Get ${plan.name}`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={() => router.push('/(onboarding)/invite')} className="items-center py-2">
          <Text className="text-muted-foreground text-sm">Continue for free</Text>
        </TouchableOpacity>
        <Text className="text-muted-foreground text-xs text-center">Cancel anytime. One subscription unlocks access for all group members.</Text>
      </View>
    </ScrollView>
  );
}
