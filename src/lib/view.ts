import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type ViewInput = {
  pageType?: "HOME" | "ABOUT" | "SKILLS" | "SERVICES" | "CONTACT" | "TESTIMONIALS" | "BLOGS" | "PROJECTS" | "CASE_STUDIES" | "PRIVACY_POLICY" | "TERMS_OF_SERVICE";
  blogId?: string;
};

export function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip ?? null;
}

export function getClientLocation(request: NextRequest): string | null {
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");

  if (country || city || region) {
    return [city, region, country].filter(Boolean).join(", ");
  }

  return null;
}

export function getReferer(request: NextRequest): string | null {
  return request.headers.get("referer");
}

export async function trackView(request: NextRequest, input: ViewInput) {
  await prisma.view.create({
    data: {
      pageType: input.pageType,
      blogId: input.blogId,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent"),
      location: getClientLocation(request),
      referer: getReferer(request),
    },
  });
}
