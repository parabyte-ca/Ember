-- =============================================================================
-- Migration 00002: Row Level Security Policies
-- Ember couples/lifestyle game app
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enable RLS on all tables
-- ---------------------------------------------------------------------------

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_pack_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE nudges ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_warnings_acknowledged ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_rooms ENABLE ROW LEVEL SECURITY; -- ROADMAP-B
ALTER TABLE toy_connections ENABLE ROW LEVEL SECURITY; -- ROADMAP-D

-- ---------------------------------------------------------------------------
-- Helper function: is the current user a member of a group?
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION is_group_member(p_group_id UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM group_members
    WHERE group_id = p_group_id AND user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- Users read/write only their own row; group members can read each other's
-- display info.
-- ---------------------------------------------------------------------------

CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow group members to read each other's profiles (for display names)
CREATE POLICY "profiles_select_group_members"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm1
      JOIN group_members gm2 ON gm1.group_id = gm2.group_id
      WHERE gm1.user_id = auth.uid() AND gm2.user_id = profiles.id
    )
  );

-- ---------------------------------------------------------------------------
-- groups
-- ---------------------------------------------------------------------------

CREATE POLICY "groups_select_member"
  ON groups FOR SELECT
  USING (is_group_member(id));

CREATE POLICY "groups_insert_own"
  ON groups FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "groups_update_member"
  ON groups FOR UPDATE
  USING (is_group_member(id));

-- ---------------------------------------------------------------------------
-- group_members
-- Read if member; insert handled by edge function (service role) but allow
-- self-insert for the initial creator flow; delete own membership.
-- ---------------------------------------------------------------------------

CREATE POLICY "group_members_select_member"
  ON group_members FOR SELECT
  USING (is_group_member(group_id));

CREATE POLICY "group_members_insert_own"
  ON group_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "group_members_delete_own"
  ON group_members FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- group_settings
-- ---------------------------------------------------------------------------

CREATE POLICY "group_settings_select_member"
  ON group_settings FOR SELECT
  USING (is_group_member(group_id));

CREATE POLICY "group_settings_insert_member"
  ON group_settings FOR INSERT
  WITH CHECK (is_group_member(group_id));

CREATE POLICY "group_settings_update_member"
  ON group_settings FOR UPDATE
  USING (is_group_member(group_id));

-- ---------------------------------------------------------------------------
-- categories
-- Readable by all authenticated users; writable by service role only.
-- ---------------------------------------------------------------------------

CREATE POLICY "categories_select_authenticated"
  ON categories FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ---------------------------------------------------------------------------
-- prompts
-- Readable by all authenticated users (published only); writable by service
-- role only.
-- ---------------------------------------------------------------------------

CREATE POLICY "prompts_select_authenticated"
  ON prompts FOR SELECT
  USING (auth.uid() IS NOT NULL AND published = TRUE);

-- ---------------------------------------------------------------------------
-- prompt_packs / prompt_pack_items
-- ---------------------------------------------------------------------------

CREATE POLICY "prompt_packs_select_authenticated"
  ON prompt_packs FOR SELECT
  USING (auth.uid() IS NOT NULL AND active = TRUE);

CREATE POLICY "prompt_pack_items_select_authenticated"
  ON prompt_pack_items FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ---------------------------------------------------------------------------
-- sessions
-- ---------------------------------------------------------------------------

CREATE POLICY "sessions_select_member"
  ON sessions FOR SELECT
  USING (is_group_member(group_id));

CREATE POLICY "sessions_insert_member"
  ON sessions FOR INSERT
  WITH CHECK (is_group_member(group_id));

CREATE POLICY "sessions_update_member"
  ON sessions FOR UPDATE
  USING (is_group_member(group_id));

-- ---------------------------------------------------------------------------
-- session_cards
-- Responses hidden until all members respond — enforced via the
-- session_cards_revealed view; raw table still needs member check.
-- ---------------------------------------------------------------------------

CREATE POLICY "session_cards_select_member"
  ON session_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_id AND is_group_member(s.group_id)
    )
  );

CREATE POLICY "session_cards_insert_member"
  ON session_cards FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_id AND is_group_member(s.group_id)
    )
  );

CREATE POLICY "session_cards_update_member"
  ON session_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions s
      WHERE s.id = session_id AND is_group_member(s.group_id)
    )
  );

-- ---------------------------------------------------------------------------
-- streaks
-- ---------------------------------------------------------------------------

CREATE POLICY "streaks_select_member"
  ON streaks FOR SELECT
  USING (is_group_member(group_id));

CREATE POLICY "streaks_insert_member"
  ON streaks FOR INSERT
  WITH CHECK (is_group_member(group_id));

CREATE POLICY "streaks_update_member"
  ON streaks FOR UPDATE
  USING (is_group_member(group_id));

-- ---------------------------------------------------------------------------
-- nudges
-- Read if group member; insert only as sender; update only as recipient
-- (to mark as read).
-- ---------------------------------------------------------------------------

CREATE POLICY "nudges_select_member"
  ON nudges FOR SELECT
  USING (is_group_member(group_id));

CREATE POLICY "nudges_insert_own"
  ON nudges FOR INSERT
  WITH CHECK (from_user_id = auth.uid() AND is_group_member(group_id));

CREATE POLICY "nudges_update_own"
  ON nudges FOR UPDATE
  USING (to_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------

CREATE POLICY "messages_select_member"
  ON messages FOR SELECT
  USING (is_group_member(group_id));

CREATE POLICY "messages_insert_member"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid() AND is_group_member(group_id));

-- ---------------------------------------------------------------------------
-- subscriptions
-- Users see their own subscription rows only; group-level entitlements are
-- surfaced through entitlements_view instead.
-- ---------------------------------------------------------------------------

CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- content_warnings_acknowledged
-- ---------------------------------------------------------------------------

CREATE POLICY "cwa_select_own"
  ON content_warnings_acknowledged FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "cwa_insert_own"
  ON content_warnings_acknowledged FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "cwa_delete_own"
  ON content_warnings_acknowledged FOR DELETE
  USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- audit_log
-- Service role only — no policy means normal authenticated users are blocked.
-- ---------------------------------------------------------------------------

-- (intentionally no policies — service role bypasses RLS)

-- ---------------------------------------------------------------------------
-- feature_flags
-- Readable by all authenticated users.
-- ---------------------------------------------------------------------------

CREATE POLICY "feature_flags_select_authenticated"
  ON feature_flags FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ---------------------------------------------------------------------------
-- ROADMAP-B: community_rooms
-- Accessible only to owning group members (no app logic yet).
-- ---------------------------------------------------------------------------

CREATE POLICY "community_rooms_select_member"
  ON community_rooms FOR SELECT
  USING (
    group_id IS NULL OR is_group_member(group_id)
  );

-- ---------------------------------------------------------------------------
-- ROADMAP-D: toy_connections
-- Accessible only to the owning user (no app logic yet).
-- ---------------------------------------------------------------------------

CREATE POLICY "toy_connections_select_own"
  ON toy_connections FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "toy_connections_insert_own"
  ON toy_connections FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "toy_connections_update_own"
  ON toy_connections FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "toy_connections_delete_own"
  ON toy_connections FOR DELETE
  USING (user_id = auth.uid());
