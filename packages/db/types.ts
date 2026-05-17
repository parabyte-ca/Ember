export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type RelationshipStructure =
  | 'monogamous'
  | 'open'
  | 'swinger'
  | 'polyamorous'
  | 'solo_poly'
  | 'relationship_anarchist'
  | 'ENM'
  | 'thruple'
  | 'quad'
  | 'constellation'
  | 'exploring'
  | 'prefer_not_to_say';

export type ContentTier = 'mild' | 'spicy' | 'explicit';
export type GroupStatus = 'pending' | 'active' | 'dissolved';
export type GroupMemberRole = 'creator' | 'member';
export type SessionMode = 'daily' | 'deck' | 'random' | 'custom';
export type NudgeKind = 'poke' | 'suggestion' | 'reaction';
export type SubscriptionProvider = 'stripe' | 'revenuecat';
export type SubscriptionTier = 'free' | 'plus' | 'household';
export type ToyProvider = 'lovense' | 'buttplug_generic'; // ROADMAP-D
export type CommunityRoomKind = 'group_private' | 'lifestyle_community' | 'event'; // ROADMAP-B

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  dob: string | null;
  age_verified_at: string | null;
  locale: string | null;
  push_token: string | null;
  pronouns: string | null;
  gender: string | null;
  orientation: string[] | null;
  relationship_structure: RelationshipStructure | null;
  lifestyle_interests: string[] | null;
  onboarding_complete: boolean;
  created_at: string;
}

export interface Group {
  id: string;
  created_by: string;
  name: string | null;
  invite_code: string;
  invite_expires_at: string | null;
  max_members: number;
  status: GroupStatus;
  created_at: string;
  dissolved_at: string | null;
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  role: GroupMemberRole;
  joined_at: string;
}

export interface GroupSettings {
  group_id: string;
  max_tier: ContentTier;
  blocked_categories: string[];
  explicit_consent: Record<string, boolean>;
  theme: Json | null;
  // ROADMAP-B: community_room_id: string | null;
  // ROADMAP-D: toy_sync_enabled: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  icon: string | null;
  active: boolean;
  relationship_structures: string[] | null;
}

export interface Prompt {
  id: string;
  category_id: string;
  tier: ContentTier;
  body: string;
  body_i18n: Json | null;
  follow_up: string | null;
  est_minutes: number | null;
  tags: string[] | null;
  relationship_structures: string[] | null;
  min_group_size: number;
  max_group_size: number;
  published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  author_id: string | null;
}

export interface PromptPack {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  is_premium: boolean;
  sku: string | null;
  sort_order: number;
  active: boolean;
  relationship_structures: string[] | null;
}

export interface PromptPackItem {
  pack_id: string;
  prompt_id: string;
  sort_order: number;
}

export interface Session {
  id: string;
  group_id: string;
  started_at: string;
  ended_at: string | null;
  mode: SessionMode;
  pack_id: string | null;
  // ROADMAP-D: toy_session_id: string | null;
}

export interface SessionCard {
  id: string;
  session_id: string;
  prompt_id: string;
  served_at: string;
  responses: Record<string, 'yes' | 'maybe' | 'no' | 'skip' | 'done'>;
  revealed_at: string | null;
  is_match: boolean;
  // ROADMAP-D: toy_pattern: Json | null;
}

export interface Streak {
  group_id: string;
  current_count: number;
  longest: number;
  last_active_date: string;
  last_saved_by: string;
}

export interface Nudge {
  id: string;
  group_id: string;
  from_user_id: string;
  to_user_id: string | null;
  kind: NudgeKind;
  payload: Json | null;
  created_at: string;
  read_at: string | null;
}

export interface Message {
  id: string;
  group_id: string;
  session_id: string | null;
  sender_id: string;
  body: string;
  created_at: string;
  expires_at: string | null;
  // ROADMAP-B: replaced by Matrix rooms for community
}

export interface Subscription {
  id: string;
  user_id: string;
  group_id: string | null;
  provider: SubscriptionProvider;
  provider_customer_id: string;
  status: string;
  tier: SubscriptionTier;
  current_period_end: string | null;
  trial_end: string | null;
  cancel_at: string | null;
  created_at: string;
  raw: Json | null;
}

export interface ContentWarningAcknowledged {
  user_id: string;
  tier: ContentTier;
  acknowledged_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_table: string;
  target_id: string;
  diff: Json | null;
  created_at: string;
}

export interface FeatureFlag {
  key: string;
  value: Json;
  description: string | null;
}

// ROADMAP-B stub
export interface CommunityRoom {
  id: string;
  group_id: string | null;
  matrix_room_id: string | null;
  name: string;
  kind: CommunityRoomKind;
  created_at: string;
}

// ROADMAP-D stub
export interface ToyConnection {
  id: string;
  user_id: string;
  provider: ToyProvider;
  provider_uid: string;
  toy_name: string;
  capabilities: Json | null;
  last_seen: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
      };
      groups: {
        Row: Group;
        Insert: Omit<Group, 'id' | 'created_at'>;
        Update: Partial<Group>;
      };
      group_members: {
        Row: GroupMember;
        Insert: GroupMember;
        Update: Partial<GroupMember>;
      };
      group_settings: {
        Row: GroupSettings;
        Insert: GroupSettings;
        Update: Partial<GroupSettings>;
      };
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id'>;
        Update: Partial<Category>;
      };
      prompts: {
        Row: Prompt;
        Insert: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Prompt>;
      };
      prompt_packs: {
        Row: PromptPack;
        Insert: Omit<PromptPack, 'id'>;
        Update: Partial<PromptPack>;
      };
      prompt_pack_items: {
        Row: PromptPackItem;
        Insert: PromptPackItem;
        Update: Partial<PromptPackItem>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'id'>;
        Update: Partial<Session>;
      };
      session_cards: {
        Row: SessionCard;
        Insert: Omit<SessionCard, 'id'>;
        Update: Partial<SessionCard>;
      };
      streaks: {
        Row: Streak;
        Insert: Streak;
        Update: Partial<Streak>;
      };
      nudges: {
        Row: Nudge;
        Insert: Omit<Nudge, 'id'>;
        Update: Partial<Nudge>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id'>;
        Update: Partial<Message>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, 'id'>;
        Update: Partial<Subscription>;
      };
      content_warnings_acknowledged: {
        Row: ContentWarningAcknowledged;
        Insert: ContentWarningAcknowledged;
        Update: Partial<ContentWarningAcknowledged>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id'>;
        Update: never;
      };
      feature_flags: {
        Row: FeatureFlag;
        Insert: FeatureFlag;
        Update: Partial<FeatureFlag>;
      };
      community_rooms: {
        Row: CommunityRoom;
        Insert: Omit<CommunityRoom, 'id'>;
        Update: Partial<CommunityRoom>;
      }; // ROADMAP-B
      toy_connections: {
        Row: ToyConnection;
        Insert: Omit<ToyConnection, 'id'>;
        Update: Partial<ToyConnection>;
      }; // ROADMAP-D
    };
  };
};
