import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DailyPromptCard from '@/components/DailyPromptCard';
import StreakDisplay from '@/components/StreakDisplay';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile?.onboarding_complete) redirect('/onboarding/age-gate');

  const { data: membership } = await supabase
    .from('group_members')
    .select('group_id, role')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-lg mx-auto space-y-6">
        <header className="flex justify-between items-center pt-4">
          <h1 className="font-display text-2xl font-bold text-primary">Ember</h1>
          <div className="flex gap-2">
            {/* Safety button — always accessible */}
            <a href="/safety" className="rounded-full bg-muted px-3 py-1 text-xs font-medium hover:bg-muted/80">Safety</a>
          </div>
        </header>

        {membership ? (
          <DailyPromptCard groupId={membership.group_id} userId={user.id} />
        ) : (
          <div className="rounded-xl bg-white border border-border p-6 text-center">
            <p className="text-muted-foreground">You&#39;re not in a group yet.</p>
            <a href="/onboarding/invite" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
              Create or join a group
            </a>
          </div>
        )}

        {membership && <StreakDisplay groupId={membership.group_id} />}
      </div>
    </div>
  );
}
