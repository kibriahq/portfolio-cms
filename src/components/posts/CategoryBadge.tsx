import { Badge } from "@/components/ui/Badge";

const categoryVariants: Record<string, "info" | "success" | "warning" | "neutral" | "danger"> = {
  Engineering: "info",
  Design: "success",
  Productivity: "warning",
  Product: "neutral",
};

export function CategoryBadge({ category }: { category: string }) {
  const variant = categoryVariants[category] ?? "neutral";
  return <Badge variant={variant}>{category}</Badge>;
}
