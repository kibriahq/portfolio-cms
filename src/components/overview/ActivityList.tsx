import {
  FilePlus2,
  Pencil,
  Trash2,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/utils";
import type { Activity } from "@/types/post";

const typeConfig: Record<
  Activity["type"],
  { icon: LucideIcon; className: string }
> = {
  published: {
    icon: Upload,
    className:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  updated: {
    icon: Pencil,
    className:
      "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  },
  deleted: {
    icon: Trash2,
    className: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  },
  created: {
    icon: FilePlus2,
    className:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  },
};

export function ActivityList({ items }: { items: Activity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {items.map((item) => {
            const { icon: Icon, className } = typeConfig[item.type];
            return (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
              >
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${className}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-800 dark:text-zinc-200">
                    {item.message}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {formatDateTime(item.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
