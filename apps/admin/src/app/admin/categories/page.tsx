import { createClient } from '@/lib/supabase/server';

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90">+ New category</button>
      </div>
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {['Sort', 'Icon', 'Slug', 'Name', 'Description', 'Targeting', 'Active', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(categories ?? []).map((cat) => (
              <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{cat.sort_order}</td>
                <td className="px-4 py-3 text-xl">{cat.icon}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{cat.slug}</td>
                <td className="px-4 py-3 font-medium">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{cat.description}</td>
                <td className="px-4 py-3">
                  {cat.relationship_structures?.length ? (
                    <span className="text-xs text-gray-500">{cat.relationship_structures.length} structures</span>
                  ) : <span className="text-xs text-gray-400">All</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${cat.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-xs text-primary hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
