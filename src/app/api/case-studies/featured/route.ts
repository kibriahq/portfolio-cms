import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const caseStudies = await prisma.caseStudy.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(caseStudies);
}
