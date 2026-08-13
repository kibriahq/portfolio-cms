import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackView } from "@/lib/view";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Blog not found" }, { status: 404 });
  }

  await trackView(request, { blogId: blog.id });

  return NextResponse.json(blog);
}
