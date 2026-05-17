import { createClient } from '@/lib/supabase/server';
import type { Subscription } from '@ember/db';

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const { data: subscriptions } = await supabase.from('subscriptions').select('*, profiles(display_name)').order('created_at', { ascending: false }).limit(100);

  const activeCount = (subscriptions ?? []).filter((s: Subscription) => ['active', 'trialing'].includes(s.status)).length;
  const plusCount = (subscriptions ?? []).filter((s: Subscription) => s.tier === 'plus' && ['active', 'trialing'].includes(s.status)).length;
  const householdCount = (subscriptions ?? []).filter((s: Subscription) => s.tier === 'household' && ['active', 'trialing'].includes(s.status)).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Subscriptions</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active subscribers', value: activeCount, color: 'text-green-600' },
          { label: 'Plus', value: plusCount, color: 'text-primary' },
          { label: 'Household', value: householdCount, color: 'text-purple-600' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 p-4">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['User', 'Provider', 'Tier', 'Status', 'Period end', 'Created'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {((subscriptions ?? []) as Array<Subscription & { profiles?: { display_name: string } }>).map((sub) => (
              <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{sub.profiles?.display_name ?? sub.user_id.slice(0, 8)}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{sub.provider}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sub.tier === 'household' ? 'bg-purple-100 text-purple-700' : sub.tier === 'plus' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sub.tier}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${['active', 'trialing'].includes(sub.status) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(sub.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
