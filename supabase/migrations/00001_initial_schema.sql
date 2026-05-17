-- =============================================================================
-- Migration 00001: Initial Schema
-- Ember couples/lifestyle game app
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ENUMs
-- ---------------------------------------------------------------------------

CREATE TYPE relationship_structure_enum AS ENUM (
  'monogamous', 'open', 'swinger', 'polyamorous', 'solo_poly',
  'relationship_anarchist', 'ENM', 'thruple', 'quad', 'constellation',
  'exploring', 'prefer_not_to_say'
);

CREATE TYPE content_tier_enum AS ENUM ('mild', 'spicy', 'explicit');
CREATE TYPE group_status_enum AS ENUM ('pending', 'active', 'dissolved');
CREATE TYPE group_member_role_enum AS ENUM ('creator', 'member');
CREATE TYPE session_mode_enum AS ENUM ('daily', 'deck', 'random', 'custom');
CREATE TYPE nudge_kind_enum AS ENUM ('poke', 'suggestion', 'reaction');
CREATE TYPE subscription_provider_enum AS ENUM ('stripe', 'revenuecat');
CREATE TYPE subscription_tier_enum AS ENUM ('free', 'plus', 'household');
CREATE TYPE toy_provider_enum AS ENUM ('lovense', 'buttplug_generic'); -- ROADMAP-D
CREATE TYPE community_room_kind_enum AS ENUM ('group_private', 'lifestyle_community', 'event'); -- ROADMAP-B

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- profiles table (mirrors auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  dob DATE,
  age_verified_at TIMESTAMPTZ,
  locale TEXT DEFAULT 'en',
  push_token TEXT,
  pronouns TEXT,
  gender TEXT,
  orientation TEXT[],
  relationship_structure relationship_structure_enum,
  lifestyle_interests TEXT[],
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- groups (2-6 members)
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES profiles(id),
  name TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  invite_expires_at TIMESTAMPTZ,
  max_members INTEGER NOT NULL DEFAULT 2 CHECK (max_members BETWEEN 2 AND 6),
  status group_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  dissolved_at TIMESTAMPTZ
);

-- group_members
CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role group_member_role_enum NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- group_settings
CREATE TABLE IF NOT EXISTS group_settings (
  group_id UUID PRIMARY KEY REFERENCES groups(id) ON DELETE CASCADE,
  max_tier content_tier_enum NOT NULL DEFAULT 'mild',
  blocked_categories TEXT[] NOT NULL DEFAULT '{}',
  explicit_consent JSONB NOT NULL DEFAULT '{}',
  theme JSONB,
  paused_until TIMESTAMPTZ
  -- ROADMAP-B: community_room_id TEXT -- Matrix room ID when community feature ships
  -- ROADMAP-D: toy_sync_enabled BOOLEAN DEFAULT FALSE
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  relationship_structures TEXT[]
);

-- prompts
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id),
  tier content_tier_enum NOT NULL DEFAULT 'mild',
  body TEXT NOT NULL,
  body_i18n JSONB,
  follow_up TEXT,
  est_minutes INTEGER,
  tags TEXT[],
  relationship_structures TEXT[],
  min_group_size INTEGER NOT NULL DEFAULT 2,
  max_group_size INTEGER NOT NULL DEFAULT 6,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_id UUID REFERENCES profiles(id)
);

-- prompt_packs
CREATE TABLE IF NOT EXISTS prompt_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  sku TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  relationship_structures TEXT[]
);

-- prompt_pack_items
CREATE TABLE IF NOT EXISTS prompt_pack_items (
  pack_id UUID NOT NULL REFERENCES prompt_packs(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (pack_id, prompt_id)
);

-- sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  mode session_mode_enum NOT NULL DEFAULT 'daily',
  pack_id UUID REFERENCES prompt_packs(id)
  -- ROADMAP-D: toy_session_id TEXT
);

-- session_cards
CREATE TABLE IF NOT EXISTS session_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id),
  served_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responses JSONB NOT NULL DEFAULT '{}',
  revealed_at TIMESTAMPTZ,
  is_match BOOLEAN NOT NULL DEFAULT FALSE
  -- ROADMAP-D: toy_pattern JSONB
);

-- streaks
CREATE TABLE IF NOT EXISTS streaks (
  group_id UUID PRIMARY KEY REFERENCES groups(id) ON DELETE CASCADE,
  current_count INTEGER NOT NULL DEFAULT 0,
  longest INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_saved_by UUID REFERENCES profiles(id)
);

-- nudges
CREATE TABLE IF NOT EXISTS nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES profiles(id),
  to_user_id UUID REFERENCES profiles(id),
  kind nudge_kind_enum NOT NULL DEFAULT 'poke',
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- messages (session-scoped chat, NOT community chat)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
  -- ROADMAP-B: for community rooms this table is replaced by Matrix rooms
);

-- subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  group_id UUID REFERENCES groups(id),
  provider subscription_provider_enum NOT NULL,
  provider_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  tier subscription_tier_enum NOT NULL DEFAULT 'free',
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw JSONB
);

-- content_warnings_acknowledged
CREATE TABLE IF NOT EXISTS content_warnings_acknowledged (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier content_tier_enum NOT NULL,
  acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, tier)
);

-- audit_log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id TEXT,
  diff JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- feature_flags
CREATE TABLE IF NOT EXISTS feature_flags (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT
);

-- ROADMAP-B stub: community rooms (no app logic yet)
CREATE TABLE IF NOT EXISTS community_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id),
  matrix_room_id TEXT,
  name TEXT NOT NULL,
  kind community_room_kind_enum NOT NULL DEFAULT 'group_private',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ROADMAP-D stub: toy connections (no app logic yet)
CREATE TABLE IF NOT EXISTS toy_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider toy_provider_enum NOT NULL,
  provider_uid TEXT NOT NULL,
  toy_name TEXT NOT NULL,
  capabilities JSONB,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------------

-- View that reveals session_cards responses only when all members have responded
CREATE OR REPLACE VIEW session_cards_revealed WITH (security_invoker = true) AS
SELECT
  sc.id,
  sc.session_id,
  sc.prompt_id,
  sc.served_at,
  sc.is_match,
  sc.revealed_at,
  CASE
    WHEN sc.revealed_at IS NOT NULL THEN sc.responses
    WHEN (
      SELECT COUNT(*) FROM group_members gm
      JOIN sessions s ON s.group_id = gm.group_id
      WHERE s.id = sc.session_id
    ) = jsonb_object_length(sc.responses)
    THEN sc.responses
    ELSE jsonb_build_object(auth.uid()::text, sc.responses->auth.uid()::text)
  END AS responses
FROM session_cards sc;

-- entitlements_view: any active sub in the group grants all members access
CREATE OR REPLACE VIEW entitlements_view AS
SELECT
  gm.user_id,
  gm.group_id,
  COALESCE(
    (SELECT MAX(
      CASE s.tier
        WHEN 'household' THEN 3
        WHEN 'plus' THEN 2
        ELSE 1
      END
    ) FROM subscriptions s
    WHERE s.group_id = gm.group_id AND s.status IN ('active', 'trialing')
    ),
    1
  ) AS tier_level,
  COALESCE(
    (SELECT s.tier FROM subscriptions s
     WHERE s.group_id = gm.group_id AND s.status IN ('active', 'trialing')
     ORDER BY CASE s.tier WHEN 'household' THEN 3 WHEN 'plus' THEN 2 ELSE 1 END DESC
     LIMIT 1),
    'free'
  )::subscription_tier_enum AS tier
FROM group_members gm;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_sessions_group_id ON sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_session_cards_session_id ON session_cards(session_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category_id ON prompts(category_id);
CREATE INDEX IF NOT EXISTS idx_prompts_tier ON prompts(tier);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_group_id ON subscriptions(group_id);
CREATE INDEX IF NOT EXISTS idx_nudges_group_id ON nudges(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id ON audit_log(actor_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_groups_invite_code ON groups(invite_code);

-- ---------------------------------------------------------------------------
-- Trigger: auto-create profile on user signup
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, created_at)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', ''), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
