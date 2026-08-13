import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const caseStudies = await prisma.caseStudy.findMany({
    where: { status: "PUBLISHED", displayOrder: { not: 0 } },
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json(caseStudies);
}
