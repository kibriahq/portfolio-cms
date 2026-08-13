import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackView } from "@/lib/view";

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
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  await trackView(request, { pageType: "BLOGS" });

  return NextResponse.json(blogs);
}
