import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Brand } from "@/components/layout/SidebarNav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div className="lg:hidden">
          <Brand />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2 py-1 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-xs font-semibold text-white shadow-sm">
            AK
          </span>
          <span className="hidden pr-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:inline">
            Ava Kim
          </span>
        </div>
      </div>
    </header>
  );
}
