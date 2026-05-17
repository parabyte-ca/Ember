import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting: simple in-memory store (use KV in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RPM = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_RPM) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  if (!checkRateLimit(user.id)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded' }),
      { status: 429, headers: corsHeaders },
    );
  }

  const { prompt_body, member_names, pronouns } = await req.json();

  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) {
    return new Response(
      JSON.stringify({ error: 'AI not configured' }),
      { status: 503, headers: corsHeaders },
    );
  }

  const systemPrompt = `You are a compassionate, inclusive relationship coach. Rephrase the given prompt to be warm and personal using the provided names and pronouns. Never add explicit content. Keep it tasteful and encouraging. Return only the rephrased prompt text, nothing else.`;

  const userMessage = `Rephrase this relationship prompt using these names: ${(member_names as string[]).join(', ')} with these pronouns: ${JSON.stringify(pronouns)}.

Prompt: ${prompt_body}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  const data = await response.json();
  const personalizedBody: string = data.content?.[0]?.text ?? prompt_body;

  return new Response(
    JSON.stringify({ personalized_body: personalizedBody }),
    { headers: corsHeaders },
  );
});
