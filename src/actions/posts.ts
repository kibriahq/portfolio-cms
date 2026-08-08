"use server";

import { prisma } from "@/lib/prisma";
import { PostInput } from "@/types/post";
import { uploadImage } from "./upload";

export async function getPosts() {
  return prisma.blog.findMany();
}

export async function getPostById(id: string) {
  return prisma.blog.findUnique({ where: { id } });
}

export async function createPost(data: PostInput) {
  // check is slug already exists
  const existingPost = await prisma.blog.findUnique({
    where: { slug: data.slug },
  });

  if (existingPost) {
    throw new Error("A post with this slug already exists.");
  }

  const post: PostInput & { coverImagePublicId?: string } = { ...data };
  // Upload the cover image if provided
  if (data.coverImage) {
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
      );
      post.coverImage = uploadedImage.secure_url; // Use the secure URL from Cloudinary
      post.coverImagePublicId = uploadedImage.public_id; // Store the public ID for future reference
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image. Please try again.",
      );
    }
  } else {
    post.coverImage = undefined;
    post.coverImagePublicId = undefined;
  }
  post.readingTime = Number(data.readingTime);

  return prisma.blog.create({ data: post });
}

export async function updatePost(id: string, data: PostInput) {
  return prisma.blog.update({ where: { id }, data });
}

export async function deletePost(id: string) {
  return prisma.blog.delete({ where: { id } });
}
