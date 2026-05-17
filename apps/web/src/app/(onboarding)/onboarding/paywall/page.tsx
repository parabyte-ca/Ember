'use client';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@ember/lib';

const PLANS = [
  {
    id: 'plus_monthly', name: 'Plus', price: '$9.99', period: '/month',
    yearlyPrice: '$59.99/yr', trial: '7-day free trial',
    features: ['Unlimited prompts', 'All content tiers', 'AI personalisation', 'Groups up to 4', 'Journaling & streaks'],
    highlighted: true,
  },
  {
    id: 'household', name: 'Household', price: '$79.99', period: '/year',
    yearlyPrice: null, trial: null,
    features: ['Everything in Plus', 'Groups up to 6', 'Lifestyle & Group Dynamics packs'],
    highlighted: false,
  },
];

export default function PaywallPage() {
  const router = useRouter();

  const handleSelect = async (_planId: string) => {
    // TODO: Integrate with Stripe Checkout or RevenueCat
    // For now, redirect to invite screen
    router.push('/onboarding/invite');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-surface">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold">Unlock the full {APP_NAME} experience</h1>
          <p className="text-muted-foreground text-sm mt-1">One subscription covers everyone in your group.</p>
        </div>
        <div className="space-y-3">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`rounded-xl border-2 p-4 ${plan.highlighted ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold">{plan.name}</div>
                  {plan.trial && <div className="text-xs text-primary font-medium">{plan.trial}</div>}
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-1 mb-3">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs flex gap-2"><span className="text-primary">✓</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => handleSelect(plan.id)}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${plan.highlighted ? 'bg-primary text-white hover:opacity-90' : 'border border-border hover:border-primary'}`}>
                {plan.trial ? `Start ${plan.trial}` : 'Get Household'}
              </button>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4">
            <div className="font-bold">Free</div>
            <div className="text-xs text-muted-foreground mt-1">1 daily question, mild content, groups of 2</div>
            <button onClick={() => router.push('/onboarding/invite')}
              className="mt-3 w-full rounded-lg border border-border px-4 py-2.5 text-sm hover:border-primary">
              Continue for free
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Cancel anytime. One subscription unlocks access for all group members.
        </p>
      </div>
    </div>
  );
}
