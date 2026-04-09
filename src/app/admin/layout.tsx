export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface-container-lowest border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="font-headline font-black tracking-widest text-[#CCFF00] uppercase text-xl">Elite Admin</h1>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <a href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high text-white font-bold text-sm tracking-widest uppercase">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a href="/admin/workouts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">
            <span className="material-symbols-outlined">fitness_center</span>
            Workouts
          </a>
          <a href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">
            <span className="material-symbols-outlined">group</span>
            Users
          </a>
          <a href="/admin/marketing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">
            <span className="material-symbols-outlined">campaign</span>
            Marketing
          </a>
        </nav>
        <div className="p-4 border-t border-white/5">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">
            <span className="material-symbols-outlined">logout</span>
            Exit Panel
          </a>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 relative pb-20 md:pb-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-surface-container-lowest border-b border-white/5">
          <h1 className="font-headline font-black tracking-widest text-[#CCFF00] uppercase text-lg">Elite Admin</h1>
          <button className="material-symbols-outlined text-white">menu</button>
        </header>
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
