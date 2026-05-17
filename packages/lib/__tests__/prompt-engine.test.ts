import { describe, it, expect } from 'vitest';
import {
  isPromptEligible,
  interpolatePrompt,
  isTierAllowed,
  selectNextPrompt,
} from '../prompt-engine';
import type { Prompt } from '@ember/db';
import type { GroupContext } from '../prompt-engine';

const mockPrompt: Prompt = {
  id: 'p1',
  category_id: 'cat1',
  tier: 'mild',
  body: 'Tell {name1} something you love about {possessive2} laugh.',
  body_i18n: null,
  follow_up: null,
  est_minutes: 5,
  tags: [],
  relationship_structures: [],
  min_group_size: 2,
  max_group_size: 6,
  published: true,
  version: 1,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
  author_id: null,
};

const mockGroup: GroupContext = {
  id: 'g1',
  members: [
    { id: 'u1', display_name: 'Alex', pronouns: 'they/them' },
    { id: 'u2', display_name: 'Sam', pronouns: 'she/her' },
  ],
  max_tier: 'mild',
  blocked_categories: [],
  relationship_structure: 'monogamous',
  lifestyle_interests: null,
};

describe('isTierAllowed', () => {
  it('allows mild when max is mild', () => expect(isTierAllowed('mild', 'mild')).toBe(true));
  it('blocks spicy when max is mild', () => expect(isTierAllowed('spicy', 'mild')).toBe(false));
  it('allows spicy when max is spicy', () => expect(isTierAllowed('spicy', 'spicy')).toBe(true));
  it('allows mild when max is explicit', () =>
    expect(isTierAllowed('mild', 'explicit')).toBe(true));
});

describe('isPromptEligible', () => {
  it('returns true for eligible prompt', () => {
    expect(isPromptEligible(mockPrompt, mockGroup)).toBe(true);
  });

  it('blocks recently seen prompts', () => {
    expect(isPromptEligible(mockPrompt, mockGroup, ['p1'])).toBe(false);
  });

  it('blocks when category is blocked', () => {
    const group = { ...mockGroup, blocked_categories: ['cat1'] };
    expect(isPromptEligible(mockPrompt, group)).toBe(false);
  });

  it('blocks when group size is too small', () => {
    const prompt = { ...mockPrompt, min_group_size: 3 };
    expect(isPromptEligible(prompt, mockGroup)).toBe(false);
  });
});

describe('interpolatePrompt', () => {
  it('replaces name and pronoun tokens', () => {
    const result = interpolatePrompt('Tell {name1} about {possessive2} day', mockGroup);
    expect(result).toBe('Tell Alex about her day');
  });
});

describe('selectNextPrompt', () => {
  it('returns null for empty eligible list', () => {
    const groupWithSpicyBlock = { ...mockGroup, max_tier: 'mild' as const };
    const spicyPrompt = { ...mockPrompt, tier: 'spicy' as const };
    expect(selectNextPrompt([spicyPrompt], groupWithSpicyBlock)).toBeNull();
  });

  it('returns a prompt from eligible list', () => {
    const result = selectNextPrompt([mockPrompt], mockGroup);
    expect(result).not.toBeNull();
    expect(result?.id).toBe('p1');
  });
});
