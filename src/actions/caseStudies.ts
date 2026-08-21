"use server";

import { prisma } from "@/lib/prisma";
import { CaseStudyInput } from "@/types/caseStudy";
import { deleteImage, uploadImage } from "./upload";
import { sanitizeHtmlContent } from "@/lib/sanitize-html";
import { extractPublicIds } from "@/lib/image-utils";

export async function getTotalPublishedCaseStudiesCount() {
  return prisma.caseStudy.count({
    where: {
      status: "PUBLISHED",
    },
  });
}

export async function getCaseStudies() {
  return prisma.caseStudy.findMany({
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

export async function getCaseStudyById(id: string) {
  return prisma.caseStudy.findUnique({ where: { id } });
}

export async function createCaseStudy(data: CaseStudyInput) {
  const existingCaseStudy = await prisma.caseStudy.findUnique({
    where: { slug: data.slug },
  });

  if (existingCaseStudy) {
    throw new Error("A case study with this slug already exists.");
  }

  const caseStudy: CaseStudyInput & { coverImagePublicId?: string } = { ...data };
  caseStudy.content = sanitizeHtmlContent(data.content ?? "");

  if (data.coverImage) {
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
        "case-studies",
      );
      caseStudy.coverImage = uploadedImage.secure_url;
      caseStudy.coverImagePublicId = uploadedImage.public_id;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image. Please try again.",
      );
    }
  } else {
    caseStudy.coverImage = undefined;
    caseStudy.coverImagePublicId = undefined;
  }
  caseStudy.displayOrder = data.displayOrder ? Number(data.displayOrder) : 0;

  if (data.status === "PUBLISHED" && !data.publishedAt) {
    caseStudy.publishedAt = new Date();
  } else {
    caseStudy.publishedAt = data.publishedAt ?? null;
  }

  return prisma.caseStudy.create({ data: caseStudy });
}

export async function updateCaseStudy(id: string, data: CaseStudyInput) {
  const existingCaseStudy = await prisma.caseStudy.findFirst({
    where: {
      slug: data.slug,
      NOT: {
        id: id,
      },
    },
  });

  if (existingCaseStudy) {
    throw new Error("A case study with this slug already exists.");
  }

  const caseStudy: CaseStudyInput & { coverImagePublicId?: string } = { ...data };
  caseStudy.content = sanitizeHtmlContent(data.content ?? "");
  const oldCaseStudy = await prisma.caseStudy.findUnique({ where: { id } });

  if (!oldCaseStudy) {
    throw new Error("Case study not found.");
  }

  if (data.coverImage) {
    try {
      const uploadedImage = await uploadImage(
        data.coverImage[0] as unknown as File,
        "case-studies",
      );
      caseStudy.coverImage = uploadedImage.secure_url;
      caseStudy.coverImagePublicId = uploadedImage.public_id;

      if (oldCaseStudy?.coverImagePublicId) {
        await deleteImage(oldCaseStudy.coverImagePublicId);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image. Please try again.",
      );
    }
  } else {
    caseStudy.coverImage = oldCaseStudy?.coverImage ?? undefined;
    caseStudy.coverImagePublicId = oldCaseStudy?.coverImagePublicId ?? undefined;
  }

  if (data.status === "PUBLISHED" && !oldCaseStudy.publishedAt) {
    caseStudy.publishedAt = new Date();
  } else {
    caseStudy.publishedAt = data.publishedAt ?? oldCaseStudy.publishedAt ?? null;
  }

  return prisma.caseStudy.update({ where: { id }, data: caseStudy });
}

export async function deleteCaseStudy(id: string) {
  const caseStudy = await prisma.caseStudy.findUnique({ where: { id } });

  if (caseStudy?.coverImagePublicId) {
    try {
      await deleteImage(caseStudy.coverImagePublicId);
    } catch (error) {
      throw Error(
        error instanceof Error
          ? error.message
          : "while deleting the image from Cloudinary",
      );
    }
  }

  if (caseStudy?.content) {
    for (const publicId of extractPublicIds(caseStudy.content)) {
      try {
        await deleteImage(publicId);
      } catch (error) {
        console.error(
          `Failed to delete in-content image ${publicId} for case study ${id}`,
          error,
        );
      }
    }
  }

  return prisma.caseStudy.delete({ where: { id } });
}
