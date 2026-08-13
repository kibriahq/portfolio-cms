import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return NextResponse.json(blogs);
}
