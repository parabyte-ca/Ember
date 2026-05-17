import { createClient } from '@/lib/supabase/server';
import PromptsTable from './PromptsTable';
import type { Prompt } from '@ember/db';

export default async function PromptsPage() {
  const supabase = await createClient();
  const { data: prompts } = await supabase.from('prompts').select('*, categories(name)').order('created_at', { ascending: false }).limit(100);
  const { data: categories } = await supabase.from('categories').select('id, name').eq('active', true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Prompts</h1>
          <p className="text-gray-500 text-sm mt-1">{prompts?.length ?? 0} prompts total</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:border-primary transition-colors">
            Import CSV
            <input type="file" accept=".csv" className="hidden" />
          </label>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            + New prompt
          </button>
        </div>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <strong>Content reminder:</strong> All placeholder prompts are labeled "REPLACE BEFORE LAUNCH". Populate via this panel before going live.
      </div>
      <PromptsTable initialPrompts={(prompts ?? []) as Prompt[]} categories={categories ?? []} />
    </div>
  );
}
