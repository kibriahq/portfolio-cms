import { trackView } from "@/lib/view";
import type { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const pageType = slug?.toUpperCase();

  if(!slug || !["HOME", "ABOUT", "SKILLS", "SERVICES", "CONTACT", "TESTIMONIALS", "BLOGS", "PROJECTS", "CASE_STUDIES", "PRIVACY_POLICY", "TERMS_OF_SERVICE"].includes(pageType)) {
    return new Response("Not Found", { status: 404 });
  }

  await trackView(request, { pageType: pageType as "HOME" | "ABOUT" | "SKILLS" | "SERVICES" | "CONTACT" | "TESTIMONIALS" | "BLOGS" | "PROJECTS" | "CASE_STUDIES" | "PRIVACY_POLICY" | "TERMS_OF_SERVICE" });

  return new Response("View tracked successfully", { status: 200 });
}
