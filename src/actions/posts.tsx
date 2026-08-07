"use server";

import { prisma } from "@/lib/prisma";
import { PostInput } from "@/types/post";

export async function getPosts() {
  return prisma.blog.findMany();
}

export async function getPostById(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

export async function createPost(data: PostInput) {
  return prisma.blog.create({ data });
}

export async function updatePost(id: string, data: PostInput) {
  return prisma.blog.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return prisma.blog.delete({ where: { id } });
}