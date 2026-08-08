"use server";

import { prisma } from "@/lib/prisma";

export async function getTotalViews() {
  return await prisma.view.count();
}