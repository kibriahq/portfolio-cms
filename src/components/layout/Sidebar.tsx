import { Brand, SidebarNav } from "@/components/layout/SidebarNav";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex">
      <div className="flex h-16 items-center border-b border-zinc-200 dark:border-zinc-800">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <p className="px-3 text-xs text-zinc-400 dark:text-zinc-500">
          v0.1.0 · Demo data
        </p>
      </div>
    </aside>
  );
}
