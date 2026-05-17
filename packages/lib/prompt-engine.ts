import type { Prompt, ContentTier, RelationshipStructure } from '@ember/db';
import { resolvePronouns } from './identity';

export type PlayMode = 'daily' | 'deck' | 'random' | 'custom';

export interface GroupContext {
  id: string;
  members: Array<{
    id: string;
    display_name: string;
    pronouns: string | null;
  }>;
  max_tier: ContentTier;
  blocked_categories: string[];
  relationship_structure: RelationshipStructure | null;
  lifestyle_interests: string[] | null;
}

export interface PromptEngineOptions {
  recentlySeenIds?: string[];
  packId?: string;
  categoryId?: string;
}

const TIER_WEIGHTS: Record<ContentTier, number> = { mild: 1, spicy: 2, explicit: 3 };

export function isTierAllowed(promptTier: ContentTier, maxTier: ContentTier): boolean {
  return TIER_WEIGHTS[promptTier] <= TIER_WEIGHTS[maxTier];
}

export function isPromptEligible(
  prompt: Prompt,
  group: GroupContext,
  recentlySeenIds: string[] = []
): boolean {
  if (!isTierAllowed(prompt.tier, group.max_tier)) return false;
  if (group.blocked_categories.includes(prompt.category_id)) return false;
  if (recentlySeenIds.includes(prompt.id)) return false;
  const memberCount = group.members.length;
  if (memberCount < prompt.min_group_size || memberCount > prompt.max_group_size) return false;
  if (
    prompt.relationship_structures &&
    prompt.relationship_structures.length > 0 &&
    group.relationship_structure &&
    !prompt.relationship_structures.includes(group.relationship_structure)
  )
    return false;
  return true;
}

export function interpolatePrompt(body: string, group: GroupContext): string {
  let result = body;
  group.members.forEach((member, idx) => {
    const n = idx + 1;
    const pronouns = resolvePronouns({ pronouns: member.pronouns });
    result = result
      .replace(new RegExp(`\\{name${n}\\}`, 'g'), member.display_name)
      .replace(new RegExp(`\\{subject${n}\\}`, 'g'), pronouns.subject)
      .replace(new RegExp(`\\{object${n}\\}`, 'g'), pronouns.object)
      .replace(new RegExp(`\\{possessive${n}\\}`, 'g'), pronouns.possessive)
      .replace(new RegExp(`\\{reflexive${n}\\}`, 'g'), pronouns.reflexive);
  });
  // Fallback tokens for generic {name1}, {subject}, etc.
  result = result
    .replace(/\{name1\}/g, group.members[0]?.display_name ?? 'Partner 1')
    .replace(/\{name2\}/g, group.members[1]?.display_name ?? 'Partner 2')
    .replace(
      /\{subject\}/g,
      resolvePronouns({ pronouns: group.members[0]?.pronouns ?? null }).subject
    )
    .replace(
      /\{object\}/g,
      resolvePronouns({ pronouns: group.members[0]?.pronouns ?? null }).object
    )
    .replace(
      /\{possessive\}/g,
      resolvePronouns({ pronouns: group.members[0]?.pronouns ?? null }).possessive
    );
  return result;
}

export function selectNextPrompt(
  prompts: Prompt[],
  group: GroupContext,
  options: PromptEngineOptions = {}
): Prompt | null {
  const { recentlySeenIds = [] } = options;
  const eligible = prompts.filter((p) => isPromptEligible(p, group, recentlySeenIds));
  if (eligible.length === 0) return null;
  // Weight group-size-appropriate prompts higher
  const weighted = eligible.map((p) => ({
    prompt: p,
    weight: group.members.length >= p.min_group_size ? 2 : 1,
  }));
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const { prompt, weight } of weighted) {
    rand -= weight;
    if (rand <= 0) return prompt;
  }
  return eligible[0] ?? null;
}

export function generateInviteCode(): string {
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}
