"use server";

import { prisma } from "@/lib/prisma";

export async function getCategories() {
  // fetch all categories with post count
  return prisma.category.findMany({
    include: { _count: { select: { blogs: true } } },
  });
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  return prisma.category.create({ data });
}

export async function updateCategory(id: string, data: { name: string; slug: string; description?: string }) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}