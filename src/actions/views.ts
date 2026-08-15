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