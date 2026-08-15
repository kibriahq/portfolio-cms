import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { TrafficOverview } from "@/actions/views";

interface TrafficOverviewCardProps {
  data: TrafficOverview;
}

export function TrafficOverview({ data }: TrafficOverviewCardProps) {
  const rows: { label: string; value: number }[] = [
    { label: "Total Visitors", value: data.totalVisitors },
    { label: "Home Page Views", value: data.homePageViews },
    { label: "Other Page Views", value: data.pageViews },
    { label: "Blogs Views", value: data.blogViews },
    { label: "Projects Views", value: data.projectViews },
    { label: "Case Studies Views", value: data.caseStudyViews },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Last 6 hours
        </p>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {row.label}
              </span>
              <span className="text-lg font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
                {row.value.toLocaleString("en-US")}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
