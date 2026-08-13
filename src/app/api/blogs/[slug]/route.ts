import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackView } from "@/lib/view";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  await trackView(request, { blogId: blog.id });

  const relatedBlogs = blog.categoryId
    ? await getRelatedBlogs(blog.id, blog.categoryId, blog.tags)
    : [];

  return NextResponse.json({ ...blog, related: relatedBlogs });
}

async function getRelatedBlogs(
  blogId: string,
  categoryId: string,
  tags: string[]
) {
  const candidates = await prisma.blog.findMany({
    where: {
      categoryId,
      id: { not: blogId },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      coverImagePublicId: true,
      metaTitle: true,
      metaDescription: true,
      status: true,
      readingTime: true,
      tags: true,
      featured: true,
      displayOrder: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
      category: true,
    },
  });

  return candidates
    .map((candidate) => ({
      ...candidate,
      score: candidate.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
