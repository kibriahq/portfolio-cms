import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

type TrackInput = {
  pageType:
    | "HOME"
    | "ABOUT"
    | "SKILLS"
    | "SERVICES"
    | "CONTACT"
    | "TESTIMONIALS"
    | "BLOGS"
    | "PROJECTS"
    | "CASE_STUDIES"
    | "PRIVACY_POLICY"
    | "TERMS_OF_SERVICE";
  blogId?: string;
  projectId?: string;
  caseStudyId?: string;

  ip?: string | null;
  location?: string | null;
  userAgent?: string | null;
  referer?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackInput;

    await prisma.view.create({
      data: {
        pageType: body.pageType,
        blogId: body.blogId,
        projectId: body.projectId,
        caseStudyId: body.caseStudyId,

        ip: body.ip,
        location: body.location,
        userAgent: body.userAgent,
        referer: body.referer,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
