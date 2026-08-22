import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hideFeatured = searchParams.get("hideFeatured") === "true";
  const tagsParam = searchParams.get("tags");
  const tags = tagsParam && tagsParam !== "all"
    ? tagsParam.split(",").map((tag) => tag.trim()).filter(Boolean)
    : [];

  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      ...(hideFeatured ? { featured: false } : {}),
      ...(tags.length ? { tags: { hasSome: tags } } : {}),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      tags: true,
      featured: true,
      status: true,
      displayOrder: true,
      readingTime: true,
      createdAt: true,
      updatedAt: true,
      category: true,
    },
  });

  blogs.sort((a, b) => {
    const aOrdered = a.displayOrder > 0;
    const bOrdered = b.displayOrder > 0;
    if (aOrdered && bOrdered) return a.displayOrder - b.displayOrder;
    if (aOrdered) return -1;
    if (bOrdered) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return NextResponse.json(blogs);
}
