import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhookSecret) {
    return new Response(JSON.stringify({ error: 'Missing signature' }), { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const body = await req.text();

  // TODO: Verify Stripe webhook signature using Stripe SDK
  // const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  const event = JSON.parse(body);

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const metadata = sub.metadata ?? {};
      await supabase.from('subscriptions').upsert(
        {
          provider: 'stripe',
          provider_customer_id: sub.customer,
          user_id: metadata.user_id,
          group_id: metadata.group_id ?? null,
          status: sub.status,
          tier: metadata.tier ?? 'plus',
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
          raw: sub,
        },
        { onConflict: 'provider_customer_id' },
      );
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('provider_customer_id', sub.customer);
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), { headers: corsHeaders });
});
