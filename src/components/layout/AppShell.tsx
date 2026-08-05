import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full">
      <Sidebar />
      <div className="flex min-h-full flex-col lg:pl-64">
        <Navbar />
        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-64 bg-[radial-gradient(60rem_20rem_at_50%_0%,rgba(99,102,241,0.12),transparent)]"
          />
          {children}
        </main>
      </div>
    </div>
  );
}
