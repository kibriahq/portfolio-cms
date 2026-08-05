"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, LayoutDashboard, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Posts / Blog", href: "/posts", icon: FileText },
  { label: "Overview", href: "/overview", icon: BarChart3 },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-300"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
            {isActive ? (
              <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-accent-500" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 px-3 py-1"
      aria-label="Portfolio CMS home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 text-zinc-50 shadow-sm">
        <PenLine className="h-4 w-4" />
      </span>
      <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Portfolio CMS
      </span>
    </Link>
  );
}
