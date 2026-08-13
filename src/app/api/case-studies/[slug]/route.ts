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

  return NextResponse.json(caseStudy);
}
