import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED", displayOrder: { not: 0 } },
    orderBy: { displayOrder: "asc" },
    include: { category: true },
  });

  return NextResponse.json(blogs);
}
