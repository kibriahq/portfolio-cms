"use server";

import { prisma } from "@/lib/prisma";
import { PostInput } from "@/types/post";
import { deleteImage, uploadImage } from "./upload";
import { sanitizeHtmlContent } from "@/lib/sanitize-html";
import { extractPublicIds } from "@/lib/image-utils";

export async function getTotalPublishedPostsCount() {
  return prisma.blog.count({
    where: {
      status: "PUBLISHED",
    },
  });
}

export async function getPosts() {
  return prisma.blog.findMany({
    include: {
      category: {
        select: {
          name: true,
          id: true,
        },
      },
      _count: {
        select: {
          views: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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
  post.content = sanitizeHtmlContent(data.content ?? "");
  // Upload the cover image if provided
  if (data.coverImage) {
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
        "blogs",
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
  post.displayOrder = data.displayOrder ? Number(data.displayOrder) : 0;
  post.featured = Boolean(data.featured);

  return prisma.blog.create({ data: post });
}

export async function updatePost(id: string, data: PostInput) {
  // check is slug already exists, dont check for the current post
  const existingPost = await prisma.blog.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id: id,
      },
    },
  });

  if (existingPost) {
    throw new Error("A post with this slug already exists.");
  }

  const post: PostInput & { coverImagePublicId?: string } = { ...data };
  post.content = sanitizeHtmlContent(data.content ?? "");
  const oldPost = await prisma.blog.findUnique({ where: { id } });

   if (!oldPost) {
    throw new Error("Post not found.");
  }

  // Upload the cover image if provided
  if (data.coverImage) {
    
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
        "blogs",
      );
      post.coverImage = uploadedImage.secure_url; // Use the secure URL from Cloudinary
      post.coverImagePublicId = uploadedImage.public_id; // Store the public ID for future reference

      // delete image from cloudinary if exists

      if (oldPost?.coverImagePublicId) {
        await deleteImage(oldPost.coverImagePublicId);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image. Please try again.",
      );
    }
  } else {
    post.coverImage = oldPost?.coverImage ?? undefined; 
    post.coverImagePublicId = oldPost?.coverImagePublicId ?? undefined;
  }
  post.readingTime = Number(data.readingTime);
  post.displayOrder = data.displayOrder ? Number(data.displayOrder) : 0;
  post.featured = Boolean(data.featured);

  return prisma.blog.update({ where: { id }, data: post });
}

export async function deletePost(id: string) {
  // delete image from cloudinary if exists
  const post = await prisma.blog.findUnique({ where: { id } });

  if (post?.coverImagePublicId) {
    try {
      await deleteImage(post.coverImagePublicId);
    } catch (error) {
      throw Error(
        error instanceof Error
          ? error.message
          : "while deleting the image from Cloudinary",
      );
    }
  }

  if (post?.content) {
    for (const publicId of extractPublicIds(post.content)) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error(
          `Failed to delete in-content image ${publicId} for post ${id}`,
          error,
        );
      }
    }
  }

  return prisma.blog.delete({ where: { id } });
}
