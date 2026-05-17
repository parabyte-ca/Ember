'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { FeatureFlag } from '@ember/db';

export default function FeatureFlagsClient({ initialFlags }: { initialFlags: FeatureFlag[] }) {
  const [flags, setFlags] = useState(initialFlags);
  const supabase = createClient();

  const handleToggle = async (key: string, currentValue: unknown) => {
    const newValue = !currentValue;
    await supabase.from('feature_flags').update({ value: newValue }).eq('key', key);
    setFlags((prev) => prev.map((f) => f.key === key ? { ...f, value: newValue } : f));
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Key</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Value</th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">Toggle</th>
          </tr>
        </thead>
        <tbody>
          {flags.map((flag) => (
            <tr key={flag.key} className="border-b border-gray-100">
              <td className="px-4 py-3 font-mono text-xs font-medium">{flag.key}</td>
              <td className="px-4 py-3 text-gray-500">{flag.description || '—'}</td>
              <td className="px-4 py-3 font-mono text-xs">{JSON.stringify(flag.value)}</td>
              <td className="px-4 py-3">
                {typeof flag.value === 'boolean' && (
                  <button onClick={() => handleToggle(flag.key, flag.value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flag.value ? 'bg-primary' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flag.value ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
