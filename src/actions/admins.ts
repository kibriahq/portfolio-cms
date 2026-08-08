"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/actions/users";
import type { AdminInput, AdminUser, UserRole } from "@/types/user";
import { ASSIGNABLE_ROLES, CREATABLE_ROLES, ROLE_LABELS } from "@/types/user";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SuperAdminGuard =
  | { ok: true; userId: string }
  | { ok: false; result: ActionResult };

async function requireSuperAdmin(): Promise<SuperAdminGuard> {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, result: { success: false, message: "You must be signed in." } };
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return {
      ok: false,
      result: { success: false, message: "Only a super admin can manage admins." },
    };
  }

  return { ok: true, userId: session.user.id };
}

export async function getAdmins(): Promise<AdminUser[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  return users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function createAdmin(data: AdminInput): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) {
    return guard.result;
  }

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim().toLowerCase() ?? "";
  const password = data.password ?? "";
  const role = data.role;

  if (!name) {
    return { success: false, message: "Name is required." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." };
  }

  if (!CREATABLE_ROLES.includes(role)) {
    return { success: false, message: "Please select a valid role." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, message: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash, role },
  });

  revalidatePath("/admins");

  return {
    success: true,
    message: `${name} was added as ${ROLE_LABELS[role]}.`,
  };
}

export async function updateAdminRole(
  userId: string,
  role: UserRole,
): Promise<ActionResult> {
  const guard = await requireSuperAdmin();
  if (!guard.ok) {
    return guard.result;
  }

  if (!userId) {
    return { success: false, message: "Admin not found." };
  }

  if (userId === guard.userId) {
    return { success: false, message: "You cannot change your own role." };
  }

  if (!ASSIGNABLE_ROLES.includes(role)) {
    return { success: false, message: "Please select a valid role." };
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!target) {
    return { success: false, message: "Admin not found." };
  }

  if (target.role === role) {
    return {
      success: false,
      message: `That admin is already ${ROLE_LABELS[role]}.`,
    };
  }

  if (target.role === "SUPER_ADMIN" && role !== "SUPER_ADMIN") {
    const superAdmins = await prisma.user.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (superAdmins <= 1) {
      return {
        success: false,
        message: "There must be at least one super admin.",
      };
    }
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });

  revalidatePath("/admins");

  return {
    success: true,
    message: `${target.name ?? target.email ?? "Admin"} is now ${ROLE_LABELS[role]}.`,
  };
}
