export type AnalyticsEvent =
  | 'onboarding_step_viewed'
  | 'age_gate_passed'
  | 'identity_completed'
  | 'group_created'
  | 'member_joined'
  | 'prompt_served'
  | 'prompt_responded'
  | 'full_match_revealed'
  | 'paywall_viewed'
  | 'trial_started'
  | 'subscription_started'
  | 'subscription_cancelled'
  | 'streak_lost'
  | 'push_sent'
  | 'push_opened'
  | 'lifestyle_pack_viewed'
  | 'lifestyle_pack_unlocked';

export interface AnalyticsSuperProperties {
  relationship_structure?: string;
  group_size?: number;
}

export interface AnalyticsClient {
  capture(event: AnalyticsEvent, properties?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  setSuperProperties(props: AnalyticsSuperProperties): void;
}

export function createNoopAnalytics(): AnalyticsClient {
  return {
    capture: () => {},
    identify: () => {},
    setSuperProperties: () => {},
  };
}
