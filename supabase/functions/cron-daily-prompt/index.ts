import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Get all active groups
  const { data: activeGroups } = await supabase
    .from('groups')
    .select('id, name')
    .eq('status', 'active');

  if (!activeGroups?.length) {
    return new Response(JSON.stringify({ processed: 0 }), { headers: corsHeaders });
  }

  let processed = 0;

  for (const group of activeGroups) {
    try {
      // Get group settings
      const { data: settings } = await supabase
        .from('group_settings')
        .select('max_tier, blocked_categories')
        .eq('group_id', group.id)
        .single();

      // Get members
      const { data: members } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', group.id);

      if (!members?.length) continue;

      // Get recently seen prompt IDs (last 60 days)
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recentSessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('group_id', group.id)
        .gte('started_at', sixtyDaysAgo);

      const sessionIds = (recentSessions ?? []).map((s: { id: string }) => s.id);

      const { data: recentCards } = sessionIds.length > 0
        ? await supabase
            .from('session_cards')
            .select('prompt_id')
            .in('session_id', sessionIds)
        : { data: [] };

      const recentPromptIds = (recentCards ?? []).map((c: { prompt_id: string }) => c.prompt_id);

      // Select a prompt
      const { data: prompts } = await supabase
        .from('prompts')
        .select('*')
        .eq('published', true)
        .eq('tier', settings?.max_tier ?? 'mild')
        .not('id', 'in', `(${recentPromptIds.length ? recentPromptIds.join(',') : 'null'})`)
        .limit(10);

      if (!prompts?.length) continue;

      const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      // Create session
      const { data: session } = await supabase
        .from('sessions')
        .insert({ group_id: group.id, mode: 'daily' })
        .select()
        .single();

      if (!session) continue;

      // Create session card with response slots for each member
      const initialResponses: Record<string, null> = {};
      for (const member of members) {
        initialResponses[member.user_id] = null;
      }

      await supabase.from('session_cards').insert({
        session_id: session.id,
        prompt_id: selectedPrompt.id,
        responses: initialResponses,
      });

      // Send push notification to all members
      await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/push-send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        },
        body: JSON.stringify({
          group_id: group.id,
          title: "Ember — Today's prompt is ready",
          body: group.name
            ? `A new question is waiting for ${group.name}`
            : 'A new question is waiting for your group',
          data: { kind: 'daily_prompt_ready', session_id: session.id },
        }),
      });

      processed++;
    } catch (err) {
      console.error(`Error processing group ${group.id}:`, err);
    }
  }

  return new Response(JSON.stringify({ processed }), { headers: corsHeaders });
});
