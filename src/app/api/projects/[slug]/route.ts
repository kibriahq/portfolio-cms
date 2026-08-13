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

  return NextResponse.json(project);
}
