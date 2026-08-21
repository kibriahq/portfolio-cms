"use server";

import { prisma } from "@/lib/prisma";
import { ProjectInput } from "@/types/project";
import { deleteImage, uploadImage } from "./upload";
import { sanitizeHtmlContent } from "@/lib/sanitize-html";
import { extractPublicIds } from "@/lib/image-utils";

export async function getTotalPublishedProjectsCount() {
  return prisma.project.count({
    where: {
      status: "PUBLISHED",
    },
  });
}

export async function getProjects() {
  return prisma.project.findMany({
    include: {
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

export async function getProjectById(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function createProject(data: ProjectInput) {
  const existingProject = await prisma.project.findUnique({
    where: { slug: data.slug },
  });

  if (existingProject) {
    throw new Error("A project with this slug already exists.");
  }

  const project: ProjectInput & { coverImagePublicId?: string } = { ...data };
  project.description = sanitizeHtmlContent(data.description ?? "");

  if (data.coverImage) {
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
        "projects",
      );
      project.coverImage = uploadedImage.secure_url;
      project.coverImagePublicId = uploadedImage.public_id;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image. Please try again.",
      );
    }
  } else {
    project.coverImage = undefined;
    project.coverImagePublicId = undefined;
  }
  project.displayOrder = data.displayOrder ? Number(data.displayOrder) : 0;
  
  return prisma.project.create({ data: project });
}

export async function updateProject(id: string, data: ProjectInput) {
  const existingProject = await prisma.project.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id: id,
      },
    },
  });

  if (existingProject) {
    throw new Error("A project with this slug already exists.");
  }

  const project: ProjectInput & { coverImagePublicId?: string } = { ...data };
  project.description = sanitizeHtmlContent(data.description ?? "");
  const oldProject = await prisma.project.findUnique({ where: { id } });

  if (!oldProject) {
    throw new Error("Project not found.");
  }

  if (data.coverImage) {
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
        "projects",
      );
      project.coverImage = uploadedImage.secure_url;
      project.coverImagePublicId = uploadedImage.public_id;

      if (oldProject?.coverImagePublicId) {
        await deleteImage(oldProject.coverImagePublicId);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image. Please try again.",
      );
    }
  } else {
    project.coverImage = oldProject?.coverImage ?? undefined;
    project.coverImagePublicId = oldProject?.coverImagePublicId ?? undefined;
  }

  return prisma.project.update({ where: { id }, data: project });
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });

  if (project?.coverImagePublicId) {
    try {
      await deleteImage(project.coverImagePublicId);
    } catch (error) {
      throw Error(
        error instanceof Error
          ? error.message
          : "while deleting the image from Cloudinary",
      );
    }
  }

  if (project?.description) {
    for (const publicId of extractPublicIds(project.description)) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error(
          `Failed to delete in-content image ${publicId} for project ${id}`,
          error,
        );
      }
    }
  }

  return prisma.project.delete({ where: { id } });
}
