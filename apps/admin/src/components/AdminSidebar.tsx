import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/admin/prompts', label: 'Prompts', icon: '💬' },
  { href: '/admin/packs', label: 'Packs', icon: '📦' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: '💳' },
  { href: '/admin/feature-flags', label: 'Feature Flags', icon: '🚩' },
  { href: '/admin/audit-log', label: 'Audit Log', icon: '📋' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-secondary text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-bold text-xl text-primary">Ember Admin</h1>
        <p className="text-white/50 text-xs mt-1">Content Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-white/30 text-xs">Ember Admin Panel</p>
      </div>
    </aside>
  );
}
