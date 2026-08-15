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
  const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);

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
    const diffHours = Math.floor((now.getTime() - viewedAt.getTime()) / (60 * 60 * 1000));
    const bucket = 5 - diffHours;
    if (bucket >= 0 && bucket < 6) {
      buckets.set(bucket, (buckets.get(bucket) ?? 0) + 1);
    }
  }

  return Array.from({ length: 6 }, (_, i) => {
    const bucketTime = new Date(now.getTime() - (5 - i) * 60 * 60 * 1000);
    const label = bucketTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return {
      hour: label,
      views: buckets.get(i) ?? 0,
    };
  });
}