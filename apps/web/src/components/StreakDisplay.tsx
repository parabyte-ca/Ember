'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Streak } from '@ember/db';

export default function StreakDisplay({ groupId }: { groupId: string }) {
  const [streak, setStreak] = useState<Streak | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from('streaks')
      .select('*')
      .eq('group_id', groupId)
      .single()
      .then(({ data }) => {
        if (data) setStreak(data as Streak);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  if (!streak) return null;

  return (
    <div className="rounded-xl bg-white border border-border p-4 flex items-center gap-4">
      <div className="text-3xl">🔥</div>
      <div>
        <div className="font-bold text-lg">{streak.current_count} day streak</div>
        <div className="text-xs text-muted-foreground">Longest: {streak.longest} days</div>
      </div>
    </div>
  );
}
