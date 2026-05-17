import type { Profile, RelationshipStructure } from '@ember/db';

export interface PronounSet {
  subject: string; // they
  object: string; // them
  possessive: string; // their
  reflexive: string; // themselves
  isPlural: boolean;
}

const COMMON_PRONOUN_SETS: Record<string, PronounSet> = {
  'she/her': {
    subject: 'she',
    object: 'her',
    possessive: 'her',
    reflexive: 'herself',
    isPlural: false,
  },
  'he/him': {
    subject: 'he',
    object: 'him',
    possessive: 'his',
    reflexive: 'himself',
    isPlural: false,
  },
  'they/them': {
    subject: 'they',
    object: 'them',
    possessive: 'their',
    reflexive: 'themselves',
    isPlural: true,
  },
  'xe/xem': {
    subject: 'xe',
    object: 'xem',
    possessive: 'xyr',
    reflexive: 'xemself',
    isPlural: false,
  },
  'ze/zir': {
    subject: 'ze',
    object: 'zir',
    possessive: 'zir',
    reflexive: 'zirself',
    isPlural: false,
  },
};

export function resolvePronouns(profile: Pick<Profile, 'pronouns'>): PronounSet {
  if (!profile.pronouns) {
    return COMMON_PRONOUN_SETS['they/them'];
  }
  const normalized = profile.pronouns.toLowerCase().trim();
  return (
    COMMON_PRONOUN_SETS[normalized] ?? {
      subject: normalized.split('/')[0] ?? 'they',
      object: normalized.split('/')[1] ?? 'them',
      possessive: normalized.split('/')[1] ?? 'their',
      reflexive: `${normalized.split('/')[0] ?? 'them'}self`,
      isPlural: false,
    }
  );
}

export function resolveGroupLabel(memberCount: number): string {
  if (memberCount === 2) return 'you two';
  if (memberCount === 3) return 'your trio';
  if (memberCount === 4) return 'your quad';
  return 'your group';
}

export function resolveRelationshipLabel(structure: RelationshipStructure | null): string {
  const labels: Record<RelationshipStructure, string> = {
    monogamous: 'Just us two',
    open: 'Open relationship',
    swinger: 'Swinger / Lifestyle',
    polyamorous: 'Polyamorous',
    solo_poly: 'Solo poly',
    relationship_anarchist: 'Relationship anarchist',
    ENM: 'Ethically non-monogamous',
    thruple: 'Thruple',
    quad: 'Quad',
    constellation: 'Constellation',
    exploring: 'Still figuring it out',
    prefer_not_to_say: 'Prefer not to say',
  };
  if (!structure) return 'Exploring';
  return labels[structure] ?? 'Exploring';
}

export const ENM_ADJACENT_STRUCTURES: RelationshipStructure[] = [
  'open',
  'swinger',
  'polyamorous',
  'solo_poly',
  'relationship_anarchist',
  'ENM',
  'thruple',
  'quad',
  'constellation',
  'exploring',
];

export function isENMAdjacent(structure: RelationshipStructure | null): boolean {
  if (!structure) return false;
  return ENM_ADJACENT_STRUCTURES.includes(structure);
}

export const COMMON_PRONOUN_SUGGESTIONS = [
  'she/her',
  'he/him',
  'they/them',
  'xe/xem',
  'ze/zir',
  'any pronouns',
];

export const GENDER_SUGGESTIONS = [
  'Woman',
  'Man',
  'Non-binary',
  'Genderfluid',
  'Agender',
  'Trans woman',
  'Trans man',
  'Two-spirit',
  'Prefer not to say',
];

export const ORIENTATION_OPTIONS = [
  'Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Queer',
  'Asexual',
  'Demisexual',
];

export const LIFESTYLE_INTEREST_OPTIONS = [
  'soft_swap',
  'full_swap',
  'unicorn_friendly',
  'kink',
  'BDSM',
  'tantra',
  'exhibitionism',
  'voyeurism',
];
