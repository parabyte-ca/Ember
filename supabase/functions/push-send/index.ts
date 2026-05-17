import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushRequest {
  user_ids?: string[];
  group_id?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const payload: PushRequest = await req.json();

  let userIds: string[] = payload.user_ids ?? [];

  if (payload.group_id && userIds.length === 0) {
    const { data: members } = await supabase
      .from('group_members')
      .select('user_id')
      .eq('group_id', payload.group_id);
    userIds = (members ?? []).map((m: { user_id: string }) => m.user_id);
  }

  // Get push tokens and check quiet hours
  const now = new Date();
  const currentHour = now.getUTCHours();
  const isQuietHours = currentHour >= 22 || currentHour < 8; // UTC-based; per-user quiet hours TODO

  if (isQuietHours) {
    return new Response(
      JSON.stringify({ skipped: true, reason: 'quiet_hours' }),
      { headers: corsHeaders },
    );
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, push_token')
    .in('id', userIds)
    .not('push_token', 'is', null);

  // TODO: Integrate with Expo Push Notification service or FCM/APNs
  // For now, log the intended push
  const tokens = (profiles ?? [])
    .map((p: { id: string; push_token: string }) => p.push_token)
    .filter(Boolean);

  console.log(`[push-send] Would send "${payload.title}" to ${tokens.length} devices`);

  return new Response(
    JSON.stringify({ sent: tokens.length, user_ids: userIds }),
    { headers: corsHeaders },
  );
});
