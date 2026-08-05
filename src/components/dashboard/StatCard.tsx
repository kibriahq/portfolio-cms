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
  default:
    "bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400",
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
    <Card className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-200/60 hover:ring-1 hover:ring-accent-500/20 sm:p-6 dark:hover:shadow-black/30">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10",
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
