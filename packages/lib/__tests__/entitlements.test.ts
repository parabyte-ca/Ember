import { describe, it, expect } from 'vitest';
import { resolveEntitlements } from '../entitlements';
import type { Subscription } from '@ember/db';

const makeSubscription = (
  tier: 'free' | 'plus' | 'household',
  status = 'active'
): Subscription => ({
  id: 'sub1',
  user_id: 'u1',
  group_id: 'g1',
  provider: 'stripe',
  provider_customer_id: 'cus_test',
  status,
  tier,
  current_period_end: null,
  trial_end: null,
  cancel_at: null,
  created_at: new Date().toISOString(),
  raw: null,
});

describe('resolveEntitlements', () => {
  it('returns free tier for no subscriptions', () => {
    const e = resolveEntitlements([]);
    expect(e.tier).toBe('free');
    expect(e.maxGroupSize).toBe(2);
    expect(e.unlimitedPrompts).toBe(false);
  });

  it('returns plus tier for active plus subscription', () => {
    const e = resolveEntitlements([makeSubscription('plus')]);
    expect(e.tier).toBe('plus');
    expect(e.maxGroupSize).toBe(4);
    expect(e.aiPersonalization).toBe(true);
  });

  it('returns household tier for household subscription', () => {
    const e = resolveEntitlements([makeSubscription('household')]);
    expect(e.tier).toBe('household');
    expect(e.maxGroupSize).toBe(6);
  });

  it('picks highest tier when multiple active', () => {
    const e = resolveEntitlements([makeSubscription('plus'), makeSubscription('household')]);
    expect(e.tier).toBe('household');
  });

  it('ignores cancelled subscriptions', () => {
    const e = resolveEntitlements([makeSubscription('plus', 'cancelled')]);
    expect(e.tier).toBe('free');
  });
});
