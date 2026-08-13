import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackView } from "@/lib/view";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
  });

  if (!caseStudy || caseStudy.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Case study not found" }, { status: 404 });
  }

  await trackView(request, { caseStudyId: caseStudy.id });

  const relatedCaseStudies = await getRelatedCaseStudies(
    caseStudy.id,
    caseStudy.tags,
    caseStudy.technologies
  );

  return NextResponse.json({ ...caseStudy, relatedCaseStudies });
}

async function getRelatedCaseStudies(
  caseStudyId: string,
  tags: string[],
  technologies: string[]
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
      technologies: true,
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
      score:
        candidate.tags.filter((tag) => tags.includes(tag)).length * 2 +
        candidate.technologies.filter((tech) =>
          technologies.includes(tech)
        ).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
