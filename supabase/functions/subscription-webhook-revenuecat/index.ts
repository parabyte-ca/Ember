import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${Deno.env.get('REVENUECAT_WEBHOOK_AUTH')}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const event = await req.json();
  const { event: rcEvent } = event;

  if (!rcEvent) {
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: corsHeaders });
  }

  const appUserId: string = rcEvent.app_user_id;
  const productId: string = rcEvent.product_id ?? '';
  const tier = productId.includes('household') ? 'household' : 'plus';

  switch (rcEvent.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'PRODUCT_CHANGE':
      await supabase.from('subscriptions').upsert(
        {
          provider: 'revenuecat',
          provider_customer_id: appUserId,
          user_id: appUserId,
          status: 'active',
          tier,
          current_period_end: rcEvent.expiration_at_ms
            ? new Date(rcEvent.expiration_at_ms).toISOString()
            : null,
          raw: rcEvent,
        },
        { onConflict: 'provider_customer_id' },
      );
      break;
    case 'CANCELLATION':
    case 'EXPIRATION':
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('provider_customer_id', appUserId);
      break;
    case 'TRIAL_STARTED':
      await supabase.from('subscriptions').upsert(
        {
          provider: 'revenuecat',
          provider_customer_id: appUserId,
          user_id: appUserId,
          status: 'trialing',
          tier,
          trial_end: rcEvent.expiration_at_ms
            ? new Date(rcEvent.expiration_at_ms).toISOString()
            : null,
          raw: rcEvent,
        },
        { onConflict: 'provider_customer_id' },
      );
      break;
  }

  return new Response(JSON.stringify({ received: true }), { headers: corsHeaders });
});
