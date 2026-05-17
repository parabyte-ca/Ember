import { z } from 'zod';

export const RelationshipStructureEnum = z.enum([
  'monogamous',
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
  'prefer_not_to_say',
]);

export const ContentTierEnum = z.enum(['mild', 'spicy', 'explicit']);

export const ProfileSchema = z.object({
  display_name: z.string().min(1).max(50),
  pronouns: z.string().max(50).optional(),
  gender: z.string().max(100).optional(),
  orientation: z.array(z.string()).optional(),
  relationship_structure: RelationshipStructureEnum.optional(),
  lifestyle_interests: z.array(z.string()).optional(),
  locale: z.string().optional(),
});

export const AgeGateSchema = z.object({
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const exactAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
      return exactAge >= 18;
    }, 'You must be 18 or older to use this app'),
});

export const GroupCreateSchema = z.object({
  max_members: z.number().int().min(2).max(6),
  name: z.string().max(50).optional(),
});

export const InviteCodeSchema = z
  .string()
  .length(6)
  .regex(/^[A-HJ-NP-Z2-9]{6}$/, 'Invalid invite code');

export const PromptResponseSchema = z.object({
  response: z.enum(['yes', 'maybe', 'no', 'skip', 'done']),
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
export type AgeGateInput = z.infer<typeof AgeGateSchema>;
export type GroupCreateInput = z.infer<typeof GroupCreateSchema>;
export type InviteCode = z.infer<typeof InviteCodeSchema>;
export type PromptResponse = z.infer<typeof PromptResponseSchema>;
