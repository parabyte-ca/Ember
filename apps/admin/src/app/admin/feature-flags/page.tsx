import { createClient } from '@/lib/supabase/server';
import FeatureFlagsClient from './FeatureFlagsClient';
import type { FeatureFlag } from '@ember/db';

export default async function FeatureFlagsPage() {
  const supabase = await createClient();
  const { data: flags } = await supabase.from('feature_flags').select('*').order('key');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Feature Flags</h1>
      <FeatureFlagsClient initialFlags={(flags ?? []) as FeatureFlag[]} />
    </div>
  );
}
