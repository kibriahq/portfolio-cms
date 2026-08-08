import type { UserRole } from "@/generated/prisma/enums";

export type { UserRole };

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  createdAt: string;
}

export interface AdminInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
  REJECTED: "Rejected",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  SUPER_ADMIN: "Full access, including managing admins and their roles.",
  ADMIN: "Can manage posts, categories and everything content related.",
  EDITOR: "Can write and edit content, but cannot manage the workspace.",
  REJECTED: "Access revoked. Keeps the account without any permissions.",
};

/** Roles that can be picked when creating a new admin. */
export const CREATABLE_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

/** Roles that a super admin can assign to an existing user. */
export const ASSIGNABLE_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "REJECTED",
];

export function isUserRole(value: string): value is UserRole {
  return value in ROLE_LABELS;
}
