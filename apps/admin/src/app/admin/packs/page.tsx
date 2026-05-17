import { createClient } from '@/lib/supabase/server';

export default async function PacksPage() {
  const supabase = await createClient();
  const { data: packs } = await supabase.from('prompt_packs').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prompt Packs</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">+ New pack</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(packs ?? []).map((pack) => (
          <div key={pack.id} className="rounded-xl border border-gray-200 p-4 space-y-2 hover:border-primary transition-colors">
            <div className="flex justify-between items-start">
              <h2 className="font-semibold">{pack.name}</h2>
              <div className="flex gap-2">
                {pack.is_premium && <span className="text-xs bg-accent/20 text-yellow-700 px-2 py-0.5 rounded-full">Premium</span>}
                {!pack.active && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
              </div>
            </div>
            <p className="text-sm text-gray-500">{pack.description}</p>
            <div className="text-xs text-gray-400">
              SKU: {pack.sku ?? 'none'} · Sort: {pack.sort_order}
            </div>
            {pack.relationship_structures?.length ? (
              <div className="flex flex-wrap gap-1">
                {pack.relationship_structures.map((s) => (
                  <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            ) : null}
            <button className="text-sm text-primary hover:underline">Edit pack →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
