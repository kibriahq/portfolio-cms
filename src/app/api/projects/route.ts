import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackView } from "@/lib/view";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const hideFeatured = searchParams.get("hideFeatured") === "true";
  const techParam = searchParams.get("tech");
  const tech = techParam && techParam !== "all"
    ? techParam.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const projects = await prisma.project.findMany({
    where: {
      status: "PUBLISHED",
      ...(hideFeatured ? { featured: false } : {}),
      ...(tech.length ? { technologies: { hasSome: tech } } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  await trackView(request, { pageType: "PROJECTS" });

  return NextResponse.json(projects);
}
