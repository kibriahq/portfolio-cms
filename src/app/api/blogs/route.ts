import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hideFeatured = searchParams.get("hideFeatured") === "true";

  const blogs = await prisma.blog.findMany({
    where: {
      status: "PUBLISHED",
      ...(hideFeatured ? { featured: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json(blogs);
}
