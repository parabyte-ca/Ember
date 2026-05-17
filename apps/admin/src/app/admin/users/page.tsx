import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@ember/db';

export default async function UsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(100);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{profiles?.length ?? 0} users (showing latest 100)</p>
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Display name', 'Pronouns', 'Relationship structure', 'Onboarding', 'Verified', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {((profiles ?? []) as Profile[]).map((profile) => (
              <tr key={profile.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{profile.display_name || <span className="text-gray-400">—</span>}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{profile.pronouns || '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{profile.relationship_structure || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${profile.onboarding_complete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {profile.onboarding_complete ? 'Complete' : 'Incomplete'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {profile.age_verified_at ? '✓' : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs text-gray-400 hover:text-primary">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
