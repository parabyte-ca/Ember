import type { Subscription, SubscriptionTier } from '@ember/db';

export interface Entitlements {
  tier: SubscriptionTier;
  maxGroupSize: number;
  canAccessSpicy: boolean;
  canAccessExplicit: boolean;
  unlimitedPrompts: boolean;
  aiPersonalization: boolean;
  allPacks: boolean;
  journaling: boolean;
  weeklyRecap: boolean;
}

const TIER_ENTITLEMENTS: Record<SubscriptionTier, Entitlements> = {
  free: {
    tier: 'free',
    maxGroupSize: 2,
    canAccessSpicy: false,
    canAccessExplicit: false,
    unlimitedPrompts: false,
    aiPersonalization: false,
    allPacks: false,
    journaling: false,
    weeklyRecap: false,
  },
  plus: {
    tier: 'plus',
    maxGroupSize: 4,
    canAccessSpicy: true,
    canAccessExplicit: true,
    unlimitedPrompts: true,
    aiPersonalization: true,
    allPacks: true,
    journaling: true,
    weeklyRecap: true,
  },
  household: {
    tier: 'household',
    maxGroupSize: 6,
    canAccessSpicy: true,
    canAccessExplicit: true,
    unlimitedPrompts: true,
    aiPersonalization: true,
    allPacks: true,
    journaling: true,
    weeklyRecap: true,
  },
};

export function resolveEntitlements(subscriptions: Subscription[]): Entitlements {
  const active = subscriptions.filter((s) => s.status === 'active' || s.status === 'trialing');
  if (active.length === 0) return TIER_ENTITLEMENTS.free;
  const tierOrder: SubscriptionTier[] = ['free', 'plus', 'household'];
  const best = active.reduce((prev, curr) => {
    const prevIdx = tierOrder.indexOf(prev.tier);
    const currIdx = tierOrder.indexOf(curr.tier);
    return currIdx > prevIdx ? curr : prev;
  });
  return TIER_ENTITLEMENTS[best.tier];
}
