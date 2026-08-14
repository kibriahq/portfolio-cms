import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hideFeatured = searchParams.get("hideFeatured") === "true";
  const tagParam = searchParams.get("tags");
  const tags = tagParam && tagParam !== "all"
    ? tagParam.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const caseStudies = await prisma.caseStudy.findMany({
    where: {
      status: "PUBLISHED",
      ...(hideFeatured ? { featured: false } : {}),
      ...(tags.length ? { tags: { hasSome: tags } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(caseStudies);
}
