import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
  });

  if (!caseStudy || caseStudy.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Case study not found" }, { status: 404 });
  }

  const relatedCaseStudies = await getRelatedCaseStudies(caseStudy.id, caseStudy.tags);

  return NextResponse.json({ ...caseStudy, related: relatedCaseStudies });
}

async function getRelatedCaseStudies(
  caseStudyId: string,
  tags: string[],
) {
  const candidates = await prisma.caseStudy.findMany({
    where: {
      id: { not: caseStudyId },
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      subTitle: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      coverImagePublicId: true,
      tags: true,
      featured: true,
      displayOrder: true,
      status: true,
      metaTitle: true,
      metaDescription: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return candidates
    .map((candidate) => ({
      ...candidate,
      score: candidate.tags.filter((tag) =>
        tags.includes(tag)
      ).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
