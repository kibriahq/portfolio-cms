import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface CategoryProgressProps {
  data: Array<{ category: string; count: number; percentage: number }>;
}

const barColors = [
  "bg-blue-500 dark:bg-blue-400",
  "bg-emerald-500 dark:bg-emerald-400",
  "bg-amber-500 dark:bg-amber-400",
  "bg-zinc-500 dark:bg-zinc-400",
  "bg-red-500 dark:bg-red-400",
];

export function CategoryProgress({ data }: CategoryProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {item.category}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {item.count} · {item.percentage}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  barColors[index % barColors.length],
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
