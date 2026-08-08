"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Brand } from "@/components/layout/SidebarNav";
import type { AuthUser } from "@/components/layout/AppShell";

function getInitials(user?: AuthUser): string {
  if (user?.name) {
    return user.name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (user?.email) {
    return user.email[0].toUpperCase();
  }
  return "U";
}

export function Navbar({ user }: { user?: AuthUser }) {
  const displayName = user?.name ?? user?.email ?? "User";

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
            {getInitials(user)}
          </span>
          <span className="hidden pr-1 text-sm font-medium text-zinc-700 dark:text-zinc-300 sm:inline">
            {displayName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          aria-label="Sign out"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
