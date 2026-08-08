"use client";

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/posts/SearchBar";
import { AdminsTable } from "@/components/admins/AdminsTable";
import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  type AdminUser,
  type UserRole,
} from "@/types/user";

interface AdminsClientProps {
  admins: AdminUser[];
  currentUserId: string;
  isSuperAdmin: boolean;
}

type RoleFilter = UserRole | "ALL";

export function AdminsClient({
  admins,
  currentUserId,
  isSuperAdmin,
}: AdminsClientProps) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return admins.filter((admin) => {
      const matchesRole = roleFilter === "ALL" || admin.role === roleFilter;
      if (!matchesRole) return false;
      if (!q) return true;
      return (
        (admin.name?.toLowerCase().includes(q) ?? false) ||
        (admin.email?.toLowerCase().includes(q) ?? false) ||
        ROLE_LABELS[admin.role].toLowerCase().includes(q)
      );
    });
  }, [admins, query, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search by name, email, role..."
          className="sm:max-w-sm"
        />
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
          aria-label="Filter by role"
          className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 sm:w-44"
        >
          <option value="ALL">All roles</option>
          {ASSIGNABLE_ROLES.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 sm:ml-auto">
          {filtered.length} of {admins.length} admins
        </p>
      </div>

      <AdminsTable
        admins={filtered}
        currentUserId={currentUserId}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}
