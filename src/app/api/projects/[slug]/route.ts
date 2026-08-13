import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackView } from "@/lib/view";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  await trackView(request, { projectId: project.id });

  const relatedProjects = await getRelatedProjects(project.id, project.technologies);

  return NextResponse.json({ ...project, relatedProjects });
}

async function getRelatedProjects(projectId: string, technologies: string[]) {
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
      technologies: true,
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
      score: candidate.technologies.filter((tech) =>
        technologies.includes(tech)
      ).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
