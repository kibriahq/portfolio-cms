import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/utils";
import type { PostStatus } from "@/types/post";

export function StatusBadge({ status }: { status: PostStatus }) {
  return (
    <Badge variant={status === "PUBLISHED" ? "success" : "warning"}>
      <span
        className={
          status === "PUBLISHED"
            ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
            : "h-1.5 w-1.5 rounded-full bg-amber-500"
        }
      />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
