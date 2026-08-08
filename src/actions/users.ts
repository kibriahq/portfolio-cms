"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type ProfileUpdate = {
  name?: string;
  email?: string;
};

export type ActionResult = {
  success: boolean;
  message: string;
};

export async function updateProfile(data: ProfileUpdate): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." };
  }

  const name = data.name?.trim();
  const email = data.email?.trim().toLowerCase();

  if (email) {
    const existing = await prisma.user.findFirst({
      where: { email, NOT: { id: session.user.id } },
    });
    if (existing) {
      return { success: false, message: "That email is already in use." };
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email } : {}),
    },
  });

  return { success: true, message: "Profile updated successfully." };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." };
  }

  if (!currentPassword || !newPassword) {
    return {
      success: false,
      message: "Both the current and new password are required.",
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: "New password must be at least 8 characters.",
    };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.passwordHash) {
    return { success: false, message: "User account not found." };
  }

  const isCurrentValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isCurrentValid) {
    return { success: false, message: "Current password is incorrect." };
  }

  if (currentPassword === newPassword) {
    return {
      success: false,
      message: "New password must be different from the current password.",
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return { success: true, message: "Password changed successfully." };
}
