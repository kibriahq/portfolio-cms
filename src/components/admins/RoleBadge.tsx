import { Badge } from "@/components/ui/Badge";
import { ROLE_LABELS, type UserRole } from "@/types/user";

const ROLE_VARIANTS: Record<
  UserRole,
  "default" | "success" | "warning" | "danger" | "info" | "neutral"
> = {
  SUPER_ADMIN: "info",
  ADMIN: "success",
  EDITOR: "warning",
  DISABLED: "danger",
};

const ROLE_DOTS: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-blue-500",
  ADMIN: "bg-emerald-500",
  EDITOR: "bg-amber-500",
  DISABLED: "bg-red-500",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge variant={ROLE_VARIANTS[role]}>
      <span className={`h-1.5 w-1.5 rounded-full ${ROLE_DOTS[role]}`} />
      {ROLE_LABELS[role]}
    </Badge>
  );
}
