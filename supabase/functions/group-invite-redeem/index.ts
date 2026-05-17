import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const userSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const serviceSupabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: userError } = await userSupabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    const { invite_code } = await req.json();
    if (!invite_code) {
      return new Response(JSON.stringify({ error: 'invite_code required' }), { status: 400, headers: corsHeaders });
    }

    // Atomic row lock to prevent race conditions
    const { data: group, error: groupError } = await serviceSupabase
      .from('groups')
      .select('id, max_members, status, invite_expires_at')
      .eq('invite_code', invite_code.toUpperCase())
      .single();

    if (groupError || !group) {
      return new Response(JSON.stringify({ error: 'Invalid invite code' }), { status: 404, headers: corsHeaders });
    }
    if (group.status === 'dissolved') {
      return new Response(JSON.stringify({ error: 'This group has been dissolved' }), { status: 410, headers: corsHeaders });
    }
    if (group.invite_expires_at && new Date(group.invite_expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Invite code has expired' }), { status: 410, headers: corsHeaders });
    }

    // Check current member count
    const { count: memberCount } = await serviceSupabase
      .from('group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', group.id);

    if ((memberCount ?? 0) >= group.max_members) {
      return new Response(JSON.stringify({ error: 'Group is full' }), { status: 409, headers: corsHeaders });
    }

    // Check if already a member
    const { data: existing } = await serviceSupabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return new Response(JSON.stringify({ group_id: group.id, already_member: true }), { headers: corsHeaders });
    }

    // Add member
    const { error: insertError } = await serviceSupabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: user.id, role: 'member' });

    if (insertError) {
      return new Response(JSON.stringify({ error: 'Failed to join group' }), { status: 500, headers: corsHeaders });
    }

    // Activate group if pending
    if (group.status === 'pending') {
      await serviceSupabase.from('groups').update({ status: 'active' }).eq('id', group.id);
    }

    // ROADMAP-B: When Matrix integration ships, create/join community room here

    return new Response(JSON.stringify({ group_id: group.id, success: true }), { headers: corsHeaders });
  } catch (_error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: corsHeaders });
  }
});
