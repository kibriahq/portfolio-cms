import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const relatedProjects = await getRelatedProjects(project.id, project.tags);

  return NextResponse.json({ ...project, related: relatedProjects });
}

async function getRelatedProjects(projectId: string, tags: string[]) {
  const candidates = await prisma.project.findMany({
    where: {
      id: { not: projectId },
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
      liveUrl: true,
      githubUrl: true,
      featured: true,
      displayOrder: true,
      status: true,
      metaTitle: true,
      metaDescription: true,
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
