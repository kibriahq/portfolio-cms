"use server";

import { prisma } from "@/lib/prisma";

export async function getTotalViews() {
  return await prisma.view.count();
}

export interface HourlyViewPoint {
  hour: string;
  views: number;
}

export async function getViewsLast6Hours(): Promise<HourlyViewPoint[]> {
  const now = new Date();
  const currentHourStart = new Date(now);
  currentHourStart.setMinutes(0, 0, 0);

  const sixHoursAgo = new Date(currentHourStart.getTime() - 5 * 60 * 60 * 1000);

  const views = await prisma.view.findMany({
    where: {
      viewedAt: {
        gte: sixHoursAgo,
      },
    },
    select: {
      viewedAt: true,
    },
  });

  const buckets = new Map<number, number>();
  for (let i = 0; i < 6; i++) buckets.set(i, 0);

  for (const { viewedAt } of views) {
    const hourStart = new Date(viewedAt);
    hourStart.setMinutes(0, 0, 0);
    const bucket = Math.round(
      (hourStart.getTime() - sixHoursAgo.getTime()) / (60 * 60 * 1000)
    );
    if (bucket >= 0 && bucket < 6) {
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
    }
  }

  return Array.from({ length: 6 }, (_, i) => {
    const bucketTime = new Date(sixHoursAgo.getTime() + i * 60 * 60 * 1000);
    const label = bucketTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
    return {
      hour: label,
      views: buckets.get(i) ?? 0,
    };
  });
}

export interface TrafficOverview {
  totalVisitors: number;
  homePageViews: number;
  pageViews: number;
  blogViews: number;
  projectViews: number;
  caseStudyViews: number;
}

export async function getTrafficOverviewLast6Hours(): Promise<TrafficOverview> {
  const now = new Date();
  const currentHourStart = new Date(now);
  currentHourStart.setMinutes(0, 0, 0);

  const sixHoursAgo = new Date(currentHourStart.getTime() - 5 * 60 * 60 * 1000);

  const result = await prisma.$queryRaw<{
    totalVisitors: bigint;
    homePageViews: bigint;
    pageViews: bigint;
    blogViews: bigint;
    projectViews: bigint;
    caseStudyViews: bigint;
  }[]>`
    SELECT
      COUNT(*) AS "totalVisitors",
      COUNT(*) FILTER (WHERE "pageType" = 'HOME') AS "homePageViews",
      COUNT(*) FILTER (WHERE "pageType" IS NOT NULL AND "pageType" <> 'HOME') AS "pageViews",
      COUNT(*) FILTER (WHERE "blogId" IS NOT NULL) AS "blogViews",
      COUNT(*) FILTER (WHERE "projectId" IS NOT NULL) AS "projectViews",
      COUNT(*) FILTER (WHERE "caseStudyId" IS NOT NULL) AS "caseStudyViews"
    FROM "View"
    WHERE "viewedAt" >= ${sixHoursAgo}
  `;

  const row = result[0];

  return {
    totalVisitors: Number(row.totalVisitors),
    homePageViews: Number(row.homePageViews),
    pageViews: Number(row.pageViews),
    blogViews: Number(row.blogViews),
    projectViews: Number(row.projectViews),
    caseStudyViews: Number(row.caseStudyViews),
  };
}