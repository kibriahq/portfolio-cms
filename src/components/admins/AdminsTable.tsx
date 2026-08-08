"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, Users } from "lucide-react";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { RoleBadge } from "@/components/admins/RoleBadge";
import { updateAdminRole } from "@/actions/admins";
import { formatDate } from "@/lib/utils";
import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  type AdminUser,
  type UserRole,
} from "@/types/user";

interface AdminsTableProps {
  admins: AdminUser[];
  currentUserId: string;
  isSuperAdmin: boolean;
}

function getInitials(admin: AdminUser): string {
  if (admin.name) {
    return admin.name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  if (admin.email) {
    return admin.email[0].toUpperCase();
  }
  return "U";
}

export function AdminsTable({
  admins,
  currentUserId,
  isSuperAdmin,
}: AdminsTableProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  // Bumped to remount the selects so they fall back to the stored role
  // whenever a change is cancelled or rejected.
  const [selectVersion, setSelectVersion] = useState(0);

  async function handleRoleChange(admin: AdminUser, role: UserRole) {
    if (role === admin.role) {
      return;
    }

    const label = admin.name ?? admin.email ?? "this admin";
    if (!confirm(`Change the role of ${label} to ${ROLE_LABELS[role]}?`)) {
      setSelectVersion((version) => version + 1);
      return;
    }

    setPendingId(admin.id);
    try {
      const result = await updateAdminRole(admin.id, role);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
        setSelectVersion((version) => version + 1);
      }
    } catch {
      toast.error("Failed to update the role. Please try again.");
      setSelectVersion((version) => version + 1);
    } finally {
      setPendingId(null);
    }
  }

  if (admins.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-5 w-5" />}
        title="No admins found"
        description="Try adjusting your search or filters to find what you are looking for."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="px-5 py-3 font-medium sm:px-6">Admin</th>
              <th className="hidden px-5 py-3 font-medium sm:px-6 md:table-cell">
                Email
              </th>
              <th className="px-5 py-3 font-medium sm:px-6">Role</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">
                Joined
              </th>
              <th className="px-5 py-3 text-right font-medium sm:px-6">
                {isSuperAdmin ? "Change Role" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {admins.map((admin) => {
              const isSelf = admin.id === currentUserId;
              const isPending = pendingId === admin.id;

              return (
                <tr
                  key={admin.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-xs font-semibold text-white shadow-sm">
                        {getInitials(admin)}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                          {admin.name ?? "Unnamed admin"}
                          {isSelf ? (
                            <span className="ml-2 text-xs font-normal text-zinc-400 dark:text-zinc-500">
                              (you)
                            </span>
                          ) : null}
                        </span>
                        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400 md:hidden">
                          {admin.email ?? "—"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-3 text-zinc-500 dark:text-zinc-400 sm:px-6 md:table-cell">
                    <span className="truncate">{admin.email ?? "—"}</span>
                  </td>
                  <td className="px-5 py-3 sm:px-6">
                    <RoleBadge role={admin.role} />
                  </td>
                  <td className="hidden px-5 py-3 text-zinc-500 dark:text-zinc-400 lg:table-cell">
                    {formatDate(admin.createdAt)}
                  </td>
                  <td className="px-5 py-3 sm:px-6">
                    <div className="flex items-center justify-end gap-2">
                      {isSuperAdmin ? (
                        <>
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                          ) : null}
                          <select
                            key={`${admin.id}-${admin.role}-${selectVersion}`}
                            value={admin.role}
                            disabled={isSelf || isPending}
                            aria-label={`Change role for ${admin.name ?? admin.email ?? "admin"}`}
                            title={
                              isSelf
                                ? "You cannot change your own role"
                                : "Change role"
                            }
                            onChange={(event) =>
                              handleRoleChange(
                                admin,
                                event.target.value as UserRole,
                              )
                            }
                            className="h-9 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-900 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                          >
                            {ASSIGNABLE_ROLES.map((role) => (
                              <option key={role} value={role}>
                                {ROLE_LABELS[role]}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Super admin only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
