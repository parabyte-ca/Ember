import { createClient } from '@/lib/supabase/server';
import type { AuditLog } from '@ember/db';

export default async function AuditLogPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(200);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audit Log</h1>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Time', 'Actor', 'Action', 'Table', 'Target ID'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {((logs ?? []) as AuditLog[]).map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{log.actor_id?.slice(0, 8)}…</td>
                <td className="px-4 py-3 font-medium text-sm">{log.action}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{log.target_table}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.target_id?.slice(0, 8)}…</td>
              </tr>
            ))}
            {!logs?.length && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No audit log entries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
