import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  trend?: "up" | "down" | "neutral";
  accent?: "default" | "success" | "warning" | "info";
}

const accentMap = {
  default: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning:
    "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  info: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "default",
}: StatCardProps) {
  return (
    <Card className="p-5 transition-shadow hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg",
            accentMap[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {hint ? (
        <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>
      ) : null}
    </Card>
  );
}
